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
    {"name": "你鼠大哥被人类做了这么多年实验KD 都没拉平", "value": 13934, "platform": "B站", "url": "https://www.bilibili.com/video/BV1gFp26uEPD"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "我去这一下看起来很轻松，实际上也不简单😭", "value": 6509, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ocJm61ERF"},
    {"name": "哥们，这是你吧", "value": 5128, "platform": "B站", "url": "https://www.bilibili.com/video/BV1KiJk67EQ9"},
    {"name": "感谢大up发声。 没人觉得粉圈很可怕吗？把普通人艰辛的维权，说成黑红营销，给我家…", "value": 3969, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "适用场景：", "value": 3508, "platform": "B站", "url": "https://www.bilibili.com/video/BV12eJQ6zEN1"},
    {"name": "支持大up发声。。。需要越来越多的大up发声", "value": 3401, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "热知识:当时的春晚晚会只有阎王爷没有来，而后面阎王爷扮演者刘江爷爷老师被采访时说…", "value": 3347, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Fspj66E66"},
    {"name": "这个是真绝", "value": 3064, "platform": "B站", "url": "https://www.bilibili.com/video/BV1wbpR6HE1g"}
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
    {"name": "生日快乐", "value": 471},
    {"name": "\\Mizi/\\Mizi/\\Mizi/\\Mizi/…", "value": 121},
    {"name": "支持", "value": 110},
    {"name": "文明", "value": 90},
    {"name": "遥遥领先", "value": 87},
    {"name": "吓哭了", "value": 86},
    {"name": "守护", "value": 52},
    {"name": "生日快乐！", "value": 49},
    {"name": "懂你意思", "value": 42},
    {"name": "\\Mizi/\\Mizi/\\Mizi/\\Mizi/…", "value": 39},
    {"name": "Ciallo～(∠・ω< )⌒☆", "value": 32},
    {"name": "刘浩存", "value": 31}
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
    {"name": "debpalash/VoiceStudio", "value": 2301, "lang": "Python", "total": "71,262"},
    {"name": "xerj-org/xerj", "value": 1648, "lang": "Rust", "total": "6,949"},
    {"name": "anthropics/claude-plugins-official", "value": 1552, "lang": "Python", "total": "40,596"},
    {"name": "K-Dense-AI/scientific-agent-skills", "value": 1158, "lang": "Python", "total": "51,526"},
    {"name": "affaan-m/ECC", "value": 1057, "lang": "JavaScript", "total": "281,532"},
    {"name": "obra/superpowers", "value": 973, "lang": "Shell", "total": "300,686"},
    {"name": "MadsLorentzen/ai-job-search", "value": 898, "lang": "Python", "total": "48,539"},
    {"name": "ruvnet/ruflo", "value": 672, "lang": "TypeScript", "total": "75,645"},
    {"name": "hmjz100/LinkSwift", "value": 538, "lang": "JavaScript", "total": "23,717"},
    {"name": "mksglu/context-mode", "value": 449, "lang": "TypeScript", "total": "30,243"}
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
