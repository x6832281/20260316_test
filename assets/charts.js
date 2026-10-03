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
    {"name": "这人招了吗[妙啊]", "value": 7704, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"},
    {"name": "一个初音，一个重音，一边挥刀，一边唱歌", "value": 6630, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UGa961Ejt"},
    {"name": "这段歌词上半体裁使用了楚辞式，下半则是宋词式。使用这两种古典文学体裁，分别对应玄…", "value": 6374, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cQap6UEr2"},
    {"name": "啊啊啊啊，宝宝", "value": 6193, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"},
    {"name": "这次的诗歌是分了两个部分，上半仿楚辞，下半仿宋词，以玄鸟仙子和祖师爷两个视角分别…", "value": 5503, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cQap6UEr2"},
    {"name": "找到同款了", "value": 4963, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UGa961Ejt"},
    {"name": "十月份是一个适合塑造苦命鸳鸯的季节[doge_金箍][doge_金箍][doge…", "value": 4259, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cQap6UEr2"},
    {"name": "你职业的第一冠献给祖国", "value": 4153, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"}
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
    {"name": "想看", "value": 780},
    {"name": "致敬", "value": 700},
    {"name": "懂你意思", "value": 580},
    {"name": "古人", "value": 375},
    {"name": "秒吃", "value": 326},
    {"name": "火钳刘明", "value": 310},
    {"name": "“这里埋葬的是章鱼哥的梦想”", "value": 303},
    {"name": "kksk", "value": 288},
    {"name": "哔哩哔哩(゜-゜)つロ干杯~-bilibili", "value": 140},
    {"name": "养好号的话这段话正好二十个字快点拿去用吧养好号的…", "value": 83},
    {"name": "谢谢", "value": 80},
    {"name": "开头见", "value": 76}
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
    {"name": "DietrichGebert/ponytail", "value": 1435, "lang": "JavaScript", "total": "151,825"},
    {"name": "mattpocock/skills", "value": 955, "lang": "Shell", "total": "274,718"},
    {"name": "pbakaus/impeccable", "value": 722, "lang": "JavaScript", "total": "74,335"},
    {"name": "Panniantong/Agent-Reach", "value": 696, "lang": "Python", "total": "88,654"},
    {"name": "mvschwarz/openrig", "value": 683, "lang": "TypeScript", "total": "4,317"},
    {"name": "pablostanley/yoinks", "value": 623, "lang": "TypeScript", "total": "3,508"},
    {"name": "NVIDIA/OpenShell", "value": 594, "lang": "Rust", "total": "14,437"},
    {"name": "heygen-com/hyperframes", "value": 580, "lang": "TypeScript", "total": "55,909"},
    {"name": "obra/superpowers", "value": 556, "lang": "Shell", "total": "294,473"},
    {"name": "mksglu/context-mode", "value": 282, "lang": "TypeScript", "total": "25,045"}
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
