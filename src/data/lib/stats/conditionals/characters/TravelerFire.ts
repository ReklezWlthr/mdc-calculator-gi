import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerFire = (c: number, a: number, t: ITalentLevel, _team: ITeamChar[], gender: string) => {
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
      title: `Foreign Blaze`,
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
      title: `Flowfire Blade`,
      content: `Wields a searing flame that can incinerate the very earth. Has different effects when Tapped or Held.
      <br />
      <br /><b>Tap</b>
      <br />Call forth flames in a raging blaze. When used, the Traveler gains <span class="text-desc">42</span> <b class="text-genshin-pyro">Nightsoul</b> points and enters the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state, summoning a <b class="text-red">Blazing Threshold</b> that follows the current active character.
      <br />When the Blazing Threshold gets close to opponents, it will deal Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents at intervals based on the Traveler's ATK.
      <br />
      <br /><b>Hold</b>
      <br />Unleash fire in a composed manner. When used, the Traveler gains <span class="text-desc">42</span> <b class="text-genshin-pyro">Nightsoul</b> points and enters the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state, summoning a <b class="text-red">Scorching Threshold</b> that follows the current active character.
      <br />When the current active character within a <b class="text-red">Scorching Threshold</b> deals DMG to opponents, the <b class="text-red">Threshold</b> will launch a Coordinated Attack that deals Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b> based on the Traveler's ATK. This effect can occur once every <span class="text-desc">3</span>s.
      <br />
      <br /><b>Nightsoul's Blessing: Traveler</b>
      <br />Continuously consumes <b class="text-genshin-pyro">Nightsoul</b> points. The Traveler's <b class="text-genshin-pyro">Nightsoul's Blessing</b> state lasts <span class="text-desc">12</span>s at maximum, and when their <b class="text-genshin-pyro">Nightsoul</b> points are exhausted, or if the skill is used again, this state will end.
      <br /><b class="text-red">Blazing</b> and <b class="text-red">Scorching Thresholds</b> will disappear once the Traveler's <b class="text-genshin-pyro">Nightsoul's Blessing</b> state ends, and <span class="text-desc">1</span> <b class="text-red">Blazing</b> and <b class="text-red">Scorching Thresholds</b> summoned by the Traveler themselves can exist at any one time.
      `,
      image: 'Skill_S_PlayerFire_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Plains Scorcher`,
      content: `Condense the flames into a mark, dealing Nightsoul-aligned <b class="text-genshin-pyro">AoE Pyro DMG</b> to opponents up ahead. Within the next <span class="text-desc">4</span>s, the Traveler restores <span class="text-desc">7</span> <b class="text-genshin-pyro">Nightsoul</b> points per second.`,
      image: 'Skill_E_PlayerFire_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `True Flame of Incineration`,
      content: `When the Traveler has over <span class="text-desc">20</span> <b class="text-genshin-pyro">Nightsoul</b> points, the attack AoE of the <b class="text-red">Blazing</b> and <b class="text-red">Scorching Thresholds</b> from the Elemental Skill <b>Flowfire Blade</b> is increased.`,
      image: 'UI_Talent_S_PlayerFire_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Embers Unspent`,
      content: `After the current active character inside a <b class="text-red">Blazing Threshold</b> or <b class="text-red">Scorching Threshold</b> triggers Burning, Vaporize, Melt, Overloaded, Burgeon, a <b class="text-genshin-pyro">Pyro</b> Swirl or a <b class="text-genshin-pyro">Pyro</b> Crystallize reaction, the Traveler will regain <span class="text-desc">5</span> Energy. This can occur once every <span class="text-desc">12</span>s. Additionally, when a nearby party member triggers a <b>Nightsoul Burst</b>, the Traveler will regain <span class="text-desc">4</span> Energy.`,
      image: 'UI_Talent_S_PlayerFire_06',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Starfire's Flowing Light`,
      content: `While <b class="text-red">Blazing Threshold</b> or <b class="text-red">Scorching Threshold</b> are active, the current active character deals <span class="text-desc">6%</span> increased DMG. If said character is in the <b>Nightsoul's Blessing</b> state, they will deal an additional <span class="text-desc">6%</span> DMG.`,
      image: 'UI_Talent_S_PlayerFire_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Ever-Lit Candle`,
      content: `Within <span class="text-desc">12</span>s after using the Elemental Skill <b>Flowfire Blade</b>, after nearby party members trigger Burning, Vaporize, Melt, Overloaded, Burgeon, a <b class="text-genshin-pyro">Pyro</b> Swirl or a <b class="text-genshin-pyro">Pyro</b> Crystallize reaction on an opponent, the Traveler will regain <span class="text-desc">14</span> <b class="text-genshin-pyro">Nightsoul</b> points. Each use of <b>Flowfire Blade</b> will restore at most <span class="text-desc">28</span> <b class="text-genshin-pyro">Nightsoul</b> points in this way.`,
      image: 'UI_Talent_S_PlayerFire_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Relayed Beacon`,
      content: `Increases the Level of <b>Flowfire Blade</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerFire_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Ravaging Flame`,
      content: `After using the Elemental Burst <b>Plains Scorcher</b>, the Traveler gains <span class="text-desc">20%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> for <span class="text-desc">9</span>s.`,
      image: 'UI_Talent_S_PlayerFire_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Fire Inextinguishable`,
      content: `Increases the Level of <b>Plains Scorcher</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_PlayerFire_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Sacred Flame Imperishable`,
      content: `While in the <b>Nightsoul's Blessing</b> state, the Traveler's Normal, Charged, and Plunging Attacks will be converted to Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b> that cannot be overridden, and their CRIT DMG is increased by <span class="text-desc">40%</span>.`,
      image: 'UI_Talent_S_PlayerFire_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'pmc_c1',
      text: `C1 DMG Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'pmc_c1_2',
      text: `C1 Nightsoul DMG Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'pmc_c4',
      text: `C4 Pyro DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'pmc_c6',
      text: `C6 Pyro Infusion`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'pmc_c1'), findContentById(content, 'pmc_c1_2')],
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
          name: 'Blazing Threshold DMG',
          value: [{ scaling: calcScaling(0.303, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Scorching Threshold Instant DMG',
          value: [{ scaling: calcScaling(0.988, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Scorching Threshold DMG',
          value: [{ scaling: calcScaling(0.916, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(4.232, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.pmc_c1) {
        base[Stats.ALL_DMG].push({
          value: 0.06 * (form.pmc_c1_2 ? 2 : 1),
          name: 'Constellation 1',
          source: 'Self',
        })
      }
      if (form.pmc_c4) {
        base[Stats.PYRO_DMG].push({
          value: 0.2,
          name: 'Constellation 4',
          source: 'Self',
        })
      }
      if (form.pmc_c6) {
        base.infuse(Element.PYRO, true)
        base[Stats.CRIT_DMG].push({
          value: 0.4,
          name: 'Constellation 6',
          source: 'Self',
        })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.pmc_c1) {
        base[Stats.ALL_DMG].push({
          value: 0.06 * (aForm.pmc_c1_2 ? 2 : 1),
          name: 'Constellation 1',
          source: 'Traveler',
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default TravelerFire
