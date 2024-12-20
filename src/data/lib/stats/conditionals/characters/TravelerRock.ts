import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerRock = (c: number, a: number, t: ITalentLevel, _team: ITeamChar[], gender: string) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const lumine = gender === 'PlayerGirl'

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Foreign Rockblade`,
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
      title: `Starfell Sword`,
      content: `You disgorge a meteorite from the depths of the earth, dealing <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />The meteorite is considered a <b class="text-genshin-geo">Geo Construct</b>, and can be climbed or used to block attacks.
      <br />
      <br /><b>Hold</b>
      <br />This skill's positioning may be adjusted.
      `,
      image: 'Skill_S_PlayerRock_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Wake of Earth`,
      content: `Energizing the Geo deep underground, you set off expanding shockwaves.
      <br />Launches surrounding opponents back and deals <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />A stone wall is erected at the edges of the shockwave.
      <br />The stone wall is considered a <b class="text-genshin-geo">Geo Construct</b>, and may be used to block attacks.`,
      image: 'Skill_E_PlayerRock_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Shattered Darkrock`,
      content: `Reduces <b>Starfell Sword</b>'s CD by <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_PlayerRock_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Frenzied Rockslide`,
      content: `The final hit of a Normal Attack combo triggers a collapse, dealing <span class="text-desc">60%</span> of ATK as <b class="text-genshin-geo">AoE Geo DMG</b>.`,
      image: 'UI_Talent_S_PlayerRock_06',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Invincible Stonewall`,
      content: `Party members within the radius of <b>Wake of Earth</b> have their CRIT Rate increased by <span class="text-desc">10%</span> and have increased resistance against interruption.`,
      image: 'UI_Talent_S_PlayerRock_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Rockcore Meltdown`,
      content: `When the meteorite created by <b>Starfell Sword</b> is destroyed, it will also explode, dealing additional <b class="text-genshin-geo">AoE Geo DMG</b> equal to the amount of damage dealt by <b>Starfell Sword</b>.`,
      image: 'UI_Talent_S_PlayerRock_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Will of the Rock`,
      content: `Increases the Level of <b>Wake of Earth</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerRock_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Reaction Force`,
      content: `The shockwave triggered by <b>Wake of Earth</b> regenerates <span class="text-desc">5</span> Energy for every opponent hit.
      <br />A maximum of <span class="text-desc">25</span> Energy can be regenerated in this manner at any one time.`,
      image: 'UI_Talent_S_PlayerRock_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Meteorite Impact`,
      content: `Increases the Level of <b>Starfell Sword</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerRock_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Everlasting Boulder`,
      content: `The barrier created by <b>Wake of Earth</b> lasts <span class="text-desc">5</span>s longer.
      <br />The meteorite created by <b>Starfell Sword</b> lasts <span class="text-desc">10</span>s longer.`,
      image: 'UI_Talent_S_PlayerRock_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'gmc_c1',
      text: `C1 CRIT Rate Buff`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'gmc_c1')]

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
          value: [{ scaling: calcScaling(2.48, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Shockwave DMG',
          value: [{ scaling: calcScaling(1.48, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
          hit: 4,
        },
      ]

      if (a >= 4)
        base.BASIC_SCALING.push({
          name: 'A4 Collapse DMG',
          value: [{ scaling: 0.6, multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.NA,
        })

      if (form.gmc_c1) base[Stats.CRIT_RATE].push({ value: 0.1, name: 'Constellation 1', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.gmc_c1) base[Stats.CRIT_RATE].push({ value: 0.1, name: 'Constellation 1', source: `Traveler` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default TravelerRock
