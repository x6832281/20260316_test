(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "我从那个世界回来就立刻做了这个视频 接下来一点点的和你们娓娓道来", "value": 38587, "platform": "B站", "url": "https://www.bilibili.com/video/BV1TxxC6vEo4"},
    {"name": "iPhone paper", "value": 24000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "这期质量真的高……有内涵有笑点，会一直支持你的老番茄", "value": 14586, "platform": "B站", "url": "https://www.bilibili.com/video/BV1TxxC6vEo4"},
    {"name": "人迟早从兜里掏出一台电视机", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "iPhone Door", "value": 9802, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "原来一边直角一边圆角就是Duo的D啊！", "value": 7608, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa313dc000000002b003caa?xsec_token=ABhkdwyqAEzNZFGz82SqksE1UMR3Eqww5nXJYcwrD2taE=&xsec_source=pc_search"},
    {"name": "万圣节大家都 cos 吸血鬼、小恶魔啥的，那为啥中元节没人 cos 纸扎人呢？[…", "value": 7264, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dRx16pE3J"},
    {"name": "突然意识到神父应该精通正态分布[思考]", "value": 7209, "platform": "B站", "url": "https://www.bilibili.com/video/BV1TxxC6vEo4"},
    {"name": "小灭霸还挺强，把复仇者联盟每个人都揍的鼻青脸肿 [绘之音表情包_瞅瞅]", "value": 6000, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ugxq6HEfH"},
    {"name": "开局以为是生死局，看到最后", "value": 5207, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Nax16uEHm"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "哔哩哔哩 - ( ゜- ゜)つロ 乾杯~", "value": 772},
    {"name": "什么意思", "value": 763},
    {"name": "纯纯稚稚请和好", "value": 562},
    {"name": "今天有空", "value": 482},
    {"name": "秒吃", "value": 401},
    {"name": "褒贬不一", "value": 186},
    {"name": "懂你意思", "value": 152},
    {"name": "文明", "value": 148},
    {"name": "又看一集", "value": 131},
    {"name": "合影", "value": 121},
    {"name": "谢谢", "value": 93},
    {"name": "啊？", "value": 81}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "pingdotgg/t3code", "value": 3229, "lang": "TypeScript", "total": "41,995"},
    {"name": "vercel-labs/agent-desktop", "value": 2275, "lang": "Rust", "total": "9,768"},
    {"name": "thedotmack/claude-mem", "value": 1803, "lang": "TypeScript", "total": "110,763"},
    {"name": "Donchitos/Claude-Code-Game-Studios", "value": 1379, "lang": "Shell", "total": "33,573"},
    {"name": "mattpocock/skills", "value": 858, "lang": "Shell", "total": "310,248"},
    {"name": "shiyu-coder/Kronos", "value": 857, "lang": "Python", "total": "46,020"},
    {"name": "D4Vinci/Scrapling", "value": 706, "lang": "Python", "total": "92,913"},
    {"name": "JustVugg/colibri", "value": 675, "lang": "C", "total": "46,569"},
    {"name": "FlashML-org/FreeToken", "value": 653, "lang": "Python", "total": "16,078"},
    {"name": "hyprwm/Hyprland", "value": 509, "lang": "C++", "total": "39,939"}
  ].reverse();

  var chart1 = null, chart2 = null, chart3 = null;

  function renderCharts() {
    var style = getComputedStyle(document.documentElement);
    var xhs = (style.getPropertyValue('--xhs') || '#C73E3A').trim();
    var bili = (style.getPropertyValue('--bili') || '#2679B2').trim();
    var gh = (style.getPropertyValue('--gh') || '#5A488A').trim();
    var ink = (style.getPropertyValue('--ink') || '#1F1B18').trim();
    var muted = (style.getPropertyValue('--muted') || '#615B54').trim();
    var rule = (style.getPropertyValue('--rule') || '#E5E0D8').trim();
    var paper = (style.getPropertyValue('--paper') || '#FAF8F5').trim();
    var wash = (style.getPropertyValue('--wash') || '#F3EFE8').trim();

    var tooltipBase = {
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: wash, opacity: 0.6 } },
      appendToBody: true,
      backgroundColor: paper,
      borderColor: rule,
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: ink, fontSize: 13, fontFamily: "-apple-system, 'PingFang SC', sans-serif" },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 6px; backdrop-filter: blur(8px);'
    };

    var labelBase = {
      show: true, position: 'right',
      color: muted, fontSize: 12,
      fontFamily: "'JetBrainsMono', -apple-system, sans-serif"
    };

    // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
    var el1 = document.getElementById('chart-top-comments');
    if (el1) {
      if (!chart1) {
        chart1 = echarts.init(el1, null, { renderer: 'svg' });
        chart1.on('click', function (params) {
          if (params.data && params.data.url) {
            window.open(params.data.url, '_blank', 'noopener');
          }
        });
      }
      chart1.setOption({
        animation: false,
        tooltip: Object.assign({}, tooltipBase, {
          formatter: function (params) {
            var p = params[0];
            var col = p.data.platform === '小红书' ? xhs : bili;
            return '<span style="font-weight:700;color:' + col + '">' +
                   p.data.platform + '</span> · <span style="font-weight:700">' + p.data.likes + ' 赞</span><br>' +
                   '<span style="font-size:12.5px;opacity:0.9;margin-top:6px;display:inline-block;max-width:340px;line-height:1.5;white-space:normal">' +
                   (p.data.full || p.name) + '</span>';
          }
        }),
        grid: { left: 8, right: 88, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: [3, 4], dashOffset: 1 } }
        },
        yAxis: {
          type: 'category',
          data: topComments.map(function (d) { return d.name; }),
          axisLabel: {
            color: ink, fontSize: 12.5,
            width: 360, overflow: 'truncate',
            formatter: function (v) { return v.length > 26 ? v.slice(0, 26) + '…' : v; }
          },
          axisLine: { lineStyle: { color: rule } },
          axisTick: { show: false }
        },
        series: [{
          type: 'bar',
          data: topComments.map(function (d) {
            var col = d.platform === '小红书' ? xhs : bili;
            return {
              value: d.value,
              platform: d.platform,
              full: d.name,
              likes: d.value.toLocaleString(),
              url: d.url || '',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: col + '44' },
                  { offset: 1, color: col }
                ]),
                borderColor: col,
                borderWidth: 0.8,
                borderRadius: [0, 4, 4, 0]
              },
              emphasis: {
                itemStyle: {
                  color: col,
                  shadowBlur: 8,
                  shadowColor: col + '66'
                }
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return p.data.likes + ' 赞'; }
          }),
          barMaxWidth: 18
        }]
      });
    }

    // --- Chart 2: B站热门弹幕频次 TOP 12 ---
    var el2 = document.getElementById('chart-danmaku');
    if (el2) {
      if (!chart2) {
        chart2 = echarts.init(el2, null, { renderer: 'svg' });
      }
      chart2.setOption({
        animation: false,
        tooltip: Object.assign({}, tooltipBase, {
          formatter: function (params) {
            var p = params[0];
            return '<span style="font-weight:700;color:' + bili + '">热门弹幕</span><br>' +
                   '<span style="font-size:13px;font-weight:600">' + p.name + '</span> · <b>' + p.value.toLocaleString() + ' 次</b>';
          }
        }),
        grid: { left: 8, right: 88, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: [3, 4], dashOffset: 1 } }
        },
        yAxis: {
          type: 'category',
          data: danmaku.map(function (d) { return d.name; }),
          axisLabel: { color: ink, fontSize: 12.5 },
          axisLine: { lineStyle: { color: rule } },
          axisTick: { show: false }
        },
        series: [{
          type: 'bar',
          data: danmaku.map(function (d) {
            return {
              value: d.value,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: bili + (d.value > 300 ? '44' : '22') },
                  { offset: 1, color: bili + (d.value > 300 ? 'ff' : 'bb') }
                ]),
                borderColor: bili,
                borderWidth: d.value > 300 ? 0.8 : 0.4,
                borderRadius: [0, 4, 4, 0]
              },
              emphasis: {
                itemStyle: {
                  color: bili,
                  shadowBlur: 8,
                  shadowColor: bili + '66'
                }
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return p.value.toLocaleString() + ' 次'; }
          }),
          barMaxWidth: 18
        }]
      });
    }

    // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
    var el3 = document.getElementById('chart-github');
    if (el3) {
      if (!chart3) {
        chart3 = echarts.init(el3, null, { renderer: 'svg' });
      }
      chart3.setOption({
        animation: false,
        tooltip: Object.assign({}, tooltipBase, {
          formatter: function (params) {
            var p = params[0];
            return '<span style="font-weight:700;color:' + gh + '">' + p.data.repo + '</span><br>' +
                   '今日新增 <b>+' + p.value.toLocaleString() + ' Star</b> · ' + p.data.lang +
                   (p.data.total ? '<br><span style="opacity:0.8;font-size:12px">全网总星数 ' + p.data.total + '</span>' : '');
          }
        }),
        grid: { left: 8, right: 96, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: [3, 4], dashOffset: 1 } }
        },
        yAxis: {
          type: 'category',
          data: ghTrending.map(function (d) { return d.name; }),
          axisLabel: { color: ink, fontSize: 12, fontFamily: "'JetBrainsMono', monospace" },
          axisLine: { lineStyle: { color: rule } },
          axisTick: { show: false }
        },
        series: [{
          type: 'bar',
          data: ghTrending.map(function (d) {
            return {
              value: d.value,
              repo: d.name,
              lang: d.lang,
              total: d.total,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: gh + (d.value > 1000 ? '44' : '22') },
                  { offset: 1, color: gh + (d.value > 1000 ? 'ff' : 'bb') }
                ]),
                borderColor: gh,
                borderWidth: d.value > 1000 ? 0.8 : 0.4,
                borderRadius: [0, 4, 4, 0]
              },
              emphasis: {
                itemStyle: {
                  color: gh,
                  shadowBlur: 8,
                  shadowColor: gh + '66'
                }
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return '+' + p.value.toLocaleString() + ' ★'; }
          }),
          barMaxWidth: 18
        }]
      });
    }
  }

  // Initial render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCharts);
  } else {
    renderCharts();
  }

  // Resize handler
  window.addEventListener('resize', function () {
    if (chart1) chart1.resize();
    if (chart2) chart2.resize();
    if (chart3) chart3.resize();
  });

  // Watch for theme changes on html attribute
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') {
        renderCharts();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('themeChanged', renderCharts);
})();
