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
      trace: `Normal Attack`,
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
      image: 'Skill_A_03',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Starfrost Swirl`,
      content: `Mika uses his crossbow to attack, granting all nearby characters in your party <b class="text-genshin-cryo">Soulwind</b>. When characters in the <b class="text-genshin-cryo">Soulwind</b> state are on the field, their ATK SPD will be increased.
      <br />Will take effect in different ways if Pressed or Held.
      <br />
      <br /><b>Press</b>
      <br />Fires a <b>Flowfrost Arrow</b> that can pierce through opponents, dealing <b class="text-genshin-cryo">Cryo DMG</b> to enemies it comes into contact with.
      <br />
      <br /><b>Hold</b>
      <br />Goes into Aiming Mode, locking on to an opponent and firing a <b>Rimestar Flare</b> at them, dealing <b class="text-genshin-cryo">Cryo DMG</b>. When the <b>Rimestar Flare</b> hits, it will rise before exploding, launching <b>Rimestar Shards</b> into a maximum of <span class="text-desc">3</span> other opponents, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      `,
      image: 'Skill_S_Mika_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Skyfeather Song`,
      content: `Derives the ability to spur his teammates on from the recited prayers of the knightly order, regenerating HP for all nearby party members. This healing is based on Mika's Max HP and will grant them the <b class="text-blue">Eagleplume</b> state.
      <br />
      <br /><b class="text-blue">Eagleplume</b>
      <br />When the Normal Attacks of active characters affected by <b class="text-blue">Eagleplume</b> hit an opponent, Mika will help them regenerate HP based on his Max HP.
      <br />Characters affected by this state can only regenerate HP in this way once per short interval of time.
      `,
      image: 'Skill_E_Mika_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Suppressive Barrage`,
      content: `Per the following circumstances, the <b class="text-genshin-cryo">Soulwind</b> state caused by <b>Starfrost Swirl</b> will grant characters the <b class="text-genshin-cryo">Detector</b> effect, increasing their <b>Physical DMG</b> by <span class="text-desc">10%</span> when they are on the field.
      <br />- If the <b>Flowfrost Arrow</b> hits more than one opponent, each additional opponent hit will generate <span class="text-desc">1</span> <b class="text-genshin-cryo">Detector</b> stack.
      <br />- When a <b>Rimestar Shard</b> hits an opponent, it will generate <span class="text-desc">1</span> <b class="text-genshin-cryo">Detector</b> stack. Each <b>Rimestar Shard</b> can trigger the effect <span class="text-desc">1</span> time.
      <br />The <b class="text-genshin-cryo">Soulwind</b> state can have a maximum of <span class="text-desc">3</span> <b class="text-genshin-cryo">Detector</b> stacks, and if <b>Starfrost Swirl</b> is cast again during this duration, the pre-existing <b class="text-genshin-cryo">Soulwind</b> state and all its <b class="text-genshin-cryo">Detector</b> stacks will be cleared.`,
      image: 'UI_Talent_S_Mika_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Topographical Mapping`,
      content: `When an active character affected by both <b>Skyfeather Song</b>'s <b class="text-blue">Eagleplume</b> and <b>Starfrost Swirl</b>'s <b class="text-genshin-cryo">Soulwind</b> at once scores a CRIT Hit with their attacks, <b class="text-genshin-cryo">Soulwind</b> will grant them <span class="text-desc">1</span> stack of <b class="text-genshin-cryo">Detector</b> from <b>Suppressive Barrage</b>. During a single instance of <b class="text-genshin-cryo">Soulwind</b>, <span class="text-desc">1</span> <b class="text-genshin-cryo">Detector</b> stack can be gained in this manner.
      <br />Additionally, the maximum number of stacks that can be gained through <b class="text-genshin-cryo">Soulwind</b> alone is increased by <span class="text-desc">1</span>.
      <br />Requires <b>Suppressive Barrage</b> to be unlocked first.`,
      image: 'UI_Talent_S_Mika_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Demarcation`,
      content: `Displays the location of nearby resources unique to Mondstadt on the mini-map.`,
      image: 'UI_Talent_Collect_Local_Mengde',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Factor Confluence`,
      content: `The <b class="text-genshin-cryo">Soulwind</b> state of <b>Starfrost Swirl</b> can decrease the healing interval between instances caused by <b>Skyfeather Song</b>'s <b class="text-blue">Eagleplume</b> state. This decrease percentage is equal to the ATK SPD increase provided by <b class="text-genshin-cryo">Soulwind</b>.`,
      image: 'UI_Talent_S_Mika_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Companion's Ingress`,
      content: `When <b>Starfrost Swirl</b>'s <b>Flowfrost Arrow</b> first hits an opponent, or its <b>Rimestar Flare</b> hits an opponent, <span class="text-desc">1</span> <b class="text-genshin-cryo">Detector</b> stack from Passive Talent <b>Suppressive Barrage</b> will be generated.
      <br />You must have unlocked the Passive Talent <b>Suppressive Barrage</b> first.`,
      image: 'UI_Talent_S_Mika_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Reconnaissance Experience`,
      content: `Increases the Level of <b>Skyfeather Song</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mika_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sunfrost Encomium`,
      content: `When Mika's own <b>Skyfeather Song</b>'s <b class="text-blue">Eagleplume</b> state heals party members, this will restore <span class="text-desc">3</span> Energy to Mika. This form of Energy restoration can occur <span class="text-desc">5</span> times during the <b class="text-blue">Eagleplume</b> state created by <span class="text-desc">1</span> use of <b>Skyfeather Song</b>.`,
      image: 'UI_Talent_S_Mika_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Signal Arrow`,
      content: `Increases the Level of <b>Starfrost Swirl</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mika_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Companion's Counsel`,
      content: `The maximum number of <b class="text-genshin-cryo">Detector</b> stacks that <b>Starfrost Swirl</b>'s <b class="text-genshin-cryo">Soulwind</b> can gain is increased by <span class="text-desc">1</span>. You need to have unlocked the Passive Talent <b>Suppressive Barrage</b> first.
      <br />Additionally, active characters affected by <b class="text-genshin-cryo">Soulwind</b> will deal <span class="text-desc">60%</span> more <b>Physical</b> CRIT DMG.`,
      image: 'UI_Talent_S_Mika_04',
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
      ...talents.a1,
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
        base.ATK_SPD.push({ value: 0.12 + skill / 100, name: 'Soulwind', source: `Self` })
        if (c >= 6) base.PHYSICAL_CD.push({ value: 0.6, name: 'Soulwind [C6]', source: `Self` })
      }
      if (form.detector) base[Stats.PHYSICAL_DMG].push({ value: 0.1, name: 'Detector', source: `Self` }) * form.detector

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.soulwind) {
        base.ATK_SPD.push({ value: 0.12 + skill / 100, name: 'Soulwind', source: `Mika` })
        if (c >= 6) base.PHYSICAL_CD.push({ value: 0.6, name: 'Soulwind [C6]', source: `Mika` })
      }
      if (form.detector) base[Stats.PHYSICAL_DMG].push({ value: 0.1, name: 'Detector', source: `Mika` }) * form.detector

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Mika
