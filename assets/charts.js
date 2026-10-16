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
    {"name": "小猫原来认人啊。。一直以为它谁都黏", "value": 18697, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Eapz6PErV"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "你鼠大哥被人类做了这么多年实验KD 都没拉平", "value": 8016, "platform": "B站", "url": "https://www.bilibili.com/video/BV1gFp26uEPD"},
    {"name": "村里人眼中的up", "value": 4764, "platform": "B站", "url": "https://www.bilibili.com/video/BV1kKWA6uEyr"},
    {"name": "斯拉夫大区特有的，你以为他没牌了，他其实还有，你看以为他有牌，他确实是没有", "value": 4060, "platform": "B站", "url": "https://www.bilibili.com/video/BV1nyJ66PEPQ"},
    {"name": "我朋友的猫也是收养的，后来面相都变了[笑哭]", "value": 3722, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cApB6NEPq"},
    {"name": "集朔的女子力，望的阳光，令的自律，均的红火 ，颉的生龙活虎，黍的丰满，绩的慷慨，…", "value": 3115, "platform": "B站", "url": "https://www.bilibili.com/video/BV1fspq6cEty"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "强得可怕[哦呼]", "value": 2624, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dfJk6hEjX"}
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
    {"name": "接生", "value": 774},
    {"name": "千言万语，感谢现役", "value": 514},
    {"name": "芙芙生日快乐", "value": 500},
    {"name": "许愿祀不歪，出必还愿", "value": 413},
    {"name": "舒服了", "value": 285},
    {"name": "LPL加油", "value": 232},
    {"name": "许愿祀，出必还愿", "value": 223},
    {"name": "阿一古", "value": 137},
    {"name": "让奇迹发生", "value": 115},
    {"name": "见证历史", "value": 96},
    {"name": "吓哭了", "value": 82},
    {"name": "我吃饱了", "value": 82}
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
    {"name": "morluto/rea", "value": 32314, "lang": "TypeScript", "total": "270,879"},
    {"name": "debpalash/VoiceStudio", "value": 3024, "lang": "Python", "total": "69,144"},
    {"name": "NationalSecurityAgency/ghidra", "value": 1369, "lang": "Java", "total": "88,785"},
    {"name": "K-Dense-AI/scientific-agent-skills", "value": 1091, "lang": "Python", "total": "50,498"},
    {"name": "affaan-m/ECC", "value": 1013, "lang": "JavaScript", "total": "280,417"},
    {"name": "mksglu/context-mode", "value": 904, "lang": "TypeScript", "total": "29,803"},
    {"name": "xerj-org/xerj", "value": 715, "lang": "Rust", "total": "5,681"},
    {"name": "obra/superpowers", "value": 582, "lang": "Shell", "total": "299,913"},
    {"name": "JuliusBrussee/caveman", "value": 433, "lang": "Go", "total": "112,574"},
    {"name": "anthropics/claude-plugins-official", "value": 307, "lang": "Python", "total": "39,127"}
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
