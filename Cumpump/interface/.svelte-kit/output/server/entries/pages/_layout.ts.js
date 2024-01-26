const prerender = false;
const ssr = false;
const load = async () => {
  const result = await fetch("/rest/features");
  const item = await result.json();
  return {
    features: item,
    title: "ESP32-SvelteKit",
    github: "theelims/ESP32-sveltekit"
  };
};
export {
  load,
  prerender,
  ssr
};
