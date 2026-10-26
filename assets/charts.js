(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "去年，在影视飓风团队的支持下，深海呼吸乐队的热爱被更多人看见，Tim捐赠的资金也…", "value": 16425, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Enb6LEDe"},
    {"name": "看完先导演示后的绳匠：", "value": 14599, "platform": "B站", "url": "https://www.bilibili.com/video/BV1U3n46GEzY"},
    {"name": "为什么没有海水过滤器和尿液过滤器？", "value": 9257, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UnHN6SECP"},
    {"name": "纳垢为啥讨厌恐虐 belike： 纳垢：“给自己弄个小花园” 恐虐：“点了”", "value": 8141, "platform": "B站", "url": "https://www.bilibili.com/video/BV111na6WExX"},
    {"name": "国内没普及是因为国内校车少见，我从小大就只见过一次校车", "value": 7674, "platform": "B站", "url": "https://www.bilibili.com/video/BV14cHP6yEYj"},
    {"name": "报告，今天上午把三只土鸡，一个柜子，还有一个不常见生物怼到不敢回话，下午再接再厉…", "value": 7283, "platform": "B站", "url": "https://www.bilibili.com/video/BV1tcHK6pEZo"},
    {"name": "悬着的心终于似了 派蒙和光之镜的四国CV都是一致的", "value": 7091, "platform": "B站", "url": "https://www.bilibili.com/video/BV1z9nt6aE5H"},
    {"name": "振宇的省钱小技巧", "value": 6479, "platform": "B站", "url": "https://www.bilibili.com/video/BV1U3n46GEzY"},
    {"name": "应该再说说，那个土耳其女士庆祝母亲战胜癌症的帖子有很多中国人祝福的事，我觉得这个…", "value": 6334, "platform": "B站", "url": "https://www.bilibili.com/video/BV1tcHK6pEZo"},
    {"name": "竟然一打开b站就刷到了挽昼 振宇的小妙招呢！[Neuro sama收藏集_比心]", "value": 6309, "platform": "B站", "url": "https://www.bilibili.com/video/BV1U3n46GEzY"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "请复制这条弹幕重新发送，帮助up主增加推流！请复…", "value": 1193},
    {"name": "吓哭了", "value": 1152},
    {"name": "恭喜", "value": 792},
    {"name": "无限进步", "value": 492},
    {"name": "kksk", "value": 296},
    {"name": "啊？", "value": 206},
    {"name": "买个der", "value": 160},
    {"name": "文明", "value": 122},
    {"name": "古人", "value": 114},
    {"name": "懂你意思", "value": 92},
    {"name": "好客山东欢迎您", "value": 84},
    {"name": "这么近，那么美，周末到河北", "value": 77}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "cloudflare/security-audit-skill", "value": 2878, "lang": "JavaScript", "total": "46,933"},
    {"name": "debpalash/VoiceStudio", "value": 1592, "lang": "Python", "total": "86,857"},
    {"name": "Nutlope/hallmark", "value": 1317, "lang": "CSS", "total": "33,809"},
    {"name": "pbakaus/impeccable", "value": 1092, "lang": "Rust", "total": "87,719"},
    {"name": "makecindy/cindy", "value": 675, "lang": "TypeScript", "total": "4,886"},
    {"name": "pollen-robotics/microduck", "value": 647, "lang": "Rust", "total": "11,655"},
    {"name": "TauricResearch/TradingAgents", "value": 381, "lang": "Python", "total": "114,629"},
    {"name": "Renhuai123/ziwei-doushu", "value": 199, "lang": "TypeScript", "total": "7,575"},
    {"name": "AgriciDaniel/claude-seo", "value": 197, "lang": "Python", "total": "20,892"},
    {"name": "coollabsio/coolify", "value": 152, "lang": "PHP", "total": "64,398"}
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

    // Chart 1
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
            return '<span style="font-weight:600;color:' + (p.data.platform === '小红书' ? xhs : bili) + '">' +
                   p.data.platform + '</span> · <span style="font-weight:700">' + p.data.likes + ' 赞</span><br>' +
                   '<span style="font-size:12px;opacity:0.85;margin-top:4px;display:inline-block;max-width:320px;white-space:normal">' +
                   (p.data.full || p.name) + '</span>';
          }
        }),
        grid: { left: 8, right: 84, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } }
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
            return {
              value: d.value,
              platform: d.platform,
              full: d.name,
              likes: d.value.toLocaleString(),
              url: d.url || '',
              itemStyle: {
                color: d.platform === '小红书' ? xhs : bili,
                borderRadius: [0, 4, 4, 0]
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return p.data.likes + ' 赞'; }
          }),
          barMaxWidth: 20
        }]
      });
    }

    // Chart 2
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
            return '<span style="font-weight:600;color:' + bili + '">热门弹幕</span><br>' +
                   p.name + ' · <b>' + p.value.toLocaleString() + ' 次</b>';
          }
        }),
        grid: { left: 8, right: 68, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } }
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
                color: d.value > 300 ? bili : bili + '99',
                borderRadius: [0, 4, 4, 0]
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return p.value.toLocaleString() + ' 次'; }
          }),
          barMaxWidth: 20
        }]
      });
    }

    // Chart 3
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
            return '<span style="font-weight:600;color:' + gh + '">' + p.data.repo + '</span><br>' +
                   '今日新增 <b>+' + p.value.toLocaleString() + ' Star</b> · ' + p.data.lang +
                   (p.data.total ? '<br><span style="opacity:0.8;font-size:12px">全网总星数 ' + p.data.total + '</span>' : '');
          }
        }),
        grid: { left: 8, right: 78, top: 12, bottom: 12, containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { color: muted, fontFamily: "'JetBrainsMono', monospace", fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } }
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
                color: d.value > 1000 ? gh : gh + '99',
                borderRadius: [0, 4, 4, 0]
              }
            };
          }),
          label: Object.assign({}, labelBase, {
            formatter: function (p) { return '+' + p.value.toLocaleString() + ' ★'; }
          }),
          barMaxWidth: 20
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
