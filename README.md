# PanSou · 全网最全的网盘搜索

用一个搜索框，搜遍阿里云盘、夸克、百度网盘、115、迅雷等热门网盘资源。即搜即得、聚合去重、免费开源、零广告、轻量部署。

在线体验：<https://pansou.app>

> 免责声明：本项目仅用于技术学习与搜索聚合演示，不存储、不传播任何受版权保护的内容。请勿用于商业或侵权用途。

---

## 为什么选择 PanSou

- 强聚合：聚合多个优质资源站与公开频道，一次搜索多源命中
- 智能排序：默认先给出“快速结果”，随后自动补全“深度结果”并覆盖显示
- 分类型展示：阿里、夸克、百度、115、迅雷等分类清晰，直达链接可复制
- 极速部署：原生支持 Cloudflare Workers，0 服务器运维成本，免费起步
- 轻定制：内置多插件，支持按需启用/禁用，参数化并发与缓存

---

## 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgailzhangjy%2Fpansou.app&project-name=PanSou&repository-name=pansou.app)

---

## 一键部署到 Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gailzhangjy/pansou.app)

---

## Docker 部署

```bash
# GHCR
docker pull ghcr.io/gailzhangjy/pansou.app:latest
docker run --name PanSou -p 3000:3000 -d ghcr.io/gailzhangjy/pansou.app:latest

# Docker Hub
docker pull docker.io/gailzhangjy/pansou.app:latest
docker run --name PanSou -p 3000:3000 -d docker.io/gailzhangjy/pansou.app:latest
```

## 使用说明

1) 输入关键词并回车开始搜索。

2) 系统会优先并发查询一批“快速结果”（默认插件并发 4，可在“设置”中调节 1-16），随后继续滚动查询“深度结果”，并自动合并覆盖展示。

3) 页面右上角“设置”可自定义：
   - 插件启用列表（聚合多个站点来源）
   - TG 频道列表（默认启用一组公开频道）
   - 插件并发数与插件超时（毫秒）

4) 搜索框“重置”会立即取消进行中的所有请求并清空结果。

5) 如需恢复默认配置，设置面板点击“恢复默认”将清空本地存储并刷新页面。

---

## 版权与合规

- PanSou 不存储任何搜索结果内容，所有链接均来自公开网络。
- 请在遵守当地法律法规与平台使用条款的前提下使用本项目。
- 若您是权利人并认为存在侵权线索，请先联系源站处理。

---

## 许可证

本项目采用 MIT License 开源许可，商业使用请遵守许可证条款并自担合规责任。
