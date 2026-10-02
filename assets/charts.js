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
    {"name": "ai生成的我跳不了这么傻", "value": 19596, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Yao6fEwa"},
    {"name": "跟普通手机安装一个豆包APP有什么区别", "value": 11000, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "哪天豆包不开心了，不让你用手机怎么办", "value": 8313, "platform": "小红书", "url": "https://www.xiaohongshu.com/explore/69301ff4000000001e029cef?xsec_token=ABJQrbMJ0rv4vhrlQjzwBrpN7kPqYGpdBxvpBx39mKU6g=&xsec_source=pc_search"},
    {"name": "我们一起戒掉拖更吧[抓狂]", "value": 8140, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cAYP6YEvj"},
    {"name": "这又是谁来了呢？[doge]", "value": 7284, "platform": "B站", "url": "https://www.bilibili.com/video/BV1hEaz6LE4X"},
    {"name": "妈妈癌症后一直觉得自己身上不好闻（怕被医护人员嫌弃），我正好看到Oliver的视…", "value": 5224, "platform": "B站", "url": "https://www.bilibili.com/video/BV1hTYN6UE6p"},
    {"name": "🇨🇳", "value": 4666, "platform": "B站", "url": "https://www.bilibili.com/video/BV1FiaZ62EAG"},
    {"name": "国庆快乐 这期凑了[良辰共此曲动态表情包_探头]", "value": 3909, "platform": "B站", "url": "https://www.bilibili.com/video/BV1jxaB6QEsN"},
    {"name": "谁没把头像换回来我不说[大笑]", "value": 3324, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cAYP6YEvj"},
    {"name": "刚刚开始我也不理解，直到我也学着跳了一段，虽然很生硬，但是跳完之后，我想通了很多", "value": 3282, "platform": "B站", "url": "https://www.bilibili.com/video/BV13Yao6fEwa"}
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
    {"name": "国庆快乐", "value": 846},
    {"name": "雨木99", "value": 470},
    {"name": "火钳刘明", "value": 436},
    {"name": "mj", "value": 433},
    {"name": "AA！", "value": 307},
    {"name": "你是？", "value": 292},
    {"name": "懂你意思", "value": 248},
    {"name": "暗影猎手，准备就绪！", "value": 242},
    {"name": "fruit", "value": 219},
    {"name": "“这里埋葬的是章鱼哥的梦想”", "value": 197},
    {"name": "暗影猎手，准备就绪", "value": 189},
    {"name": "祖国万岁", "value": 186}
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
    {"name": "NVIDIA/OpenShell", "value": 2456, "lang": "Rust", "total": "14,028"},
    {"name": "DietrichGebert/ponytail", "value": 1194, "lang": "JavaScript", "total": "150,537"},
    {"name": "mattpocock/skills", "value": 883, "lang": "Shell", "total": "273,919"},
    {"name": "mvschwarz/openrig", "value": 642, "lang": "TypeScript", "total": "3,733"},
    {"name": "heygen-com/hyperframes", "value": 627, "lang": "TypeScript", "total": "55,355"},
    {"name": "pbakaus/impeccable", "value": 495, "lang": "JavaScript", "total": "73,688"},
    {"name": "obra/superpowers", "value": 455, "lang": "Shell", "total": "293,981"},
    {"name": "HunxByts/GhostTrack", "value": 368, "lang": "Python", "total": "16,412"},
    {"name": "mksglu/context-mode", "value": 362, "lang": "TypeScript", "total": "24,786"},
    {"name": "pablostanley/yoinks", "value": 361, "lang": "TypeScript", "total": "2,947"}
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
