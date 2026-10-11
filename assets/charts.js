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
    {"name": "祝大家都能找到自己的幸福喵", "value": 4374, "platform": "B站", "url": "https://www.bilibili.com/video/BV16xpt6BE6t"},
    {"name": "耐人寻味的是，我们一帮人做了这么久视频，对彼此内心的了解可能不到10％，只有特定…", "value": 4153, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Rgpi6DEhX"},
    {"name": "去，哪有那么多规矩，我前列腺发炎还起飞呢，我才是身体的主人", "value": 3995, "platform": "B站", "url": "https://www.bilibili.com/video/BV1AQHS6MEfW"},
    {"name": "是皮特赢了，砍不到脖子 00:36", "value": 2539, "platform": "B站", "url": "https://www.bilibili.com/video/BV1CLHQ6zEHC"},
    {"name": "声带是最后衰老的器官，按道理来讲，大妈要是保养的好，其实跟十几年前声音差别不大", "value": 2515, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FUpb6kERs"},
    {"name": "我去开心成舍利子了[星星眼][星星眼][星星眼]谢谢你们的支持！！！", "value": 2459, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ispc6sEHg"},
    {"name": "太不专业了，居然不开会研究一下塞嘴布的颜色", "value": 2444, "platform": "B站", "url": "https://www.bilibili.com/video/BV1fopY6QEmP"},
    {"name": "难道只有我一个人在看男生女生向前冲的节目觉得别人很菜，然后幻想自己上去的话会拿到…", "value": 2268, "platform": "B站", "url": "https://www.bilibili.com/video/BV15rpt6bEPm"},
    {"name": "海关“额……你的意思是说，她做为一个法师  在一个世俗的 非宗教的 普遍无神论的…", "value": 1978, "platform": "B站", "url": "https://www.bilibili.com/video/BV1QJpi6yEPp"},
    {"name": "有攻略剧透。和朋友玩了两个周目，一周目是正常玩的，钱不够，不过没打电话给警长，所…", "value": 1964, "platform": "B站", "url": "https://www.bilibili.com/video/BV1iqpt6cEMU"}
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
    {"name": "出必还愿", "value": 375},
    {"name": "吓哭了", "value": 301},
    {"name": "世纪大和解", "value": 228},
    {"name": "生日快乐", "value": 200},
    {"name": "懂你意思", "value": 115},
    {"name": "心生爱慕", "value": 68},
    {"name": "好看", "value": 64},
    {"name": "kksk", "value": 62},
    {"name": "没绷住", "value": 52},
    {"name": "绷不住了", "value": 52},
    {"name": "弹幕飞过", "value": 52},
    {"name": "学到了", "value": 49}
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
    {"name": "morluto/rea", "value": 25793, "lang": "TypeScript", "total": "72,904"},
    {"name": "boykopovar/AnyPS5", "value": 5805, "lang": "C++", "total": "26,884"},
    {"name": "storytold/artcraft", "value": 3222, "lang": "Rust", "total": "14,524"},
    {"name": "mattpocock/skills", "value": 1736, "lang": "Shell", "total": "284,510"},
    {"name": "cathrynlavery/diagram-design", "value": 1190, "lang": "HTML", "total": "48,958"},
    {"name": "anthropics/knowledge-work-plugins", "value": 625, "lang": "Python", "total": "28,822"},
    {"name": "hugohe3/ppt-master", "value": 461, "lang": "Python", "total": "59,464"},
    {"name": "multica-ai/andrej-karpathy-skills", "value": 278, "lang": "—", "total": "218,283"},
    {"name": "mksglu/context-mode", "value": 178, "lang": "TypeScript", "total": "26,320"},
    {"name": "huggingface/transformers", "value": 96, "lang": "Python", "total": "167,265"}
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
