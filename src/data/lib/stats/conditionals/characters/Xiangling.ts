import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Guoba Attack`,
      content: `Summons Guoba, who will continuously breathe fire at opponents, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      `,
      image: 'Skill_S_Xiangling_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Pyronado`,
      content: `Displaying her mastery over both fire and polearms, Xiangling sends a Pyronado whirling around her. The Pyronado will move with your character for the ability's duration, dealing <b class="text-genshin-pyro">Pyro DMG</b> to all opponents in its path.
      `,
      image: 'Skill_E_Xiangling_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Crossfire`,
      content: `Increases the flame range of Guoba by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Xiangling_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Beware, It's Super Hot!`,
      content: `When Guoba Attack's effects end, Guoba leaves a chili pepper on the spot where it disappeared. Picking up a chili pepper increases ATK by <span class="text-desc">10%</span> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Xiangling_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Chef de Cuisine`,
      content: `When Xiangling cooks an ATK-boosting dish perfectly, she has a <span class="text-desc">12%</span> chance to receive double the product.`,
      image: 'UI_Talent_Cook_Attack',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Crispy Outside, Tender Inside`,
      content: `Opponents hit by Guoba's attacks have their <b class="text-genshin-pyro">Pyro RES</b> reduced by <span class="text-desc">15%</span> for <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Xiangling_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Oil Meets Fire`,
      content: `The last attack in a Normal Attack sequence applies the <b>Implode</b> status onto the opponent for <span class="text-desc">2</span>s. An explosion will occur once this duration ends, dealing <span class="text-desc">75%</span> of Xiangling's ATK as <b class="text-genshin-pyro">AoE Pyro DMG</b>.`,
      image: 'UI_Talent_S_Xiangling_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Deepfry`,
      content: `Increases the Level of <b>Pyronado</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xiangling_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Slowbake`,
      content: `<b>Pyronado</b>'s duration is increased by <span class="text-desc">40%</span>.`,
      image: 'UI_Talent_S_Xiangling_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Guoba Mad`,
      content: `Increases the Level of <b>Guoba Attack</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xiangling_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Condensed Pyronado`,
      content: `For the duration of <b>Pyronado</b>, all party members receive a <span class="text-desc">15%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b>.`,
      image: 'UI_Talent_S_Xiangling_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'xl_a4',
      text: `A4 Pepper ATK Buff`,
      ...talents.a4,
      show: a >= 4,
      default: false,
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

  const teammateContent: IContent[] = [findContentById(content, 'xl_c1'), findContentById(content, 'xl_c6')]

  const allyContent: IContent[] = [findContentById(content, 'xl_a4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent,
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
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.2606, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.141, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 4,
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

      if (form.xl_a4) base[Stats.P_ATK].push({ value: 0.1, name: 'Ascension 4 Passive', source: `Self` })
      if (form.xl_c1) base.PYRO_RES_PEN.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
      if (form.xl_c6) base[Stats.PYRO_DMG].push({ value: 0.15, name: 'Constellation 6', source: `Self` })

      if (c >= 2)
        base.BASIC_SCALING.push({
          name: 'C2 Explosion DMG',
          value: [{ scaling: 0.75, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.ADD,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.xl_a4) base[Stats.P_ATK].push({ value: 0.1, name: 'Ascension 4 Passive', source: `Xiangling` })
      if (form.xl_c1) base.PYRO_RES_PEN.push({ value: 0.15, name: 'Constellation 1', source: `Xiangling` })
      if (form.xl_c6) base[Stats.PYRO_DMG].push({ value: 0.15, name: 'Constellation 6', source: `Xiangling` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Xiangling
