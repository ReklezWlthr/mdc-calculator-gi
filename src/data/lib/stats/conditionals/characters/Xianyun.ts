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
      <br />During each Cloud Transmogrification state Xianyun enters, Skyladder may be used up to <span class="text-yellow">3</span> times and only <span class="text-yellow">1</span> instance of Skyladder DMG can be dealt to any one opponent.
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
      <br />Starts with <span class="text-yellow">8</span> stacks of Adeptal Assistance. While Adeptal Assistance is active, nearby active characters in the party will have their jump height increased.
      <br />When the active character completes a Plunging Attack, Starwicker will consume 1 stack of Adeptal Assistance and deal <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />Only <span class="text-yellow">1</span> Starwicker can exist simultaneously.
      `,
    },
    a1: {
      title: `A1: Galefeather Pursuit`,
      content: `Each opponent hit by Driftcloud Waves from White Clouds at Dawn will grant all nearby party members <span class="text-yellow">1</span> stack of Storm Pinion for <span class="text-yellow">20</span>s. Max <span class="text-yellow">4</span> stacks. These will cause the characters' Plunging Attack CRIT Rate to increase by <span class="text-yellow">4%/6%/8%/10%</span> respectively.
      <br />Each Storm Pinion created by hitting an opponent has an independent duration.`,
    },
    a4: {
      title: `A4: Consider, the Adeptus in Her Realm`,
      content: `When the Starwicker created by Stars Gather at Dusk has Adeptal Assistance stacks, nearby active characters' Plunging Attack shockwave DMG will be increased by <span class="text-yellow">0.1</span> of Xianyun's ATK. The maximum DMG increase that can be achieved this way is <span class="text-yellow">9,000</span>.
      <br />Each Plunging Attack shockwave DMG instance can only apply this increased DMG effect to a single opponent. Each character can trigger this effect once every <span class="text-yellow">0.4</span>s.`,
    },
    util: {
      title: `Crane Form`,
      content: `Increases gliding SPD for your own party members by <span class="text-yellow">15%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      title: `C1: Purifying Wind`,
      content: `White Clouds at Dawn gains <span class="text-yellow">1</span> additional charge.`,
    },
    c2: {
      title: `C2: Aloof From the World`,
      content: `After using a Skyladder from White Clouds at Dawn, Xianyun's ATK will be increased by <span class="text-yellow">20%</span> for <span class="text-yellow">15</span>s.
      <br />Additionally, the effects of the Passive Talent "Consider, the Adeptus in Her Realm" will be enhanced: When the Starwicker created by Stars Gather at Dusk has Adeptal Assistance stacks, nearby active characters' Plunging Attack shockwave DMG will be increased by <span class="text-yellow">400%</span> of Xianyun's ATK. The maximum DMG increase that can be achieved this way is <span class="text-yellow">18,000</span>.
      <br />Each Plunging Attack shockwave DMG instance can only apply this increased DMG effect to a single opponent. Each character can trigger this effect once every <span class="text-yellow">0.4</span>s.
      <br />You must first unlock the Passive Talent "Consider, the Adeptus in Her Realm."`,
    },
    c3: {
      title: `C3: Creations of Star and Moon`,
      content: `Increases the Level of Stars Gather at Dusk by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Mystery Millet Gourmet`,
      content: `After using Skyladder <span class="text-yellow">1/2/3</span> times during one White Clouds at Dawn Cloud Transmogrification state, when a Driftcloud Wave unleashed during that instance hits an opponent, it will heal all nearby party members for <span class="text-yellow">50%/80%/150%</span> of Xianyun's ATK. This effect can be triggered once every <span class="text-yellow">5</span>s.`,
    },
    c5: {
      title: `C5: Astride Rose-Colored Clouds`,
      content: `Increases the Level of White Clouds at Dawn by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: They Call Her Cloud Retainer`,
      content: `After Xianyun uses <span class="text-yellow">1/2/3</span> Skyladders within one Cloud Transmogrification caused by White Clouds at Dawn, the CRIT DMG of a Driftcloud Wave created in this instance of Cloud Transmogrification will be increased by <span class="text-yellow">15%/35%/70%</span>%.
      <br />Within <span class="text-yellow">16</span>s after Xianyun has used Stars Gather at Dusk, White Clouds at Dawn will not enter CD. This effect will be canceled once she has used White Clouds at Dawn <span class="text-yellow">8</span> times.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'windfavored',
      text: `Windfavored State`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'windfavored_pyro',
      text: `Windfavored State: Pyro`,
      ...talents.a1,
      show: a >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'windfavored_cryo',
      text: `Windfavored State: Cryo`,
      ...talents.a1,
      show: a >= 1,
      default: false,
    },
    {
      type: 'number',
      id: 'wanderer_c2',
      text: `C2 Burst DMG per Missing Point`,
      ...talents.c2,
      show: c >= 2,
      default: 100,
      min: 0,
      max: 140,
    },
  ]

  const teammateContent: IContent[] = []

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
          name: '3-Hit',
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
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ANEMO)

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
          name: `Skill DMG [x5]`,
          value: [{ scaling: calcScaling(1.472, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
      ]
      if (form.windfavored_pyro) base[Stats.P_ATK] += 0.3
      if (form.windfavored_cryo) base[Stats.CRIT_RATE] += 0.2

      if (a >= 4)
        base.SKILL_SCALING.push({
          name: 'Wind Arrow DMG [x4]',
          value: [{ scaling: 0.35 + (c >= 1 ? 0.25 : 0), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.ADD,
        })
      if (c >= 1 && form.windfavored) base.ATK_SPD += 0.1
      if (form.wanderer_c2) base.BURST_DMG += _.min([form.wanderer_c2 * 0.04, 2])

      if (c >= 6)
        base.BASIC_SCALING.push({
          name: 'Kuugo: Fushoudan DMG',
          value: [{ scaling: 0.4, multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Xianyun
