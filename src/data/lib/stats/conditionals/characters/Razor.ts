import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Razor = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Steel Fang`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous spinning attacks against all nearby opponents.
      <br />At the end of the sequence, performs a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Claw and Thunder`,
      content: `Hunts his prey using the techniques taught to him by his master and his lupical.
      <br />
      <br /><b>Press</b>
      <br />Swings the Thunder Wolf Claw, dealing <b class="text-genshin-electro">Electro DMG</b> to opponents in front of Razor.
      <br />Upon striking an opponent, Razor will gain an Electro Sigil, which increases his Energy Recharge rate.
      <br />Razor can have up to <span class="text-desc">3</span> Electro Sigils simultaneously, and gaining a new Electro Sigil refreshes their duration.
      <br />
      <br /><b>Hold</b>
      <br />Gathers Electro energy to unleash a lightning storm over a small AoE, causing massive <b class="text-genshin-electro">Electro DMG</b>, and clears all of Razor's Electro Sigils.
      <br />Each Electro Sigil cleared in this manner will be converted into Energy for Razor.
      `,
    },
    burst: {
      title: `Lightning Fang`,
      content: `Summons the Wolf Within, which deals <b class="text-genshin-electro">Electro DMG</b> to all nearby opponents. This clears all of Razor's Electro Sigils, which will be converted into Elemental Energy for him.
      <br />The Wolf Within will fight alongside Razor for the skill's duration.
      <br />
      <br /><b>The Wolf Within</b>
      <br />- Strikes alongside Razor's normal attacks, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />- Raises Razor's ATK SPD and <b class="text-genshin-electro">Electro RES</b>.
      <br />- Causes Razor to be immune to DMG inflicted by the Electro-Charged status.
      <br />- Disables Razor's Charged Attacks.
      <br />- Increases Razor's resistance to interruption.
      <br />
      <br />These effects end when Razor leaves the battlefield.
      <br />When Razor leaves the field, a maximum of <span class="text-desc">10</span> Energy will be returned to him based off the duration remaining on this skill.`,
    },
    a1: {
      title: `A1: Awakening`,
      content: `Decreases Claw and Thunder's CD by <span class="text-desc">18%</span>. Using Lightning Fang resets the CD of Claw and Thunder.`,
    },
    a4: {
      title: `A4: Hunger`,
      content: `When Razor's Energy is below <span class="text-desc">50%</span>, increases Energy Recharge by <span class="text-desc">30%</span>.`,
    },
    util: {
      title: `Wolvensprint`,
      content: `Decreases sprinting Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      title: `C1: Wolf's Instinct`,
      content: `Picking up an Elemental Orb or Particle increases Razor's DMG by <span class="text-desc">10%</span> for <span class="text-desc">8</span>s.`,
    },
    c2: {
      title: `C2: Suppression`,
      content: `Increases CRIT Rate against opponents with less than <span class="text-desc">30%</span> HP by <span class="text-desc">10%</span>.`,
    },
    c3: {
      title: `C3: Soul Companion`,
      content: `Increases the Level of Lightning Fang by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Bite`,
      content: `When casting Claw and Thunder <b>Press</b>, opponents hit will have their DEF decreased by <span class="text-desc">15%</span> for <span class="text-desc">7</span>s.`,
    },
    c5: {
      title: `C5: Sharpened Claws`,
      content: `Increases the Level of Claw and Thunder by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Lupus Fulguris`,
      content: `Every <span class="text-desc">10</span>s, Razor's sword charges up, causing the next Normal Attack to release lightning that deals <span class="text-desc">100%</span> of Razor's ATK as <b class="text-genshin-electro">Electro DMG</b>.
      <br />When Razor is not using Lightning Fang, a lightning strike on an opponent will grant Razor an Electro Sigil for Claw and Thunder.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'electro_sigil',
      text: `Electro Sigil Stacks`,
      ...talents.skill,
      show: true,
      default: 3,
      min: 0,
      max: 3,
    },
    {
      type: 'toggle',
      id: 'razor_burst',
      text: `The Wolf Within`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'razor_low_energy',
      text: `Current Energy < 50%`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'razor_c1',
      text: `C1 DMG Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'razor_c2',
      text: `Target Current HP < 30%`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'razor_c4',
      text: `C4 DEF Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'razor_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      if (form.navia_infusion) {
        base.infuse(Element.GEO, true)
        base.BASIC_DMG += 0.4
        base.CHARGE_DMG += 0.4
        base.PLUNGE_DMG += 0.4
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.9592, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.8263, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x3]',
          value: [{ scaling: calcScaling(1.0331, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.3605, normal, 'physical', '2'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.6254, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.1309, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('razor', normal)

      base.SKILL_SCALING = [
        {
          name: 'Press Skill DMG',
          value: [{ scaling: calcScaling(1.992, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold Skill DMG',
          value: [{ scaling: calcScaling(2.952, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Elemental Burst DMG`,
          value: [{ scaling: calcScaling(1.6, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Soul Companion DMG`,
          value: [{ scaling: calcScaling(0.24, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.electro_sigil) base[Stats.ER] += 0.2 * form.electro_sigil
      if (form.razor_burst) {
        base.ATK_SPD += _.min([0.24 + _.min([burst, 6]) * 0.02 * (_.max([burst - 6, 0]) * 0.01), 0.4])
        base.ELECTRO_RES += 0.8
      }
      if (a >= 1) base.SKILL_CD_RED += 0.18
      if (form.razor_low_energy) base[Stats.ER] += 0.3
      if (form.razor_c1) base[Stats.ALL_DMG] += 0.1
      if (form.razor_c2) base[Stats.CRIT_RATE] += 0.1

      if (form.razor_c4) base.DEF_REDUCTION += 0.15

      if (c >= 6)
        base.BASIC_SCALING.push({
          name: 'C6 Lightning DMG',
          value: [{ scaling: 1, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.razor_c4) base.DEF_REDUCTION += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Razor
