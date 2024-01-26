import { c as create_ssr_component, a as subscribe, v as validate_component, h as add_attribute } from "../../../../chunks/ssr.js";
import { S as SettingsCard } from "../../../../chunks/SettingsCard.js";
import { Chart, registerables } from "chart.js";
import { R as Report_analytics } from "../../../../chunks/report-analytics.js";
import { w as writable } from "../../../../chunks/index.js";
import "../../../../chunks/user.js";
import { p as page } from "../../../../chunks/stores.js";
import { g as goto } from "../../../../chunks/navigation.js";
let analytics_data = {
  uptime: [],
  free_heap: [],
  total_heap: [],
  min_free_heap: [],
  max_alloc_heap: [],
  fs_used: [],
  fs_total: [],
  core_temp: []
};
function createAnalytics() {
  const { subscribe: subscribe2, set, update } = writable(analytics_data);
  return {
    subscribe: subscribe2,
    addData: (data) => {
      const content = JSON.parse(data);
      update((analytics_data2) => ({
        ...analytics_data2,
        uptime: [...analytics_data2.uptime, content.uptime],
        free_heap: [...analytics_data2.free_heap, content.free_heap / 1e3],
        total_heap: [...analytics_data2.total_heap, content.total_heap / 1e3],
        min_free_heap: [...analytics_data2.min_free_heap, content.min_free_heap / 1e3],
        max_alloc_heap: [...analytics_data2.max_alloc_heap, content.max_alloc_heap / 1e3],
        fs_used: [...analytics_data2.fs_used, content.fs_used / 1e3],
        fs_total: [...analytics_data2.fs_total, content.fs_total / 1e3],
        core_temp: [...analytics_data2.core_temp, content.core_temp]
      }));
    }
  };
}
const analytics = createAnalytics();
const SystemMetrics = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_analytics;
  $$unsubscribe_analytics = subscribe(analytics, (value) => value);
  Chart.register(...registerables);
  let heapChartElement;
  let filesystemChartElement;
  let temperatureChartElement;
  $$unsubscribe_analytics();
  return `${validate_component(SettingsCard, "SettingsCard").$$render($$result, { collapsible: false }, {}, {
    title: () => {
      return `<span slot="title" data-svelte-h="svelte-o3oys9">System Metrics</span>`;
    },
    icon: () => {
      return `${validate_component(Report_analytics, "Metrics").$$render(
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
      return `<div class="w-full overflow-x-auto"><div class="flex w-full flex-col space-y-1 h-60"><canvas${add_attribute("this", heapChartElement, 0)}></canvas></div></div> <div class="w-full overflow-x-auto"><div class="flex w-full flex-col space-y-1 h-52"><canvas${add_attribute("this", filesystemChartElement, 0)}></canvas></div></div> <div class="w-full overflow-x-auto"><div class="flex w-full flex-col space-y-1 h-52"><canvas${add_attribute("this", temperatureChartElement, 0)}></canvas></div></div>`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  if (!$page.data.features.analytics) {
    goto("/");
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_page();
  return `<div class="mx-0 my-1 flex flex-col space-y-4 sm:mx-8 sm:my-8">${validate_component(SystemMetrics, "SystemMetrics").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Page as default
};
