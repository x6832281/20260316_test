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
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "老鼠自己跑了又自己回来的时候我真的笑岔气了。哈哈哈哈哈哈哈哈哈哈哈[笑哭] 老鼠…", "value": 5546, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ZFeB6xEs9"},
    {"name": "不是？去世了？我之前看他拍的视频身子骨不是挺好的吗？这么突然啊[酸了][酸了]", "value": 3827, "platform": "B站", "url": "https://www.bilibili.com/video/BV17Eaw6DEMi"},
    {"name": "谁点的男模围棋？[doge]", "value": 3579, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YDhJ6ZEL6"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "这游戏主角的真实身份是从良的连环杀手，还是疑似信恐虐的，每个月杀8个，为了给自己…", "value": 2960, "platform": "B站", "url": "https://www.bilibili.com/video/BV18fhb65EGs"},
    {"name": "以前听说你在卖围棋课，现在看来你确实在卖了。", "value": 2449, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YDhJ6ZEL6"},
    {"name": "午夜轮班 这款曾经爆火的游戏 玩起来 太刺激了简直不要太爽 硬生生玩成搞笑游戏[…", "value": 2436, "platform": "B站", "url": "https://www.bilibili.com/video/BV18fhb65EGs"},
    {"name": "地铁终于开了，希望可以作为我们店的救命稻草，实现扭亏为盈，不过目前这个经济形势，…", "value": 2300, "platform": "B站", "url": "https://www.bilibili.com/video/BV11WaA6KEBb"}
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
    {"name": "牛来", "value": 562},
    {"name": "这很COLMO！", "value": 518},
    {"name": "一路走好", "value": 343},
    {"name": "哔哩哔哩 (゜-゜)つロ 干杯~-bilibil", "value": 99},
    {"name": "谢谢款待", "value": 57},
    {"name": "中秋快乐", "value": 55},
    {"name": "绵羊绵羊，是不是你的番茄品种买错了咯？", "value": 53},
    {"name": "bilibili- ( ゜- ゜)つロ 乾杯~", "value": 49},
    {"name": "啊？", "value": 49},
    {"name": "那能一样吗", "value": 49},
    {"name": "还真是", "value": 43},
    {"name": "笑死我了", "value": 40}
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
    {"name": "vectorize-io/hindsight", "value": 1668, "lang": "Python", "total": "27,796"},
    {"name": "google/ax", "value": 1373, "lang": "Go", "total": "10,472"},
    {"name": "dream-num/univer", "value": 1082, "lang": "TypeScript", "total": "17,698"},
    {"name": "obra/superpowers", "value": 611, "lang": "Shell", "total": "291,234"},
    {"name": "anthropics/financial-services", "value": 509, "lang": "Python", "total": "37,358"},
    {"name": "superdesigndev/treg", "value": 468, "lang": "Python", "total": "3,167"},
    {"name": "strands-agents/harness-sdk", "value": 455, "lang": "Python", "total": "8,261"},
    {"name": "HKUDS/CLI-Anything", "value": 413, "lang": "Python", "total": "50,337"},
    {"name": "rohitg00/ai-engineering-from-scratch", "value": 347, "lang": "Python", "total": "56,573"},
    {"name": "mvt-project/mvt", "value": 272, "lang": "Python", "total": "14,732"}
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
