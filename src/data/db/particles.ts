// PPS is calculated by (Particle per trigger x (Duration / CD) rounded down) / Duration
// Variance (Modifier on the chance of gaining extra particle) is Particle's decimal / Total Particle

export const ParticleCount = (id: string, c: number) =>
  ({
    '10000038': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.5, pps: 0.3, duration: 30 }],
    '10000078': [
      { name: 'Projection Attack', default: 0, value: 1, variance: 0 },
      { name: '3-Mirror Full Uptime', default: 1, value: 8, variance: 0 },
    ],
    '10000057': [{ name: 'Skill Cast', default: 1, value: 3.5, variance: 0.5 / 3.5 }],
    '10000082': [{ name: 'Skill Cast', default: 1, value: 3.5, variance: 0.5 / 3.5 }],
    '10000024': [
      { name: 'No Charge', default: 1, value: 2, variance: 0 },
      { name: '1 Charge', default: 0, value: 3, variance: 0 },
      { name: 'Full Charge', default: 0, value: 4, variance: 0 },
    ],
    '10000032': [
      { name: 'Skill Press', default: 1, value: 2.25, variance: 0.25 / 2.25 },
      { name: 'Skill Hold', default: 0, value: 3, variance: 0 },
    ],
    '10000072': [
      { name: 'Skill Press', default: 1, value: 2, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 3, variance: 0 },
    ],
    '10000088': [
      { name: 'Skill Press', default: 1, value: 3, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 5, variance: 0 },
    ],
    '10000090': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000094': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.2, pps: 0.33, duration: 17 }],
    '10000036': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000067': [{ name: 'Skill Cast', default: 1, value: 3, variance: 0 }],
    '10000071': [
      { name: 'Skill Cast', default: 1, value: 3, variance: 0 },
      { name: 'Skill Cast [Burst]', default: 0, value: 4 / 3, variance: 0.25 },
    ],
    '10000079': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.5, pps: 0.33, duration: c >= 2 ? 18 : 12 }],
    '10000016': [
      { name: 'Skill Cast', default: 0, value: 4 / 3, variance: 1 / 4 },
      { name: '3-Cast Combo', default: 1, value: 3.75, variance: 1 / 5 },
    ],
    '10000039': [
      { name: 'Skill Press', default: 1, value: 1.6, variance: 0.6 / 1.6 },
      { name: 'Skill Hold', default: 0, value: 4, variance: 0.25 },
    ],
    '10000068': [{ name: 'Skill Cast', default: 1, value: 2, variance: 0 }],
    '10000051': [
      { name: 'Skill Press', default: 1, value: 1.5, variance: 0.5 / 1.5 },
      { name: 'Skill Hold', default: 0, value: 2.5, variance: 0.5 / 2.5 },
    ],
    '10000076': [{ name: 'Vortex', default: 1, value: 2, variance: 0 }],
    '10000031': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.5, pps: 2 / 3, duration: c >= 6 ? 12 : 10 }],
    '10000085': [
      { name: 'Skill Cast', default: 1, value: 2, variance: 0 },
      { name: 'Skill Cast [Burst]', default: 0, value: 1, variance: 0 },
      { name: 'Pressure Level 4', default: 1, value: 1, variance: 0 },
    ],
    '10000089': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.5, pps: 0.3, duration: 30 }],
    '10000092': [{ name: 'Charmed Cloudstrider', default: 1, value: 2, variance: 0 }],
    '10000037': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000055': [{ name: 'Skill Cast', default: 1, value: 2, variance: 0 }],
    '10000046': [
      { name: 'Converted Attack', default: 0, value: 2.5, variance: 1 / 5 },
      { name: 'Full Uptime', default: 1, value: 4.8, variance: 1 / 6 },
    ],
    '10000003': [{ name: 'Skill Cast', default: 1, value: 8 / 3, variance: 0.25 }],
    '10000047': [
      { name: 'Skill Press', default: 1, value: 3, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 4, variance: 0 },
    ],
    '10000015': [
      { name: 'No Freeze', default: 1, value: 8 / 3, variance: 0.25 },
      { name: '1 Freeze', default: 0, value: 11 / 3, variance: 2 / 11 },
      { name: '2 Freeze', default: 0, value: 14 / 3, variance: 1 / 7 },
    ],
    '10000002': [{ name: 'Skill Cast', default: 1, value: 4.5, variance: 1 / 9 }],
    '10000066': [
      { name: 'Shunsuiken Hit', default: 0, value: 1.5, variance: 1 / 3 },
      { name: 'Full Uptime', default: 1, value: 4.5, variance: 1 / 9 },
    ],
    '10000081': [{ name: 'Skill Cast', default: 1, value: 2, variance: 0 }],
    '10000042': [{ name: 'Skill Recast', default: 1, value: 2.5, variance: 1 / 5 }],
    '10000061': [
      { name: 'Flipclaw Hit', default: 1, value: 3, variance: 0 },
      { name: 'Neko Parcel Hit', default: 0, value: 1, variance: 0 },
    ],
    '10000029': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000056': [{ name: 'Skill Cast', default: 1, value: 3, variance: 0 }],
    '10000065': [
      { name: 'Skill Cast', default: 1, value: 1, variance: 0, pps: c >= 4 ? 0.39 : 0.3, duration: c >= 2 ? 15 : 12 },
    ],
    '10000074': [
      { name: '1 Volleys', default: 0, value: 0, variance: 0.5, pps: 1 / 9, duration: 12 },
      { name: '2 Volleys', default: 0, value: 0, variance: 0.5, pps: 2 / 9, duration: 12 },
      { name: '3 Volleys', default: 1, value: 0, variance: 0.5, pps: 1 / 3, duration: 12 },
    ],
    '10000006': [{ name: 'Skill Hold', default: 1, value: 5, variance: 0 }],
    '10000083': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000084': [{ name: 'Skill Cast', default: 1, value: 5, variance: 0 }],
    '10000080': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000041': [{ name: 'Skill Cast', default: 1, value: 10 / 3, variance: 0.1 }],
    // Nahida's TKP always generate 3 Particles = 0 Variance
    '10000073': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0, pps: 0.36, duration: 25 }],
    '10000091': [{ name: 'Skill Cast', default: 2, value: 3.5, variance: 1 / 7 }],
    '10000087': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000070': [
      { name: 'Skill Hit', default: 0, value: 1.5, variance: 1 / 3 },
      { name: 'Full Dance', default: 1, value: 4.5, variance: 1 / 9 },
    ],
    '10000027': [{ name: 'Skill Cast', default: 1, value: 10 / 3, variance: 0.1 }],
    '10000052': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0.5, pps: 0.45, duration: 25 }],
    '10000020': [
      { name: 'Skill Press', default: 1, value: 3, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 4, variance: 0 },
    ],
    '10000045': [{ name: 'Skill Cast', default: 1, value: 3, variance: 0 }],
    '10000054': [
      { name: 'No Refresh', default: 0, value: 0, variance: 0.5, pps: 1 / 3, duration: 12 },
      { name: 'With Refresh', default: 1, value: 0, variance: 0.5, pps: 1 / 3, duration: 24 },
    ],
    '10000053': [{ name: 'Skill Cast', default: 1, value: 2, variance: 0 }],
    '10000063': [
      { name: 'Skill Press', default: 1, value: 3, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 4, variance: 0 },
    ],
    '10000059': [
      { name: '0~1 Stack', default: 0, value: 2, variance: 0 },
      { name: '2~3 Stacks', default: 0, value: 2.5, variance: 1 / 5 },
      { name: 'Full Stacks', default: 1, value: 3, variance: 0 },
    ],
    '10000043': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000033': [
      { name: 'Riptide Slash', default: 1, value: 1, variance: 0 },
      { name: 'Riptide Flash', default: 1, value: 1, variance: 0 },
    ],
    '10000050': [{ name: 'Skill Cast', default: 1, value: 3.5, variance: 1 / 7 }],
    '10000069': [{ name: 'Skill Cast', default: 1, value: 3.5, variance: 1 / 7 }],
    '10000022': [
      { name: 'Skill Press', default: 1, value: 3, variance: 0 },
      { name: 'Skill Hold', default: 0, value: 4, variance: 0 },
    ],
    '10000075': [
      { name: 'Enhanced NA/CA', default: 0, value: 1, variance: 0 },
      { name: '6~8s Uptime', default: 0, value: 3, variance: 0 },
      { name: '8~10s Uptime', default: 1, value: 4, variance: 0 },
    ],
    '10000086': [{ name: 'Enhanced NA/CA', default: 1, value: 1, variance: 0 }],
    '10000023': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0, pps: 0.5, duration: 7 }],
    '10000093': [{ name: 'Skill Cast', default: 1, value: 5, variance: 0 }],
    '10000026': [{ name: 'Skill Cast', default: 1, value: 3, variance: 0 }],
    '10000025': [{ name: 'Skill Cast', default: 1, value: 5, variance: 0 }],
    '10000044': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000058': [{ name: '3-Cast Combo', default: 1, value: 0, variance: 0, pps: 5 / 14, duration: 14 }],
    '10000048': [{ name: 'Skill Cast', default: 1, value: 3, variance: 0 }],
    '10000077': [{ name: 'Skill Cast', default: 1, value: 0, variance: 0, pps: 0.5, duration: 10 }],
    '10000060': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000049': [
      { name: 'Enhanced NA', default: 0, value: 1, variance: 0 },
      { name: 'Full Uptime', default: 1, value: 4, variance: 0 },
    ],
    '10000064': [
      { name: 'Skill Press', default: 1, value: 2, variance: 0 },
      { name: 'Hold Level 1', default: 0, value: 2.5, variance: 1 / 5 },
      { name: 'Hold Level 2', default: 0, value: 3, variance: 0 },
    ],
    '10000030': [{ name: 'Skill (Hit)', default: 1, value: 0, variance: 0.5, pps: 0.25, duration: 30 }],
    '10000096': [{ name: 'Skill Cast', default: 1, value: 5, variance: 0 }],
    '10000097': [{ name: 'Skill Cast', default: 1, value: 2, variance: 0 }],
    '10000095': [{ name: 'Skill Cast', default: 1, value: 4, variance: 0 }],
    '10000098': [
      { name: 'Shot/Lunge Hit', default: 0, value: 1, variance: 0 },
      { name: 'Full Uptime', default: 1, value: 4, variance: 0 },
    ],
    '10000099': [
      { name: 'Skill Cast', default: 1, value: 0, variance: 0, pps: 7 / 22, duration: 22 },
      { name: 'Burst Cast', default: 1, value: -1, variance: 0 },
    ],
    '10000100': [
      { name: 'Skill Hit', default: 0, value: 2 / 3, variance: 2 / 3 },
      { name: 'Unmount', default: 1, value: 0, variance: 0.5, pps: 1 / 3, duration: 12 },
      { name: 'Mount', default: 0, value: 4, variance: 0.5 },
    ],
    '10000102': [{ name: `Skill Cast`, default: 1, value: 4.5, variance: 1 / 9 }],
    '10000101': [{ name: `Skill Cast`, default: 1, value: 5, variance: 0 }],
    '10000103': [{ name: `Skill Cast`, default: 1, value: 4, variance: 0 }],
    '10000104': [{ name: `Skill Cast`, default: 1, value: 5, variance: 0 }],
    '10000105': [{ name: `Skill Cast`, default: 1, value: 3, variance: 0 }],
  }[id])
