(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "iPhone paper", "value": 24000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "人迟早从兜里掏出一台电视机", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "iPhone Door", "value": 9802, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "原来一边直角一边圆角就是Duo的D啊！", "value": 7608, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa313dc000000002b003caa?xsec_token=ABhkdwyqAEzNZFGz82SqksE1UMR3Eqww5nXJYcwrD2taE=&xsec_source=pc_search"},
    {"name": "我喜欢躺着看", "value": 5835, "platform": "B站", "url": "https://www.bilibili.com/video/BV12qnt6VEM1"},
    {"name": "本部给了9，gs给了8，开分91，这影境有力气[doge][doge]", "value": 5563, "platform": "B站", "url": "https://www.bilibili.com/video/BV19bHK6AEBD"},
    {"name": "我很想知道，第一次坐飞机需要注意什么？[脸红]", "value": 4550, "platform": "B站", "url": "https://www.bilibili.com/video/BV12qnt6VEM1"},
    {"name": "为什么他露点就没事🙂其他人露点就超管警告？", "value": 4234, "platform": "B站", "url": "https://www.bilibili.com/video/BV194n86ZEAD"},
    {"name": "[笑哭]这么看原版是真强，哪怕经常跳舞的猛男舞团也做不到还原。", "value": 4143, "platform": "B站", "url": "https://www.bilibili.com/video/BV194n86ZEAD"},
    {"name": "刚想说社长喝清酒的面相不对，这样就对了[doge_金箍]", "value": 3762, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EzH56bE5k"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "请复制这条弹幕重新发送，帮助up主增加推流！请复…", "value": 1171},
    {"name": "吓哭了", "value": 738},
    {"name": "爆了", "value": 238},
    {"name": "合影", "value": 209},
    {"name": "买个der", "value": 201},
    {"name": "文明", "value": 88},
    {"name": "橹穆99", "value": 80},
    {"name": "（擦眼泪）（说了一堆赞美的话）", "value": 63},
    {"name": "懂你意思", "value": 62},
    {"name": "先生大义", "value": 57},
    {"name": "无限进步", "value": 52},
    {"name": "我知道你为何而来", "value": 48}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "debpalash/VoiceStudio", "value": 2297, "lang": "Python", "total": "89,305"},
    {"name": "Nutlope/hallmark", "value": 2244, "lang": "CSS", "total": "36,401"},
    {"name": "pbakaus/impeccable", "value": 1506, "lang": "Rust", "total": "89,240"},
    {"name": "TauricResearch/TradingAgents", "value": 1395, "lang": "Python", "total": "116,135"},
    {"name": "makecindy/cindy", "value": 1296, "lang": "TypeScript", "total": "6,509"},
    {"name": "JetBrains/thinkrail", "value": 1173, "lang": "TypeScript", "total": "2,935"},
    {"name": "affaan-m/ECC", "value": 896, "lang": "JavaScript", "total": "289,869"},
    {"name": "pollen-robotics/microduck", "value": 843, "lang": "Rust", "total": "12,430"},
    {"name": "Panniantong/Agent-Reach", "value": 746, "lang": "Python", "total": "103,629"},
    {"name": "multica-ai/andrej-karpathy-skills", "value": 638, "lang": "—", "total": "224,666"}
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
