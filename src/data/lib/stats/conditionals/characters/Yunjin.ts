import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Opening Flourish`,
      content: `Ms. Yun may just be acting out fights on stage, but her skills with the spear are real enough to defend against her foes.
      <br />
      <br /><b>Press</b>
      <br />Flourishes her polearm in a cloud-grasping stance, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />Takes up the <b>Opening Flourish</b> stance and charges up, forming a shield. DMG Absorption is based on Yun Jin's Max HP and has <span class="text-desc">150%</span> effectiveness against all <b>Elemental DMG</b> and <b>Physical DMG</b>. The shield lasts until she finishes unleashing her Elemental Skill.
      <br />When the skill is released, when its duration ends, or when the shield breaks, Yun Jin will unleash the charged energy as an attack, dealing <b class="text-genshin-geo">Geo DMG</b>.
      <br />Based on the time spent charging, it will either unleash an attack at <b>Charge Level</b> <span class="text-desc">1</span> or <b>Level</b> <span class="text-desc">2</span>.`,
      image: 'Skill_S_Yunjin_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Cliffbreaker's Banner`,
      content: `Deals <b class="text-genshin-geo">AoE Geo DMG</b> and grants all nearby party members a <b class="text-desc">Flying Cloud Flag Formation</b>.
      <br />
      <br /><b class="text-desc">Flying Cloud Flag Formation</b>
      <br />When Normal Attack DMG is dealt to opponents, Bonus DMG will be dealt based on Yun Jin's current DEF.
      <br />
      <br />The effects of this skill will be cleared after a set duration or after being triggered a specific number of times.
      <br />When one Normal Attack hits multiple opponents, the effect is triggered multiple times according to the number of opponents hit. The number of times that the effect is triggered is counted independently for each member of the party with <b class="text-desc">Flying Cloud Flag Formation</b>.`,
      image: 'Skill_E_Yunjin_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `True to Oneself`,
      content: `Using <b>Opening Flourish</b> at the precise moment when Yun Jin is attacked will unleash its <b>Level</b> <span class="text-desc">2</span> <b>Charged</b> (Hold) form.`,
      image: 'UI_Talent_S_Yunjin_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Breaking Conventions`,
      content: `The Normal Attack DMG Bonus granted by <b class="text-desc">Flying Cloud Flag Formation</b> is further increased by <span class="text-desc">2.5%/5%/7.5%/11.5%</span> of Yun Jin's DEF when the party contains characters of <span class="text-desc">1/2/3/4</span> <b>Elemental Types</b>, respectively.`,
      image: 'UI_Talent_S_Yunjin_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Light Nourishment`,
      content: `When Perfect Cooking is achieved on Food with Adventure-related effects, there is a <span class="text-desc">12%</span> chance to obtain double the product.`,
      image: 'UI_Talent_S_Yunjin_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Thespian Gallop`,
      content: `<b>Opening Flourish</b>'s CD is decreased by <span class="text-desc">18%</span>.`,
      image: 'UI_Talent_S_Yunjin_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Myriad Mise-En-Scène`,
      content: `After <b>Cliffbreaker's Banner</b> is unleashed, all nearby party members' Normal Attack DMG is increased by <span class="text-desc">15%</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Yunjin_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Seafaring General`,
      content: `Increases the Level of <b>Cliffbreaker's Banner</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yunjin_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Flower and a Fighter`,
      content: `When Yun Jin triggers the Crystallize Reaction, her DEF is increased by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Yunjin_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Famed Throughout the Land`,
      content: `Increases the Level of <b>Opening Flourish</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yunjin_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Decorous Harmony`,
      content: `Characters under the effects of the <b class="text-desc">Flying Cloud Flag Formation</b> have their Normal ATK SPD increased by <span class="text-desc">12%</span>.`,
      image: 'UI_Talent_S_Yunjin_04',
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
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

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

      if (c >= 1) base.SKILL_CD_RED.push({ value: 0.18, name: 'Constellation 1', source: `Self` })
      if (form.yunjin_burst) {
        if (c >= 2) base.BASIC_DMG.push({ value: 0.15, name: 'Flying Cloud Flag Formation', source: `Self` })
        if (c >= 6) base.ATK_SPD.push({ value: 0.12, name: 'Flying Cloud Flag Formation', source: `Self` })
      }
      if (form.yunjin_c4) base[Stats.P_DEF].push({ value: 0.2, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yunjin_burst) {
        if (c >= 2) base.BASIC_DMG.push({ value: 0.15, name: 'Flying Cloud Flag Formation', source: `Yunjin` })
        if (c >= 6) base.ATK_SPD.push({ value: 0.12, name: 'Flying Cloud Flag Formation', source: `Yunjin` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>, baseAll: StatsObject[]) => {
      const a4Bonus = a >= 4 ? uniqueCount * 0.025 + (uniqueCount === 4 ? 0.015 : 0) : 0
      const index = _.findIndex(team, (item) => item.cId === '10000064')
      if (form.yunjin_burst)
        _.forEach(baseAll, (item, i) => {
          item.BASIC_F_DMG.push({
            value: (calcScaling(0.3216, burst, 'elemental', '1') + a4Bonus) * baseAll[index].getDef(),
            name: 'Flying Cloud Flag Formation',
            source: index === i ? 'Self' : 'Yunjin',
            base: baseAll[index].getDef(),
            multiplier: toPercentage(calcScaling(0.3216, burst, 'elemental', '1') + a4Bonus),
          })
        })

      return base
    },
  }
}

export default Yunjin
