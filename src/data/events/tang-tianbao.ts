import type { HistoricalEvent } from '../../lib/types'

export const TANG_TIANBAO_EVENTS: HistoricalEvent[] = [
  {
    id: 'fan-yang-755',
    date: '2026-06-28',
    yearCE: 755,
    dynasty: '唐 · 天宝十四载',
    title: { zh: '范阳鼙鼓', en: 'Drums at Fanyang' },
    scenario: {
      zh: '天宝十四载冬,范阳节度使安禄山起兵。你是洛阳一户殷实人家的当家人,消息传来,城中已有人开始南逃。三日内,你必须定夺。',
      en: 'Winter, 755 CE. An Lushan, military governor of Fanyang, has raised his banner. You are the head of a prosperous Luoyang household. Rumors fly; some are already fleeing south. You have three days to decide.',
    },
    choices: [
      { id: 'flee-south', label: { zh: '举家南逃江淮', en: 'Flee south with your household to Jianghuai' } },
      { id: 'stay-luoyang', label: { zh: '据守洛阳祖宅', en: 'Hold your ancestral home in Luoyang' } },
      { id: 'join-loyalist', label: { zh: '投军平叛', en: 'Join the imperial army to suppress the rebellion' } },
    ],
    footnote: {
      zh: '安史之乱(755–763)使中原人口锐减,洛阳两度陷落。',
      en: 'The An Lushan Rebellion (755–763) devastated the Central Plains; Luoyang fell twice.',
    },
  },
  {
    id: 'mawei-756',
    date: '2026-06-29',
    yearCE: 756,
    dynasty: '唐 · 至德元载',
    title: { zh: '马嵬之变', en: 'The Incident at Mawei' },
    scenario: {
      zh: '至德元载,玄宗西幸至马嵬驿,六军不发,请诛杨国忠与贵妃。你是一名随驾禁军小校,被同袍推作代表上前陈情。',
      en: '756 CE. Emperor Xuanzong\'s flight halts at Mawei Station. The guards refuse to march, demanding the lives of Yang Guozhong and the imperial consort. You are a junior officer, pushed forward by your comrades to speak.',
    },
    choices: [
      { id: 'speak-for-guards', label: { zh: '陈请诛杨', en: 'Voice the guards\' demand' } },
      { id: 'shield-consort', label: { zh: '护驾贵妃', en: 'Shield the consort' } },
      { id: 'stay-silent', label: { zh: '缄默退后', en: 'Stay silent, step back' } },
    ],
    footnote: {
      zh: '马嵬之变中杨贵妃赐死,玄宗入蜀,太子北上灵武即位。',
      en: 'At Mawei, Consort Yang was ordered to die; Xuanzong fled to Shu while the crown prince marched north to Lingwu and took the throne.',
    },
  },
  {
    id: 'shu-scholar-753',
    date: '2026-06-30',
    yearCE: 753,
    dynasty: '唐 · 天宝十二载',
    title: { zh: '蜀中征辟', en: 'A Summons in Shu' },
    scenario: {
      zh: '天宝十二载,剑南节度使征辟你为幕府掌书记。同期,长安李林甫当国,株连之风甚烈。',
      en: '753 CE. The military governor of Jiannan offers you the post of secretary in his staff. In Chang\'an, the chancellor Li Linfu\'s purges are at their cruelest.',
    },
    choices: [
      { id: 'accept-shu', label: { zh: '赴蜀就任', en: 'Accept, go to Shu' } },
      { id: 'decline-changan', label: { zh: '婉拒,留待长安', en: 'Decline, bide your time in Chang\'an' } },
      { id: 'retire-mountain', label: { zh: '辞官归隐山林', en: 'Refuse and retire to the mountains' } },
    ],
    footnote: {
      zh: '天宝末年党争激烈,入幕与归隐皆为士人常见出路。',
      en: 'In the late Tianbao era, factional strife made both staff posts and mountain retirement common paths for scholars.',
    },
  },
]
