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
    {"name": "下次记得给嘉宾准备点儿水，有点干了………[doge_金箍]", "value": 32192, "platform": "B站", "url": "https://www.bilibili.com/video/BV1JFaN6hEL9"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "我们一般不把艺术家叫做嘉豪", "value": 8838, "platform": "B站", "url": "https://www.bilibili.com/video/BV1DvaP62ECv"},
    {"name": "体验就是 手机翻译软件更好用[doge]", "value": 8638, "platform": "B站", "url": "https://www.bilibili.com/video/BV1F5h86PEUH"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "午夜轮班 这款曾经爆火的游戏 玩起来 太刺激了简直不要太爽 硬生生玩成搞笑游戏[…", "value": 6164, "platform": "B站", "url": "https://www.bilibili.com/video/BV18fhb65EGs"},
    {"name": "哥们内存够大的，装这么多语种语音包", "value": 6035, "platform": "B站", "url": "https://www.bilibili.com/video/BV1F5h86PEUH"},
    {"name": "这游戏主角的真实身份是从良的连环杀手，还是疑似信恐虐的，每个月杀8个，为了给自己…", "value": 5976, "platform": "B站", "url": "https://www.bilibili.com/video/BV18fhb65EGs"},
    {"name": "冷知识， NBA并没有规定不能用须佐手臂扣篮，也没有规定打球不能放雷遁和火遁[笑…", "value": 4736, "platform": "B站", "url": "https://www.bilibili.com/video/BV1c7hX6hEgh"},
    {"name": "由两个动物和一个水果经营的杀人商厦[doge_金箍]", "value": 3727, "platform": "B站", "url": "https://www.bilibili.com/video/BV18fhb65EGs"}
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
    {"name": "一路走好", "value": 1024},
    {"name": "豪到我了", "value": 581},
    {"name": "藏狐", "value": 567},
    {"name": "掉皮掉肉不掉队！", "value": 510},
    {"name": "jo等了", "value": 470},
    {"name": "牛来", "value": 468},
    {"name": "许愿心不歪，玩到关服", "value": 417},
    {"name": "谢谢款待", "value": 307},
    {"name": "中秋快乐", "value": 270},
    {"name": "爷们！", "value": 262},
    {"name": "大王", "value": 215},
    {"name": "man！", "value": 200}
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
    {"name": "paperclipai/paperclip", "value": 2608, "lang": "TypeScript", "total": "87,375"},
    {"name": "vectorize-io/hindsight", "value": 2147, "lang": "Python", "total": "32,229"},
    {"name": "dream-num/univer", "value": 849, "lang": "TypeScript", "total": "19,235"},
    {"name": "rohitg00/ai-engineering-from-scratch", "value": 827, "lang": "Python", "total": "58,393"},
    {"name": "openbao/openbao", "value": 364, "lang": "Go", "total": "8,010"},
    {"name": "zhaoxuya520/reverse-skill", "value": 361, "lang": "PowerShell", "total": "38,022"},
    {"name": "NVIDIA/Model-Optimizer", "value": 357, "lang": "Python", "total": "4,758"},
    {"name": "block/buzz", "value": 339, "lang": "Rust", "total": "34,834"},
    {"name": "mobile-next/mobile-mcp", "value": 168, "lang": "TypeScript", "total": "7,361"},
    {"name": "microsoft/vscode", "value": 95, "lang": "TypeScript", "total": "193,077"}
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
