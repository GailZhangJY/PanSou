<template>
  <div class="home">
    <header class="hero">
      <div class="hero__logo">
        <img src="/logo.png" alt="logo" />
      </div>
      <div class="hero__subtitle">全网最全的网盘搜索工具</div>
    </header>

    <SearchBox
      v-model="kw"
      :loading="loading"
      :placeholder="placeholder"
      @search="onSearch"
      @reset="resetSearch" />

    <div v-if="searched" class="sticky-tabs">
      <ResultHeader
        :total="total"
        :elapsed-ms="elapsedMs"
        :platforms="platforms"
        :has-results="hasResults"
        :platform-name="platformName"
        :deep-loading="deepLoading"
        :model="{ sortType: sortType, filterPlatform: filterPlatform }"
        @change-filter="(val: string) => (filterPlatform = val)"
        @change-sort="(val: string) => (sortType = val as any)" />
    </div>

    <section v-if="hasResults" class="results">
      <ResultGroup
        v-for="group in groupedResults"
        :key="group.type"
        :title="platformName(group.type)"
        :color="platformColor(group.type)"
        :icon="platformIcon(group.type)"
        :items="visibleSorted(group.items)"
        :expanded="filterPlatform !== 'all' || isExpanded(group.type)"
        :initial-visible="initialVisible"
        :can-toggle-collapse="false"
        @toggle="handleToggle(group.type)"
        @copy="copyLink" />
    </section>

    <section v-else-if="searched && !loading" class="empty">
      <div class="card">
        <div class="empty__inner">未找到相关资源，试试其他关键词</div>
      </div>
    </section>

    <section v-if="error" class="alert">{{ error }}</section>
  </div>
</template>

<script setup lang="ts">
import SearchBox from "./SearchBox.vue";
import ResultHeader from "./ResultHeader.vue";
import ResultGroup from "./ResultGroup.vue";
import SettingsDrawer from "./SettingsDrawer.vue";
import type {
  GenericResponse,
  SearchResponse,
  MergedLinks,
} from "@/server/core/types/models";

const config = useRuntimeConfig();
const apiBase = (config.public?.apiBase as string) || "/api";
const siteUrl = (config.public?.siteUrl as string) || "";
const platformPriority =
  ((config.public as any)?.platformPriority as string[] | undefined) || [];

useSeoMeta({
  title: "PanSou - 全网最全的网盘搜索",
  description:
    "聚合阿里云盘、夸克、百度网盘、115、迅雷等平台，实时检索各类分享链接与资源，免费、快速、无广告。",
  ogTitle: "PanSou - 全网最全的网盘搜索",
  ogDescription:
    "聚合阿里云盘、夸克、百度网盘、115、迅雷等平台，实时检索各类分享链接与资源，免费、快速、无广告。",
  ogType: "website",
  ogSiteName: "PanSou",
  ogImage: siteUrl ? `${siteUrl}/og.svg` : "/og.svg",
  twitterCard: "summary_large_image",
  twitterTitle: "PanSou - 全网最全的网盘搜索",
  twitterDescription:
    "聚合阿里云盘、夸克、百度网盘、115、迅雷等平台，实时检索各类分享链接与资源，免费、快速、无广告。",
  twitterImage: siteUrl ? `${siteUrl}/og.svg` : "/og.svg",
});

useHead({
  link: [{ rel: "canonical", href: siteUrl ? `${siteUrl}/` : "/" }],
  meta: [
    {
      name: "keywords",
      content:
        "网盘搜索, 阿里云盘搜索, 夸克网盘搜索, 百度网盘搜索, 115 网盘, 迅雷云盘, 资源搜索, 盘搜, PanSou",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PanSou",
        url: siteUrl || "",
        potentialAction: {
          "@type": "SearchAction",
          target: (siteUrl || "") + "/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }),
    },
  ],
});

const placeholder =
  "搜索网盘资源，支持百度云、阿里云盘、夸克网盘、115网盘、迅雷云盘、天翼云盘、123网盘、移动云盘、UC网盘等";

const kw = ref("");
// 默认快速搜索，后续自动触发深度搜索
const mode = ref<"fast" | "deep">("fast");

const isFocused = ref(false);

const loading = ref(false);
const error = ref("");
const searched = ref(false);
const elapsedMs = ref(0);
const deepLoading = ref(false);

const merged = ref<MergedLinks>({});
const total = ref(0);

const sortType = ref<
  "default" | "date-desc" | "date-asc" | "name-asc" | "name-desc"
>("default");
const filterPlatform = ref<string>("all");
const initialVisible = 3;
const expandedSet = ref<Set<string>>(new Set());

// 设置相关
const openSettings = ref(false);
interface UserSettings {
  enabledTgChannels: string[];
  enabledPlugins: string[]; // 选中的插件名
  concurrency: number;
  pluginTimeoutMs: number;
}
const DEFAULT_SETTINGS: UserSettings = {
  enabledTgChannels: [
    ...(((config.public as any)?.tgDefaultChannels || []) as string[]),
  ],
  enabledPlugins: [
    "pansearch",
    "qupansou",
    "panta",
    "hunhepan",
    "jikepan",
    "labi",
    "thepiratebay",
    "duoduo",
    "xuexizhinan",
    "nyaa",
  ],
  concurrency: 4,
  pluginTimeoutMs: 5000,
};
const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS });
const LS_KEY = "PanSou.settings";
function loadSettings() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    const s: UserSettings = {
      enabledTgChannels: Array.isArray(parsed.enabledTgChannels)
        ? parsed.enabledTgChannels.filter((x: any) => typeof x === "string")
        : [],
      enabledPlugins: Array.isArray(parsed.enabledPlugins)
        ? parsed.enabledPlugins.filter((x: any) => typeof x === "string")
        : [...ALL_PLUGIN_NAMES],
      concurrency:
        typeof parsed.concurrency === "number" && parsed.concurrency > 0
          ? Math.min(16, Math.max(1, parsed.concurrency))
          : 4,
      pluginTimeoutMs:
        typeof parsed.pluginTimeoutMs === "number" && parsed.pluginTimeoutMs > 0
          ? parsed.pluginTimeoutMs
          : 5000,
    };
    s.enabledPlugins = s.enabledPlugins.filter((n) =>
      ALL_PLUGIN_NAMES.includes(n)
    );
    settings.value = s;
  } catch {}
}
function persistSettings() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(settings.value));
  } catch {}
}
function saveSettings() {
  persistSettings();
  openSettings.value = false;
}
function resetToDefault() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }
  settings.value = { ...DEFAULT_SETTINGS };
}

// 全部插件名（与服务端注册名一致）
const ALL_PLUGIN_NAMES = [
  "pansearch",
  "qupansou",
  "panta",
  "hunhepan",
  "jikepan",
  "labi",
  "thepiratebay",
  "duoduo",
  "xuexizhinan",
  "nyaa",
];

// 合并深度搜索返回的 merged_by_type（按 url 去重）
function mergeMergedByType(
  target: MergedLinks,
  incoming?: MergedLinks
): MergedLinks {
  if (!incoming) return target;
  const out: MergedLinks = { ...target };
  for (const type of Object.keys(incoming)) {
    const existed = out[type] || [];
    const next = incoming[type] || [];
    const seen = new Set<string>(existed.map((x) => x.url));
    const mergedArr = [...existed];
    for (const item of next) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        mergedArr.push(item);
      }
    }
    out[type] = mergedArr;
  }
  return out;
}

let searchSeq = 0; // 取消旧搜索用
const activeControllers: AbortController[] = [];
function cancelActiveRequests() {
  for (const c of activeControllers) {
    try {
      c.abort();
    } catch {}
  }
  activeControllers.length = 0;
}

// 已移除热搜相关功能

// 平台可视化信息
const platformInfo: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  aliyun: { name: "阿里云盘", color: "#7c3aed", icon: "☁️" },
  quark: { name: "夸克网盘", color: "#6366f1", icon: "🔎" },
  baidu: { name: "百度网盘", color: "#2563eb", icon: "🧰" },
  "115": { name: "115网盘", color: "#f59e0b", icon: "📦" },
  xunlei: { name: "迅雷云盘", color: "#fbbf24", icon: "⚡" },
  uc: { name: "UC网盘", color: "#ef4444", icon: "🧭" },
  tianyi: { name: "天翼云盘", color: "#ec4899", icon: "☁️" },
  "123": { name: "123网盘", color: "#10b981", icon: "#" },
  mobile: { name: "移动云盘", color: "#0ea5e9", icon: "📱" },
  others: { name: "其他网盘", color: "#6b7280", icon: "…" },
};

const platforms = computed(() => Object.keys(merged.value));
const hasResults = computed(() => platforms.value.length > 0);

const groupedResults = computed(() => {
  const list: Array<{ type: string; items: any[] }> = [];
  const source =
    filterPlatform.value === "all"
      ? merged.value
      : { [filterPlatform.value]: merged.value[filterPlatform.value] || [] };
  for (const type of Object.keys(source)) {
    if (!source[type]?.length) continue;
    list.push({ type, items: source[type] || [] });
  }
  // 按 platformPriority 排序；未配置则保持插入顺序
  if (Array.isArray(platformPriority) && platformPriority.length > 0) {
    const idx = (t: string) => {
      const i = platformPriority.indexOf(t);
      return i === -1 ? platformPriority.length : i;
    };
    list.sort((a, b) => {
      const ai = idx(a.type);
      const bi = idx(b.type);
      if (ai !== bi) return ai - bi;
      // 同优先级：按数量多的在前
      return (b.items?.length || 0) - (a.items?.length || 0);
    });
  }
  return list;
});

function platformName(t: string): string {
  return platformInfo[t]?.name || t;
}
function platformColor(t: string): string {
  return platformInfo[t]?.color || "#9ca3af";
}
function platformIcon(t: string): string {
  return platformInfo[t]?.icon || "📦";
}

function setMode(m: "fast" | "deep") {
  mode.value = m;
  if (typeof window !== "undefined") localStorage.setItem("searchMode", m);
}
// 分类与热搜入口已移除
function isExpanded(type: string) {
  return expandedSet.value.has(type);
}
function toggleExpand(type: string) {
  if (expandedSet.value.has(type)) expandedSet.value.delete(type);
  else expandedSet.value.add(type);
}
function handleToggle(type: string) {
  // 点击展开/查看更多时，切换到对应平台 Tab，并展开
  filterPlatform.value = type;
}
function visibleItems(type: string, items: any[]) {
  return isExpanded(type) ? items : items.slice(0, initialVisible);
}

function sortItems(items: any[]) {
  const arr = [...items];
  switch (sortType.value) {
    case "date-desc":
      return arr.sort(
        (a, b) =>
          new Date(b.datetime || "1970-01-01").getTime() -
          new Date(a.datetime || "1970-01-01").getTime()
      );
    case "date-asc":
      return arr.sort(
        (a, b) =>
          new Date(a.datetime || "1970-01-01").getTime() -
          new Date(b.datetime || "1970-01-01").getTime()
      );
    case "name-asc":
      return arr.sort((a, b) =>
        String(a.note || "").localeCompare(String(b.note || ""), "zh-CN")
      );
    case "name-desc":
      return arr.sort((a, b) =>
        String(b.note || "").localeCompare(String(a.note || ""), "zh-CN")
      );
    default:
      return items;
  }
}

function visibleSorted(items: any[]) {
  return sortItems(items);
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
}

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
  } catch {}
}

// 失效标记功能暂时移除（无真实接口）

function resetSearch() {
  // 取消进行中的请求并阻止老搜索写回
  cancelActiveRequests();
  searchSeq++;
  kw.value = "";
  merged.value = {};
  total.value = 0;
  searched.value = false;
  error.value = "";
  loading.value = false;
  deepLoading.value = false;
}

// 热搜功能暂时移除（无真实接口）

// 已去除随机合集

async function onSearch() {
  if (!kw.value || loading.value) return;

  // iOS Safari兼容性：确保输入框失去焦点并添加延迟
  if (
    typeof window !== "undefined" &&
    document.activeElement instanceof HTMLInputElement
  ) {
    document.activeElement.blur();
    // 添加小延迟确保焦点处理完成
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // 每次搜索前读取最新设置，避免跨页面/跨组件状态不同步
  loadSettings();
  loading.value = true;
  error.value = "";
  searched.value = true;
  elapsedMs.value = 0;
  total.value = 0;
  merged.value = {};
  expandedSet.value = new Set();
  filterPlatform.value = "all";
  const mySeq = ++searchSeq;
  const start = performance.now();
  try {
    // 计算用户选择
    const enabledPlugins = settings.value.enabledPlugins.filter((n) =>
      ALL_PLUGIN_NAMES.includes(n)
    );
    if (
      (settings.value.enabledTgChannels?.length || 0) === 0 &&
      enabledPlugins.length === 0
    ) {
      throw new Error("请先在设置中选择至少一个搜索来源");
    }

    // 工具：把逗号分隔字符串转成数组
    const parseList = (s: string | undefined): string[] => {
      if (!s) return [];
      return s
        .split(",")
        .map((x) => x.trim())
        .filter((x) => !!x);
    };

    // 1) 快速搜索：按“并发数 conc”选择同等数量的插件进行首批请求
    const conc = Math.min(
      16,
      Math.max(1, Number(settings.value.concurrency || 3))
    );
    const batchSize = conc; // 单批插件数量 = 并发数
    const fastPluginsArr = enabledPlugins.slice(0, conc);
    const userTgChannels = settings.value.enabledTgChannels || [];
    const tgBatched = userTgChannels.length > 0;
    const fastTgArr = tgBatched ? userTgChannels.slice(0, batchSize) : [];

    const fastPromises: Array<Promise<any>> = [];
    if (fastPluginsArr.length) {
      fastPromises.push(
        (() => {
          const ac = new AbortController();
          activeControllers.push(ac);
          return $fetch<GenericResponse<SearchResponse>>(`${apiBase}/search`, {
            method: "GET",
            query: {
              kw: kw.value,
              res: "merged_by_type",
              src: "plugin",
              plugins: fastPluginsArr.join(","),
              conc: conc,
              ext: JSON.stringify({
                __plugin_timeout_ms: settings.value.pluginTimeoutMs || 5000,
              }),
            },
            signal: ac.signal,
          } as any);
        })()
      );
    } else {
      fastPromises.push(
        Promise.resolve({ data: { total: 0, merged_by_type: {} } } as any)
      );
    }
    if (userTgChannels.length > 0) {
      if (fastTgArr.length) {
        fastPromises.push(
          (() => {
            const ac = new AbortController();
            activeControllers.push(ac);
            return $fetch<GenericResponse<SearchResponse>>(
              `${apiBase}/search`,
              {
                method: "GET",
                query: {
                  kw: kw.value,
                  res: "merged_by_type",
                  src: "tg",
                  channels: fastTgArr.join(","),
                  conc: conc,
                  ext: JSON.stringify({
                    __plugin_timeout_ms: settings.value.pluginTimeoutMs || 5000,
                  }),
                },
                signal: ac.signal,
              } as any
            );
          })()
        );
      }
    }

    const [fastPluginResp, fastTgResp] = await Promise.all(fastPromises);
    const fastPluginData = (fastPluginResp as any)?.data as
      | SearchResponse
      | undefined;
    const fastTgData = (fastTgResp as any)?.data as SearchResponse | undefined;
    merged.value = mergeMergedByType(
      mergeMergedByType({}, fastPluginData?.merged_by_type),
      fastTgData?.merged_by_type
    );
    total.value = Object.values(merged.value).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );

    // 2) 持续深度搜索：插件按“并发数”为批大小推进；TG 仍按 3 个一批
    const restPlugins = enabledPlugins.slice(3);
    const pluginBatches: string[][] = [];
    for (let i = 0; i < restPlugins.length; i += batchSize) {
      pluginBatches.push(restPlugins.slice(i, i + batchSize));
    }
    const tgRest = tgBatched ? userTgChannels.slice(batchSize) : [];
    const tgBatches: string[][] = [];
    for (let i = 0; i < tgRest.length; i += batchSize) {
      tgBatches.push(tgRest.slice(i, i + batchSize));
    }

    deepLoading.value = true;
    const maxLen = Math.max(pluginBatches.length, tgBatches.length);
    for (let i = 0; i < maxLen; i++) {
      if (mySeq !== searchSeq) break;
      const reqs: Array<Promise<any>> = [];
      const pb = pluginBatches[i];
      if (pb && pb.length) {
        reqs.push(
          (() => {
            const ac = new AbortController();
            activeControllers.push(ac);
            return $fetch<GenericResponse<SearchResponse>>(
              `${apiBase}/search`,
              {
                method: "GET",
                query: {
                  kw: kw.value,
                  res: "merged_by_type",
                  src: "plugin",
                  plugins: pb.join(","),
                  conc: conc,
                  ext: JSON.stringify({
                    __plugin_timeout_ms: settings.value.pluginTimeoutMs || 5000,
                  }),
                },
                signal: ac.signal,
              } as any
            );
          })()
        );
      }
      const tb = tgBatches[i];
      if (tb && tb.length) {
        reqs.push(
          (() => {
            const ac = new AbortController();
            activeControllers.push(ac);
            return $fetch<GenericResponse<SearchResponse>>(
              `${apiBase}/search`,
              {
                method: "GET",
                query: {
                  kw: kw.value,
                  res: "merged_by_type",
                  src: "tg",
                  channels: tb.join(","),
                  conc: conc,
                  ext: JSON.stringify({
                    __plugin_timeout_ms: settings.value.pluginTimeoutMs || 5000,
                  }),
                },
                signal: ac.signal,
              } as any
            );
          })()
        );
      }

      if (!reqs.length) continue;
      try {
        const resps = await Promise.all(reqs);
        for (const r of resps) {
          const d = (r as any)?.data as SearchResponse | undefined;
          if (!d || mySeq !== searchSeq) continue;
          merged.value = mergeMergedByType(merged.value, d.merged_by_type);
        }
        total.value = Object.values(merged.value).reduce(
          (sum, arr) => sum + (arr?.length || 0),
          0
        );
      } catch {
        // 单批失败忽略
      }
    }
    deepLoading.value = false;
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    elapsedMs.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 24px auto 0; /* 去掉底部 40px 外边距，初始不出现滚动条 */
  padding: 0 16px 16px;
}
.toolsbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.toolsbar .muted {
  color: #666;
  font-size: 12px;
}
.hero {
  text-align: center;
  padding: 24px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafafa, #f6faff);
}
.hero__logo img {
  width: 150px;
  height: 128px;
}
.hero__subtitle {
  color: #666;
  font-size: 14px;
}

.search {
  margin-top: 16px;
}
.search__box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}
.search__box.focused {
  box-shadow: 0 10px 30px rgba(38, 132, 255, 0.12);
}
.search__icon {
  opacity: 0.6;
}
.search__box input {
  flex: 1;
  border: 0;
  outline: none;
  font-size: 16px;
}
/* 模式切换已移除 */

/* 分类与热搜入口样式已移除 */

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 2px;
}
.result-header .tools {
  display: flex;
  gap: 10px;
  align-items: center;
}
.result-header select {
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.statusbar {
  min-height: 28px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin: 6px 2px 4px;
  min-width: 180px; /* 避免布局变化时抖动 */
}
.statusbar .muted {
  color: #666;
  font-size: 13px;
}
.statusbar .chip-num {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  color: #111;
}
.statusbar .dots {
  display: inline-flex;
  gap: 4px;
}
.statusbar .dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2684ff;
  opacity: 0.6;
  animation: sb-bounce 1.2s infinite ease-in-out;
  display: inline-block;
}
.statusbar .dots i:nth-child(2) {
  animation-delay: 0.15s;
}
.statusbar .dots i:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes sb-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
}
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  padding: 8px 0 6px;
  border-bottom: 1px solid #f0f0f0;
}
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f1f1;
}
.badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}
.card__title {
  font-size: 16px;
  font-weight: 700;
}
.card__count {
  margin-left: auto;
  color: #666;
  font-size: 13px;
}
.link {
  background: transparent;
  border: 0;
  color: #0a58ff;
  cursor: pointer;
  padding: 4px 6px;
}
.link--danger {
  color: #e11d48;
}
.card__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  padding: 12px;
  border-bottom: 1px solid #f3f3f3;
}
.item:last-child {
  border-bottom: none;
}
.item__title {
  color: #0a58ff;
  text-decoration: none;
}
.item__title:hover {
  text-decoration: underline;
}
.item__meta {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.pill {
  font-size: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 999px;
  padding: 2px 8px;
  color: #333;
}
.pill--ok {
  background: rgba(52, 199, 89, 0.15);
  border-color: rgba(52, 199, 89, 0.25);
  color: #22c55e;
}
.card__footer {
  padding: 10px;
  text-align: center;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111;
  border-radius: 10px;
  cursor: pointer;
}
.btn:hover {
  background: #f6f7f9;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
.btn--primary:hover {
  background: #000;
}
.btn--ghost {
  background: transparent;
}

.reco {
  margin-top: 16px;
}
.reco__title {
  font-weight: 700;
  margin: 6px 2px 10px;
}
.reco__row {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 4px;
}
/* 占位选择器移除 */

.empty .card {
  padding: 16px;
}
.empty__inner {
  color: #777;
  text-align: center;
}

.alert {
  background: #fff6f6;
  border: 1px solid #ffd1d1;
  color: #a40000;
  padding: 8px 10px;
  border-radius: 8px;
  margin-top: 12px;
}

/* 设置抽屉样式由子组件自带，这里保留通用工具条样式 */

/* 小屏优化与安全区适配 */
@media (max-width: 640px) {
  .home {
    margin-top: 12px;
    padding: 0 12px 12px;
  }
  .hero {
    padding: 16px 12px;
    border-radius: 12px;
  }
  .hero__title {
    font-size: 22px;
  }
  .hero__subtitle {
    font-size: 13px;
  }
  .result-header select {
    font-size: 12px;
  }
  .results {
    gap: 10px;
  }
  .sticky-tabs {
    top: env(safe-area-inset-top);
    padding-top: calc(6px + env(safe-area-inset-top));
  }
}
</style>
