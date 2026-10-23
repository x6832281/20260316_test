(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "iPhone paper", "value": 24000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "👋💿🤓✋🎤哇奥！♿️在这个特别的日子里～👋送给你们一首非常特别🤟的歌曲👄特别↑的…", "value": 18559, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Wone6REPF"},
    {"name": "一路走来实属不易，是给所有玩家的主线钩子，老玩家也可以一瞥不少熟悉元素的新形态，…", "value": 11903, "platform": "B站", "url": "https://www.bilibili.com/video/BV1AHnB6NEhM"},
    {"name": "人迟早从兜里掏出一台电视机", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "iPhone Door", "value": 9802, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa4e98e000000000d0202b5?xsec_token=ABTjSL3REDb9gLErdcaNhNlQQ_Q5rog6QJBX6xkfMpojk=&xsec_source=pc_search"},
    {"name": "东大的情报组织最厉害的一点就是：你都不知道它是啥，叫什么，在哪里。 国安、总参、…", "value": 8952, "platform": "B站", "url": "https://www.bilibili.com/video/BV1iMnv6jEZw"},
    {"name": "日本人想象不出来具体中国人的工作环境，全凭刻板印象。说明国内保密措施做的还是很好…", "value": 8651, "platform": "B站", "url": "https://www.bilibili.com/video/BV1iMnv6jEZw"},
    {"name": "原来一边直角一边圆角就是Duo的D啊！", "value": 7608, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6aa313dc000000002b003caa?xsec_token=ABhkdwyqAEzNZFGz82SqksE1UMR3Eqww5nXJYcwrD2taE=&xsec_source=pc_search"},
    {"name": "此乃何物啊", "value": 7332, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Agnr6gEPk"},
    {"name": "叶师傅与沟槽的日军交手时遭偷袭枪击负伤，急需前往香港就医，还差 328 元费用，…", "value": 4564, "platform": "B站", "url": "https://www.bilibili.com/video/BV1AHnB6NEhM"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "冒泡", "value": 2122},
    {"name": "合影", "value": 562},
    {"name": "吓哭了", "value": 453},
    {"name": "藏狐", "value": 440},
    {"name": "无限进步", "value": 355},
    {"name": "抽我", "value": 262},
    {"name": "懂你意思", "value": 179},
    {"name": "新婚快乐", "value": 121},
    {"name": "哔哩哔哩 (゜ - ゜)つロ 乾杯~", "value": 108},
    {"name": "恭喜", "value": 103},
    {"name": "谢谢", "value": 97},
    {"name": "千言万语，感谢现役", "value": 69}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "cloudflare/security-audit-skill", "value": 2979, "lang": "JavaScript", "total": "39,616"},
    {"name": "DietrichGebert/ponytail", "value": 1948, "lang": "JavaScript", "total": "173,524"},
    {"name": "Graphify-Labs/graphify", "value": 1408, "lang": "Python", "total": "132,982"},
    {"name": "supabase/supabase", "value": 693, "lang": "TypeScript", "total": "113,495"},
    {"name": "anthropics/knowledge-work-plugins", "value": 303, "lang": "Python", "total": "31,626"},
    {"name": "php/php-src", "value": 287, "lang": "C", "total": "41,169"},
    {"name": "luongnv89/claude-howto", "value": 177, "lang": "Python", "total": "43,242"},
    {"name": "fastapi/fastapi", "value": 101, "lang": "Python", "total": "103,763"}
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
