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
    {"name": "老资历在此", "value": 9171, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Baa6JENd"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "评论区不用怀疑，他的声乐就是纯天赋[笑哭]在他来川音之前从来没学过声乐，他也是钢…", "value": 6576, "platform": "B站", "url": "https://www.bilibili.com/video/BV14KaK6LE8w"},
    {"name": "我是《鸣潮》心月狐PV单曲《心愿吟》中文版演唱者小时姑娘。 很开心能用自己的声音…", "value": 6451, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s8aq6FEfJ"},
    {"name": "冷知识：真珠是第1个欢愉命途PV不欢快的角色", "value": 5406, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Rmh96ZEXh"},
    {"name": "故意掉下水的米格尔得知自己要重新上场时:", "value": 5013, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Kyas6wEuz"},
    {"name": "想建一层“原神六周年快乐！”的楼！[原神_小事一桩]", "value": 4430, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Baa6JENd"},
    {"name": "bro冲剪映会员就为了这个炸金特效", "value": 4234, "platform": "B站", "url": "https://www.bilibili.com/video/BV1N2aV6wELJ"},
    {"name": "汤圆砂仁啦[鸣潮·致予新世界静态表情包_这你都信][鸣潮·致予新世界静态表情包_…", "value": 3638, "platform": "B站", "url": "https://www.bilibili.com/video/BV1pPap6DEhi"}
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
    {"name": "精彩", "value": 1225},
    {"name": "六周年快乐！", "value": 756},
    {"name": "许愿心不歪，玩到关服", "value": 696},
    {"name": "过年了", "value": 641},
    {"name": "过年了？", "value": 457},
    {"name": "加强威龙", "value": 403},
    {"name": "懂你意思", "value": 365},
    {"name": "掉皮掉肉不掉队！", "value": 337},
    {"name": "绿色健康小清新", "value": 325},
    {"name": "爷们！", "value": 252},
    {"name": "许愿真珠不歪", "value": 235},
    {"name": "六周年快乐", "value": 203}
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
    {"name": "debpalash/VoiceStudio", "value": 4758, "lang": "Python", "total": "48,189"},
    {"name": "vectorize-io/hindsight", "value": 2575, "lang": "Python", "total": "42,873"},
    {"name": "paperclipai/paperclip", "value": 2458, "lang": "TypeScript", "total": "94,489"},
    {"name": "NVIDIA/OpenShell", "value": 990, "lang": "Rust", "total": "10,636"},
    {"name": "VectifyAI/PageIndex", "value": 835, "lang": "Python", "total": "37,398"},
    {"name": "rohitg00/ai-engineering-from-scratch", "value": 786, "lang": "Python", "total": "61,414"},
    {"name": "mvschwarz/openrig", "value": 737, "lang": "TypeScript", "total": "2,452"},
    {"name": "dream-num/univer", "value": 696, "lang": "TypeScript", "total": "21,866"},
    {"name": "cs341-illinois/coursebook", "value": 572, "lang": "TeX", "total": "3,111"},
    {"name": "oblien/openship", "value": 437, "lang": "TypeScript", "total": "13,840"}
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
