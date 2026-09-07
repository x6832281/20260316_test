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
    {"name": "洋葱此事早有记载[微笑]", "value": 8977, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HBbE6cEc5"},
    {"name": "手书？", "value": 7721, "platform": "B站", "url": "https://www.bilibili.com/video/BV1tHbj6PEmH"},
    {"name": "终于到我发了", "value": 5382, "platform": "B站", "url": "https://www.bilibili.com/video/BV1tHbj6PEmH"},
    {"name": "最喜欢的一段🥹速涂之", "value": 5053, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HBbE6cEc5"},
    {"name": "AA的那个短片真的拍得好好！力导🐮", "value": 3856, "platform": "B站", "url": "https://www.bilibili.com/video/BV1HBbE6cEc5"},
    {"name": "曾经守在电视机前看成龙历险记的那个七八岁的小女孩，如今也是怀胎八月的准妈妈了[呲…", "value": 3761, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Z4ti6BE4b"},
    {"name": "又到了我最喜欢的欧盟笑话时刻[呲牙][doge]", "value": 3720, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EEbL67ECU"},
    {"name": "我一直在期待让他人生跌入谷底的转折，然后我发现视频播完了", "value": 3355, "platform": "B站", "url": "https://www.bilibili.com/video/BV1J1t26KEcz"},
    {"name": "最伟大的厚黑！！", "value": 2193, "platform": "B站", "url": "https://www.bilibili.com/video/BV1iPbj61E3u"},
    {"name": "能不能搬空一下这个，想看[doge]", "value": 1547, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Xdt26bECx"}
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
    {"name": "生日快乐", "value": 2490},
    {"name": "泪目", "value": 937},
    {"name": "见证历史", "value": 729},
    {"name": "古人", "value": 558},
    {"name": "kksk", "value": 552},
    {"name": "秒吃", "value": 507},
    {"name": "《礼鱼》", "value": 470},
    {"name": "复旦之光", "value": 445},
    {"name": "他真好看", "value": 351},
    {"name": "雨木99", "value": 335},
    {"name": "我去", "value": 320},
    {"name": "AA！", "value": 286}
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
    {"name": "mattpocock/skills", "value": 2207, "lang": "Shell", "total": "254,583"},
    {"name": "DietrichGebert/ponytail", "value": 1539, "lang": "JavaScript", "total": "129,386"},
    {"name": "affaan-m/ECC", "value": 1485, "lang": "JavaScript", "total": "251,362"},
    {"name": "blader/humanizer", "value": 748, "lang": "Python", "total": "44,256"},
    {"name": "cathrynlavery/diagram-design", "value": 620, "lang": "HTML", "total": "32,383"},
    {"name": "magnitudedev/magnitude", "value": 604, "lang": "TypeScript", "total": "3,677"},
    {"name": "anomalyco/opencode", "value": 551, "lang": "TypeScript", "total": "205,269"},
    {"name": "NousResearch/hermes-agent", "value": 520, "lang": "Python", "total": "242,554"},
    {"name": "humanlayer/skills", "value": 451, "lang": "TypeScript", "total": "3,147"},
    {"name": "BraveOPotato/FckSignups", "value": 436, "lang": "TypeScript", "total": "3,317"}
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
