import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as RemovalPolicy from "alchemy/RemovalPolicy";
import * as Effect from "effect/Effect";

const APEX = "ianpascoe.dev";
const MAILBOX = "ian.g.pascoe@gmail.com";

const website = {
  astro: { output: "static" },
  assets: { notFoundHandling: "404-page" },
} as const;

export default Alchemy.Stack(
  "ianpascoe-dev",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const stage = yield* Alchemy.Stage;

    // Previews (pr-<n>) and personal stages (live_$USER, dev_$USER) get an
    // isolated Worker on workers.dev and nothing zone-level, so destroying
    // them can never touch the domain, DNS, email, or analytics.
    if (stage !== "prod") {
      const site = yield* Cloudflare.Website.Astro("Website", website);
      return { url: site.url };
    }

    // The zone already exists; take it over without creating it. Zones are
    // retained on destroy by default.
    const zone = yield* Cloudflare.Zone.Zone("Zone", { name: APEX }).pipe(
      adopt(true),
    );

    // Manual-snippet Web Analytics. The site token is fed to the Astro build as
    // PUBLIC_CF_BEACON_TOKEN (Worker env literals reach the build's process.env).
    const analytics = yield* Cloudflare.Rum.Site("Analytics", {
      zoneTag: zone.zoneId,
      autoInstall: false,
    }).pipe(adopt(true));

    const site = yield* Cloudflare.Website.Astro("Website", {
      ...website,
      domain: {
        name: APEX,
        redirects: [`www.${APEX}`],
        zoneId: zone.zoneId,
      },
      workersDev: false,
      env: { PUBLIC_CF_BEACON_TOKEN: analytics.siteToken },
    });

    // Mail is independent of the site: keep it even if prod is destroyed.
    const routing = yield* Cloudflare.Email.Routing("EmailRouting", {
      zone: zone.zoneId,
    }).pipe(RemovalPolicy.retain());

    const mailbox = yield* Cloudflare.Email.Address("Mailbox", {
      email: MAILBOX,
    }).pipe(RemovalPolicy.retain());

    yield* Cloudflare.Email.Rule("HiForward", {
      zone: routing.zoneId,
      name: `hi@${APEX} → ${MAILBOX}`,
      matchers: [{ type: "literal", field: "to", value: `hi@${APEX}` }],
      actions: [{ type: "forward", value: [mailbox.email] }],
    }).pipe(RemovalPolicy.retain());

    return {
      url: site.url,
      emailRouting: routing.status,
      mailboxVerified: mailbox.verified,
    };
  }),
);
