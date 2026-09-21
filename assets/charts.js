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
    {"name": "本次事件中所谓品牌联动、购机换取签售名额，均为漫展主办方单方面说法，vivo天津…", "value": 42197, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YaeN6xEWR"},
    {"name": "一看就是主办方阴间操作，借着兔娘还有其他 coser 的相关权益捞好处，然后拿这…", "value": 35400, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YaeN6xEWR"},
    {"name": "律师函相当于律师有话想和你说，于是他写了一封信给你，仅此而已，含金量和你今天吃完…", "value": 18612, "platform": "B站", "url": "https://www.bilibili.com/video/BV1YaeN6xEWR"},
    {"name": "反掰在日常使用中太容易实现了。 我拿手机睡着了，手机展开屏幕朝下，睡觉时身体压在…", "value": 11614, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cSec6tEux"},
    {"name": "这学校为什么要在教学楼中间设立一个舞台🤔", "value": 11513, "platform": "B站", "url": "https://www.bilibili.com/video/BV1vgeb6ZEN7"},
    {"name": "看所有iPhone duo导购视频的先决条件是你没有见过任何折叠屏[doge]", "value": 10030, "platform": "B站", "url": "https://www.bilibili.com/video/BV1cSec6tEux"},
    {"name": "很高兴又和亚细亚老师合作啦！[乐鸣东方动态表情包_盯]这次是由亚细亚老师担当「闪…", "value": 8454, "platform": "B站", "url": "https://www.bilibili.com/video/BV16veP6eEeC"},
    {"name": "这哪像送荔枝进长安，这像打进长安的[笑哭]", "value": 5324, "platform": "B站", "url": "https://www.bilibili.com/video/BV1WgeN66EAe"},
    {"name": "相信我，食品安全方面对于渔哥来说是一片蓝海，有的是素材", "value": 4546, "platform": "B站", "url": "https://www.bilibili.com/video/BV1T2er6QE4b"},
    {"name": "这个不是芭乐，这是木瓜[藏狐][藏狐]芭乐中间是实心的", "value": 4472, "platform": "B站", "url": "https://www.bilibili.com/video/BV1ZueH6LEa6"}
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
    {"name": "十周年快乐", "value": 899},
    {"name": "kksk", "value": 807},
    {"name": "哦呼", "value": 702},
    {"name": "懂你意思", "value": 613},
    {"name": "开坑", "value": 590},
    {"name": "无限进步", "value": 514},
    {"name": "文明", "value": 459},
    {"name": "中！", "value": 458},
    {"name": "支持", "value": 415},
    {"name": "人民万岁", "value": 401},
    {"name": "中中中", "value": 395},
    {"name": "天下为公", "value": 391}
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
    {"name": "cloudflare/security-audit-skill", "value": 2428, "lang": "JavaScript", "total": "18,169"},
    {"name": "trycua/cua", "value": 1018, "lang": "HTML", "total": "25,235"},
    {"name": "affaan-m/ECC", "value": 826, "lang": "JavaScript", "total": "263,870"},
    {"name": "Open-Dev-Society/OpenStock", "value": 755, "lang": "TypeScript", "total": "16,928"},
    {"name": "addyosmani/agent-skills", "value": 736, "lang": "JavaScript", "total": "97,763"},
    {"name": "anthropics/claude-code", "value": 419, "lang": "TypeScript", "total": "147,190"},
    {"name": "coder/coder", "value": 379, "lang": "Go", "total": "16,101"},
    {"name": "vercel-labs/json-render", "value": 291, "lang": "TypeScript", "total": "17,416"},
    {"name": "anthropics/financial-services", "value": 260, "lang": "Python", "total": "35,429"},
    {"name": "mihail911/modern-software-dev-assignments", "value": 172, "lang": "Python", "total": "4,597"}
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
