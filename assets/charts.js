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
    {"name": "下次记得给嘉宾准备点儿水，有点干了………[doge_金箍]", "value": 20068, "platform": "B站", "url": "https://www.bilibili.com/video/BV1JFaN6hEL9"},
    {"name": "[抓狂]", "value": 11112, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Vkag6TExf"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "小约翰同志， 9月份的指标能不能更新10期呢", "value": 3190, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WhaA6hE7s"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "最早玩黑莓那代人已经老花了", "value": 2220, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69e224d9000000002101038b?xsec_token=ABmuylZEbxoHDcVfKEl8R1_BD21a9foH64_6sR_VGWK08=&xsec_source=pc_search"},
    {"name": "一部通辽史，半部勋宗传[笑哭]", "value": 1802, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WhaA6hE7s"},
    {"name": "苏联的粮食政策真的太抽象了，解体之后的苏联各个加盟国虽然有各种各样的问题，但是在…", "value": 1777, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WhaA6hE7s"},
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
    {"name": "完结撒花", "value": 922},
    {"name": "这很COLMO！", "value": 787},
    {"name": "中秋快乐", "value": 443},
    {"name": "懂你意思", "value": 160},
    {"name": "嘉豪", "value": 141},
    {"name": "谢谢款待", "value": 131},
    {"name": "中秋节快乐", "value": 117},
    {"name": "害怕", "value": 109},
    {"name": "░░░░░░░░░░░░░░░░░░░░ 防网暴…", "value": 98},
    {"name": "绵羊绵羊，是不是你的番茄品种买错了咯？", "value": 97},
    {"name": "中秋快乐！", "value": 91},
    {"name": "谁？", "value": 78}
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
    {"name": "paperclipai/paperclip", "value": 2109, "lang": "TypeScript", "total": "84,990"},
    {"name": "vectorize-io/hindsight", "value": 1653, "lang": "Python", "total": "29,817"},
    {"name": "google/ax", "value": 1379, "lang": "Go", "total": "11,515"},
    {"name": "rohitg00/ai-engineering-from-scratch", "value": 1177, "lang": "Python", "total": "57,515"},
    {"name": "dream-num/univer", "value": 1050, "lang": "TypeScript", "total": "18,450"},
    {"name": "mattpocock/skills", "value": 583, "lang": "Shell", "total": "269,735"},
    {"name": "obra/superpowers", "value": 468, "lang": "Shell", "total": "291,665"},
    {"name": "NVIDIA/Model-Optimizer", "value": 359, "lang": "Python", "total": "4,479"},
    {"name": "pbakaus/impeccable", "value": 306, "lang": "JavaScript", "total": "71,208"},
    {"name": "anthropics/skills", "value": 189, "lang": "Python", "total": "178,323"}
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
