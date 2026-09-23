(function () {
  var style = getComputedStyle(document.documentElement);
  var xhs = style.getPropertyValue('--xhs').trim();
  var bili = style.getPropertyValue('--bili').trim();
  var gh = style.getPropertyValue('--gh').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var paper = style.getPropertyValue('--paper').trim();

  var tooltipBase = {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    appendToBody: true,
    backgroundColor: paper,
    borderColor: rule,
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: ink, fontSize: 12.5 },
    extraCssText: 'box-shadow: 0 4px 14px rgba(28,25,23,0.10); border-radius: 4px;'
  };
  var labelBase = {
    show: true, position: 'right',
    color: muted, fontSize: 12,
    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif"
  };

  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "此时就有明天10连三金沃雅妮莎的旅行者疑惑了", "value": 8690, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BqhB6nEdN"},
    {"name": "她妈妈长这样[阴阳师缘结神_我不活啦]", "value": 8582, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Thi6AE3S"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "你们不许看，我是一集一集追的😭", "value": 6244, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BreB6tEWT"},
    {"name": "妹妹其实并没有像家长嘴里说的脾气大难相处喜欢吵架，她朝尿贴过去的时候就像一只害羞…", "value": 4179, "platform": "B站", "url": "https://www.bilibili.com/video/BV1T7hB6PEBm"},
    {"name": "我说制作组审美高的惊人，这个字体真的太漂亮了", "value": 3993, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BqhB6nEdN"},
    {"name": "以后会刷到越来越多的，初代宠物博主的猫基本都到年纪了，唉", "value": 3379, "platform": "B站", "url": "https://www.bilibili.com/video/BV15bez6xEEB"},
    {"name": "这下知道为什么海报上画的是沃雅妮莎了", "value": 3221, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BqhB6nEdN"},
    {"name": "千万别跟这种级别的大佬开玩笑[笑哭]，之前在长春的时候见过一个在保镖队干过的，打…", "value": 3035, "platform": "B站", "url": "https://www.bilibili.com/video/BV1J7hE6aEDQ"}
  ].reverse();

  var chart1 = echarts.init(document.getElementById('chart-top-comments'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: Object.assign({}, tooltipBase, {
      formatter: function (params) {
        var p = params[0];
        return p.data.platform + ' · ' + p.data.likes + ' 赞<br>' + p.data.full;
      }
    }),
    grid: { left: 8, right: 64, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule } } },
    yAxis: {
      type: 'category',
      data: topComments.map(function (d) { return d.name; }),
      axisLabel: {
        color: ink, fontSize: 12,
        width: 220, overflow: 'truncate',
        formatter: function (v) { return v.length > 16 ? v.slice(0, 16) + '…' : v; }
      },
      axisLine: { lineStyle: { color: rule } }
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
          itemStyle: { color: d.platform === '小红书' ? xhs : bili, borderRadius: [0, 3, 3, 0] }
        };
      }),
      label: Object.assign({}, labelBase, { formatter: function (p) { return p.data.likes + ' 赞'; } }),
      barMaxWidth: 20
    }]
  });
  chart1.on('click', function (params) {
    if (params.data && params.data.url) {
      window.open(params.data.url, '_blank', 'noopener');
    }
  });
  window.addEventListener('resize', function () { chart1.resize(); });

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    {"name": "为了纳塔！", "value": 1181},
    {"name": "kksk", "value": 858},
    {"name": "晚安", "value": 846},
    {"name": "沃来了", "value": 488},
    {"name": "晚安泰哥", "value": 277},
    {"name": "沃真好看", "value": 252},
    {"name": "沃不歪！", "value": 176},
    {"name": "无人机", "value": 115},
    {"name": "文明", "value": 109},
    {"name": "人民万岁", "value": 96},
    {"name": "吓哭了", "value": 78},
    {"name": "月轮启幕，星谱为听，指藏遗音，幻中见真，娅门永存…", "value": 72}
  ].reverse();

  var chart2 = echarts.init(document.getElementById('chart-danmaku'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: Object.assign({}, tooltipBase, {
      formatter: function (params) {
        var p = params[0];
        return p.name + '<br>' + p.value + ' 次';
      }
    }),
    grid: { left: 8, right: 64, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule } } },
    yAxis: {
      type: 'category',
      data: danmaku.map(function (d) { return d.name; }),
      axisLabel: { color: ink, fontSize: 13 },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'bar',
      data: danmaku.map(function (d) {
        return {
          value: d.value,
          itemStyle: {
            color: d.value > 300 ? bili : bili + '88',
            borderRadius: [0, 3, 3, 0]
          }
        };
      }),
      label: Object.assign({}, labelBase, { formatter: function (p) { return p.value.toLocaleString() + ' 次'; } }),
      barMaxWidth: 20
    }]
  });
  window.addEventListener('resize', function () { chart2.resize(); });

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    {"name": "google/ax", "value": 2305, "lang": "Go", "total": "7,629"},
    {"name": "mvt-project/mvt", "value": 441, "lang": "Python", "total": "14,119"},
    {"name": "anthropics/financial-services", "value": 438, "lang": "Python", "total": "36,348"},
    {"name": "dream-num/univer", "value": 255, "lang": "TypeScript", "total": "15,423"},
    {"name": "agent-substrate/substrate", "value": 245, "lang": "Go", "total": "2,983"},
    {"name": "superdesigndev/treg", "value": 230, "lang": "Python", "total": "2,231"},
    {"name": "browser-use/video-use", "value": 191, "lang": "Python", "total": "25,852"},
    {"name": "davila7/claude-code-templates", "value": 64, "lang": "Python", "total": "31,135"}
  ].reverse();

  var chart3 = echarts.init(document.getElementById('chart-github'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: Object.assign({}, tooltipBase, {
      formatter: function (params) {
        var p = params[0];
        return p.data.repo + '<br>今日 +' + p.value.toLocaleString() + ' 星 · ' + p.data.lang +
          (p.data.total ? '<br>总星 ' + p.data.total : '');
      }
    }),
    grid: { left: 8, right: 64, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule } } },
    yAxis: {
      type: 'category',
      data: ghTrending.map(function (d) { return d.name; }),
      axisLabel: { color: ink, fontSize: 13 },
      axisLine: { lineStyle: { color: rule } }
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
            color: d.value > 1000 ? gh : gh + '88',
            borderRadius: [0, 3, 3, 0]
          }
        };
      }),
      label: Object.assign({}, labelBase, { formatter: function (p) { return '+' + p.value.toLocaleString() + ' 星'; } }),
      barMaxWidth: 20
    }]
  });
  window.addEventListener('resize', function () { chart3.resize(); });
})();
