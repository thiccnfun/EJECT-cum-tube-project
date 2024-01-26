import * as universal from '../entries/pages/system/status/_page.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/system/status/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/system/status/+page.ts";
export const imports = ["_app/immutable/nodes/9.js","_app/immutable/chunks/utils.js","_app/immutable/chunks/scheduler.js","_app/immutable/chunks/index.js","_app/immutable/chunks/await_block.js","_app/immutable/chunks/ConfirmDialog.js","_app/immutable/chunks/index3.js","_app/immutable/chunks/index2.js","_app/immutable/chunks/navigation.js","_app/immutable/chunks/singletons.js","_app/immutable/chunks/stores.js","_app/immutable/chunks/SettingsCard.js","_app/immutable/chunks/Spinner.js","_app/immutable/chunks/reload.js","_app/immutable/chunks/stethoscope.js","_app/immutable/chunks/24-hours.js"];
export const stylesheets = [];
export const fonts = [];
