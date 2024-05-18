import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yunjin = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const uniqueCount = _.uniq(teamData).length

  const talents: ITalent = {
    normal: {
      title: `Cloud-Grazing Strike`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Opening Flourish`,
      content: `Ms. Yun may just be acting out fights on stage, but her skills with the spear are real enough to defend against her foes.
      <br />
      <br /><b>Press</b>
      <br />Flourishes her polearm in a cloud-grasping stance, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />Takes up the Opening Flourish stance and charges up, forming a shield. DMG Absorption is based on Yun Jin's Max HP and has <span class="text-desc">150%</span> effectiveness against all <b>Elemental DMG</b> and <b>Physical DMG</b>. The shield lasts until she finishes unleashing her Elemental Skill.
      <br />When the skill is released, when its duration ends, or when the shield breaks, Yun Jin will unleash the charged energy as an attack, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />Based on the time spent charging, it will either unleash an attack at Charge Level 1 or Level 2.`,
    },
    burst: {
      title: `Cliffbreaker's Banner`,
      content: `Deals <b class="text-genshin-geo">AoE Geo DMG</b> and grants all nearby party members a Flying Cloud Flag Formation.
      <br />
      <br /><b>Flying Cloud Flag Formation</b>
      <br />When Normal Attack DMG is dealt to opponents, Bonus DMG will be dealt based on Yun Jin's current DEF.
      <br />
      <br />The effects of this skill will be cleared after a set duration or after being triggered a specific number of times.
      <br />When one Normal Attack hits multiple opponents, the effect is triggered multiple times according to the number of opponents hit. The number of times that the effect is triggered is counted independently for each member of the party with Flying Cloud Flag Formation.`,
    },
    a1: {
      title: `A1: True to Oneself`,
      content: `While affected by the Adeptal Legacy state caused by Moonjade Descent, Yaoyao will constantly throw White Jade Radishes at nearby opponents when she is sprinting, jumping, or running. She can throw <span class="text-desc">1</span> White Jade Radish this way once every <span class="text-desc">0.6</span>s.`,
    },
    a4: {
      title: `A4: Breaking Conventions`,
      content: `The Normal Attack DMG Bonus granted by Flying Cloud Flag Formation is further increased by <span class="text-desc">2.5%/5%/7.5%/11.5%</span> of Yun Jin's DEF when the party contains characters of <span class="text-desc">1/2/3/4</span> Elemental Types, respectively.`,
    },
    util: {
      title: `Light Nourishment`,
      content: `When Perfect Cooking is achieved on Food with Adventure-related effects, there is a <span class="text-desc">12%</span> chance to obtain double the product.`,
    },
    c1: {
      title: `C1: Thespian Gallop`,
      content: `Opening Flourish's CD is decreased by <span class="text-desc">18%</span>.`,
    },
    c2: {
      title: `C2: Myriad Mise-En-Scène`,
      content: `After Cliffbreaker's Banner is unleashed, all nearby party members' Normal Attack DMG is increased by <span class="text-desc">15%</span> for <span class="text-desc">12</span>s.`,
    },
    c3: {
      title: `C3: Seafaring General`,
      content: `Increases the Level of Cliffbreaker's Banner by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Flower and a Fighter`,
      content: `When Yun Jin triggers the Crystallize Reaction, her DEF is increased by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s.`,
    },
    c5: {
      title: `C5: Famed Throughout the Land`,
      content: `Increases the Level of Opening Flourish by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Decorous Harmony`,
      content: `Characters under the effects of the Flying Cloud Flag Formation have their Normal ATK SPD increased by <span class="text-desc">12%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'yunjin_burst',
      text: `Flying Cloud Flag Formation`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'yunjin_c4',
      text: `C4 DEF Increase`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'yunjin_burst')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4051, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4025, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.2296, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.2752, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [1]',
          value: [{ scaling: calcScaling(0.2399, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [2]',
          value: [{ scaling: calcScaling(0.2881, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.6734, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.1269, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(1.4912, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 1 DMG',
          value: [{ scaling: calcScaling(2.6096, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 2 DMG',
          value: [{ scaling: calcScaling(3.728, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.12, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1155, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.44, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (c >= 1) base.SKILL_CD_RED += 0.18
      if (form.yunjin_burst) {
        if (c >= 2) base.BASIC_DMG += 0.15
        if (c >= 6) base.ATK_SPD += 0.12
      }
      if (form.yunjin_c4) base[Stats.P_DEF] += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      const a4Bonus = a >= 4 ? uniqueCount * 0.025 + (uniqueCount === 4 ? 0.015 : 0) : 0
      if (form.yunjin_burst) {
        base.BASIC_F_DMG += (calcScaling(0.3216, burst, 'elemental', '1') + a4Bonus) * own.getDef()
        if (c >= 2) base.BASIC_DMG += 0.15
        if (c >= 6) base.ATK_SPD += 0.12
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const a4Bonus = a >= 4 ? uniqueCount * 0.025 + (uniqueCount === 4 ? 0.015 : 0) : 0
      if (form.yunjin_burst)
        base.BASIC_F_DMG += (calcScaling(0.3216, burst, 'elemental', '1') + a4Bonus) * base.getDef()

      return base
    },
  }
}

export default Yunjin
