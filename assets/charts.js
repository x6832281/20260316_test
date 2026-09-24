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
    {"name": "正义属于正义的一方，文明属于文明的一方，胜利属于胜利的一方[奋斗]", "value": 15399, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SZh76LEPA"},
    {"name": "真珠因为画了这么一张图，被星神啊哈瞥视，踏上了欢愉的命途[思考][思考]", "value": 12849, "platform": "B站", "url": "https://www.bilibili.com/video/BV1yvhW6sEzi"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "她妈妈长这样[阴阳师缘结神_我不活啦]", "value": 9749, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Thi6AE3S"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "经典回合制", "value": 6372, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SZh76LEPA"},
    {"name": "依旧善意引导", "value": 6172, "platform": "B站", "url": "https://www.bilibili.com/video/BV1kUht6wEKw"},
    {"name": "小时候以为大雁往南飞是飞往中国的南方", "value": 6136, "platform": "B站", "url": "https://www.bilibili.com/video/BV1bQhs6YE9d"},
    {"name": "考古回来了，今年没看到她呢？她还红吗？", "value": 6012, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Thi6AE3S"},
    {"name": "发现阿哈画的不是二创而是自传的真珠：", "value": 5369, "platform": "B站", "url": "https://www.bilibili.com/video/BV1yvhW6sEzi"}
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
    {"name": "秒吃", "value": 793},
    {"name": "懂你意思", "value": 376},
    {"name": "惊了", "value": 135},
    {"name": "无人机", "value": 102},
    {"name": "文明", "value": 87},
    {"name": "哔哩哔哩 (゜-゜)つロ 干杯~-bilibil", "value": 61},
    {"name": "这是好事啊", "value": 48},
    {"name": "bilibili- ( ゜- ゜)つロ 乾杯~", "value": 47},
    {"name": "恭喜", "value": 46},
    {"name": "正义必胜", "value": 43},
    {"name": "大大方方", "value": 35},
    {"name": "那能一样吗", "value": 32}
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
    {"name": "google/ax", "value": 1543, "lang": "Go", "total": "9,088"},
    {"name": "dream-num/univer", "value": 1142, "lang": "TypeScript", "total": "16,338"},
    {"name": "browser-use/video-use", "value": 746, "lang": "Python", "total": "26,499"},
    {"name": "anthropics/financial-services", "value": 664, "lang": "Python", "total": "36,948"},
    {"name": "agent-substrate/substrate", "value": 558, "lang": "Go", "total": "3,503"},
    {"name": "mvt-project/mvt", "value": 543, "lang": "Python", "total": "14,484"},
    {"name": "superdesigndev/treg", "value": 506, "lang": "Python", "total": "2,719"},
    {"name": "obra/superpowers", "value": 474, "lang": "Shell", "total": "290,688"},
    {"name": "davila7/claude-code-templates", "value": 389, "lang": "Python", "total": "31,503"},
    {"name": "Open-Dev-Society/OpenStock", "value": 344, "lang": "TypeScript", "total": "18,834"}
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
