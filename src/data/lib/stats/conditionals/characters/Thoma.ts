import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
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
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Blazing Blessing`,
      content: `Thoma vaults forward with his polearm and delivers a flame-filled flying kick that deals <b class="text-genshin-pyro">AoE Pyro DMG</b>, while also summoning a defensive <b class="text-red">Blazing Barrier</b>. At the moment of casting, Thoma's Elemental Skill applies <b class="text-genshin-pyro">Pyro</b> to himself.
      <br />The DMG Absorption of the <b class="text-red">Blazing Barrier</b> scales off Thoma's Max HP.
      <br />The <b class="text-red">Blazing Barrier</b> has the following traits:
      <br />- Absorbs <b class="text-genshin-pyro">Pyro DMG</b> <span class="text-desc">250%</span> more effectively.
      <br />- When a new <b class="text-red">Blazing Barrier</b> is obtained, the remaining DMG Absorption of an existing <b class="text-red">Blazing Barrier</b> will stack and its duration will be refreshed.
      <br />
      <br />The maximum DMG Absorprtion of the <b class="text-red">Blazing Barrier</b> will not exceed a certain percentage of Thoma's Max HP.
      `,
      image: 'Skill_S_Tohma_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Crimson Ooyoroi`,
      content: `Thoma spins his polearm, slicing at his foes with roaring flames that deal <b class="text-genshin-pyro">AoE Pyro DMG</b> and weave themselves into a <b class="text-genshin-bol">Scorching Ooyoroi</b>.
      <br />
      <br /><b class="text-genshin-bol">Scorching Ooyoroi</b>
      <br />While <b class="text-genshin-bol">Scorching Ooyoroi</b> is in effect, the active character's Normal Attacks will trigger <b>Fiery Collapse</b>, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> and summoning a <b class="text-red">Blazing Barrier</b>.
      <br /><b>Fiery Collapse</b> can be triggered once every <span class="text-desc">1</span>s.
      <br />
      <br />Except for the amount of DMG they can absorb, the <b class="text-red">Blazing Barriers</b> created in this way are identical to those created by Thoma's Elemental Skill, <b>Blazing Blessing</b>:
      <br />- Absorbs <b class="text-genshin-pyro">Pyro DMG</b> <span class="text-desc">250%</span> more effectively.
      <br />- When a new <b class="text-red">Blazing Barrier</b> is obtained, the remaining DMG Absorption of an existing <b class="text-red">Blazing Barrier</b> will stack and its duration will be refreshed.
      <br />
      <br />The maximum DMG Absorption of the <b class="text-red">Blazing Barrier</b> will not exceed a certain percentage of Thoma's Max HP.
      <br />
      <br />If Thoma falls, the effects of <b class="text-genshin-bol">Scorching Ooyoroi</b> will be cleared.
      `,
      image: 'Skill_E_Tohma_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Imbricated Armor`,
      content: `When your current active character obtains or refreshes a <b class="text-red">Blazing Barrier</b>, this character's Shield Strength will increase by <span class="text-desc">5%</span> for <span class="text-desc">6</span>s.
      <br />This effect can be triggered once every <span class="text-desc">0.3</span> seconds. Max <span class="text-desc">5</span> stacks.`,
      image: 'UI_Talent_S_Tohma_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Flaming Assault`,
      content: `DMG dealt by <b>Crimson Ooyoroi</b>'s <b>Fiery Collapse</b> is increased by <span class="text-desc">2.2%</span> of Thoma's Max HP.`,
      image: 'UI_Talent_S_Tohma_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Snap and Swing`,
      content: `When you fish successfully in Inazuma, Thoma's help grants a <span class="text-desc">20%</span> chance of scoring a double catch.`,
      image: 'UI_Talent_S_Tohma_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `A Comrade's Duty`,
      content: `When a character protected by Thoma's own Blazing Barrier (Thoma excluded) is attacked, Thoma's own <b>Blazing Blessing</b> CD is decreased by <span class="text-desc">3</span>s, while his own <b>Crimson Ooyoroi</b>'s CD is decreased by <span class="text-desc">3</span>s.
      <br />This effect can be triggered once every <span class="text-desc">20</span>s.`,
      image: 'UI_Talent_S_Tohma_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `A Subordinate's Skills`,
      content: `<b>Crimson Ooyoroi</b>'s duration is increased by <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Tohma_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Fortified Resolve`,
      content: `Increases the Level of <b>Blazing Blessing</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Tohma_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Long-Term Planning`,
      content: `After using <b>Crimson Ooyoroi</b>, <span class="text-desc">15</span> Energy will be restored to Thoma.`,
      image: 'UI_Talent_S_Tohma_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Raging Wildfire`,
      content: `Increases the Level of <b>Crimson Ooyoroi</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Tohma_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Burning Heart`,
      content: `When a <b class="text-red">Blazing Barrier</b> is obtained or refreshed, the DMG dealt by all party members' Normal, Charged, and Plunging Attacks is increased by <span class="text-desc">15%</span> for <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Tohma_04',
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
    allyContent: [],
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

      if (form.a1_shield)
        base[Stats.SHIELD].push({ value: 0.05, name: 'Ascension 1 Passive', source: `Self` }) * form.a1_shield
      if (form.thoma_c6) {
        base.BASIC_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Self` })
        base.CHARGE_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Self` })
        base.PLUNGE_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.a1_shield)
        base[Stats.SHIELD].push({ value: 0.05, name: 'Ascension 1 Passive', source: `Thoma` }) * form.a1_shield
      if (form.thoma_c6) {
        base.BASIC_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Thoma` })
        base.CHARGE_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Thoma` })
        base.PLUNGE_DMG.push({ value: 0.15, name: 'Constellation 6', source: `Thoma` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Thoma
