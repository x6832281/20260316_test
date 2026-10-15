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
    {"name": "用感光基因帮助盲人复现世界的轮廓……一个相当大胆和天才的想法，今年诺奖太强了[笑…", "value": 12263, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Fbpt6qEPq"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "孩子们，学物理真的很累", "value": 7689, "platform": "B站", "url": "https://www.bilibili.com/video/BV1EKWc6hEmQ"},
    {"name": "基拉，用这个死亡笔记，劲大", "value": 7259, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Sepk6bEZC"},
    {"name": "你孟德尔叔叔有多超标，生物地基都没盖好，他先把顶封上了[笑哭][笑哭][笑哭]", "value": 6046, "platform": "B站", "url": "https://www.bilibili.com/video/BV1XupR6NEeo"},
    {"name": "宿傩和大小保底交给我，你们先十连双红吧", "value": 6037, "platform": "B站", "url": "https://www.bilibili.com/video/BV1fspq6cEty"},
    {"name": "希腊有个说法，叫nostos，就是在长远的旅行后回归自己原本的身份。在伊萨卡，我…", "value": 5183, "platform": "B站", "url": "https://www.bilibili.com/video/BV1mopE6xEqv"},
    {"name": "封面幻视凤凰传奇怎么办[笑哭]", "value": 4005, "platform": "B站", "url": "https://www.bilibili.com/video/BV1mopE6xEqv"},
    {"name": "村里人眼中的up", "value": 3182, "platform": "B站", "url": "https://www.bilibili.com/video/BV1kKWA6uEyr"}
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
    {"name": "接生", "value": 748},
    {"name": "千言万语，感谢现役", "value": 640},
    {"name": "LPL加油", "value": 177},
    {"name": "阿一古", "value": 133},
    {"name": "咕咕嘎嘎", "value": 31},
    {"name": "舒服了", "value": 29},
    {"name": "吓哭了", "value": 28},
    {"name": "最芙幻想", "value": 22},
    {"name": "河南", "value": 21},
    {"name": "山东", "value": 19},
    {"name": "好人一生平安", "value": 18},
    {"name": "来都来了", "value": 17}
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
    {"name": "morluto/rea", "value": 41034, "lang": "TypeScript", "total": "242,950"},
    {"name": "debpalash/VoiceStudio", "value": 3538, "lang": "Python", "total": "66,419"},
    {"name": "ifixai-ai/iFixAi", "value": 2109, "lang": "Python", "total": "27,444"},
    {"name": "xtool-org/xtool", "value": 1502, "lang": "Swift", "total": "10,855"},
    {"name": "vxcontrol/pentagi", "value": 1025, "lang": "Go", "total": "29,513"},
    {"name": "NationalSecurityAgency/ghidra", "value": 1008, "lang": "Java", "total": "87,547"},
    {"name": "mksglu/context-mode", "value": 947, "lang": "TypeScript", "total": "29,145"},
    {"name": "rust-lang/rust", "value": 207, "lang": "Rust", "total": "120,045"},
    {"name": "K-Dense-AI/scientific-agent-skills", "value": 163, "lang": "Python", "total": "49,362"},
    {"name": "ntdevlabs/tiny11builder", "value": 139, "lang": "C#", "total": "20,246"}
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
