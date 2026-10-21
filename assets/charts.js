(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "iPhone paper", "value": 24000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "怀谷老师太强了，每个视频都是这种意想不到却又令人产生无限好奇的高质量视频[支持]", "value": 18209, "platform": "B站", "url": "https://www.bilibili.com/video/BV1pGnn67EbB"},
    {"name": "拍照就给我拍好了呀[辣眼睛]", "value": 11071, "platform": "B站", "url": "https://www.bilibili.com/video/BV1v3nc6jEiV"},
    {"name": "人迟早从兜里掏出一台电视机", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "[哦呼][哦呼][哦呼]这个选题是不是之前Q&amp;A出现过 现在返点有得看了…", "value": 10968, "platform": "B站", "url": "https://www.bilibili.com/video/BV1pGnn67EbB"},
    {"name": "想看一期有关黑客的，感觉很神秘也很危险，以及很好奇在ai时代下拥有致命网络打击能…", "value": 9973, "platform": "B站", "url": "https://www.bilibili.com/video/BV1pGnn67EbB"},
    {"name": "iPhone Door", "value": 9802, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "原来一边直角一边圆角就是Duo的D啊！", "value": 7608, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa313dc000000002b003caa?xsec_token=ABhkdwyqAEzNZFGz82SqksE1UMR3Eqww5nXJYcwrD2taE=&xsec_source=pc_search"},
    {"name": "最想看到“社会各界人士”“热情招待”“深切慰问”“进一步缓解各方压力”的一集[妙…", "value": 4405, "platform": "B站", "url": "https://www.bilibili.com/video/BV1APJd62Esz"},
    {"name": "主力机难道不是用来生活的吗？[汗颜R]我备用机里才有办公app", "value": 3669, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/68bc4d3b000000001d002244?xsec_token=ABn_i7G-eMUa4DSWmT7-_MrUthLxtsO9gJoiEekw1RbQY=&xsec_source=pc_search"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "无限进步", "value": 1034},
    {"name": "莱拉！", "value": 877},
    {"name": "再来亿遍", "value": 876},
    {"name": "大彻大悟", "value": 426},
    {"name": "莱拉", "value": 114},
    {"name": "已然陷入NMIXX的爱河", "value": 111},
    {"name": "生日快乐", "value": 107},
    {"name": "还真是", "value": 101},
    {"name": "ig加油", "value": 99},
    {"name": "kksk", "value": 97},
    {"name": "NMIXX永远是恩瑟的缪斯", "value": 88},
    {"name": "可爱捏", "value": 84}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "MadsLorentzen/ai-job-search", "value": 3861, "lang": "Python", "total": "60,656"},
    {"name": "cloudflare/security-audit-skill", "value": 1712, "lang": "JavaScript", "total": "34,277"},
    {"name": "stablyai/orca", "value": 1565, "lang": "TypeScript", "total": "99,773"},
    {"name": "anomalyco/opencode", "value": 1240, "lang": "TypeScript", "total": "218,951"},
    {"name": "DietrichGebert/ponytail", "value": 1208, "lang": "JavaScript", "total": "169,711"},
    {"name": "Comfy-Org/ComfyUI", "value": 1206, "lang": "Python", "total": "140,794"},
    {"name": "Graphify-Labs/graphify", "value": 802, "lang": "Python", "total": "130,275"},
    {"name": "shiyu-coder/Kronos", "value": 733, "lang": "Python", "total": "42,363"},
    {"name": "ruvnet/ruflo", "value": 684, "lang": "TypeScript", "total": "77,861"},
    {"name": "msitarzewski/agency-agents", "value": 562, "lang": "Shell", "total": "162,372"}
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
