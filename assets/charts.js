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
    {"name": "有人说他有天分，只能说你有钱你也能发觉自己的天赋，但大多数人只能稳妥的苦哈哈走读…", "value": 11329, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "盛艾敬家长要招员工可以直接从盛艾敬超话里找免费劳动力。", "value": 6828, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "1945柏林", "value": 6641, "platform": "B站", "url": "https://www.bilibili.com/video/BV1wMJv6WErL"},
    {"name": "这波是说到点上了 三谋全新 S1 讨董赏金服 10 月 17 日 12 点 - …", "value": 5717, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "记得怪鸽在直播的时候有人录到他对弟弟嫌弃而且怒喝。我只想说，试试照顾一个精神疾病…", "value": 5415, "platform": "B站", "url": "https://www.bilibili.com/video/BV1GMnM6aEzJ"},
    {"name": "试着闭着眼睛想象了一会儿，感觉脑内token用完了_(:з」∠)_", "value": 5014, "platform": "B站", "url": "https://www.bilibili.com/video/BV1G5po6zECY"},
    {"name": "太久不见，相当想念！我目前已经在新的目的地拍摄，11月中旬将恢复稳定更新，咕咕勒…", "value": 4258, "platform": "B站", "url": "https://www.bilibili.com/video/BV18Bn36BE6S"},
    {"name": "[doge]再加上服务员脾气有点大 停车免费", "value": 3120, "platform": "B站", "url": "https://www.bilibili.com/video/BV11CJy6nEaC"},
    {"name": "你是说这个超人背着雷霆重的装备朝着个有长枪和防弹衣的大规模枪击犯狂奔，又立刻隔着…", "value": 2732, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dCJe6zEgv"},
    {"name": "看了下评论区的大家都多少有些坎坷，我说下我自己吧，00年26岁女生，毕业三年半，…", "value": 2514, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ifJY66EjT"}
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
    {"name": "失踪人口回归", "value": 521},
    {"name": "生日快乐", "value": 432},
    {"name": "虞书欣", "value": 362},
    {"name": "r.i.p", "value": 338},
    {"name": "锁暝不歪，玩到关服", "value": 332},
    {"name": "rip", "value": 260},
    {"name": "空军", "value": 207},
    {"name": "生日快乐！", "value": 171},
    {"name": "大彻大悟", "value": 113},
    {"name": "默哀", "value": 86},
    {"name": "文明", "value": 84},
    {"name": "听见你说", "value": 76}
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
    {"name": "MadsLorentzen/ai-job-search", "value": 2232, "lang": "Python", "total": "53,338"},
    {"name": "debpalash/VoiceStudio", "value": 2082, "lang": "Python", "total": "75,468"},
    {"name": "anomalyco/opencode", "value": 1414, "lang": "TypeScript", "total": "216,640"},
    {"name": "anthropics/claude-plugins-official", "value": 1175, "lang": "Python", "total": "42,723"},
    {"name": "stablyai/orca", "value": 1146, "lang": "TypeScript", "total": "96,712"},
    {"name": "HKUDS/CLI-Anything", "value": 589, "lang": "Python", "total": "54,612"},
    {"name": "ruvnet/ruflo", "value": 513, "lang": "TypeScript", "total": "76,545"},
    {"name": "akitaonrails/ai-memory", "value": 512, "lang": "Rust", "total": "10,518"},
    {"name": "android/skills", "value": 375, "lang": "Kotlin", "total": "8,789"},
    {"name": "cursor/plugins", "value": 350, "lang": "TypeScript", "total": "12,760"}
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
