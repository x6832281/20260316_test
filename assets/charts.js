(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "[Cat2_Watching!]", "value": 27216, "platform": "B站", "url": "https://www.bilibili.com/video/BV1S3nQ6EEoW"},
    {"name": "刚从888换了8ee6，还能说啥呢", "value": 7750, "platform": "B站", "url": "https://www.bilibili.com/video/BV1kMxM6FECM"},
    {"name": "我喜欢躺着看", "value": 6378, "platform": "B站", "url": "https://www.bilibili.com/video/BV12qnt6VEM1"},
    {"name": "卡黄就是很典型的喜恶同因，喜欢发卡的活泼开朗，就一定会被她的鲁莽冲动创到，同样卡…", "value": 6170, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HZnR6yEGj"},
    {"name": "我很想知道，第一次坐飞机需要注意什么？[脸红]", "value": 5619, "platform": "B站", "url": "https://www.bilibili.com/video/BV12qnt6VEM1"},
    {"name": "为众人抱薪者，不可使其冻毙于风雪。 为愚昧启蒙者，不可使其困惑于无知。 为自由开…", "value": 5473, "platform": "B站", "url": "https://www.bilibili.com/video/BV1mdxN68E7F"},
    {"name": "《当意大利黑手党发现在网上擦边比贩毒更健康》[脱单doge][脱单doge][脱…", "value": 4966, "platform": "B站", "url": "https://www.bilibili.com/video/BV1GDHN6FE6X"},
    {"name": "本尼还能打开卡子的主页吗，这编年史堪比卡黄应援会了", "value": 4963, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HZnR6yEGj"},
    {"name": "[笑哭]这么看原版是真强，哪怕经常跳舞的猛男舞团也做不到还原。", "value": 4852, "platform": "B站", "url": "https://www.bilibili.com/video/BV194n86ZEAD"},
    {"name": "她们已经不断变成对方最理想的模样，李艺彤学会了分寸与边界，黄婷婷学会了表达自己的…", "value": 4700, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HZnR6yEGj"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "花融99", "value": 1386},
    {"name": "致敬", "value": 1016},
    {"name": "好兄弟一辈子", "value": 994},
    {"name": "吓哭了", "value": 990},
    {"name": "大胆", "value": 486},
    {"name": "桃绒99", "value": 352},
    {"name": "纳尼", "value": 299},
    {"name": "啊？", "value": 254},
    {"name": "干就完了", "value": 187},
    {"name": "相信", "value": 154},
    {"name": "懂你意思", "value": 138},
    {"name": "正规媒体", "value": 123}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "Nutlope/hallmark", "value": 2830, "lang": "CSS", "total": "39,028"},
    {"name": "HKUDS/DeepTutor", "value": 1598, "lang": "Python", "total": "45,924"},
    {"name": "makecindy/cindy", "value": 1465, "lang": "TypeScript", "total": "7,484"},
    {"name": "pbakaus/impeccable", "value": 1449, "lang": "Rust", "total": "90,550"},
    {"name": "elayadesign/ai-design-skills", "value": 1395, "lang": "—", "total": "9,375"},
    {"name": "JetBrains/thinkrail", "value": 1204, "lang": "TypeScript", "total": "4,021"},
    {"name": "affaan-m/ECC", "value": 1165, "lang": "JavaScript", "total": "290,904"},
    {"name": "gitroomhq/postiz-app", "value": 951, "lang": "TypeScript", "total": "39,393"},
    {"name": "togg53192-cmd/jailbreaks", "value": 902, "lang": "—", "total": "5,561"},
    {"name": "nightly-labs/openbot", "value": 777, "lang": "TypeScript", "total": "2,453"}
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
