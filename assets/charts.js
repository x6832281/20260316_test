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
    {"name": "[笑哭]", "value": 6825, "platform": "B站", "url": "https://www.bilibili.com/video/BV1UNhR6jEiW"},
    {"name": "在快要毁灭性的星球看到这样的景象你也会踏上开拓的", "value": 5381, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Rmh96ZEXh"},
    {"name": "冷知识：真珠是第1个欢愉命途PV不欢快的角色", "value": 5302, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Rmh96ZEXh"},
    {"name": "看到pv最后，各位是否发自内心的感到高兴了？ 所以说，经此淬炼者，方得欢愉", "value": 3339, "platform": "B站", "url": "https://www.bilibili.com/video/BV1Rmh96ZEXh"},
    {"name": "系统级 跨APP执行", "value": 3024, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "最早玩黑莓那代人已经老花了", "value": 2220, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69e224d9000000002101038b?xsec_token=ABmuylZEbxoHDcVfKEl8R1_BD21a9foH64_6sR_VGWK08=&xsec_source=pc_search"},
    {"name": "2是7", "value": 1768, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/699ab185000000001a02567f?xsec_token=AB9MRNPH7i-pxtsiwE-W46H8pRsztx20EmW77-H6o1bL4=&xsec_source=pc_search"},
    {"name": "妈你看手机不离手不就不会丢了吗[抽泣R]还成天说我[色色R]", "value": 1680, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/6a981106000000002900f745?xsec_token=ABgFkexTizTcRuRHtiUpnK2k469XWnsLSy-Mcl9cbFqKg=&xsec_source=pc_search"}
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
    {"name": "跨火盆", "value": 1485},
    {"name": "藏狐", "value": 573},
    {"name": "掉皮掉肉不掉队！", "value": 555},
    {"name": "谢谢款待", "value": 552},
    {"name": "爷们！", "value": 451},
    {"name": "秒吃", "value": 361},
    {"name": "那能一样吗", "value": 301},
    {"name": "许愿真珠不歪", "value": 284},
    {"name": "中秋快乐", "value": 255},
    {"name": "爷青回", "value": 150},
    {"name": "她真好看", "value": 116},
    {"name": "哎呀 timtim 我不想听你讲这些绕口令 这个…", "value": 85}
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
    {"name": "vectorize-io/hindsight", "value": 4520, "lang": "Python", "total": "37,363"},
    {"name": "debpalash/VoiceStudio", "value": 3086, "lang": "Python", "total": "40,203"},
    {"name": "paperclipai/paperclip", "value": 2401, "lang": "TypeScript", "total": "89,957"},
    {"name": "dream-num/univer", "value": 895, "lang": "TypeScript", "total": "20,262"},
    {"name": "rohitg00/ai-engineering-from-scratch", "value": 790, "lang": "Python", "total": "59,318"},
    {"name": "InfinityLoop1308/PipePipe", "value": 242, "lang": "Shell", "total": "6,582"},
    {"name": "mvschwarz/openrig", "value": 114, "lang": "TypeScript", "total": "992"},
    {"name": "vercel-labs/scriptc", "value": 102, "lang": "TypeScript", "total": "5,410"},
    {"name": "willfaust/Madeira", "value": 83, "lang": "C", "total": "821"}
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
