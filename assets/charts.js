(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "在前两年谁能想到，以后举显卡的不是老黄了", "value": 10231, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FuWZ6dEjb"},
    {"name": "胡桃：什么叫客卿可以自己搓摩拉", "value": 8207, "platform": "B站", "url": "https://www.bilibili.com/video/BV1aTWm6jEL8"},
    {"name": "钟离出来这么久了，钟离厨应该了解的很多吧？ 钟离本命叫啥啊？[doge_金箍]有…", "value": 6805, "platform": "B站", "url": "https://www.bilibili.com/video/BV1aTWm6jEL8"},
    {"name": "Tim本平台个人账号有且仅有@Tim潘子，仿冒的账号很多，请各位注意甄别！", "value": 6320, "platform": "B站", "url": "https://www.bilibili.com/video/BV1kZWX62ENY"},
    {"name": "我迷路了，请问狼堡怎么走？", "value": 6067, "platform": "B站", "url": "https://www.bilibili.com/video/BV1aNWm6UEeC"},
    {"name": "所有gpu 温度降半度[拥抱]", "value": 5931, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FuWZ6dEjb"},
    {"name": "服了，刷了几百个这种mj宇宙的视频，搞不懂这种视频的受众是谁", "value": 4780, "platform": "B站", "url": "https://www.bilibili.com/video/BV1VmWL6fE7z"},
    {"name": "算力中心能建在居民区也是牛逼哄哄的", "value": 4627, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WEWs66EBP"},
    {"name": "以身入局，胜天半子", "value": 4300, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WEWs66EBP"},
    {"name": "rxt50系显卡将成为绝唱，股东只看价值", "value": 4128, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FuWZ6dEjb"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "无限进步", "value": 948},
    {"name": "出必还愿", "value": 760},
    {"name": "可爱捏", "value": 632},
    {"name": "还真是", "value": 518},
    {"name": "意气风发啊，岩主天星大人", "value": 499},
    {"name": "阿哈时刻！", "value": 475},
    {"name": "文明", "value": 306},
    {"name": "kksk", "value": 296},
    {"name": "她真好看", "value": 148},
    {"name": "见证历史", "value": 138},
    {"name": "吓哭了", "value": 111},
    {"name": "接接接", "value": 91}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "meta/astryx", "value": 1830, "lang": "TypeScript", "total": "26,560"},
    {"name": "we-promise/sure", "value": 967, "lang": "Ruby", "total": "13,931"},
    {"name": "addyosmani/agent-skills", "value": 816, "lang": "JavaScript", "total": "116,682"},
    {"name": "GoogleChrome/modern-web-guidance-src", "value": 739, "lang": "TypeScript", "total": "2,996"},
    {"name": "openai/codex-security", "value": 643, "lang": "TypeScript", "total": "12,437"},
    {"name": "Alishahryar1/free-claude-code", "value": 415, "lang": "Python", "total": "69,307"},
    {"name": "CopilotKit/OpenBot", "value": 298, "lang": "TypeScript", "total": "11,628"},
    {"name": "pookjw/HermesEnabler", "value": 218, "lang": "Objective-C", "total": "1,541"},
    {"name": "ggml-org/llama.cpp", "value": 176, "lang": "C++", "total": "134,567"},
    {"name": "QwenLM/qwen-code", "value": 151, "lang": "TypeScript", "total": "29,822"}
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
