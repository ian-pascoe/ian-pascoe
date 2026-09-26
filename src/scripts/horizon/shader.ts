/**
 * The accretion disk, traced per pixel through curved space. The integrator
 * is the same one `optics.ts` runs on the CPU; keep the two in step.
 */

export const MAX_FRAGMENTS = 32;
export const MAX_YEARS = 12;

export const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2 uRes;
uniform vec3 uCam;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform vec2 uShift;
uniform float uSpin;
uniform vec4 uFrag[${MAX_FRAGMENTS}];
uniform int uFragCount;
uniform float uYear[${MAX_YEARS}];
uniform int uYearCount;
uniform vec3 uVeil;

const float FOCAL = 1.6;
const int STEPS = 180;
const float DISK_IN = 3.0;
const float DISK_OUT = 14.5;

const vec3 EMBER = vec3(1.0, 0.2, 0.05);
const vec3 WARM = vec3(1.0, 0.6, 0.34);
const vec3 APPROACH = vec3(0.56, 0.74, 1.0);
const vec3 GOLD = vec3(1.0, 0.76, 0.30);
const vec3 BONE = vec3(0.93, 0.90, 0.84);

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

// Emission and opacity of the disk where a ray crosses it.
vec4 disk(vec3 hit, float rr, vec3 dir) {
  float phi = atan(hit.z, hit.x);
  // Inner matter laps the outer: the texture turns faster toward the hole.
  float a = phi - uSpin * (0.5 + 0.9 * pow(DISK_IN / rr, 1.5));
  // Turbulent filaments: fine in radius, long along the orbit.
  vec3 q = vec3(rr * 2.6, cos(a) * 1.7, sin(a) * 1.7);
  float n = noise(q) * 0.62 + noise(q * vec3(2.3, 3.1, 3.1) + 7.0) * 0.38;
  float fil = noise(vec3(rr * 13.0 + n * 2.5, cos(a) * 1.3, sin(a) * 1.3)) * 0.65
    + noise(vec3(rr * 29.0, cos(a) * 2.2 + 3.0, sin(a) * 2.2)) * 0.35;
  float bands = 0.3 + 0.7 * pow(fil, 1.4);

  float profile = pow(DISK_IN / rr, 2.1)
    * smoothstep(DISK_IN, DISK_IN + 0.45, rr)
    * (1.0 - smoothstep(DISK_OUT - 3.5, DISK_OUT, rr));

  // Doppler beaming and gravitational redshift.
  float beta = sqrt(0.5 / (rr - 1.0));
  vec3 tangent = vec3(-sin(phi), 0.0, cos(phi));
  float cosT = dot(tangent, -dir);
  float gamma = inversesqrt(1.0 - beta * beta);
  float g = sqrt(1.0 - 1.0 / rr) / (gamma * (1.0 - beta * cosT));

  // Receding matter reddens to ember, approaching matter blues toward white.
  float t = clamp((g - 0.6) / 0.62 - (rr - DISK_IN) / 40.0, 0.0, 1.0);
  vec3 color = t < 0.5 ? mix(EMBER, WARM, t * 2.0) : mix(WARM, APPROACH, t * 2.0 - 1.0);
  float light = profile * pow(g, 1.7) * (0.35 + 0.65 * n * bands) * 3.4;
  vec3 emission = color * light;

  // Year rings, etched.
  for (int i = 0; i < ${MAX_YEARS}; i++) {
    if (i >= uYearCount) break;
    float d = (rr - uYear[i]) / 0.022;
    emission += BONE * exp(-d * d) * 0.16;
  }

  // Fragments: every work, a point of matter at its date.
  for (int i = 0; i < ${MAX_FRAGMENTS}; i++) {
    if (i >= uFragCount) break;
    vec4 f = uFrag[i];
    float fphi = f.y + uSpin;
    vec2 fp = f.x * vec2(cos(fphi), sin(fphi));
    vec2 dv = hit.xz - fp;
    float d2 = dot(dv, dv);
    // f.z: 0 plain, 1 retired (cooled), 2 in progress; f.w: 0..1 how current it is.
    float size = mix(0.09, 0.22, f.w) * (0.8 + f.x * 0.03);
    float core = exp(-d2 / (size * size));
    vec3 hot = f.z > 0.5 && f.z < 1.5 ? EMBER * 0.5 : mix(vec3(1.0, 0.95, 0.88), GOLD, f.w);
    float strength = mix(f.z > 0.5 && f.z < 1.5 ? 0.8 : 1.6, 3.2, f.w);
    emission += hot * core * strength;
    // A cold halo marks the current fragment's orbit.
    float halo = exp(-pow((sqrt(d2) - size * 3.2) / (size * 0.35), 2.0));
    emission += GOLD * halo * f.w * 1.2;
  }

  float alpha = clamp(profile * (0.4 + 0.6 * n) * 1.7, 0.0, 0.92);
  return vec4(emission, alpha);
}

void main() {
  vec2 s = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * min(uRes.x, uRes.y)) - uShift;
  vec3 v = normalize(uFwd * FOCAL + uRight * s.x + uUp * s.y);
  vec3 p = uCam;
  vec3 h = cross(p, v);
  float h2 = dot(h, h);

  vec3 color = vec3(0.0);
  float through = 1.0;
  bool captured = false;

  for (int i = 0; i < STEPS; i++) {
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { captured = true; break; }
    float dt = clamp(0.07 * r, 0.03, 2.5);
    v += (-1.5 * h2 / (r2 * r2 * r)) * p * dt;
    vec3 n = p + v * dt;
    if (p.y * n.y < 0.0) {
      vec3 hit = mix(p, n, p.y / (p.y - n.y));
      float rr = length(hit.xz);
      if (rr > DISK_IN && rr < DISK_OUT) {
        vec4 e = disk(hit, rr, normalize(v));
        color += through * e.rgb;
        through *= 1.0 - e.a;
        if (through < 0.02) break;
      }
    }
    p = n;
    if (r > 40.0 && dot(p, v) > 0.0) break;
  }

  // Light that skimmed the photon sphere and escaped, its impact parameter just above 3√3/2: the gold ring.
  // It hugs the shadow: brightest at the edge, falling off outward.
  if (!captured) {
    float edge = max(0.0, sqrt(h2) - 2.598);
    color += GOLD * (exp(-edge / 0.05) * 1.25 + exp(-edge / 0.4) * 0.22) * through;
  }

  if (!captured && through > 0.02) {
    vec3 d = normalize(v);
    vec3 cell = floor(d * 260.0);
    float star = step(0.9975, hash(cell)) * hash(cell + 3.1);
    color += through * BONE * star * 0.45;
  }

  // Keep the reading side of the sky quiet.
  float x = gl_FragCoord.x / uRes.x;
  color *= 1.0 - uVeil.z * (1.0 - smoothstep(uVeil.x - uVeil.y, uVeil.x, x));

  color = vec3(1.0) - exp(-color * 1.25);
  gl_FragColor = vec4(pow(color, vec3(0.92)), 1.0);
}
`;
