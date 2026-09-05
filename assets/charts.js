(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: 今日全站最高赞评论 TOP 10 ---
  var topComments = [
    { name: '跟普通手机安装一个豆包APP有什么区别', value: 11000, platform: '小红书' },
    { name: '哪天豆包不开心了，不让你用手机怎么办', value: 8313, platform: '小红书' },
    { name: '请求支援此评论，溯源之惧已出第六章', value: 4013, platform: 'B站' },
    { name: '系统级 跨APP执行', value: 3024, platform: '小红书' },
    { name: '时间的力量[大哭][大哭][大哭]', value: 2849, platform: 'B站' },
    { name: '我只是开玩笑的而已啊。[辣眼睛]', value: 2754, platform: 'B站' },
    { name: '最早玩黑莓那代人已经老花了', value: 2220, platform: '小红书' },
    { name: '2是7', value: 1768, platform: '小红书' },
    { name: '妈你看手机不离手不就不会丢了吗', value: 1680, platform: '小红书' },
    { name: '12年iphone4拍的[笑哭R]', value: 1531, platform: '小红书' }
  ].reverse();

  var chart1 = echarts.init(document.getElementById('chart-top-comments'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      formatter: function (params) {
        var p = params[0];
        return p.data.platform + ' · ' + p.data.likes + ' 赞<br>' + p.data.full;
      }
    },
    grid: { left: 8, right: 60, top: 10, bottom: 10, containLabel: true },
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
          itemStyle: { color: d.platform === '小红书' ? accent : accent2, borderRadius: [0, 4, 4, 0] }
        };
      }),
      label: {
        show: true, position: 'right',
        color: muted, fontFamily: 'JetBrainsMono, monospace', fontSize: 12,
        formatter: function (p) { return p.data.likes; }
      },
      barMaxWidth: 22
    }]
  });
  window.addEventListener('resize', function () { chart1.resize(); });

  // --- Chart 2: B站热门弹幕频次 TOP 12 ---
  var danmaku = [
    { name: '火钳刘明', value: 588 },
    { name: 'kksk', value: 97 },
    { name: '聪明的小潮院长非常聪明', value: 86 },
    { name: '每周必看', value: 39 },
    { name: '聪明的小潮院长非常聪明~', value: 39 },
    { name: '看完了', value: 32 },
    { name: '笑死我了', value: 30 },
    { name: 'mj', value: 30 },
    { name: '聪明的小潮院长非常聪明～～', value: 28 },
    { name: '你妈补天', value: 25 },
    { name: '心生爱慕', value: 24 },
    { name: '还真是', value: 24 }
  ].reverse();

  var chart2 = echarts.init(document.getElementById('chart-danmaku'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      formatter: function (params) {
        var p = params[0];
        return p.name + '<br>' + p.value + ' 次';
      }
    },
    grid: { left: 8, right: 56, top: 10, bottom: 10, containLabel: true },
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
            color: d.value > 300 ? accent2 : accent2 + '88',
            borderRadius: [0, 4, 4, 0]
          }
        };
      }),
      label: {
        show: true, position: 'right',
        color: muted, fontFamily: 'JetBrainsMono, monospace', fontSize: 12,
        formatter: '{c} 次'
      },
      barMaxWidth: 20
    }]
  });
  window.addEventListener('resize', function () { chart2.resize(); });

  // --- Chart 3: GitHub Trending 今日新增星数 TOP 10 ---
  var ghTrending = [
    { name: 'DietrichGebert/ponytail', value: 2813, lang: 'JavaScript', total: '127,164' },
    { name: 'mattpocock/skills', value: 2666, lang: 'Shell', total: '251,476' },
    { name: 'affaan-m/ECC', value: 1325, lang: 'JavaScript', total: '249,080' },
    { name: 'humanlayer/skills', value: 1141, lang: 'TypeScript', total: '—' },
    { name: 'blader/humanizer', value: 988, lang: 'Python', total: '—' },
    { name: 'cathrynlavery/diagram-design', value: 852, lang: 'HTML', total: '—' },
    { name: 'anomalyco/opencode', value: 725, lang: 'TypeScript', total: '—' },
    { name: 'magnitudedev/magnitude', value: 686, lang: 'TypeScript', total: '—' },
    { name: 'NousResearch/hermes-agent', value: 573, lang: 'Python', total: '241,745' },
    { name: 'anthropics/skills', value: 472, lang: 'Python', total: '—' }
  ].reverse();

  var chart3 = echarts.init(document.getElementById('chart-github'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      formatter: function (params) {
        var p = params[0];
        return p.data.repo + '<br>今日 +' + p.value.toLocaleString() + ' 星 · ' + p.data.lang +
          (p.data.total && p.data.total !== '—' ? '<br>总星 ' + p.data.total : '');
      }
    },
    grid: { left: 8, right: 70, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule } } },
    yAxis: {
      type: 'category',
      data: ghTrending.map(function (d) { return d.name; }),
      axisLabel: { color: ink, fontSize: 12, fontFamily: 'JetBrainsMono, monospace' },
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
          itemStyle: { color: '#a371f7', borderRadius: [0, 4, 4, 0] }
        };
      }),
      label: {
        show: true, position: 'right',
        color: muted, fontFamily: 'JetBrainsMono, monospace', fontSize: 12,
        formatter: function (p) { return '+' + p.value.toLocaleString(); }
      },
      barMaxWidth: 20
    }]
  });
  window.addEventListener('resize', function () { chart3.resize(); });
})();
