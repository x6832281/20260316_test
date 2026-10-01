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
    {"name": "老资历在此", "value": 9480, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Baa6JENd"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "[星星眼][星星眼]", "value": 6733, "platform": "B站", "url": "https://www.bilibili.com/video/BV1JPaE6NEji"},
    {"name": "我是《鸣潮》心月狐PV单曲《心愿吟》中文版演唱者小时姑娘。 很开心能用自己的声音…", "value": 6573, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s8aq6FEfJ"},
    {"name": "来，一人一句赵然老师晚安", "value": 6241, "platform": "B站", "url": "https://www.bilibili.com/video/BV16ead6uEsy"},
    {"name": "她这个团队对风景和光影的利用真是神了", "value": 5885, "platform": "B站", "url": "https://www.bilibili.com/video/BV1zLa36yE86"},
    {"name": "想建一层“原神六周年快乐！”的楼！[原神_小事一桩]", "value": 5206, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Baa6JENd"},
    {"name": "ai生成的我跳不了这么傻", "value": 4956, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Yao6fEwa"},
    {"name": "风的来信是不是也可以叫信风（信封）", "value": 4056, "platform": "B站", "url": "https://www.bilibili.com/video/BV14Baa6JENd"}
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
    {"name": "精彩", "value": 1278},
    {"name": "藏狐", "value": 827},
    {"name": "过年了", "value": 749},
    {"name": "只看不沾", "value": 719},
    {"name": "六周年快乐！", "value": 700},
    {"name": "国庆快乐", "value": 656},
    {"name": "许愿心不歪，玩到关服", "value": 581},
    {"name": "过年了？", "value": 527},
    {"name": "五花肉", "value": 507},
    {"name": "合影", "value": 484},
    {"name": "天地玄宗，万炁本根。广修亿劫，证吾神通。三界内外…", "value": 426},
    {"name": "六周年快乐", "value": 237}
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
    {"name": "debpalash/VoiceStudio", "value": 3483, "lang": "Python", "total": "50,459"},
    {"name": "NVIDIA/OpenShell", "value": 1281, "lang": "Rust", "total": "12,706"},
    {"name": "t8y2/dbx", "value": 1138, "lang": "Rust", "total": "23,200"},
    {"name": "VectifyAI/PageIndex", "value": 1097, "lang": "Python", "total": "38,133"},
    {"name": "mattpocock/skills", "value": 876, "lang": "Shell", "total": "273,019"},
    {"name": "DietrichGebert/ponytail", "value": 743, "lang": "JavaScript", "total": "149,203"},
    {"name": "byoungd/up", "value": 743, "lang": "JavaScript", "total": "66,393"},
    {"name": "mvschwarz/openrig", "value": 624, "lang": "TypeScript", "total": "3,035"},
    {"name": "harry0703/MoneyPrinterTurbo", "value": 431, "lang": "Python", "total": "127,574"},
    {"name": "heygen-com/hyperframes", "value": 349, "lang": "TypeScript", "total": "54,744"}
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
