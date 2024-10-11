import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Klee = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Kaboom!`,
      content: `<b>Normal Attack</b>
      <br />Throws things that go boom when they hit things! Performs up to 3 explosive attacks, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina and deals <b class="text-genshin-pyro">AoE Pyro DMG</b> to opponents after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the power of Pyro, Klee plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-pyro">AoE Pyro DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Jumpy Dumpty`,
      content: `Jumpy Dumpty is tons of boom-bang-fun!
      <br />When thrown, Jumpy Dumpty bounces thrice, igniting and dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> with every bounce.
      <br />
      <br />On the third bounce, the bomb splits into many mines.
      <br />The mines will explode upon contact with opponents, or after a short period of time, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />
      <br />Starts with <span class="text-desc">2</span> charges.
      `,
      image: 'Skill_S_Klee_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Sparks 'n' Splash`,
      content: `Klee's Blazing Delight! For the duration of this ability, continuously summons <b>Sparks 'n' Splash</b> to attack nearby opponents, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.`,
      image: 'Skill_E_Klee_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Pounding Surprise`,
      content: `When <b>Jumpy Dumpty</b> and Normal Attacks deal DMG, Klee has a <span class="text-desc">50%</span> chance to obtain an <b class="text-genshin-pyro">Explosive Spark</b>. This <b class="text-genshin-pyro">Explosive Spark</b> is consumed by the next Charged Attack, which costs no Stamina and deals <span class="text-desc">50%</span> increased DMG.`,
      image: 'UI_Talent_S_Klee_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Sparkling Burst`,
      content: `When Klee's Charged Attack results in a CRIT Hit, all party members gain <span class="text-desc">2</span> Elemental Energy.`,
      image: 'UI_Talent_S_Klee_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `All Of My Treasures!`,
      content: `Displays the location of nearby resources unique to Mondstadt on the mini-map.`,
      image: 'UI_Talent_Collect_Local_Mengde',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Chained Reactions`,
      content: `Attacks and Skills have a certain chance to summon sparks that bombard opponents, dealing DMG equal to <span class="text-desc">120%</span> of <b>Sparks 'n' Splash</b>'s DMG.`,
      image: 'UI_Talent_S_Klee_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Explosive Frags`,
      content: `Being hit by <b>Jumpy Dumpty</b>'s mines decreases opponents' DEF by <span class="text-desc">23%</span> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Klee_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Exquisite Compound`,
      content: `Increases the Level of <b>Jumpy Dumpty</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Klee_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sparkly Explosion`,
      content: `If Klee leaves the field during the duration of <b>Sparks 'n' Splash</b>, her departure triggers an explosion that deals <span class="text-desc">555%</span> of her ATK as <b class="text-genshin-pyro">AoE Pyro DMG</b>.`,
      image: 'UI_Talent_S_Klee_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Nova Burst`,
      content: `Increases the Level of <b>Sparks 'n' Splash</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Klee_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Blazing Delight`,
      content: `While under the effects of <b>Sparks 'n' Splash</b>, Klee will regenerate <span class="text-desc">3</span> Energy for all members of the party (excluding Klee) every <span class="text-desc">3</span>s.
      <br />When <b>Sparks 'n' Splash</b> is used, all party members will gain a <span class="text-desc">10%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> for <span class="text-desc">25</span>s.`,
      image: 'UI_Talent_S_Klee_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'klee_a1',
      text: `Explosive Spark`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'klee_c2',
      text: `C2 Skill DEF Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'klee_c6',
      text: `C6 Pyro DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'klee_c2'), findContentById(content, 'klee_c6')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.7216, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.624, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.8992, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.5736, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
          bonus: form.klee_a1 ? 0.5 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.PYRO)
      base.SKILL_SCALING = [
        {
          name: 'Jumpy Dumpty DMG',
          value: [{ scaling: calcScaling(0.952, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Mine DMG',
          value: [{ scaling: calcScaling(0.328, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Sparks 'n' Splash DMG`,
          value: [{ scaling: calcScaling(0.4264, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (c >= 1)
        base.SKILL_SCALING.push({
          name: `C1 Spark DMG`,
          value: [{ scaling: calcScaling(0.4264, burst, 'elemental', '1') * 1.2, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        })
      if (c >= 4)
        base.SKILL_SCALING.push({
          name: `C4 Departure Explosion DMG`,
          value: [{ scaling: 5.55, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.ADD,
        })

      if (form.klee_c2) base.DEF_REDUCTION.push({ value: 0.23, name: 'Constellation 2', source: `Self` })
      if (form.klee_c6) base[Stats.PYRO_DMG].push({ value: 0.1, name: 'Constellation 6', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.klee_c6) base[Stats.PYRO_DMG].push({ value: 0.1, name: 'Constellation 2', source: `Klee` })
      if (form.klee_c2) base.DEF_REDUCTION.push({ value: 0.23, name: 'Constellation 6', source: `Klee` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Klee
