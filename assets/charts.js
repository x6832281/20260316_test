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
    {"name": "这才是真正的音乐", "value": 8053, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BCpw6cEuo"},
    {"name": "平常没事就摆这个动作，感觉活的特别通透", "value": 7089, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BCpw6cEuo"},
    {"name": "“品质一定有所保证”", "value": 6008, "platform": "B站", "url": "https://www.bilibili.com/video/BV1BCpw6cEuo"},
    {"name": "[doge]", "value": 4727, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UPaS6vEBK"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "【系统】西边的国家下辈子再来探索吧", "value": 2633, "platform": "B站", "url": "https://www.bilibili.com/video/BV1aZpw6DEKJ"},
    {"name": "是的，你们没有看错，在强者如云的7月，最佳原创其实是向日葵马戏团[颂乐人偶_眯眼…", "value": 2357, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Uppw6yEMr"},
    {"name": "这个电影好像叫什么权力的游戏？", "value": 2299, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UPaS6vEBK"}
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
    {"name": "往日种种", "value": 853},
    {"name": "致敬", "value": 833},
    {"name": "又看一集", "value": 658},
    {"name": "哦对了", "value": 548},
    {"name": "紧？", "value": 276},
    {"name": "哔哩哔哩(゜-゜)つロ干杯~-bilibili", "value": 271},
    {"name": "辛苦了", "value": 165},
    {"name": "kksk", "value": 165},
    {"name": "懂你意思", "value": 133},
    {"name": "神了", "value": 132},
    {"name": "致敬！", "value": 125},
    {"name": "[黑洞]复制有惊喜", "value": 103}
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
    {"name": "morluto/rea", "value": 4655, "lang": "TypeScript", "total": "15,311"},
    {"name": "boykopovar/AnyPS5", "value": 2716, "lang": "C++", "total": "10,669"},
    {"name": "DuarteSantos8/openGym", "value": 1493, "lang": "JavaScript", "total": "6,925"},
    {"name": "mattpocock/skills", "value": 1403, "lang": "Shell", "total": "279,627"},
    {"name": "tester-army/e2e", "value": 1390, "lang": "TypeScript", "total": "7,470"},
    {"name": "cathrynlavery/diagram-design", "value": 825, "lang": "HTML", "total": "44,985"},
    {"name": "addyosmani/agent-skills", "value": 677, "lang": "JavaScript", "total": "102,832"},
    {"name": "ayghri/i-have-adhd", "value": 619, "lang": "Python", "total": "55,137"},
    {"name": "thedotmack/claude-mem", "value": 578, "lang": "TypeScript", "total": "97,737"},
    {"name": "cloudflare/security-audit-skill", "value": 576, "lang": "JavaScript", "total": "26,064"}
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
