// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      title: "PanSou 盘搜 - 网盘搜索引擎与资源聚合 | 阿里云盘/夸克/百度网盘",
      titleTemplate: "%s · PanSou",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
        },
        {
          name: "description",
          content:
            "PanSou 盘搜是专业的网盘搜索引擎，聚合阿里云盘、夸克、百度网盘、115、迅雷等平台数据，智能去重与实时检索公开分享资源；支持关键词搜索、来源筛选与并发加速，免费、快速、无广告，覆盖影视、学习资料、软件、音乐、电子书等多种类型。",
        },
        {
          name: "keywords",
          content:
            "网盘搜索, 网盘聚合搜索, 阿里云盘, 夸克, 百度网盘, 115, 迅雷, 资源搜索, PanSou, 盘搜, 网盘搜索引擎",
        },
        {
          name: "google-site-verification",
          content: "dKKQz3noqGglNOuY55qF3Cts_WknoWAZuNOsIRWoFok",
        },
        {
          name: "msvalidate.01",
          content: "0526A1E55ECA85E3DDB49725AB10E6B6",
        },
        { name: "theme-color", content: "#111111" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "PanSou" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
    },
  },
  nitro: {
    // 根据环境变量动态选择部署预设：
    // - cloudflare-module（默认，用于 Cloudflare Workers）
    // - node-server（用于 Docker/自托管 Node）
    // - vercel（用于 Vercel 平台）
    // 优先使用平台内置变量自动识别，无需手动配置 NITRO_PRESET
    // - Vercel: process.env.VERCEL 存在
    // 其余场景：若显式提供 NITRO_PRESET 则使用，否则默认 cloudflare-module
    preset: process.env.VERCEL
      ? "vercel"
      : process.env.NITRO_PRESET || "cloudflare-module",
    prerender: {
      routes: ["/"],
    },
  },
  routeRules: {
    "/": {
          swr: false, // 关闭 ISR/SWR，避免首页被边缘缓存
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
          }
        },
    // 静态资源走长缓存（带内容哈希，安全）
    "/_nuxt/**": {
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        }
  },
  runtimeConfig: {
    // server-only
    defaultChannels: [
      "tgsearchers3",
      "yunpanxunlei",
      "tianyifc",
      "BaiduCloudDisk",
      "txtyzy",
      "peccxinpd",
      "gotopan",
      "xingqiump4",
      "yunpanqk",
      "PanjClub",
      "kkxlzy",
      "baicaoZY",
      "MCPH01",
      "share_aliyun",
      "bdwpzhpd",
      "ysxb48",
      "jdjdn1111",
      "yggpan",
      "MCPH086",
      "zaihuayun",
      "Q66Share",
      "NewAliPan",
      "ypquark",
      "Oscar_4Kmovies",
      "ucwpzy",
      "alyp_TV",
      "alyp_4K_Movies",
      "shareAliyun",
      "alyp_1",
      "dianyingshare",
      "Quark_Movies",
      "XiangxiuNBB",
      "NewQuark",
      "ydypzyfx",
      "kuakeyun",
      "ucquark",
      "xx123pan",
      "yingshifenxiang123",
      "zyfb123",
      "tyypzhpd",
      "tianyirigeng",
      "cloudtianyi",
      "hdhhd21",
      "Lsp115",
      "oneonefivewpfx",
      "Maidanglaocom",
      "qixingzhenren",
      "taoxgzy",
      "tgsearchers115",
      "Channel_Shares_115",
      "tyysypzypd",
      "vip115hot",
      "wp123zy",
      "yunpan139",
      "yunpan189",
      "yunpanuc",
      "yydf_hzl",
      "alyp_Animation",
      "alyp_JLP",
      "leoziyuan",
      "AliyunDrive_Share_Channel",
      "aliyunys",
      "Aliyun_4K_Movies",
      "yunpanpan",
      "Quark_Share_Channel",
      "quarkshare",
      "baiduyun",
      "iAliyun",
      "quanziyuanshe",
    ],
    defaultConcurrency: 10,
    pluginTimeoutMs: 15000,
    cacheEnabled: true,
    cacheTtlMinutes: 30,
    public: {
      apiBase: "/api",
      // 用于 sitemap、canonical、OG 等
      siteUrl: "https://pansou.app",
      // 平台显示优先级（前端会按此顺序渲染分组）
      platformPriority: [
        "aliyun",
        "baidu",
        "quark",
        "115",
        "xunlei",
        "tianyi",
        "uc",
        "123",
        "mobile",
        "others",
      ],
      // 向前端暴露默认频道清单，供 UI 勾选（不会影响服务端私有配置）
      tgDefaultChannels: [
        "tgsearchers3",
        "yunpanxunlei",
        "tianyifc",
        "BaiduCloudDisk",
        "txtyzy",
        "peccxinpd",
        "gotopan",
        "xingqiump4",
        "yunpanqk",
        "PanjClub",
        "kkxlzy",
        "baicaoZY",
        "MCPH01",
        "share_aliyun",
        "bdwpzhpd",
        "ysxb48",
        "jdjdn1111",
        "yggpan",
        "MCPH086",
        "zaihuayun",
        "Q66Share",
        "NewAliPan",
        "ypquark",
        "Oscar_4Kmovies",
        "ucwpzy",
        "alyp_TV",
        "alyp_4K_Movies",
        "shareAliyun",
        "alyp_1",
        "dianyingshare",
        "Quark_Movies",
        "XiangxiuNBB",
        "NewQuark",
        "ydypzyfx",
        "kuakeyun",
        "ucquark",
        "xx123pan",
        "yingshifenxiang123",
        "zyfb123",
        "tyypzhpd",
        "tianyirigeng",
        "cloudtianyi",
        "hdhhd21",
        "Lsp115",
        "oneonefivewpfx",
        "Maidanglaocom",
        "qixingzhenren",
        "taoxgzy",
        "tgsearchers115",
        "Channel_Shares_115",
        "tyysypzypd",
        "vip115hot",
        "wp123zy",
        "yunpan139",
        "yunpan189",
        "yunpanuc",
        "yydf_hzl",
        "alyp_Animation",
        "alyp_JLP",
        "leoziyuan",
        "AliyunDrive_Share_Channel",
        "aliyunys",
        "Aliyun_4K_Movies",
        "yunpanpan",
        "Quark_Share_Channel",
        "quarkshare",
        "baiduyun",
        "iAliyun",
        "quanziyuanshe",
      ],
    },
  },
});
