import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerWater = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Foreign Stream`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Aquacrest Saber`,
      content: `Unleashes a torrent that can cleanse the world.
      <br />
      <br /><b>Press</b>
      <br />Sends a Torrent Surge forward that will deal <b class="text-genshin-hydro">Hydro DMG</b> to opponents it comes into contact with.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode and constantly fire off Dewdrops in the direction in which you are aiming, dealing <b class="text-genshin-hydro">Hydro DMG</b> to opponents they hit.
      <br />When the skill ends, it will send a Torrent Surge forward that will <b class="text-genshin-hydro">Hydro DMG</b> to opponents it comes into contact with.
      <br />Suffusion: When using the Hold configuration of this skill, if the Traveler's HP is higher than <span class="text-desc">50%</span>, the DMG dealt by Dewdrops will increase based on the Traveler's Max HP, and the Traveler will lose a fixed amount of HP every second.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At certain intervals, after using Torrent Surge, this skill will unleash a Spiritbreath Thorn that pierces opponents, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-hydro">Hydro DMG</b>.
      `,
    },
    burst: {
      title: `Rising Waters`,
      content: `Unleashes a slow-moving floating bubble that deals continuous <b class="text-genshin-hydro">Hydro DMG</b> to nearby opponents.`,
    },
    a1: {
      title: `A1: Spotless Waters`,
      content: `After the Dewdrop fired by the Hold Mode of the Aquacrest Saber hits an opponent, a Sourcewater Droplet will be generated near to the Traveler. If the Traveler picks it up, they will restore <span class="text-desc">7%</span> HP.
      <br /><span class="text-desc">1</span> Droplet can be created this way every second, and each use of Aquacrest Saber can create <span class="text-desc">4</span> Droplets at most.`,
    },
    a4: {
      title: `A4: Clear Waters`,
      content: `If HP has been consumed via Suffusion while using the Hold Mode Aquacrest Saber, the Torrent Surge at the skill's end will deal Bonus DMG equal to <span class="text-desc">45%</span> of the total HP the Traveler has consumed in this skill use via Suffusion.
      <br />The maximum DMG Bonus that can be gained this way is <span class="text-desc">5,000</span>.`,
    },
    c1: {
      title: `C1: Swelling Lake`,
      content: `Picking up a Sourcewater Droplet will restore <span class="text-desc">2</span> Energy to the Traveler.
      <br />Requires the Passive Talent "Spotless Waters."`,
    },
    c2: {
      title: `C2: Trickling Purity`,
      content: `The Movement SPD of Rising Waters' bubble will be decreased by <span class="text-desc">30%</span>, and its duration increased by <span class="text-desc">3</span>s.`,
    },
    c3: {
      title: `C3: Turbulent Ripples`,
      content: `Increases the Level of Aquacrest Saber by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Pouring Descent`,
      content: `When using Aquacrest Saber, an Aquacrest Aegis that can absorb <span class="text-desc">10%</span> of the Traveler's Max HP in DMG will be created and will absorb <b class="text-genshin-hydro">Hydro DMG</b> with <span class="text-desc">250%</span> effectiveness. It will persist until the Traveler finishes using the skill.
      <br />Once every <span class="text-desc">2</span>s, after a Dewdrop hits an opponent, if the Traveler is being protected by Aquacrest Aegis, the DMG Absorption of the Aegis will be restored to <span class="text-desc">10%</span> of the Traveler's Max HP. If the Traveler is not presently being protected by an Aegis, one will be redeployed.`,
    },
    c5: {
      title: `C5: Churning Whirlpool`,
      content: `Increases the Level of Rising Waters by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Tides of Justice`,
      content: `When the Traveler picks up a Sourcewater Droplet, they will restore HP to the nearest party member with the lowest HP percentage remaining based on <span class="text-desc">6%</span> of their Max HP.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'suffusion',
      text: `Current HP > 50%`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'hmc_a4',
      text: `Total HP Consumed`,
      ...talents.a4,
      show: a >= 4,
      default: 0,
      min: 0,
      max: 5000,
    },
  ]

  const teammateContent: IContent[] = []

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
          value: [{ scaling: calcScaling(0.607, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      const suffusion = form.suffusion
        ? [{ scaling: calcScaling(0.0064, skill, 'elemental', '1'), multiplier: Stats.HP }]
        : []
      base.SKILL_SCALING = [
        {
          name: 'Torrent Surge DMG',
          value: [{ scaling: calcScaling(1.8928, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Dewdrop DMG',
          value: [{ scaling: calcScaling(0.328, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...suffusion],
          flat: form.hmc_a4 ? form.hmc_a4 * 0.45 : 0,
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.328, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.ADD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.0187, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'Sourcewater Droplet Healing',
          value: [{ scaling: 0.07, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      if (c >= 4)
        base.SKILL_SCALING.push(
          {
            name: 'C4 Shield',
            value: [{ scaling: 0.1, multiplier: Stats.HP }],
            element: TalentProperty.SHIELD,
            property: TalentProperty.SHIELD,
          },
          {
            name: 'C4 Shielded Healing',
            value: [{ scaling: 0.1, multiplier: Stats.HP }],
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          }
        )

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'C6 Allied Sourcewater Droplet Healing',
          value: [{ scaling: 0.06, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default TravelerWater
