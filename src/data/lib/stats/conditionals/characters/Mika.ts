import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Mika = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Spear of Favonius - Arrow's Passage`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive strikes using his crossbow and spear.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Starfrost Swirl`,
      content: `Mika uses his crossbow to attack, granting all nearby characters in your party Soulwind. When characters in the Soulwind state are on the field, their ATK SPD will be increased.
      <br />Will take effect in different ways if Pressed or Held.
      <br />
      <br /><b>Press</b>
      <br />Fires a Flowfrost Arrow that can pierce through opponents, dealing <b class="text-genshin-cryo">Cryo DMG</b> to enemies it comes into contact with.
      <br />
      <br /><b>Hold</b>
      <br />Goes into Aiming Mode, locking on to an opponent and firing a Rimestar Flare at them, dealing <b class="text-genshin-cryo">Cryo DMG</b>. When the Rimestar Flare hits, it will rise before exploding, launching Rimestar Shards into a maximum of <span class="text-desc">3</span> other opponents, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      `,
    },
    burst: {
      title: `Skyfeather Song`,
      content: `Derives the ability to spur his teammates on from the recited prayers of the knightly order, regenerating HP for all nearby party members. This healing is based on Mika's Max HP and will grant them the Eagleplume state.
      <br />
      <br /><b>Eagleplume</b>
      <br />When the Normal Attacks of active characters affected by Eagleplume hit an opponent, Mika will help them regenerate HP based on his Max HP.
      <br />Characters affected by this state can only regenerate HP in this way once per short interval of time.
      `,
    },
    a1: {
      title: `A1: Suppressive Barrage`,
      content: `Per the following circumstances, the Soulwind state caused by Starfrost Swirl will grant characters the Detector effect, increasing their <b>Physical DMG</b> by <span class="text-desc">10%</span> when they are on the field.
      <br />- If the Flowfrost Arrow hits more than one opponent, each additional opponent hit will generate <span class="text-desc">1</span> Detector stack.
      <br />- When a Rimestar Shard hits an opponent, it will generate <span class="text-desc">1</span> Detector stack. Each Rimestar Shard can trigger the effect <span class="text-desc">1</span> time.
      <br />The Soulwind state can have a maximum of <span class="text-desc">3</span> Detector stacks, and if Starfrost Swirl is cast again during this duration, the pre-existing Soulwind state and all its Detector stacks will be cleared.`,
    },
    a4: {
      title: `A4: Topographical Mapping`,
      content: `When an active character affected by both Skyfeather Song's Eagleplume and Starfrost Swirl's Soulwind at once scores a CRIT Hit with their attacks, Soulwind will grant them <span class="text-desc">1</span> stack of Detector from Suppressive Barrage. During a single instance of Soulwind, <span class="text-desc">1</span> Detector stack can be gained in this manner.
      <br />Additionally, the maximum number of stacks that can be gained through Soulwind alone is increased by <span class="text-desc">1</span>.
      <br />Requires Suppressive Barrage to be unlocked first.`,
    },
    util: {
      title: `Demarcation`,
      content: `Displays the location of nearby resources unique to Mondstadt on the mini-map.`,
    },
    c1: {
      title: `C1: Factor Confluence`,
      content: `The Soulwind state of Starfrost Swirl can decrease the healing interval between instances caused by Skyfeather Song's Eagleplume state. This decrease percentage is equal to the ATK SPD increase provided by Soulwind.`,
    },
    c2: {
      title: `C2: Companion's Ingress`,
      content: `When Starfrost Swirl's Flowfrost Arrow first hits an opponent, or its Rimestar Flare hits an opponent, <span class="text-desc">1</span> Detector stack from Passive Talent "Suppressive Barrage" will be generated.
      <br />You must have unlocked the Passive Talent "Suppressive Barrage" first.`,
    },
    c3: {
      title: `C3: Reconnaissance Experience`,
      content: `Increases the Level of Skyfeather Song by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Sunfrost Encomium`,
      content: `When Mika's own Skyfeather Song's Eagleplume state heals party members, this will restore <span class="text-desc">3</span> Energy to Mika. This form of Energy restoration can occur <span class="text-desc">5</span> times during the Eagleplume state created by <span class="text-desc">1</span> use of Skyfeather Song.`,
    },
    c5: {
      title: `C5: Signal Arrow`,
      content: `Increases the Level of Starfrost Swirl by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Companion's Counsel`,
      content: `The maximum number of Detector stacks that Starfrost Swirl's Soulwind can gain is increased by <span class="text-desc">1</span>. You need to have unlocked the Passive Talent "Suppressive Barrage" first.
      <br />Additionally, active characters affected by Soulwind will deal <span class="text-desc">60%</span> more <b>Physical</b> CRIT DMG.`,
    },
  }

  const maxDetector = 3 + (a >= 4 ? 1 : 0) + (c >= 6 ? 1 : 0)

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'soulwind',
      text: `Soulwind`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'detector',
      text: `Detector Stacks`,
      ...talents.a2,
      show: a >= 1,
      default: maxDetector,
      min: 0,
      max: maxDetector,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'soulwind'), findContentById(content, 'detector')]

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
          value: [{ scaling: calcScaling(0.4326, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.415, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.545, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.2761, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.7087, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          name: 'Flowfrost Arrow DMG',
          value: [{ scaling: calcScaling(0.64, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Rimestar Flare DMG',
          value: [{ scaling: calcScaling(0.84, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Rimestar Shard DMG',
          value: [{ scaling: calcScaling(0.252, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Cast Healing',
          value: [{ scaling: calcScaling(0.1217, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1172.0355, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Eagleplume Healing',
          value: [{ scaling: calcScaling(0.0243, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(233.95428, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (form.soulwind) {
        base.ATK_SPD += 12 + skill
        if (c >= 6) base.PHYSICAL_CD += 0.6
      }
      if (form.detector) base[Stats.PHYSICAL_DMG] += 0.1 * form.detector

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.soulwind) {
        base.ATK_SPD += 12 + skill
        if (c >= 6) base.PHYSICAL_CD += 0.6
      }
      if (form.detector) base[Stats.PHYSICAL_DMG] += 0.1 * form.detector

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Mika
