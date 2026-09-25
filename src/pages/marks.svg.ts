import type { APIRoute } from "astro";
import { MARKS } from "../lib/marks";

/** Every mark as one <symbol>, fetched once and shared by every page through <use href="/marks.svg#name">. */
export const GET: APIRoute = () => {
  const symbols = Object.entries(MARKS)
    .map(([name, mark]) => `<symbol id="${name}" viewBox="${mark.viewBox}">${mark.body}</symbol>`)
    .join("");
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};
