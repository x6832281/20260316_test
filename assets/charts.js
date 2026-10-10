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
    {"name": "在音乐领域你才是挑战者 faker，", "value": 19483, "platform": "B站", "url": "https://www.bilibili.com/video/BV1DRHU6LELy"},
    {"name": "你把我的预言家还给我😭", "value": 11737, "platform": "B站", "url": "https://www.bilibili.com/video/BV1arH968EzQ"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "这么多食物如果让你自己吃，你能在一年内吃完吗[doge]", "value": 10481, "platform": "B站", "url": "https://www.bilibili.com/video/BV1VeHQ6tEaS"},
    {"name": "01:31 这是哪个战队哦？", "value": 8881, "platform": "B站", "url": "https://www.bilibili.com/video/BV1DRHU6LELy"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "老李头，音乐这一块，过得了乐队，再谈未来", "value": 6931, "platform": "B站", "url": "https://www.bilibili.com/video/BV1DRHU6LELy"},
    {"name": "纯奖励局啊，又可以合作，又不限时，还提供健身器材，还提供私教[笑哭]", "value": 5482, "platform": "B站", "url": "https://www.bilibili.com/video/BV1VeHQ6tEaS"},
    {"name": "这才是我呀，没有绝望舞步那么傻，没有虎了吧唧声音难听，没有臭企鹅那么矮，这个帅的…", "value": 4141, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Dwpx6jEaB"},
    {"name": "买一箱猕猴桃 第一天：硬邦邦 第二天：吃一个，有点酸 第三天：吃三个 第四天：吃…", "value": 3821, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Y6H96cEkz"}
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
    {"name": "懂你意思", "value": 974},
    {"name": "吓哭了", "value": 326},
    {"name": "谢谢", "value": 72},
    {"name": "难说", "value": 55},
    {"name": "若娜瓦！", "value": 55},
    {"name": "还真是", "value": 52},
    {"name": "完结撒花", "value": 49},
    {"name": "man", "value": 47},
    {"name": "别这么说", "value": 43},
    {"name": "生日快乐", "value": 41},
    {"name": "没绷住", "value": 39},
    {"name": "未识别到人脸", "value": 39}
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
    {"name": "morluto/rea", "value": 14927, "lang": "TypeScript", "total": "46,836"},
    {"name": "boykopovar/AnyPS5", "value": 5868, "lang": "C++", "total": "22,453"},
    {"name": "storytold/artcraft", "value": 3752, "lang": "Rust", "total": "11,561"},
    {"name": "cathrynlavery/diagram-design", "value": 1739, "lang": "HTML", "total": "47,899"},
    {"name": "mattpocock/skills", "value": 1687, "lang": "Shell", "total": "282,742"},
    {"name": "anthropics/knowledge-work-plugins", "value": 709, "lang": "Python", "total": "28,276"},
    {"name": "addyosmani/agent-skills", "value": 436, "lang": "JavaScript", "total": "104,003"},
    {"name": "alibaba/open-code-review", "value": 326, "lang": "Go", "total": "45,250"},
    {"name": "Robbyant/lingbot-map", "value": 110, "lang": "Python", "total": "17,708"},
    {"name": "BerriAI/litellm", "value": 95, "lang": "Python", "total": "60,675"}
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
