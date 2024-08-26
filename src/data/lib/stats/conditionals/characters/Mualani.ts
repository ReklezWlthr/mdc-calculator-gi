import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Mualani = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Cooling Treatment`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 attacks that deals <b class="text-genshin-hydro">Hydro DMG</b>.
      <br /><br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to smack a Pufferball into the air that deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon landing.
      <br /><br /><b>Plunging Attack</b>
      <br />Gathers the power of Hydro and plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Surfshark Wavebreaker`,
      content: `Combining her mastery of speed and the waves and water, Mualani can surf anytime, anywhere.
      <br />After using this skill, Mualani will gain <span class="text-desc">60</span> <b class="text-genshin-hydro">Nightsoul</b> points and enter the <b class="text-genshin-hydro">Nightsoul's Blessing</b> state.
      <br /><br /><b>Nightsoul's Blessing: Mualani</b>
      <br />Continuously consume Nightsoul points. When they are depleted or when the skill is used again, Mualani's <b class="text-genshin-hydro">Nightsoul's Blessing</b> will end. The state itself has the following traits:
      <br />- Mualani mounts her Sharky Surfboard, increasing Mualani's Movement SPD and interruption resistance. Mualani can move on water and liquid <b class="text-genshin-pyro">Phlogiston</b> while this state is active, and she will take no DMG from the latter.
      <br />- Normal Attacks will be converted to <b>Sharky's Bites</b>, dealing Nightsoul-aligned <b class="text-genshin-hydro">Hydro DMG</b> based on Mualani's Max HP. <b>Sharky's Bites</b> can be used in mid-air. DMG dealt this way is considered Normal Attack DMG.
      <br />- When she makes contact with opponents in this state, Mualani applies <b class="text-genshin-hydro">Marked as Prey</b> to them and gains <span class="text-desc">1</span> <b class="text-genshin-hydro">Wave Momentum</b> stack. Max <span class="text-desc">3</span> stacks. <span class="text-desc">1</span> stack can be gained from the same opponent every <span class="text-desc">0.7</span>s.
      <br /><br /><b class="text-genshin-hydro">Wave Momentum</b> and <b class="text-genshin-hydro">Marked as Prey</b>
      <br />When Mualani uses <b>Sharky's Bite</b>, her DMG dealt increases based on <b class="text-genshin-hydro">Wave Momentum</b> stacks. When she has <span class="text-desc">3</span> stacks, a Normal Attack will use <b>Sharky's Surging Bite</b> instead, further increasing her DMG and removing all her stacks when hitting an opponent.
      <br />When <b>Sharky's Bites</b> hit opponents <b class="text-genshin-hydro">Marked as Prey</b>, that mark will be removed, and she will fire <b>Shark Missiles</b> at up to <span class="text-desc">5</span> nearby opponents <b class="text-genshin-hydro">Marked as Prey</b>, dealing DMG to them equal to this <b>Sharky's Bite</b> instance and clearing their Marks. If more than <span class="text-desc">1</span> opponent is the target of <b>Sharky's Bite</b> and <b>Shark Missiles</b>, the DMG dealt will decrease, decreasing to <span class="text-desc">72%</span> of the original DMG when at least <span class="text-desc">3</span> opponents are targeted.`,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Boomsharka-laka`,
      content: `Fires a Super Shark Missile that can track opponents, dealing Nightsoul-aligned <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Mualani's Max HP.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Heat-Resistant Freshwater Floater`,
      content: `When <b>Sharky's Surging Bite</b> hits an opponent, a <b>Puffer</b> will be generated nearby. Mualani will restore <span class="text-desc">20</span> <b class="text-genshin-hydro">Nightsoul</b> points when she picks up a <b>Puffer</b>. Only <span class="text-desc">2</span> such <b>Puffers</b> can be created in this way during a single instance of being in <b class="text-genshin-hydro">Nightsoul's Blessing</b>.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Natlan's Greatest Guide`,
      content: `After a nearby party member triggers a <b>Nightsoul Burst</b>, Mualani will gain <span class="text-desc">1</span> stack of <b class="text-genshin-hydro">Wavechaser's Exploits</b>, which lasts for <span class="text-desc">20</span>s. Max <span class="text-desc">3</span> stacks. When she uses <b>Boomsharka-laka</b>, Mualani will clear all <b class="text-genshin-hydro">Wavechaser's Exploits</b> stacks and increase the DMG of this Boomsharka-laka by <span class="text-desc">15%/30%/45%</span> of her Max HP based on the number of stacks cleared.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Trick Is to Keep Smiling!`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, <span class="text-desc">15</span> <b class="text-genshin-pyro">Phlogiston</b> will be restored when interacting with some harvestable items. Additionally, the location of nearby resources unique to Natlan will appear on your mini-map.`,
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Night Realm's Gift: Crests and Troughs`,
      content: `After her <b class="text-genshin-hydro">Nightsoul</b> points are depleted, Mualani will switch to consuming <b class="text-genshin-pyro">Phlogiston</b> to maintain her <b class="text-genshin-hydro">Nightsoul's Blessing</b>.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, she can use <b>Nightsoul Transmission: Mualani</b>. When the active character is currently sprinting, swimming, in a movement mode caused by certain Talents, or at a certain height in the air, the following will trigger when switching to Mualani: Mualani will enter the <b class="text-genshin-hydro">Nightsoul's Blessing</b> state and gain <span class="text-desc">40</span> <b class="text-genshin-hydro">Nightsoul</b> points. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own team.
      <br /><br />Additionally, Mualani's <b class="text-genshin-hydro">Nightsoul</b> point or <b class="text-genshin-pyro">Phlogiston</b> consumption while moving on water and Liquid <b class="text-genshin-pyro">Phlogiston</b> during <b class="text-genshin-hydro">Nightsoul's Blessing</b> is decreased by <span class="text-desc">75%</span> while in Natlan, and her <b class="text-genshin-hydro">Nightsoul</b> point consumption is decreased by <span class="text-desc">35%</span> while doing the same outside Natlan.`,
      image: `UI_Talent_S_Mualani_07.png`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Leisurely "Meztli"...`,
      content: `The DMG dealt by the first <b>Sharky's Surging Bite</b> after Mualani enters <b class="text-genshin-hydro">Nightsoul's Blessing</b> and the <b>Shark Missiles</b> it triggers is increased by <span class="text-desc">66%</span> of Mualani's Max HP. This instance of increased DMG is subject to the diminishing DMG rules of <b>Surfshark Wavebreaker</b>.
      <br />In addition, while out of combat, Mualani's <b class="text-genshin-hydro">Nightsoul's Blessing</b> state consumes <span class="text-desc">30%</span> less <b class="text-genshin-pyro">Phlogiston</b> and <b class="text-genshin-hydro">Nightsoul</b> points.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Mualani, Going All Out!`,
      content: `Mualani gains <span class="text-desc">2</span> of <b>Surfshark Wavebreaker</b>'s <b class="text-genshin-hydro">Wave Momentum</b> stacks when she enters <b class="text-genshin-hydro">Nightsoul's Blessing</b> state. She will gain <span class="text-desc">1</span> stack when obtaining a <b>Puffer</b>.
      <br />In addition, whenever Mualani obtains <span class="text-desc">2</span> <b>Puffers</b> within a single instance of the <b class="text-genshin-hydro">Nightsoul's Blessing</b> state, she will recover an additional <span class="text-desc">12</span> <b class="text-genshin-hydro">Nightsoul</b> points over <span class="text-desc">2</span>s. This effect requires the Passive Talent <b>Heat-Resistant Freshwater Floater</b> to be unlocked first.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Surfing Atop Joyous Seas`,
      content: `Increases the Level of <b>Surfshark Wavebreaker</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sharky Eats Puffies`,
      content: `Mualani regenerates <span class="text-desc">8</span> Energy when obtaining a <b>Puffer</b>. Must first unlock the Passive Talent <b>Heat-Resistant Freshwater Floater</b>.
      <br />Additionally, <b>Boomsharka-laka</b> deals <span class="text-desc">75%</span> increased DMG.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Same Style of Surfboard on Sale!`,
      content: `Increases the Level of <b>Boomsharka-laka</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Spirit of the Springs' People`,
      content: `The DMG increase from the Constellation <b>The Leisurely 'Meztli'...</b> is no longer limited to being triggered once every <b class="text-genshin-hydro">Nightsoul's Blessing</b>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'zhongli_res',
      text: `Jade Shield RES Shred`,
      ...talents.skill,
      show: true,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'zhongli_a1',
      text: `A1 Shield Strength`,
      ...talents.c4,
      show: c >= 4,
      default: 5,
      min: 0,
      max: 5,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'zhongli_res'), findContentById(content, 'zhongli_a1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.51396, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.44626, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.70034, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.4288, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.HYDRO)
      base.SKILL_SCALING = [
        {
          name: 'Stone Stele Summon DMG',
          value: [{ scaling: calcScaling(0.16, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Resonance DMG DMG',
          value: [{ scaling: calcScaling(0.32, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(0.8, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.128, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1232, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(4.0108, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.zhongli_res) base.ALL_TYPE_RES_PEN += 0.2
      if (form.zhongli_a1) base[Stats.SHIELD] += form.zhongli_a1 * 0.05

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.zhongli_res) base.ALL_TYPE_RES_PEN += 0.2
      if (form.zhongli_a1) base[Stats.SHIELD] += form.zhongli_a1 * 0.05

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Mualani
