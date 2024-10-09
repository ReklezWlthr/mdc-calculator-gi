import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yaoyao = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Toss 'N' Turn Spear`,
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
      title: `Raphanus Sky Cluster`,
      content: `Calls upon <b class="text-lime-400">Yuegui: Throwing Mode</b> a special device created by a certain adeptus to help Yaoyao solve her problems.
      <br />This skill will be used differently in Holding Mode.
      <br />
      <br /><b>Hold</b>
      <br />Enters Aiming Mode to adjust the throw direction.
      <br />
      <br /><b class="text-lime-400">Yuegui: Throwing Mode</b>
      <br />Throws out <b>White Jade Radishes</b> that will explode upon hitting characters or opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b> to opponents within a certain AoE, and healing characters within that same AoE based on Yaoyao's Max HP. If a radish does not hit either an opponent or a character, the radish will remain where it is and explode on contact with a character or opponent, or will explode after its duration expires.
      <br /><b class="text-lime-400">Yuegui: Throwing Mode</b> will choose its radish-throw targets.
      <br />- If all nearby characters have more than <span class="text-desc">70%</span> HP remaining, then it will throw the radish at a nearby opponent.
      <br />- If nearby characters have <span class="text-desc">70%</span> or less HP remaining, it will throw a radish at the character with the lowest HP percentage remaining. If no opponents exist nearby, Yuegui will throw <b>White Jade Radishes</b> at characters even if they all have more than <span class="text-desc">70%</span> HP remaining.
      <br />
      <br />A maximum of <span class="text-desc">2</span> instances <b class="text-lime-400">Yuegui: Throwing Mode</b> can exist at any one time.`,
      image: 'Skill_S_Yaoyao_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Moonjade Descent`,
      content: `At the enjoinment of a certain adeptus, Yuegui's full potential can be unleashed in an emergency, dealing <b class="text-genshin-dendro">Dendro DMG</b> to nearby opponents and entering an (in some sense) unsurpassed <b class="text-desc">Adeptal Legacy</b> state.
      <br />
      <br /><b class="text-desc">Adeptal Legacy</b>
      <br />- <b>White Jade Radishes</b> generated will be changed to heal and deal DMG according to this skill. Explosions will heal all nearby party members, and the <b class="text-genshin-dendro">Dendro DMG</b> that they deal will be viewed as Elemental Burst DMG instead.
      <br />- Summons <b class="text-lime-400">Yuegui: Jumping Mode</b> at intervals until their limit has been reached. The behavior of this version of Yuegui is the same as that of <b class="text-lime-400">Yuegui: Jumping Mode</b> in the Elemental Skill, <b>Raphanus Sky Cluster</b>. A maximum of <span class="text-desc">3</span> <b class="text-lime-400">Yuegui: Jumping Mode</b> can exist at any one time.
      <br />- Yaoyao's Movement SPD is increased by <span class="text-desc">15%</span>.
      <br />- Yaoyao's <b class="text-genshin-dendro">Dendro RES</b> will be increased.
      <br />
      <br />The <b class="text-desc">Adeptal Legacy</b> state will end once Yaoyao is off-field, and all remaining <b class="text-lime-400">Yuegui: Jumping Mode</b> will be cleared once this state ends.`,
      image: 'Skill_E_Yaoyao_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Starscatter`,
      content: `While affected by the <b class="text-desc">Adeptal Legacy</b> state caused by <b>Moonjade Descent</b>, Yaoyao will constantly throw <b>White Jade Radishes</b> at nearby opponents when she is sprinting, jumping, or running. She can throw <span class="text-desc">1</span> <b>White Jade Radish</b> this way once every <span class="text-desc">0.6</span>s.`,
      image: 'UI_Talent_S_Yaoyao_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `In Others' Shoes`,
      content: `When <b>White Jade Radishes</b> explode, active characters within their AoE will regain HP every <span class="text-desc">1</span>s based on <span class="text-desc">0.8%</span> of Yaoyao's Max HP. This effect lasts <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Yaoyao_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Tailing on Tiptoes`,
      content: `When Yaoyao is in the party, your characters will not startle Crystalflies and certain other animals when getting near them.
      <br />Check the "Other" sub-category of the "Living Beings / Wildlife" section in the Archive for creatures this skill works on.`,
      image: 'UI_Talent_S_Yaoyao_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Adeptus' Tutelage`,
      content: `When <b>White Jade Radishes</b> explode, active characters within their AoE will gain <span class="text-desc">15%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b> for <span class="text-desc">8</span>s and have <span class="text-desc">15</span> Stamina restored to them. This form of Stamina Restoration can only be triggered every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Yaoyao_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Innocent`,
      content: `While affected by the <b class="text-desc">Adeptal Legacy</b> state caused by <b>Moonjade Descent</b>, if <b>White Jade Radish</b> explosions damage opponents, <span class="text-desc">3</span> Energy will be restored to Yaoyao. This form of Energy regeneration can occur once every <span class="text-desc">0.8</span>s.`,
      image: 'UI_Talent_S_Yaoyao_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Loyal and Kind`,
      content: `Increases the Level of <b>Raphanus Sky Cluster</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yaoyao_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Winsome`,
      content: `After using <b>Raphanus Sky Cluster</b> or <b>Moonjade Descent</b>, Yaoyao's Elemental Mastery will be increased based on <span class="text-desc">0.3%</span> of her Max HP for <span class="text-desc">8</span>s. The maximum Elemental Mastery she can gain this way is <span class="text-desc">120</span>.`,
      image: 'UI_Talent_S_Yaoyao_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Compassionate`,
      content: `Increases the Level of <b>Moonjade Descent</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yaoyao_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Beneficent`,
      content: `For every <span class="text-desc">2</span> <b>White Jade Radishes</b> <b class="text-lime-400">Yuegui: Throwing Mode</b> throws out, it will also throw a <b>Mega Radish</b> that will have a larger AoE than the standard <b>White Jade Radish</b> and have the following effects upon exploding:
      <br />Deals <b class="text-genshin-dendro">AoE Dendro DMG</b> based on <span class="text-desc">75%</span> of Yaoyao's ATK.
      <br />Restores HP for the active character based on <span class="text-desc">7.5%</span> of Yaoyao's Max HP.
      <br />
      <br />Every <b class="text-lime-400">Yuegui: Throwing Mode</b> can throw out a maximum of <span class="text-desc">2</span> <b>Mega Radishes</b>.`,
      image: 'UI_Talent_S_Yaoyao_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'yaoyaoC1',
      text: `C1 Dendro DMG Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'yaoyaoC4',
      text: `C4 EM Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'yaoyaoC1')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.51, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4744, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.3138, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.3295, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.7793, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.1266, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'White Jade Radish DMG',
          value: [{ scaling: calcScaling(0.2992, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'White Jade Radish Healing',
          value: [{ scaling: calcScaling(0.0171, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(165.07991, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.1456, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Adeptal Legacy White Jade Radish DMG',
          value: [{ scaling: calcScaling(0.7216, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Adeptal Legacy White Jade Radish Healing',
          value: [{ scaling: calcScaling(0.0202, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(194.21231, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (a >= 4)
        base.SKILL_SCALING.push({
          name: 'A4 Healing Per Tick',
          value: [{ scaling: 0.008, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.yaoyaoC1) base[Stats.DENDRO_DMG].push({ value: 0.15, name: 'Constellation 1', source: `Self` })
      if (c >= 6)
        base.SKILL_SCALING.push(
          {
            name: 'Mega Radish DMG',
            value: [{ scaling: 0.75, multiplier: Stats.ATK }],
            element: Element.DENDRO,
            property: TalentProperty.SKILL,
          },
          {
            name: 'Mega Radish Healing',
            value: [{ scaling: 0.075, multiplier: Stats.HP }],
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          }
        )

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.yaoyaoC1) base[Stats.DENDRO_DMG].push({ value: 0.15, name: 'Constellation 1', source: `Yaoyao` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.yaoyaoC4)
        base.CALLBACK.push(function (x) {
          x[Stats.EM].push({
            value: _.min([0.003 * x.getHP(), 120]),
            name: 'Constellation 4',
            source: 'Self',
            base: _.min([x.getHP(), 40000]),
            multiplier: toPercentage(0.003),
          })
          return x
        })

      return base
    },
  }
}

export default Yaoyao
