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
    {"name": "好搞笑 奶奶和小伙子都以为对方听力不好[笑哭]", "value": 3754, "platform": "B站", "url": "https://www.bilibili.com/video/BV16LH76rEfS"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "你们说的那个……秋假……是他妈的什么……😭", "value": 2243, "platform": "B站", "url": "https://www.bilibili.com/video/BV18HHE6xEBE"},
    {"name": "最早玩黑莓那代人已经老花了", "value": 2220, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69e224d9000000002101038b?xsec_token=ABmuylZEbxoHDcVfKEl8R1_BD21a9foH64_6sR_VGWK08=&xsec_source=pc_search"},
    {"name": "三哥的湿婆神belike", "value": 2034, "platform": "B站", "url": "https://www.bilibili.com/video/BV11bHE6QEx2"},
    {"name": "都要把你之前的视频盘包浆了 话说合同什么时候到期？", "value": 2030, "platform": "B站", "url": "https://www.bilibili.com/video/BV1nMHs68EQu"},
    {"name": "之前拍的这种尴尬小视频我都是笑笑就过去了，但轮到赵管家跟王妈拍时我是真的尴尬了，…", "value": 1990, "platform": "B站", "url": "https://www.bilibili.com/video/BV1NzHp6hEu9"},
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
    {"name": "失踪人口回归", "value": 806},
    {"name": "忍耐已经结束！", "value": 620},
    {"name": "这次一定", "value": 571},
    {"name": "kksk", "value": 477},
    {"name": "恭迎天后", "value": 411},
    {"name": "好样的布鲁斯", "value": 365},
    {"name": "整段垮掉", "value": 356},
    {"name": "Again↓→ and↓again→↑ I→↑s…", "value": 352},
    {"name": "秒吃", "value": 350},
    {"name": "古人", "value": 345},
    {"name": "又看一集", "value": 292},
    {"name": "我去", "value": 279}
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
    {"name": "DuarteSantos8/openGym", "value": 1433, "lang": "JavaScript", "total": "4,243"},
    {"name": "tester-army/e2e", "value": 1398, "lang": "TypeScript", "total": "4,841"},
    {"name": "Panniantong/Agent-Reach", "value": 1155, "lang": "Python", "total": "91,905"},
    {"name": "boykopovar/AnyPS5", "value": 997, "lang": "C++", "total": "4,979"},
    {"name": "msitarzewski/agency-agents", "value": 744, "lang": "Shell", "total": "157,276"},
    {"name": "calesthio/OpenMontage", "value": 742, "lang": "Python", "total": "64,057"},
    {"name": "thedotmack/claude-mem", "value": 534, "lang": "TypeScript", "total": "96,644"},
    {"name": "caddyserver/caddy", "value": 515, "lang": "Go", "total": "77,133"},
    {"name": "pingdotgg/t3code", "value": 485, "lang": "TypeScript", "total": "25,629"},
    {"name": "earthtojake/text-to-cad", "value": 437, "lang": "Python", "total": "17,433"}
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
