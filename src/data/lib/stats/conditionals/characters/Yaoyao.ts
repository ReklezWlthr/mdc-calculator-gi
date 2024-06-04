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
    },
    skill: {
      title: `Raphanus Sky Cluster`,
      content: `Calls upon "Yuegui: Throwing Mode," a special device created by a certain adeptus to help Yaoyao solve her problems.
      <br />This skill will be used differently in Holding Mode.
      <br />
      <br /><b>Hold</b>
      <br />Enters Aiming Mode to adjust the throw direction.
      <br />
      <br /><b>Yuegui: Throwing Mode</b>
      <br />Throws out White Jade Radishes that will explode upon hitting characters or opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b> to opponents within a certain AoE, and healing characters within that same AoE based on Yaoyao's Max HP. If a radish does not hit either an opponent or a character, the radish will remain where it is and explode on contact with a character or opponent, or will explode after its duration expires.
      <br />Yuegui: Throwing Mode will choose its radish-throw targets.
      <br />- If all nearby characters have more than 70% HP remaining, then it will throw the radish at a nearby opponent.
      <br />- If nearby characters have <span class="text-desc">70%</span> or less HP remaining, it will throw a radish at the character with the lowest HP percentage remaining. If no opponents exist nearby, Yuegui will throw White Jade Radishes at characters even if they all have more than <span class="text-desc">70%</span> HP remaining.
      <br />
      <br />A maximum of <span class="text-desc">2</span> instances Yuegui: Throwing Mode can exist at any one time.`,
    },
    burst: {
      title: `Moonjade Descent`,
      content: `At the enjoinment of a certain adeptus, Yuegui's full potential can be unleashed in an emergency, dealing Dendro DMG to nearby opponents and entering an (in some sense) unsurpassed Adeptal Legacy state.
      <br />
      <br /><b>Adeptal Legacy</b>
      <br />- White Jade Radishes generated will be changed to heal and deal DMG according to this skill. Explosions will heal all nearby party members, and the <b class="text-genshin-dendro">Dendro DMG</b> that they deal will be viewed as Elemental Burst DMG instead.
      <br />- Summons "Yuegui: Jumping Mode" at intervals until their limit has been reached. The behavior of this version of Yuegui is the same as that of "Yuegui: Throwing Mode" in the Elemental Skill, Raphanus Sky Cluster. A maximum of <span class="text-desc">3</span> Yuegui: Jumping Mode can exist at any one time.
      <br />- Yaoyao's Movement SPD is increased by <span class="text-desc">15%</span>.
      <br />- Yaoyao's <b class="text-genshin-dendro">Dendro RES</b> will be increased.
      <br />
      <br />The Adeptal Legacy state will end once Yaoyao is off-field, and all remaining Yuegui: Jumping Mode will be cleared once this state ends.`,
    },
    a1: {
      title: `A1: Starscatter`,
      content: `While affected by the Adeptal Legacy state caused by Moonjade Descent, Yaoyao will constantly throw White Jade Radishes at nearby opponents when she is sprinting, jumping, or running. She can throw <span class="text-desc">1</span> White Jade Radish this way once every <span class="text-desc">0.6</span>s.`,
    },
    a4: {
      title: `A4: In Others' Shoes`,
      content: `When White Jade Radishes explode, active characters within their AoE will regain HP every <span class="text-desc">1</span>s based on <span class="text-desc">0.8%</span> of Yaoyao's Max HP. This effect lasts <span class="text-desc">5</span>s.`,
    },
    util: {
      title: `Tailing on Tiptoes`,
      content: `When Yaoyao is in the party, your characters will not startle Crystalflies and certain other animals when getting near them.
      <br />Check the "Other" sub-category of the "Living Beings / Wildlife" section in the Archive for creatures this skill works on.`,
    },
    c1: {
      title: `C1: Adeptus' Tutelage`,
      content: `When White Jade Radishes explode, active characters within their AoE will gain <span class="text-desc">15%</span> <b class="text-genshin-dendro">Dendro DMG Bonus</b> for 8s and have <span class="text-desc">15</span> Stamina restored to them. This form of Stamina Restoration can only be triggered every <span class="text-desc">5</span>s.`,
    },
    c2: {
      title: `C2: Innocent`,
      content: `While affected by the Adeptal Legacy state caused by Moonjade Descent, if White Jade Radish explosions damage opponents, <span class="text-desc">3</span> Energy will be restored to Yaoyao. This form of Energy regeneration can occur once every <span class="text-desc">0.8</span>s.`,
    },
    c3: {
      title: `C3: Loyal and Kind`,
      content: `Increases the Level of Raphanus Sky Cluster by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Winsome`,
      content: `After using Raphanus Sky Cluster or Moonjade Descent, Yaoyao's Elemental Mastery will be increased based on <span class="text-desc">0.3%</span> of her Max HP for <span class="text-desc">8</span>s. The maximum Elemental Mastery she can gain this way is <span class="text-desc">120</span>.`,
      value: [
        {
          name: 'Current Elemental Mastery Buff',
          value: { stat: Stats.HP, scaling: (hp) => _.round(_.min([0.003 * hp, 120])).toLocaleString() },
        },
      ],
    },
    c5: {
      title: `C5: Compassionate`,
      content: `Increases the Level of Moonjade Descent by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Beneficent`,
      content: `For every <span class="text-desc">2</span> White Jade Radishes Yuegui: Throwing Mode throws out, it will also throw a Mega Radish that will have a larger AoE than the standard White Jade Radish and have the following effects upon exploding:
      <br />Deals <b class="text-genshin-dendro">AoE Dendro DMG</b> based on <span class="text-desc">75%</span> of Yaoyao's ATK.
      <br />Restores HP for the active character based on <span class="text-desc">7.5%</span> of Yaoyao's Max HP.
      <br />
      <br />Every Yuegui: Throwing Mode can throw out a maximum of <span class="text-desc">2</span> Mega Radishes.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'yaoyaoC1',
      text: `Adeptus' Tutelage`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'yaoyaoC4',
      text: `Winsome`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'yaoyaoC1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 70

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

      if (form.yaoyaoC1) base[Stats.DENDRO_DMG] += 0.15
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
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.yaoyaoC4) base[Stats.EM] += _.min([0.003 * base.getHP(), 120])

      return base
    },
  }
}

export default Yaoyao
