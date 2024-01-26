import { c as create_ssr_component, b as spread, d as escape_object } from "./ssr.js";
const Info_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m9-3h.01"/><path d="M11 12h1v4h1"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const Topology_star_3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm8-14a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm-8 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm-4 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm12 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm-4-7a2 2 0 1 0-4 0a2 2 0 0 0 4 0zm8 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0zM6 12h4m4 0h4m-3-5l-2 3M9 7l2 3m0 4l-2 3m4-3l2 3"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Info_circle as I,
  Topology_star_3 as T
};
