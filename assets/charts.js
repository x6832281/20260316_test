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
    {"name": "可能要断更了，我遇到了麻烦，也就是不会经常更新了，抱歉了大家！", "value": 15434, "platform": "B站", "url": "https://www.bilibili.com/video/BV1xtaU6cE3Z"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "[难过]", "value": 8700, "platform": "B站", "url": "https://www.bilibili.com/video/BV1o9YP6tEJm"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "这人招了吗[妙啊]", "value": 8188, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"},
    {"name": "一个赞当一天头像😋", "value": 6997, "platform": "B站", "url": "https://www.bilibili.com/video/BV1PSaf6dEmW"},
    {"name": "啊啊啊啊，宝宝", "value": 6397, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"},
    {"name": "1", "value": 4891, "platform": "B站", "url": "https://www.bilibili.com/video/BV1PSaf6dEmW"},
    {"name": "你职业的第一冠献给祖国", "value": 4726, "platform": "B站", "url": "https://www.bilibili.com/video/BV1SyaB6zEEs"},
    {"name": "[喜欢]", "value": 4178, "platform": "B站", "url": "https://www.bilibili.com/video/BV1o9YP6tEJm"}
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
    {"name": "致敬", "value": 811},
    {"name": "至↑此↓间→ 我↑知↓觉→ 流↑年↓应↑有↓限→", "value": 658},
    {"name": "生日快乐", "value": 533},
    {"name": "整段垮掉", "value": 448},
    {"name": "爷们儿！", "value": 297},
    {"name": "好听", "value": 127},
    {"name": "古人", "value": 115},
    {"name": "未识别到人脸", "value": 93},
    {"name": "来了来了", "value": 82},
    {"name": "开头见", "value": 76},
    {"name": "好耶", "value": 68},
    {"name": "好听！", "value": 66}
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
    {"name": "Panniantong/Agent-Reach", "value": 1696, "lang": "Python", "total": "89,827"},
    {"name": "DietrichGebert/ponytail", "value": 1281, "lang": "JavaScript", "total": "153,443"},
    {"name": "affaan-m/ECC", "value": 897, "lang": "JavaScript", "total": "272,265"},
    {"name": "mattpocock/skills", "value": 751, "lang": "Shell", "total": "275,376"},
    {"name": "pbakaus/impeccable", "value": 699, "lang": "JavaScript", "total": "75,325"},
    {"name": "obra/superpowers", "value": 577, "lang": "Shell", "total": "294,922"},
    {"name": "JuliusBrussee/caveman", "value": 507, "lang": "Go", "total": "109,539"},
    {"name": "earendil-works/pi", "value": 408, "lang": "TypeScript", "total": "112,164"},
    {"name": "Effect-TS/effect", "value": 302, "lang": "TypeScript", "total": "16,824"},
    {"name": "mksglu/context-mode", "value": 256, "lang": "TypeScript", "total": "25,251"}
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
