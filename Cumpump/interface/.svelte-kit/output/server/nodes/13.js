import * as universal from '../entries/pages/wifi/ap/_page.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/wifi/ap/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/wifi/ap/+page.ts";
export const imports = ["_app/immutable/nodes/13.js","_app/immutable/chunks/utils.js","_app/immutable/chunks/scheduler.js","_app/immutable/chunks/index.js","_app/immutable/chunks/await_block.js","_app/immutable/chunks/each.js","_app/immutable/chunks/index2.js","_app/immutable/chunks/index3.js","_app/immutable/chunks/navigation.js","_app/immutable/chunks/singletons.js","_app/immutable/chunks/InputPassword.js","_app/immutable/chunks/SettingsCard.js","_app/immutable/chunks/stores.js","_app/immutable/chunks/notifications.js","_app/immutable/chunks/Spinner.js","_app/immutable/chunks/access-point.js","_app/immutable/chunks/home.js"];
export const stylesheets = [];
export const fonts = [];
