import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xianyun = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Word of Wind and Flower`,
      content: `<b>Normal Attack</b>
      <br />Summons swirling winds to perform up to 4 attacks, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina and launches a Breeze Bolt in a straight line that deals <b class="text-genshin-anemo">Anemo DMG</b> to opponents along its path.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathers the power of Anemo and plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-anemo">AoE Anemo DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      title: `White Clouds at Dawn`,
      content: `Xianyun enters the Cloud Transmogrification state, in which she will not take Fall DMG, and uses Skyladder once.
      <br />In this state, her Plunging Attack will be converted into Driftcloud Wave instead, which deals <b class="text-genshin-anemo">AoE Anemo DMG</b> and ends the Cloud Transmogrification state. This DMG is considered Plunging Attack DMG.
      <br />Each use of Skyladder while in this state increases the DMG and AoE of the next Driftcloud Wave used.
      <br />
      <br /><b>Skyladder</b>
      <br />Can be used while in mid-air. Xianyun leaps forward, dealing <b class="text-genshin-anemo">Anemo DMG</b> to targets along her path.
      <br />During each Cloud Transmogrification state Xianyun enters, Skyladder may be used up to <span class="text-desc">3</span> times and only <span class="text-desc">1</span> instance of Skyladder DMG can be dealt to any one opponent.
      <br />If Skyladder is not used again in a short period, the Cloud Transmogrification state will be canceled.
      <br />
      <br />If Xianyun does not use Driftcloud Wave while in this state, the next CD of White Clouds at Dawn will be decreased by 3s.
      `,
    },
    burst: {
      title: `Stars Gather at Dusk`,
      content: `Brings forth a sacred breeze that deals <b class="text-genshin-anemo">AoE Anemo DMG</b> and heals all nearby characters based on Xianyun's ATK. It will also summon the "Starwicker" mechanism.
      <br />
      <br /><b>Starwicker</b>
      <br />Continuously follows the active character and periodically heals all nearby party members based on Xianyun's ATK.
      <br />Starts with <span class="text-desc">8</span> stacks of Adeptal Assistance. While Adeptal Assistance is active, nearby active characters in the party will have their jump height increased.
      <br />When the active character completes a Plunging Attack, Starwicker will consume 1 stack of Adeptal Assistance and deal <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />Only <span class="text-desc">1</span> Starwicker can exist simultaneously.
      `,
    },
    a1: {
      title: `A1: Galefeather Pursuit`,
      content: `Each opponent hit by Driftcloud Waves from White Clouds at Dawn will grant all nearby party members <span class="text-desc">1</span> stack of Storm Pinion for <span class="text-desc">20</span>s. Max <span class="text-desc">4</span> stacks. These will cause the characters' Plunging Attack CRIT Rate to increase by <span class="text-desc">4%/6%/8%/10%</span> respectively.
      <br />Each Storm Pinion created by hitting an opponent has an independent duration.`,
    },
    a4: {
      title: `A4: Consider, the Adeptus in Her Realm`,
      content: `When the Starwicker created by Stars Gather at Dusk has Adeptal Assistance stacks, nearby active characters' Plunging Attack shockwave DMG will be increased by <span class="text-desc">0.1</span> of Xianyun's ATK. The maximum DMG increase that can be achieved this way is <span class="text-desc">9,000</span>.
      <br />Each Plunging Attack shockwave DMG instance can only apply this increased DMG effect to a single opponent. Each character can trigger this effect once every <span class="text-desc">0.4</span>s.`,
      value: [
        {
          name: 'Base Bonus Plung DMG',
          value: { stat: Stats.ATK, scaling: (atk) => _.round(_.min([2 * atk, 9000])).toLocaleString() },
        },
      ],
    },
    util: {
      title: `Crane Form`,
      content: `Increases gliding SPD for your own party members by <span class="text-desc">15%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      title: `C1: Purifying Wind`,
      content: `White Clouds at Dawn gains <span class="text-desc">1</span> additional charge.`,
    },
    c2: {
      title: `C2: Aloof From the World`,
      content: `After using a Skyladder from White Clouds at Dawn, Xianyun's ATK will be increased by <span class="text-desc">20%</span> for <span class="text-desc">15</span>s.
      <br />Additionally, the effects of the Passive Talent "Consider, the Adeptus in Her Realm" will be enhanced: When the Starwicker created by Stars Gather at Dusk has Adeptal Assistance stacks, nearby active characters' Plunging Attack shockwave DMG will be increased by <span class="text-desc">400%</span> of Xianyun's ATK. The maximum DMG increase that can be achieved this way is <span class="text-desc">18,000</span>.
      <br />Each Plunging Attack shockwave DMG instance can only apply this increased DMG effect to a single opponent. Each character can trigger this effect once every <span class="text-desc">0.4</span>s.
      <br />You must first unlock the Passive Talent "Consider, the Adeptus in Her Realm."`,
      value: [
        {
          name: 'Enhanced Bonus Plung DMG',
          value: { stat: Stats.ATK, scaling: (atk) => _.round(_.min([4 * atk, 18000])).toLocaleString() },
        },
      ],
    },
    c3: {
      title: `C3: Creations of Star and Moon`,
      content: `Increases the Level of Stars Gather at Dusk by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Mystery Millet Gourmet`,
      content: `After using Skyladder <span class="text-desc">1/2/3</span> times during one White Clouds at Dawn Cloud Transmogrification state, when a Driftcloud Wave unleashed during that instance hits an opponent, it will heal all nearby party members for <span class="text-desc">50%/80%/150%</span> of Xianyun's ATK. This effect can be triggered once every <span class="text-desc">5</span>s.`,
    },
    c5: {
      title: `C5: Astride Rose-Colored Clouds`,
      content: `Increases the Level of White Clouds at Dawn by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: They Call Her Cloud Retainer`,
      content: `After Xianyun uses <span class="text-desc">1/2/3</span> Skyladders within one Cloud Transmogrification caused by White Clouds at Dawn, the CRIT DMG of a Driftcloud Wave created in this instance of Cloud Transmogrification will be increased by <span class="text-desc">15%/35%/70%</span>%.
      <br />Within <span class="text-desc">16</span>s after Xianyun has used Stars Gather at Dusk, White Clouds at Dawn will not enter CD. This effect will be canceled once she has used White Clouds at Dawn <span class="text-desc">8</span> times.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'skyladder',
      text: `Skyladder Stacks`,
      ...talents.skill,
      show: true,
      default: 3,
      min: 0,
      max: 3,
    },
    {
      type: 'number',
      id: 'storm_pinion',
      text: `Storm Pinion Stacks`,
      ...talents.a1,
      show: a >= 1,
      default: 0,
      min: 0,
      max: 4,
    },
    {
      type: 'toggle',
      id: 'xianyun_a4',
      text: `A4 Bonus Plunge DMG`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'xianyun_a4')]

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
          value: [{ scaling: calcScaling(0.403, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3886, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.488, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.488, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.2312, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
        },
      ]
      const c6Cd = form.skyladder >= 3 ? 0.7 : form.skyladder >= 2 ? 0.35 : form.skyladder ? 0.15 : 0
      base.PLUNGE_SCALING = form.skyladder
        ? [
            {
              name: 'Driftcloud Wave DMG',
              value: [
                {
                  scaling: calcScaling(
                    form.skyladder >= 3 ? 3.376 : form.skyladder >= 2 ? 1.48 : form.skyladder ? 1.16 : 0,
                    skill,
                    'elemental',
                    '1_alt'
                  ),
                  multiplier: Stats.ATK,
                },
              ],
              element: Element.ANEMO,
              property: TalentProperty.PA,
              cd: c >= 6 ? c6Cd : 0,
            },
          ]
        : getPlungeScaling('catalyst', normal, Element.ANEMO)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.952, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.08, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Starwicker DMG`,
          value: [{ scaling: calcScaling(0.392, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Healing`,
          value: [{ scaling: calcScaling(0.9216, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(578, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: `Continuous Healing`,
          value: [{ scaling: calcScaling(0.4301, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(270, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]
      if (form.storm_pinion) base[Stats.CRIT_RATE] += form.storm_pinion * 0.2 + 0.2
      if (c >= 2 && form.skyladder) base[Stats.P_ATK] += 0.2

      if (c >= 6 && form.skyladder)
        base.PLUNGE_SCALING.push({
          name: 'C4 Healing',
          value: [
            {
              scaling: form.skyladder >= 3 ? 1.5 : form.skyladder >= 2 ? 0.8 : form.skyladder ? 0.5 : 0,
              multiplier: Stats.ATK,
            },
          ],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xianyun_a4) base.PLUNGE_F_DMG += _.min([2 * own.getAtk(), 9000]) * (c >= 2 ? 2 : 1)

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.xianyun_a4) base.PLUNGE_F_DMG += _.min([2 * base.getAtk(), 9000]) * (c >= 2 ? 2 : 1)
      return base
    },
  }
}

export default Xianyun
