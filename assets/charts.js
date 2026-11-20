(function () {
  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "背景是喜上眉梢图吗", "value": 10078, "platform": "B站", "url": "https://www.bilibili.com/video/BV1rnsb6UEZp"},
    {"name": "须知少年凌云志，曾许人间第一流", "value": 8534, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YWsr6NEs7"},
    {"name": "小雨桑怎么有大会员了 发生什么事了[脸红]", "value": 7035, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EYsJ6UEj8"},
    {"name": "我说句可能会有人喷的话。 没有kk，cn瓦的流量至少要少一半吧。所以拜托你多打几…", "value": 5875, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YWsr6NEs7"},
    {"name": "谁能想到，美国开始买俄油了", "value": 5337, "platform": "B站", "url": "https://www.bilibili.com/video/BV1rnsb6UEZp"},
    {"name": "康神 来BLG吧。BLG下赛季刚好缺一个射手", "value": 4979, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YWsr6NEs7"},
    {"name": "其他人把工资转给伊能静", "value": 4808, "platform": "B站", "url": "https://www.bilibili.com/video/BV1W5sb6XEov"},
    {"name": "终于有人看到许飞的需求和委屈了，不知道为啥观察室前几期都在说许飞不真诚", "value": 3978, "platform": "B站", "url": "https://www.bilibili.com/video/BV1W5sb6XEov"},
    {"name": "终于刷到正常的舞蹈了，无擦边，无美颜，你这家伙100分啊", "value": 3736, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EYsJ6UEj8"},
    {"name": "主力机难道不是用来生活的吗？[汗颜R]我备用机里才有办公app", "value": 3703, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/68bc4d3b000000001d002244?xsec_token=ABn_i7G-eMUa4DSWmT7-_MramzptTL5I1a4U1jJqV9tlI=&xsec_source=pc_search"}
  ].reverse();

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "一切顺利", "value": 963},
    {"name": "我们是冠军", "value": 849},
    {"name": "合影", "value": 819},
    {"name": "见证历史", "value": 810},
    {"name": "忍耐已经结束！", "value": 685},
    {"name": "变得更强", "value": 492},
    {"name": "我们是冠军！", "value": 400},
    {"name": "哔哩哔哩 (゜-゜)つロ 干杯~-bilibil…", "value": 380},
    {"name": "还真是", "value": 325},
    {"name": "with→ you↓,I'm↑ ready↓to…", "value": 250},
    {"name": "秒吃", "value": 149},
    {"name": "哔哩哔哩(゜-゜)つロ干杯~-bilibili", "value": 107}
  ].reverse();

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "obra/superpowers", "value": 2028, "lang": "Shell", "total": "322,096"},
    {"name": "elementalsouls/Claude-BugHunter", "value": 1349, "lang": "Python", "total": "12,562"},
    {"name": "mvanhorn/last30days-skill", "value": 954, "lang": "Python", "total": "70,810"},
    {"name": "HKUDS/CLI-Anything", "value": 898, "lang": "Python", "total": "60,577"},
    {"name": "firecrawl/firecrawl", "value": 825, "lang": "TypeScript", "total": "204,249"},
    {"name": "cursor/plugins", "value": 384, "lang": "TypeScript", "total": "17,567"},
    {"name": "mjmirza/app-store-compliance", "value": 377, "lang": "Shell", "total": "1,860"},
    {"name": "XiaoYouChR/Ghost-Downloader-3", "value": 341, "lang": "Python", "total": "12,745"},
    {"name": "google-labs-code/stitch-skills", "value": 302, "lang": "TypeScript", "total": "10,722"},
    {"name": "cathrynlavery/diagram-design", "value": 271, "lang": "HTML", "total": "68,643"}
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
