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
    {"name": "谱子来了： 运动牛仔混合洗运动单漂单排单甩单漂牛仔节能洗运动牛仔混合洗运动单漂单…", "value": 13605, "platform": "B站", "url": "https://www.bilibili.com/video/BV1fNJQ6bEAj"},
    {"name": "只能说粉丝多说，大家自会去调查。甚至是“全部未履行”，这集太神了[笑哭]", "value": 10420, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "叮动基", "value": 7160, "platform": "B站", "url": "https://www.bilibili.com/video/BV1pVJU64Ey6"},
    {"name": "感谢大up发声。 没人觉得粉圈很可怕吗？把普通人艰辛的维权，说成黑红营销，给我家…", "value": 5899, "platform": "B站", "url": "https://www.bilibili.com/video/BV1s7JX6gELt"},
    {"name": "因为非法取证法院不予采纳，而且你只能证明他开过这个保险柜。", "value": 5712, "platform": "B站", "url": "https://www.bilibili.com/video/BV1q3pS6tE4J"},
    {"name": "无障碍电影是在原版影片音频基础上，插入旁白解说画面内容，方便视障人士理解剧情的电…", "value": 4707, "platform": "B站", "url": "https://www.bilibili.com/video/BV1G5po6zECY"},
    {"name": "虽然很搞笑，但是搞出这么多纸板，还给每一块上了色，还专门弄出窗户孔和细节，规模真…", "value": 4147, "platform": "B站", "url": "https://www.bilibili.com/video/BV1XJJ96oEXg"},
    {"name": "其实到这里就可以结束了，感谢大自然的馈赠", "value": 3468, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dfJk6hEjX"},
    {"name": "强得可怕[哦呼]", "value": 3089, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dfJk6hEjX"},
    {"name": "本期探访女嘉宾 @是盈妹ovo 大家还想我去探访谁的家？[doge]", "value": 2538, "platform": "B站", "url": "https://www.bilibili.com/video/BV1dfJk6hEjX"}
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
    {"name": "永远不死", "value": 1079},
    {"name": "接生", "value": 838},
    {"name": "简介nb", "value": 631},
    {"name": "永远不死！", "value": 563},
    {"name": "懂你意思", "value": 435},
    {"name": "舒服了", "value": 427},
    {"name": "生日快乐", "value": 426},
    {"name": "古人", "value": 386},
    {"name": "kksk", "value": 228},
    {"name": "完结撒花", "value": 191},
    {"name": "生日快乐！", "value": 156},
    {"name": "虞书欣", "value": 82}
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
    {"name": "debpalash/VoiceStudio", "value": 2125, "lang": "Python", "total": "73,480"},
    {"name": "anthropics/claude-plugins-official", "value": 1397, "lang": "Python", "total": "41,822"},
    {"name": "MadsLorentzen/ai-job-search", "value": 1365, "lang": "Python", "total": "50,513"},
    {"name": "xerj-org/xerj", "value": 1160, "lang": "Rust", "total": "7,844"},
    {"name": "affaan-m/ECC", "value": 1145, "lang": "JavaScript", "total": "282,557"},
    {"name": "K-Dense-AI/scientific-agent-skills", "value": 878, "lang": "Python", "total": "52,281"},
    {"name": "stablyai/orca", "value": 830, "lang": "TypeScript", "total": "95,481"},
    {"name": "HKUDS/CLI-Anything", "value": 574, "lang": "Python", "total": "54,091"},
    {"name": "anomalyco/opencode", "value": 438, "lang": "TypeScript", "total": "215,423"},
    {"name": "ruvnet/ruflo", "value": 420, "lang": "TypeScript", "total": "76,101"}
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
