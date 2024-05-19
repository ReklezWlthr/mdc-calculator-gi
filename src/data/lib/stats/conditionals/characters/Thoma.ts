import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Thoma = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Swiftshatter Spear`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Blazing Blessing`,
      content: `Thoma vaults forward with his polearm and delivers a flame-filled flying kick that deals <b class="text-genshin-pyro">AoE Pyro DMG</b>, while also summoning a defensive Blazing Barrier. At the moment of casting, Thoma's Elemental Skill applies <b class="text-genshin-pyro">Pyro</b> to himself.
      <br />The DMG Absorption of the Blazing Barrier scales off Thoma's Max HP.
      <br />The Blazing Barrier has the following traits:
      <br />- Absorbs <b class="text-genshin-pyro">Pyro DMG</b> <span class="text-desc">250%</span> more effectively.
      <br />- When a new Blazing Barrier is obtained, the remaining DMG Absorption of an existing Blazing Barrier will stack and its duration will be refreshed.
      <br />
      <br />The maximum DMG Absorprtion of the Blazing Barrier will not exceed a certain percentage of Thoma's Max HP.
      `,
    },
    burst: {
      title: `Crimson Ooyoroi`,
      content: `Thoma spins his polearm, slicing at his foes with roaring flames that deal <b class="text-genshin-pyro">AoE Pyro DMG</b> and weave themselves into a Scorching Ooyoroi.
      <br />
      <br /><b>Scorching Ooyoroi</b>
      <br />While Scorching Ooyoroi is in effect, the active character's Normal Attacks will trigger Fiery Collapse, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> and summoning a Blazing Barrier.
      <br />Fiery Collapse can be triggered once every <span class="text-desc">1</span>s.
      <br />
      <br />Except for the amount of DMG they can absorb, the Blazing Barriers created in this way are identical to those created by Thoma's Elemental Skill, Blazing Blessing:
      <br />- Absorbs <b class="text-genshin-pyro">Pyro DMG</b> <span class="text-desc">250%</span> more effectively.
      <br />- When a new Blazing Barrier is obtained, the remaining DMG Absorption of an existing Blazing Barrier will stack and its duration will be refreshed.
      <br />
      <br />The maximum DMG Absorption of the Blazing Barrier will not exceed a certain percentage of Thoma's Max HP.
      <br />
      <br />If Thoma falls, the effects of Scorching Ooyoroi will be cleared.
      `,
    },
    a1: {
      title: `A1: Imbricated Armor`,
      content: `When your current active character obtains or refreshes a Blazing Barrier, this character's Shield Strength will increase by <span class="text-desc">5%</span> for <span class="text-desc">6</span>s.
      <br />This effect can be triggered once every <span class="text-desc">0.3</span> seconds. Max <span class="text-desc">5</span> stacks.`,
    },
    a4: {
      title: `A4: Flaming Assault`,
      content: `DMG dealt by Crimson Ooyoroi's Fiery Collapse is increased by <span class="text-desc">2.2%</span> of Thoma's Max HP.`,
    },
    util: {
      title: `Snap and Swing`,
      content: `When you fish successfully in Inazuma, Thoma's help grants a <span class="text-desc">20%</span> chance of scoring a double catch.`,
    },
    c1: {
      title: `C1: A Comrade's Duty`,
      content: `When a character protected by Thoma's own Blazing Barrier (Thoma excluded) is attacked, Thoma's own Blazing Blessing CD is decreased by <span class="text-desc">3</span>s, while his own Crimson Ooyoroi's CD is decreased by <span class="text-desc">3</span>s.
      <br />This effect can be triggered once every <span class="text-desc">20</span>s.`,
    },
    c2: {
      title: `C2: A Subordinate's Skills`,
      content: `Crimson Ooyoroi's duration is increased by <span class="text-desc">3</span>s.`,
    },
    c3: {
      title: `C3: Fortified Resolve`,
      content: `Increases the Level of Blazing Blessing by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Long-Term Planning`,
      content: `After using Crimson Ooyoroi, <span class="text-desc">15</span> Energy will be restored to Thoma.`,
    },
    c5: {
      title: `C5: Raging Wildfire`,
      content: `Increases the Level of Crimson Ooyoroi by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Burning Heart`,
      content: `When a Blazing Barrier is obtained or refreshed, the DMG dealt by all party members' Normal, Charged, and Plunging Attacks is increased by <span class="text-desc">15%</span> for <span class="text-desc">6</span>s.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'a1_shield',
      text: `A1 Shield Strength Buff`,
      ...talents.a1,
      show: a >= 1,
      default: 0,
      min: 0,
      max: 5,
    },
    {
      type: 'toggle',
      id: 'thoma_c6',
      text: `C6 DMG Buffs`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'a1_shield'), findContentById(content, 'thoma_c6')]

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
          value: [{ scaling: calcScaling(0.4439, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4363, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.2679, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6736, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.1275, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.464, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.072, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(693.3, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Max Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.196, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1887, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      const a4Dmg = a >= 4 ? [{ scaling: 0.022, multiplier: Stats.HP }] : []
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.88, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Fiery Collapse DMG',
          value: [{ scaling: calcScaling(0.58, burst, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Dmg],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.0114, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(110, burst, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]

      if (form.a1_shield) base[Stats.SHIELD] += 0.05 * form.a1_shield
      if (form.thoma_c6) {
        base.BASIC_DMG += 0.15
        base.CHARGE_DMG += 0.15
        base.PLUNGE_DMG += 0.15
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.a1_shield) base[Stats.SHIELD] += 0.05 * form.a1_shield
      if (form.thoma_c6) {
        base.BASIC_DMG += 0.15
        base.CHARGE_DMG += 0.15
        base.PLUNGE_DMG += 0.15
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Thoma
