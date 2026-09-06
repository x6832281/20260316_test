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
    {"name": "up这家伙最精了，外面的琴房练琴要钱，这里免费还倒送两杯酒还装到了[大笑]", "value": 21754, "platform": "B站", "url": "https://www.bilibili.com/video/BV1e8tR6EER5"},
    {"name": "有多少人一眼认出封面？查询二刺螈浓度[热词表情_世萌双冠]", "value": 10258, "platform": "B站", "url": "https://www.bilibili.com/video/BV1wote6gEQ1"},
    {"name": "关谷，你绝对不知道今天绝区零放啥了", "value": 9304, "platform": "B站", "url": "https://www.bilibili.com/video/BV1wote6gEQ1"},
    {"name": "上条视频发的时候你B的审核自作主张的给我加了个限制评论和弹幕的模型，于是三十分钟…", "value": 7974, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Yubj6VEpD"},
    {"name": "角：时序的力量 牢马：分割万物 拉海洛：唯心大运 心：能召唤很多机关，真的很多", "value": 7925, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Q5tG6bEX3"},
    {"name": "[鸣潮·共鸣与群星_点赞][鸣潮·共鸣与群星_点赞]大的要来了", "value": 7716, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Q5tG6bEX3"},
    {"name": "孩子们，消息是真的，不用再被骗了", "value": 6381, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Q5tG6bEX3"},
    {"name": "大家可能对曼哈顿停电4个小时没什么概念：这相当于北京2环内停电，而最近一次北京二…", "value": 6221, "platform": "B站", "url": "https://www.bilibili.com/video/BV1bHtd6CESR"},
    {"name": "请求支援此评论，溯源之惧（深不可测的恐惧）已出第六章，可双人联机想看鲤鱼和社会人…", "value": 6057, "platform": "B站", "url": "https://www.bilibili.com/video/BV16Htm6rE8n"},
    {"name": "看来是我没合上故事书，让我的公主跑出来了[笑哭]", "value": 5534, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FUbF6rEFf"}
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
    {"name": "藏狐", "value": 902},
    {"name": "见证历史", "value": 858},
    {"name": "晚安", "value": 684},
    {"name": "古人", "value": 585},
    {"name": "火钳刘明", "value": 564},
    {"name": "秒吃", "value": 516},
    {"name": "萌黄可爱捏", "value": 510},
    {"name": "kksk", "value": 507},
    {"name": "爷们", "value": 435},
    {"name": "复旦之光", "value": 316},
    {"name": "听见你说", "value": 283},
    {"name": "文明", "value": 138}
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
    {"name": "DietrichGebert/ponytail", "value": 2845, "lang": "JavaScript", "total": "127,962"},
    {"name": "mattpocock/skills", "value": 2692, "lang": "Shell", "total": "252,657"},
    {"name": "affaan-m/ECC", "value": 1314, "lang": "JavaScript", "total": "249,915"},
    {"name": "blader/humanizer", "value": 990, "lang": "Python", "total": "43,491"},
    {"name": "cathrynlavery/diagram-design", "value": 855, "lang": "HTML", "total": "31,696"},
    {"name": "anomalyco/opencode", "value": 725, "lang": "TypeScript", "total": "204,682"},
    {"name": "magnitudedev/magnitude", "value": 674, "lang": "TypeScript", "total": "3,214"},
    {"name": "NousResearch/hermes-agent", "value": 575, "lang": "Python", "total": "242,017"},
    {"name": "anthropics/skills", "value": 475, "lang": "Python", "total": "174,569"},
    {"name": "humanlayer/skills", "value": 442, "lang": "TypeScript", "total": "2,711"}
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
