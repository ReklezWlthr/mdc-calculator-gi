import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xiangling = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      title: `Dough-Fu`,
      content: `<b>Normal Attack</b>
      <br />Performs up to five consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Guoba Attack`,
      content: `Summons Guoba, who will continuously breathe fire at opponents, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      `,
    },
    burst: {
      title: `Pyronado`,
      content: `Displaying her mastery over both fire and polearms, Xiangling sends a Pyronado whirling around her. The Pyronado will move with your character for the ability's duration, dealing <b class="text-genshin-pyro">Pyro DMG</b> to all opponents in its path.
      `,
    },
    a1: {
      title: `A1: Crossfire`,
      content: `Increases the flame range of Guoba by <span class="text-desc">20%</span>.`,
    },
    a4: {
      title: `A4: Beware, It's Super Hot!`,
      content: `When Guoba Attack's effects end, Guoba leaves a chili pepper on the spot where it disappeared. Picking up a chili pepper increases ATK by <span class="text-desc">10%</span> for <span class="text-desc">10</span>s.`,
    },
    util: {
      title: `Chef de Cuisine`,
      content: `When Xiangling cooks an ATK-boosting dish perfectly, she has a <span class="text-desc">12%</span> chance to receive double the product.`,
    },
    c1: {
      title: `C1: Crispy Outside, Tender Inside`,
      content: `Opponents hit by Guoba's attacks have their <b class="text-genshin-pyro">Pyro RES</b> reduced by 15% for 6s.`,
    },
    c2: {
      title: `C2: Oil Meets Fire`,
      content: `The last attack in a Normal Attack sequence applies the Implode status onto the opponent for <span class="text-desc">2</span>s. An explosion will occur once this duration ends, dealing <span class="text-desc">75%</span> of Xiangling's ATK as <b class="text-genshin-pyro">AoE Pyro DMG</b>.`,
    },
    c3: {
      title: `C3: Deepfry`,
      content: `Increases the Level of Pyronado by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Slowbake`,
      content: `Pyronado's duration is increased by <span class="text-desc">40%</span>.`,
    },
    c5: {
      title: `C5: Guoba Mad`,
      content: `Increases the Level of Guoba Attack by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Condensed Pyronado`,
      content: `For the duration of Pyronado, all party members receive a <span class="text-desc">15%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'xl_a4',
      text: `A4 Pepper ATK Buff`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xl_c1',
      text: `C1 Pyro RES Shred`,
      ...talents.c1,
      show: c >= 1,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'xl_c6',
      text: `C6 Pyro DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'xl_a4'),
    findContentById(content, 'xl_c1'),
    findContentById(content, 'xl_c6'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4205, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4214, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2606, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x4]',
          value: [{ scaling: calcScaling(0.141, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.7104, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.2169, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Flame DMG',
          value: [{ scaling: calcScaling(1.1128, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: '1-Hit Swing DMG',
          value: [{ scaling: calcScaling(0.72, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: '2-Hit Swing DMG',
          value: [{ scaling: calcScaling(0.88, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: '3-Hit Swing DMG',
          value: [{ scaling: calcScaling(1.096, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Pyronado DMG',
          value: [{ scaling: calcScaling(1.12, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.xl_a4) base[Stats.P_ATK] += 0.1
      if (form.xl_c1) base.PYRO_RES_PEN += 0.15
      if (form.xl_c6) base[Stats.PYRO_DMG] += 0.15

      if (c >= 2)
        base.BASIC_SCALING.push({
          name: 'C2 Explosion DMG',
          value: [{ scaling: 0.75, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.ADD,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xl_a4) base[Stats.P_ATK] += 0.1
      if (form.xl_c1) base.PYRO_RES_PEN += 0.15
      if (form.xl_c6) base[Stats.PYRO_DMG] += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Xiangling
