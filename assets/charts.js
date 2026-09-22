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
    {"name": "不觉得在教学楼中间建了一个决斗场的校领导更是豪中之豪吗[鬼刀海琴烟午后-表情包_…", "value": 4524, "platform": "B站", "url": "https://www.bilibili.com/video/BV14mez6VEG9"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "最早玩黑莓那代人已经老花了", "value": 2220, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69e224d9000000002101038b?xsec_token=ABmuylZEbxoHDcVfKEl8R1_BD21a9foH64_6sR_VGWK08=&xsec_source=pc_search"},
    {"name": "妈妈居然是会带着孩子一起用科学方法消毒饲养小老鼠的嘛，我小时候也抓到过小耗子想养…", "value": 2125, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ZFeB6xEs9"},
    {"name": "若不争那一纸文凭，世人怎知我寒窗苦读数十载", "value": 1930, "platform": "B站", "url": "https://www.bilibili.com/video/BV1o2eM6kEDT"},
    {"name": "一模一样[doge]", "value": 1826, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Pnhi6WErP"},
    {"name": "原生家庭幸福导致的", "value": 1782, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ZFeB6xEs9"},
    {"name": "2是7", "value": 1768, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/699ab185000000001a02567f?xsec_token=AB9MRNPH7i-pxtsiwE-W46H8pRsztx20EmW77-H6o1bL4=&xsec_source=pc_search"}
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
    {"name": "吓哭了", "value": 743},
    {"name": "晚安", "value": 606},
    {"name": "薇斯纳不歪，玩到关服！", "value": 383},
    {"name": "这很COLMO！", "value": 312},
    {"name": "晚安泰哥", "value": 296},
    {"name": "原神牛逼", "value": 214},
    {"name": "优雅", "value": 193},
    {"name": "kksk", "value": 126},
    {"name": "少偶99", "value": 62},
    {"name": "月轮启幕，星谱为听，指藏遗音，幻中见真，娅门永存…", "value": 57},
    {"name": "主不在乎", "value": 56},
    {"name": "泰哥晚安", "value": 46}
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
    {"name": "Open-Dev-Society/OpenStock", "value": 844, "lang": "TypeScript", "total": "17,754"},
    {"name": "trycua/cua", "value": 609, "lang": "HTML", "total": "25,709"},
    {"name": "BuilderIO/agent-native", "value": 607, "lang": "TypeScript", "total": "5,923"},
    {"name": "coder/coder", "value": 460, "lang": "Go", "total": "16,431"},
    {"name": "anthropics/financial-services", "value": 424, "lang": "Python", "total": "35,841"},
    {"name": "Crosstalk-Solutions/project-nomad", "value": 394, "lang": "TypeScript", "total": "37,877"},
    {"name": "zhouxiaoka/autoclip", "value": 250, "lang": "Python", "total": "8,260"},
    {"name": "ruanyf/weekly", "value": 182, "lang": "—", "total": "103,957"},
    {"name": "mvt-project/mvt", "value": 169, "lang": "Python", "total": "13,605"},
    {"name": "akitaonrails/ai-memory", "value": 167, "lang": "Rust", "total": "7,696"}
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
