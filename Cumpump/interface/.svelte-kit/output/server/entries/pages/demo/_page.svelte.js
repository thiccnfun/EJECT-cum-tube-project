import { c as create_ssr_component, b as spread, d as escape_object, a as subscribe, o as onDestroy, v as validate_component, f as escape, h as add_attribute } from "../../../chunks/ssr.js";
import { u as user } from "../../../chunks/user.js";
import { p as page } from "../../../chunks/stores.js";
import { n as notifications } from "../../../chunks/notifications.js";
import { S as SettingsCard } from "../../../chunks/SettingsCard.js";
import { R as Reload } from "../../../chunks/reload.js";
const Droplet_filled = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="M10.708 2.372a2.382 2.382 0 0 0-.71.686l-4.892 7.26c-1.981 3.314-1.22 7.466 1.767 9.882c2.969 2.402 7.286 2.402 10.254 0c2.987-2.416 3.748-6.569 1.795-9.836l-4.919-7.306c-.722-1.075-2.192-1.376-3.295-.686z"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const Droplet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602-2.105 3.262-5.708 1.566-8.546l-4.89-7.26c-.42-.625-1.287-.803-1.936-.397a1.376 1.376 0 0 0-.41.397l-4.893 7.26C4.24 13.715 4.9 17.318 7.502 19.423z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const DIVISOR = 800;
const Demo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $user, $$unsubscribe_user;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  let pumpState = { ejecting: false };
  let pumpSettings = {
    cum_time: 0,
    cum_size: 800,
    cum_accel: 800,
    reverse: false,
    continuous: false
  };
  let cumSizeValue = pumpSettings.cum_size / DIVISOR;
  let cumAccelValue = pumpSettings.cum_accel / DIVISOR;
  const ws_token = $page.data.features.security ? "?access_token=" + $user.bearer_token : "";
  const pumpStateSocket = new WebSocket("ws://" + $page.url.host + "/ws/pumpState" + ws_token);
  pumpStateSocket.onopen = (event) => {
    pumpStateSocket.send("Hello");
  };
  pumpStateSocket.addEventListener("close", (event) => {
    const closeCode = event.code;
    const closeReason = event.reason;
    console.log("Pump State WebSocket closed with code:", closeCode);
    console.log("Close reason:", closeReason);
    notifications.error("Websocket disconnected", 5e3);
  });
  pumpStateSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type != "id") {
      pumpState = message;
    }
  };
  const pumpSettingsSocket = new WebSocket("ws://" + $page.url.host + "/ws/pumpSettings" + ws_token);
  pumpSettingsSocket.onopen = (event) => {
    pumpSettingsSocket.send("Hello");
  };
  pumpSettingsSocket.addEventListener("close", (event) => {
    const closeCode = event.code;
    const closeReason = event.reason;
    console.log("Pump State WebSocket closed with code:", closeCode);
    console.log("Close reason:", closeReason);
    notifications.error("Websocket disconnected", 5e3);
  });
  pumpSettingsSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type != "id") {
      pumpSettings = message;
      cumSizeValue = pumpSettings.cum_size / DIVISOR;
      cumAccelValue = pumpSettings.cum_accel / DIVISOR;
      console.log("pumpSettings", pumpSettings);
    }
  };
  onDestroy(() => {
    pumpStateSocket.close();
    pumpSettingsSocket.close();
  });
  $$unsubscribe_page();
  $$unsubscribe_user();
  return `${validate_component(SettingsCard, "SettingsCard").$$render($$result, { collapsible: false }, {}, {
    title: () => {
      return `<span slot="title" data-svelte-h="svelte-14ujj00">Pump State</span>`;
    },
    icon: () => {
      return `${validate_component(Droplet, "IconDroplet").$$render(
        $$result,
        {
          slot: "icon",
          class: "lex-shrink-0 mr-2 h-6 w-6 self-end"
        },
        {},
        {}
      )}`;
    },
    default: () => {
      return `<div class="w-full"><div class="flex flex-col flex-wrap justify-between gap-x-2"><span class="mr-4" data-svelte-h="svelte-1il3ujg">Time (seconds)</span> <label class="label cursor-pointer"><span class="mr-4">${escape(pumpSettings.cum_time)}</span> <input type="range" min="0" max="300" class="range"${add_attribute("value", pumpSettings.cum_time, 0)}></label> <span class="mr-4" data-svelte-h="svelte-cxo4ec">Size</span> <label class="label cursor-pointer"><span class="mr-4">${escape(cumSizeValue)}</span> <input type="range" min="1" max="500" step="1" class="range"${add_attribute("value", cumSizeValue, 0)}></label> <span class="mr-4" data-svelte-h="svelte-1d87jyc">Force</span> <label class="label cursor-pointer"><span class="mr-4">${escape(cumAccelValue)}</span> <input type="range" min="1" max="500" step="1" class="range"${add_attribute("value", cumAccelValue, 0)}></label> <label class="label cursor-pointer"><span class="" data-svelte-h="svelte-k6fxtj">Reverse Flow</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", pumpSettings.reverse, 1)}></label></div>  <div class="flex flex-row flex-wrap justify-between gap-x-2"> <label class="label cursor-pointer"><span class="" data-svelte-h="svelte-12lbb5c">Continuous</span> <input type="checkbox" class="toggle toggle-primary"${add_attribute("checked", pumpSettings.continuous, 1)}></label> <div class="flex-grow"></div> <button class="btn btn-primary inline-flex items-center">${pumpState.ejecting ? ` ${validate_component(Reload, "Reload").$$render($$result, { class: "animate-spin mr-2 h-5 w-5" }, {}, {})} <span data-svelte-h="svelte-mh4zxv">Stop Ejecting</span>` : ` ${validate_component(Droplet_filled, "IconDropletFilled").$$render($$result, { class: "mr-2 h-5 w-5" }, {}, {})} <span data-svelte-h="svelte-13f77m5">Start Ejecting</span>`}</button></div> </div>`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="mx-0 my-1 flex flex-col space-y-4 sm:mx-8 sm:my-8">${validate_component(Demo, "Demo").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Page as default
};
