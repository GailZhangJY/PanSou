<template>
  <div class="container">
    <header class="hero">
      <div class="hero__title">PanSou API 文档</div>
      <div class="hero__subtitle">网盘搜索服务 API 接口文档</div>
    </header>

    <div class="content">
      <!-- API 概述 -->
      <section class="section">
        <h2 class="section__title">API 概述</h2>
        <div class="overview">
          <p>
            PanSou API
            提供了强大的网盘搜索功能，支持多个搜索源和插件。通过简单的 HTTP
            请求即可获取网盘资源信息。
          </p>
          <p>
            <strong>主要接口：</strong>
          </p>
          <ul>
            <li>
              <code>/api/search</code> - 网盘搜索接口，支持 GET 和 POST 请求
            </li>
            <li>
              <code>/api/health</code> - 健康检查接口，返回可用的插件和频道列表
            </li>
          </ul>
          <div class="endpoint-info">
            <div class="endpoint">
              <span class="method method--get">GET</span>
              <code>/api/search</code>
            </div>
            <div class="endpoint">
              <span class="method method--post">POST</span>
              <code>/api/search</code>
            </div>
            <div class="endpoint">
              <span class="method method--get">GET</span>
              <code>/api/health</code>
            </div>
          </div>
        </div>
      </section>

      <!-- 请求参数 -->
      <section class="section">
        <h2 class="section__title">请求参数</h2>

        <div class="params-table">
          <table>
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>必填</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>kw</code></td>
                <td>string</td>
                <td><span class="required">是</span></td>
                <td>-</td>
                <td>搜索关键词</td>
              </tr>
              <tr>
                <td><code>channels</code></td>
                <td>string[] | string</td>
                <td>否</td>
                <td>-</td>
                <td>Telegram 频道列表，支持逗号分隔的字符串或数组</td>
              </tr>
              <tr>
                <td><code>plugins</code></td>
                <td>string[] | string</td>
                <td>否</td>
                <td>-</td>
                <td>插件列表，支持逗号分隔的字符串或数组</td>
              </tr>
              <tr>
                <td><code>cloud_types</code></td>
                <td>string[] | string</td>
                <td>否</td>
                <td>-</td>
                <td>云盘类型过滤，如：aliyun,baidu,onedrive</td>
              </tr>
              <tr>
                <td><code>conc</code></td>
                <td>number</td>
                <td>否</td>
                <td>10</td>
                <td>并发数量限制</td>
              </tr>
              <tr>
                <td><code>refresh</code></td>
                <td>boolean</td>
                <td>否</td>
                <td>false</td>
                <td>是否强制刷新缓存</td>
              </tr>
              <tr>
                <td><code>res</code></td>
                <td>string</td>
                <td>否</td>
                <td>merged_by_type</td>
                <td>响应格式：merged_by_type | results | all</td>
              </tr>
              <tr>
                <td><code>src</code></td>
                <td>string</td>
                <td>否</td>
                <td>all</td>
                <td>搜索源：all | tg | plugin</td>
              </tr>
              <tr>
                <td><code>ext</code></td>
                <td>object</td>
                <td>否</td>
                <td>{}</td>
                <td>扩展参数，JSON 格式</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 参数详细说明 -->
        <div class="param-details">
          <h3>参数详细说明</h3>

          <div class="param-group">
            <h4>channels - Telegram 频道</h4>
            <p>指定要搜索的 Telegram 频道，支持以下格式：</p>
            <div class="code-example">
              <div class="code-header">示例</div>
              <pre><code>channels=alipanshare,tgxiazaiyuan
channels=["alipanshare", "tgxiazaiyuan"]</code></pre>
            </div>
            <p>
              <strong>可用的 Telegram 频道列表：（也可以输入其他频道）</strong>
            </p>
            <div class="channels-grid">
              <span class="channel-tag">tgsearchers3</span>
              <span class="channel-tag">yunpanxunlei</span>
              <span class="channel-tag">tianyifc</span>
              <span class="channel-tag">BaiduCloudDisk</span>
              <span class="channel-tag">txtyzy</span>
              <span class="channel-tag">peccxinpd</span>
              <span class="channel-tag">gotopan</span>
              <span class="channel-tag">xingqiump4</span>
              <span class="channel-tag">yunpanqk</span>
              <span class="channel-tag">PanjClub</span>
              <span class="channel-tag">kkxlzy</span>
              <span class="channel-tag">baicaoZY</span>
              <span class="channel-tag">MCPH01</span>
              <span class="channel-tag">share_aliyun</span>
              <span class="channel-tag">bdwpzhpd</span>
              <span class="channel-tag">ysxb48</span>
              <span class="channel-tag">jdjdn1111</span>
              <span class="channel-tag">yggpan</span>
              <span class="channel-tag">MCPH086</span>
              <span class="channel-tag">zaihuayun</span>
              <span class="channel-tag">Q66Share</span>
              <span class="channel-tag">NewAliPan</span>
              <span class="channel-tag">ypquark</span>
              <span class="channel-tag">Oscar_4Kmovies</span>
              <span class="channel-tag">ucwpzy</span>
              <span class="channel-tag">alyp_TV</span>
              <span class="channel-tag">alyp_4K_Movies</span>
              <span class="channel-tag">shareAliyun</span>
              <span class="channel-tag">alyp_1</span>
              <span class="channel-tag">dianyingshare</span>
              <span class="channel-tag">Quark_Movies</span>
              <span class="channel-tag">XiangxiuNBB</span>
              <span class="channel-tag">NewQuark</span>
              <span class="channel-tag">ydypzyfx</span>
              <span class="channel-tag">kuakeyun</span>
              <span class="channel-tag">ucquark</span>
              <span class="channel-tag">xx123pan</span>
              <span class="channel-tag">yingshifenxiang123</span>
              <span class="channel-tag">zyfb123</span>
              <span class="channel-tag">tyypzhpd</span>
              <span class="channel-tag">tianyirigeng</span>
              <span class="channel-tag">cloudtianyi</span>
              <span class="channel-tag">hdhhd21</span>
              <span class="channel-tag">Lsp115</span>
              <span class="channel-tag">oneonefivewpfx</span>
              <span class="channel-tag">Maidanglaocom</span>
              <span class="channel-tag">qixingzhenren</span>
              <span class="channel-tag">taoxgzy</span>
              <span class="channel-tag">tgsearchers115</span>
              <span class="channel-tag">Channel_Shares_115</span>
              <span class="channel-tag">tyysypzypd</span>
              <span class="channel-tag">vip115hot</span>
              <span class="channel-tag">wp123zy</span>
              <span class="channel-tag">yunpan139</span>
              <span class="channel-tag">yunpan189</span>
              <span class="channel-tag">yunpanuc</span>
              <span class="channel-tag">yydf_hzl</span>
              <span class="channel-tag">alyp_Animation</span>
              <span class="channel-tag">alyp_JLP</span>
              <span class="channel-tag">leoziyuan</span>
              <span class="channel-tag">AliyunDrive_Share_Channel</span>
              <span class="channel-tag">aliyunys</span>
              <span class="channel-tag">Aliyun_4K_Movies</span>
              <span class="channel-tag">yunpanpan</span>
              <span class="channel-tag">Quark_Share_Channel</span>
              <span class="channel-tag">quarkshare</span>
              <span class="channel-tag">baiduyun</span>
              <span class="channel-tag">iAliyun</span>
              <span class="channel-tag">quanziyuanshe</span>
            </div>
          </div>

          <div class="param-group">
            <h4>plugins - 搜索插件</h4>
            <p>可用的搜索插件包括：</p>
            <div class="plugin-grid">
              <span class="plugin-tag">labi</span>
              <span class="plugin-tag">panta</span>
              <span class="plugin-tag">jikepan</span>
              <span class="plugin-tag">qupansou</span>
              <span class="plugin-tag">thepiratebay</span>
              <span class="plugin-tag">duoduo</span>
              <span class="plugin-tag">xuexizhinan</span>
              <span class="plugin-tag">pansearch</span>
              <span class="plugin-tag">nyaa</span>
              <span class="plugin-tag">hunhepan</span>
            </div>
          </div>

          <div class="param-group">
            <h4>res - 响应格式</h4>
            <ul>
              <li><code>merged_by_type</code> - 按类型合并的链接（默认）</li>
              <li><code>results</code> - 原始搜索结果</li>
              <li><code>all</code> - 包含所有格式的完整响应</li>
            </ul>
          </div>

          <div class="param-group">
            <h4>src - 搜索源</h4>
            <ul>
              <li><code>all</code> - 搜索所有源（默认）</li>
              <li><code>tg</code> - 仅搜索 Telegram 频道</li>
              <li><code>plugin</code> - 仅搜索插件</li>
            </ul>
            <p>
              <strong>注意：</strong>当 src=tg 时，plugins 参数会被忽略；当
              src=plugin 时，channels 参数会被忽略。
            </p>
          </div>
        </div>
      </section>

      <!-- 请求示例 -->
      <section class="section">
        <h2 class="section__title">请求示例</h2>

        <div class="examples">
          <!-- Health 接口示例 -->
          <div class="example">
            <h3>Health 接口</h3>
            <div class="code-example">
              <div class="code-header">cURL</div>
              <pre><code>curl -X GET "https://your-domain.com/api/health"</code></pre>
            </div>
            <div class="code-example">
              <div class="code-header">JavaScript (fetch)</div>
              <pre><code>const response = await fetch('/api/health');
const data = await response.json();
console.log('可用插件:', data.plugins);
console.log('可用频道:', data.channels);</code></pre>
            </div>
            <div class="code-example">
              <div class="code-header">响应示例</div>
              <pre><code>{
  "status": "ok",
  "plugins_enabled": true,
  "plugin_count": 10,
  "plugins": ["labi", "panta", "jikepan", "qupansou", "thepiratebay", "duoduo", "xuexizhinan", "pansearch", "nyaa", "hunhepan"],
  "channels": ["tgsearchers3", "yunpanxunlei", "tianyifc", "BaiduCloudDisk", ...]
}</code></pre>
            </div>
          </div>

          <!-- GET 请求示例 -->
          <div class="example">
            <h3>Search GET 请求</h3>
            <div class="code-example">
              <div class="code-header">cURL</div>
              <pre><code>curl -X GET "https://your-domain.com/api/search?kw=电影&channels=alipanshare,tgxiazaiyuan&plugins=hunhepan&res=merged_by_type"</code></pre>
            </div>
            <div class="code-example">
              <div class="code-header">JavaScript (fetch)</div>
              <pre><code>const response = await fetch('/api/search?kw=电影&channels=alipanshare,tgxiazaiyuan&plugins=hunhepan&res=merged_by_type');
const data = await response.json();</code></pre>
            </div>
          </div>

          <!-- POST 请求示例 -->
          <div class="example">
            <h3>Search POST 请求</h3>
            <div class="code-example">
              <div class="code-header">cURL</div>
              <pre><code>curl -X POST "https://your-domain.com/api/search" \
  -H "Content-Type: application/json" \
  -d '{
    "kw": "电影",
    "channels": ["alipanshare", "tgxiazaiyuan"],
    "plugins": ["hunhepan"],
    "res": "merged_by_type",
    "refresh": false,
    "ext": {"custom_param": "value"}
  }'</code></pre>
            </div>
            <div class="code-example">
              <div class="code-header">JavaScript (fetch)</div>
              <pre><code>const response = await fetch('/api/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    kw: '电影',
    channels: ['alipanshare', 'tgxiazaiyuan'],
    plugins: ['hunhepan'],
    res: 'merged_by_type',
    refresh: false,
    ext: { custom_param: 'value' }
  })
});
const data = await response.json();</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- 响应格式 -->
      <section class="section">
        <h2 class="section__title">响应格式</h2>

        <div class="response-info">
          <p>所有 API 响应都遵循统一的格式：</p>
          <div class="code-example">
            <div class="code-header">响应结构</div>
            <pre><code>{
  "code": 0,
  "message": "success",
  "data": {
    // 具体数据内容
  }
}</code></pre>
          </div>
        </div>

        <div class="response-types">
          <h3>响应类型</h3>

          <div class="response-type">
            <h4>merged_by_type 格式 (默认)</h4>
            <div class="code-example">
              <pre><code>{
  "code": 0,
  "message": "success",
  "data": {
    "total": 150,
    "merged_by_type": {
      "aliyun": [
        {
          "url": "https://www.aliyundrive.com/s/xxx",
          "password": "1234",
          "note": "电影资源",
          "datetime": "2024-01-01T12:00:00Z",
          "source": "tg:alipanshare",
          "images": ["https://example.com/image.jpg"]
        }
      ],
      "baidu": [
        {
          "url": "https://pan.baidu.com/s/xxx",
          "password": "5678",
          "note": "电视剧资源",
          "datetime": "2024-01-01T13:00:00Z",
          "source": "plugin:hunhepan"
        }
      ]
    }
  }
}</code></pre>
            </div>
          </div>

          <div class="response-type">
            <h4>results 格式</h4>
            <div class="code-example">
              <pre><code>{
  "code": 0,
  "message": "success",
  "data": {
    "total": 150,
    "results": [
      {
        "message_id": "12345",
        "unique_id": "unique_123",
        "channel": "alipanshare",
        "datetime": "2024-01-01T12:00:00Z",
        "title": "电影资源分享",
        "content": "分享一些电影资源...",
        "links": [
          {
            "type": "aliyun",
            "url": "https://www.aliyundrive.com/s/xxx",
            "password": "1234"
          }
        ],
        "tags": ["电影", "高清"],
        "images": ["https://example.com/image.jpg"]
      }
    ]
  }
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- 错误码 -->
      <section class="section">
        <h2 class="section__title">错误码</h2>

        <div class="error-codes">
          <table>
            <thead>
              <tr>
                <th>错误码</th>
                <th>说明</th>
                <th>解决方案</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>400</td>
                <td>请求参数错误</td>
                <td>检查必填参数 kw 是否提供，参数格式是否正确</td>
              </tr>
              <tr>
                <td>400</td>
                <td>ext 参数 JSON 格式错误</td>
                <td>确保 ext 参数是有效的 JSON 格式</td>
              </tr>
              <tr>
                <td>500</td>
                <td>服务器内部错误</td>
                <td>请联系管理员或稍后重试</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 在线测试 -->
      <section class="section">
        <h2 class="section__title">在线测试</h2>

        <div class="test-panel">
          <div class="test-form">
            <h3>快速测试</h3>

            <div class="form-group">
              <label>
                <span>搜索关键词 (kw) *</span>
                <input v-model="testKw" placeholder="输入搜索关键词" />
              </label>
            </div>

            <div class="form-group">
              <label>
                <span>Telegram 频道 (channels)</span>
                <input
                  v-model="testChannels"
                  placeholder="alipanshare,tgxiazaiyuan" />
              </label>
            </div>

            <div class="form-group">
              <label>
                <span>插件 (plugins)</span>
                <input v-model="testPlugins" placeholder="hunhepan" />
              </label>
            </div>

            <div class="form-group">
              <label>
                <span>响应格式 (res)</span>
                <select v-model="testRes">
                  <option value="merged_by_type">merged_by_type</option>
                  <option value="results">results</option>
                  <option value="all">all</option>
                </select>
              </label>
            </div>

            <div class="test-actions">
              <button
                class="btn btn--primary"
                :disabled="!testKw || loading"
                @click="testGet">
                Search GET 测试
              </button>
              <button
                class="btn btn--secondary"
                :disabled="!testKw || loading"
                @click="testPost">
                Search POST 测试
              </button>
              <button
                class="btn btn--info"
                :disabled="loading"
                @click="testHealth">
                Health 接口测试
              </button>
              <span v-if="loading" class="loading">请求中...</span>
            </div>

            <div v-if="error" class="alert alert--error">{{ error }}</div>
          </div>

          <div class="test-result">
            <div class="result-header">
              <h3>响应结果</h3>
              <button v-if="result" class="btn btn--ghost" @click="copyResult">
                复制结果
              </button>
            </div>
            <div class="result-content">
              <pre v-if="result">{{ pretty(result) }}</pre>
              <div v-else class="placeholder">点击上方按钮开始测试</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "PanSou API 文档",
  description:
    "PanSou 网盘搜索服务 API 接口文档，包含详细的参数说明、示例代码和响应格式。",
});

const config = useRuntimeConfig();
const apiBase = (config.public?.apiBase as string) || "/api";

// 测试表单数据
const testKw = ref("");
const testChannels = ref("alipanshare,tgxiazaiyuan");
const testPlugins = ref("hunhepan");
const testRes = ref<"merged_by_type" | "results" | "all">("merged_by_type");

const loading = ref(false);
const error = ref("");
const result = ref<any>(null);

function pretty(data: unknown) {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

async function testGet() {
  await testRequest("GET");
}

async function testPost() {
  await testRequest("POST");
}

async function testHealth() {
  error.value = "";
  result.value = null;
  loading.value = true;

  try {
    const data = await $fetch(`${apiBase}/health`);
    result.value = data;
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    loading.value = false;
  }
}

async function testRequest(method: "GET" | "POST") {
  error.value = "";
  result.value = null;
  loading.value = true;

  try {
    if (method === "GET") {
      const query: Record<string, any> = { kw: testKw.value };
      if (testChannels.value) query.channels = testChannels.value;
      if (testPlugins.value) query.plugins = testPlugins.value;
      if (testRes.value) query.res = testRes.value;

      const data = await $fetch(`${apiBase}/search`, { method: "GET", query });
      result.value = data;
    } else {
      const body: Record<string, any> = {
        kw: testKw.value,
        res: testRes.value,
      };

      if (testChannels.value) {
        body.channels = testChannels.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (testPlugins.value) {
        body.plugins = testPlugins.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const data = await $fetch(`${apiBase}/search`, { method: "POST", body });
      result.value = data;
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    loading.value = false;
  }
}

async function copyResult() {
  if (!result.value) return;
  try {
    await navigator.clipboard.writeText(pretty(result.value) as string);
  } catch {}
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero__title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero__subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.overview {
  line-height: 1.6;
  color: #666;
}

.endpoint-info {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.method--get {
  background: #28a745;
  color: white;
}

.method--post {
  background: #007bff;
  color: white;
}

.params-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.params-table th,
.params-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.params-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.required {
  color: #dc3545;
  font-weight: 600;
}

.param-details {
  margin-top: 30px;
}

.param-group {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.param-group h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
}

.param-group ul {
  margin: 10px 0;
  padding-left: 20px;
}

.param-group li {
  margin-bottom: 5px;
  color: #666;
}

.plugin-grid,
.channels-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.plugin-tag,
.channel-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
  border: 1px solid #bbdefb;
}

.channel-tag {
  background: #f3e5f5;
  color: #7b1fa2;
  border-color: #ce93d8;
}

.code-example {
  margin: 15px 0;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  background: #f8f9fa;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.code-example pre {
  margin: 0;
  padding: 15px;
  background: #f8f9fa;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.4;
}

.code-example code {
  color: #333;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.example h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.response-info {
  margin-bottom: 30px;
}

.response-types {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.response-type h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

.error-codes table {
  width: 100%;
  border-collapse: collapse;
}

.error-codes th,
.error-codes td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.error-codes th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.test-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.test-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.test-form h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.test-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn--primary {
  background: #007bff;
  color: white;
}

.btn--primary:hover {
  background: #0056b3;
}

.btn--secondary {
  background: #6c757d;
  color: white;
}

.btn--secondary:hover {
  background: #545b62;
}

.btn--info {
  background: #17a2b8;
  color: white;
}

.btn--info:hover {
  background: #138496;
}

.btn--ghost {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn--ghost:hover {
  background: #007bff;
  color: white;
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  color: #666;
  font-size: 14px;
}

.alert {
  padding: 10px 12px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 14px;
}

.alert--error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.test-result {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-header h3 {
  margin: 0;
  color: #333;
}

.result-content {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  min-height: 200px;
}

.result-content pre {
  margin: 0;
  padding: 15px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.placeholder {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .test-panel {
    grid-template-columns: 1fr;
  }

  .endpoint-info {
    flex-direction: column;
  }

  .hero__title {
    font-size: 2rem;
  }
}
</style>
