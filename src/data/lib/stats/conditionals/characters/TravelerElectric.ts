import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerElectric = (c: number, a: number, t: ITalentLevel, team: ITeamChar[], gender: string) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const lumine = gender === 'PlayerGirl'

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Foreign Thundershock`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Lightning Blade`,
      content: `Unleashes three swift thunder shadows that deal <b class="text-genshin-electro">Electro DMG</b> to opponents and leave an <b class="text-violet-300">Abundance Amulet</b> behind after hitting an opponent.
      <br /><span class="text-desc">2</span> <b class="text-violet-300">Abundance Amulets</b> can be created initially. Using this skill will reset any <b class="text-violet-300">Abundance Amulets</b> that were generated.
      <br />
      <br /><b class="text-violet-300">Abundance Amulets</b>
      <br />When a character is near an <b class="text-violet-300">Abundance Amulets</b>, they will absorb it and obtain the following effects:
      <br />- Restores Elemental Energy
      <br />- Increases Energy Recharge during the <b class="text-violet-300">Abundance Amulets</b>'s duration.
      `,
      image: 'Skill_S_PlayerElectric_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Bellowing Thunder	`,
      content: `You call upon the protection of lightning, knocking nearby opponents back and dealing <b class="text-genshin-electro">Electro DMG</b> to them.
      <br />
      <br /><b>Lightning Shroud</b>
      <br />When your active character's Normal or Charged Attacks hit opponents, they will call <b>Falling Thunder</b> forth, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />When <b>Falling Thunder</b> hits opponents, it will regenerate Energy for that character.
      <br />One instance of <b>Falling Thunder</b> can be generated every <span class="text-desc">0.5</span>s.`,
      image: 'Skill_E_PlayerElectric_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Thunderflash`,
      content: `When another nearby character in the party obtains an <b class="text-violet-300">Abundance Amulet</b> created by <b>Lightning Blade</b>, <b>Lightning Blade</b>'s CD is decreased by <span class="text-desc">1.5</span>s.`,
      image: 'UI_Talent_S_PlayerElectric_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Resounding Roar`,
      content: `Increases the Energy Recharge effect granted by <b>Lightning Blade</b>'s <b class="text-violet-300">Abundance Amulet</b> by <span class="text-desc">10%</span> of the Traveler's Energy Recharge.`,
      image: 'UI_Talent_S_PlayerElectric_06',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Spring Thunder of Fertility`,
      content: `The number of <b class="text-violet-300">Abundance Amulets</b> that can be generated using <b>Lightning Blade</b> is increased to <span class="text-desc">3</span>.`,
      image: 'UI_Talent_S_PlayerElectric_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Violet Vehemence`,
      content: `When <b>Falling Thunder</b> created by <b>Bellowing Thunder</b> hits an opponent, it will decrease their <b class="text-genshin-electro">Electro RES</b> by <span class="text-desc">15%</span> for <span class="text-desc">8</span>s.
      `,
      image: 'UI_Talent_S_PlayerElectric_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Distant Crackling`,
      content: `Increases the Level of <b>Bellowing Thunder</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerElectric_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Fickle Cloudstrike`,
      content: `When a character obtains <b class="text-violet-300">Abundance Amulets</b> generated by <b>Lightning Blade</b>, if this character's Energy is less than <span class="text-desc">35%</span>, the Energy restored by the <b class="text-violet-300">Abundance Amulets</b> is increased by <span class="text-desc">100%</span>.`,
      image: 'UI_Talent_S_PlayerElectric_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Clamor in the Wilds`,
      content: `Increases the Level of <b>Lightning Blade</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerElectric_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `World-Shaker`,
      content: `Every <span class="text-desc">2</span> <b>Falling Thunder</b> attacks triggered by <b>Bellowing Thunder</b> will significantly increase the DMG dealt by the next <b>Falling Thunder</b>, dealing <span class="text-desc">200%</span> of its original DMG, and will restore an additional <span class="text-desc">1</span> Energy to the current character.`,
      image: 'UI_Talent_S_PlayerElectric_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'amulet',
      text: `Abundance Amulet Absorption`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'emc_c2',
      text: `C2 Electro RES Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'amulet'), findContentById(content, 'emc_c2')]

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
          value: [{ scaling: calcScaling(0.445, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.53, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.583, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.708, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.559, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(lumine ? 0.722 : 0.607, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.7866, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.144, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Falling Thunder DMG',
          value: [{ scaling: calcScaling(0.328, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.emc_c2) base.ELECTRO_RES_PEN.push({ value: 0.15, name: 'Constellation 2', source: `Self` })

      if (c >= 6)
        base.BURST_SCALING.push({
          name: 'Third Falling Thunder DMG',
          value: [{ scaling: calcScaling(0.328, burst, 'elemental', '1') * 2, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.emc_c2) base.ELECTRO_RES_PEN.push({ value: 0.15, name: 'Constellation 2', source: `Traveler` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.amulet)
        base.CALLBACK.push(function (x, all) {
          const index = _.findIndex(team, (item) => _.includes(item.cId, '10000005'))
          _.forEach(all, (m, i) => {
            m[Stats.ER].push({
              value: 0.2 + (a >= 4 ? x.getValue(Stats.ER) * 0.1 : 0),
              name: 'Abundance Amulet',
              source: index === i ? `Self` : 'Traveler',
            })
          })
          return x
        })

      return base
    },
  }
}

export default TravelerElectric
