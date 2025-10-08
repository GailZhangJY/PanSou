import { defineEventHandler, getHeader, getMethod, setHeader, setResponseStatus, getRequestURL } from 'h3';

// 严格 CORS：
// - 仅允许同源（https://pansou.app）或你自定义白名单域名
// - 对不在白名单的跨域预检（OPTIONS）直接 403
// - 对不在白名单的实际跨域请求不返回 CORS 头从而被浏览器拦截
export default defineEventHandler((event) => {
  // 仅作用于 /api 下的接口
  const url = getRequestURL(event);
  if (!url.pathname.startsWith('/api')) return;

  const origin = getHeader(event, 'origin') || '';
  const method = getMethod(event).toUpperCase();

  // 允许的来源白名单（如需多域名可添加到数组）
  const allowlist = new Set<string>([
    'https://pansou.app',
    // 可添加更多允许的来源，例如：
    // 'https://www.pansou.app',
  ]);

  // 同源请求在浏览器层面不需要 CORS 头，这里仅对带 Origin 的跨域请求进行控制
  if (origin) {
    const isAllowed = allowlist.has(origin);

    if (method === 'OPTIONS') {
      // 预检请求：仅对白名单返回 204 + CORS 头；其他一律 403
      if (isAllowed) {
        setHeader(event, 'Access-Control-Allow-Origin', origin);
        setHeader(event, 'Vary', 'Origin');
        setHeader(event, 'Access-Control-Allow-Credentials', 'true');
        setHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
        setResponseStatus(event, 204);
        return '';
      } else {
        setResponseStatus(event, 403);
        return 'CORS Forbidden';
      }
    } else if (isAllowed) {
      // 实际跨域请求：白名单才返回 CORS 头
      setHeader(event, 'Access-Control-Allow-Origin', origin);
      setHeader(event, 'Vary', 'Origin');
      setHeader(event, 'Access-Control-Allow-Credentials', 'true');
    } else {
      // 非白名单：直接拒绝（浏览器与非浏览器都会拿到 403）
      setResponseStatus(event, 403);
      return 'CORS Forbidden';
    }
  }
});
