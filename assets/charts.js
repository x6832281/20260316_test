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
    {"name": "用感光基因帮助盲人复现世界的轮廓……一个相当大胆和天才的想法，今年诺奖太强了[笑…", "value": 10068, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Fbpt6qEPq"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "孩子们，学物理真的很累", "value": 5538, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EKWc6hEmQ"},
    {"name": "你孟德尔叔叔有多超标，生物地基都没盖好，他先把顶封上了[笑哭][笑哭][笑哭]", "value": 4974, "platform": "B站", "url": "https://www.bilibili.com/video/BV1XupR6NEeo"},
    {"name": "希腊有个说法，叫nostos，就是在长远的旅行后回归自己原本的身份。在伊萨卡，我…", "value": 4801, "platform": "B站", "url": "https://www.bilibili.com/video/BV1mopE6xEqv"},
    {"name": "是真的，挂到大鱼，跟挂地球一样，这是我挂到鱼之后一点动静都没有，我心想完了，切了…", "value": 4187, "platform": "B站", "url": "https://www.bilibili.com/video/BV1xTpG6iEbV"},
    {"name": "封面幻视凤凰传奇怎么办[笑哭]", "value": 3929, "platform": "B站", "url": "https://www.bilibili.com/video/BV1mopE6xEqv"},
    {"name": "我爸看网上说吃土豆降血糖，吃了一个月，结果血糖飙升。后来发现他是正常吃完饭再啃个…", "value": 3311, "platform": "B站", "url": "https://www.bilibili.com/video/BV1doWc6xEjL"},
    {"name": "这母亲感觉是战略性原谅一波，毕竟两年没有接触外界，加上要是在公共节目逼她儿子保不…", "value": 3309, "platform": "B站", "url": "https://www.bilibili.com/video/BV1wAp76yEu1"}
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
    {"name": "接生", "value": 721},
    {"name": "芙芙生日快乐", "value": 495},
    {"name": "爷青回", "value": 467},
    {"name": "好久不见", "value": 419},
    {"name": "《金色大狗熊》", "value": 398},
    {"name": "害怕", "value": 365},
    {"name": "《通缉令》", "value": 300},
    {"name": "看完了", "value": 153},
    {"name": "懂你意思", "value": 119},
    {"name": "忠诚", "value": 111},
    {"name": "吓哭了", "value": 110},
    {"name": "啊？", "value": 102}
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
    {"name": "morluto/rea", "value": 54679, "lang": "TypeScript", "total": "208,412"},
    {"name": "storytold/artcraft", "value": 4081, "lang": "Rust", "total": "25,730"},
    {"name": "bilawalsidhu/gods-eye-view", "value": 1961, "lang": "JavaScript", "total": "55,432"},
    {"name": "cathrynlavery/diagram-design", "value": 1815, "lang": "HTML", "total": "54,161"},
    {"name": "debpalash/VoiceStudio", "value": 1748, "lang": "Python", "total": "63,368"},
    {"name": "xtool-org/xtool", "value": 1198, "lang": "Swift", "total": "9,402"},
    {"name": "mksglu/context-mode", "value": 969, "lang": "TypeScript", "total": "28,261"},
    {"name": "vercel-labs/skills", "value": 190, "lang": "TypeScript", "total": "34,528"}
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
