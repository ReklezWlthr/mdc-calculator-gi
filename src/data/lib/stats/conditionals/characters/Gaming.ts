import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Gaming = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Stellar Rend`,
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
      title: `Bestial Ascent`,
      content: `Pounces forward using the Wushou arts, leaping high into the air after coming into contact with a target or surface.
      <br />After Gaming has used Bestial Ascent to rise into the air, he will use the especially powerful Plunging Attack: Charmed Cloudstrider when performing a Plunging Attack.
      <br />
      <br /><b>Plunging Attack: Charmed Cloudstrider</b>
      <br />The DMG from Plunging Attacks caused by Bestial Ascent is converted to <b class="text-genshin-pyro">Pyro DMG</b> that cannot be overridden by other elemental infusions. Upon landing, Gaming will consume a fixed amount of HP. Gaming's HP cannot be reduced below <span class="text-desc">10%</span> by this method.
      <br />Charmed Cloudstrider DMG is considered Plunging Attack DMG.
      `,
    },
    burst: {
      title: `Suanni's Gilded Dance`,
      content: `Gaming enters Wushou Stance, briefly applying <b class="text-genshin-pyro">Pyro</b> to him, recovering a fixed amount of HP, and summons his companion, the Suanni Man Chai, to smash into his target, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />After bashing its target, Man Chai will roll to a nearby location before moving towards Gaming. When it links up with Gaming, Man Chai will leave the field and reset the CD for Gaming's Elemental Skill, Bestial Ascent.
      <br />While Wushou Stance is active, his resistance to interruption is increased, and when Gaming lands with Charmed Cloudstrider attack or completes the forward pounce attack from Bestial Ascent with over <span class="text-desc">50%</span> HP, he will summon Man Chai again.
      <br />Each Gaming can only have 1 Man Chai on the field simultaneously.
      <br />This effect will be canceled once Gaming leaves the field.`,
    },
    a1: {
      title: `A1: Dance of Amity`,
      content: `After Bestial Ascent's Plunging Attack: Charmed Cloudstrider hits an opponent, Gaming will regain <span class="text-desc">1.5%</span> of his Max HP once every <span class="text-desc">0.2</span>s for <span class="text-desc">0.8</span>s.`,
    },
    a4: {
      title: `A4: Air of Prosperity`,
      content: `When Gaming has less than <span class="text-desc">50%</span> HP, he will receive a <span class="text-desc">20%</span> Incoming Healing Bonus. When Gaming has <span class="text-desc">50%</span> HP or more, Plunging Attack: Charmed Cloudstrider will deal <span class="text-desc">20%</span> more DMG.`,
    },
    util: {
      title: `The Striding Beast`,
      content: `During the day (6:00 - 18:00), your party members gain the Swift Stride effect: Movement SPD increased by <span class="text-desc">10%</span>.
      <br />This effect does not take effect in Domains, Trounce Domains and the Spiral Abyss. Swift Stride does not stack.`,
    },
    c1: {
      title: `C1: Bringer of Blessing`,
      content: `When the Suanni Man Chai from Suanni's Gilded Dance meets back up with Gaming, it will heal <span class="text-desc">15%</span> of Gaming's HP.`,
    },
    c2: {
      title: `C2: Plum Blossoms Underfoot`,
      content: `When Gaming receives healing and this instance of healing overflows, his ATK will be increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
    },
    c3: {
      title: `C3: Awakening Spirit`,
      content: `Increases the Level of Bestial Ascent by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Soar Across Mountains`,
      content: `When Bestial Ascent's Plunging Attack: Charmed Cloudstrider hits an opponent, it will restore <span class="text-desc">2</span> Energy to Gaming. This effect can be triggered once every <span class="text-desc">0.2</span>s.`,
    },
    c5: {
      title: `C5: Evil-Daunting Roar`,
      content: `Increases the Level of Suanni's Gilded Dance by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: To Tame All Beasts`,
      content: `Bestial Ascent's Plunging Attack: Charmed Cloudstrider CRIT Rate increased by <span class="text-desc">20%</span> and CRIT DMG increased by <span class="text-desc">40%</span>, and its attack radius will be increased.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'gaming_a4',
      text: `Current HP >= 50%`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'gaming_c2',
      text: `Healing Overflow Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: true,
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
      base.MAX_ENERGY = 80

      if (form.diluc_infusion) {
        base.INFUSION = Element.PYRO
        if (a >= 4) base[Stats.PYRO_DMG] += 0.2
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.8386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.7904, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(1.0665, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.2795, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.6252, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
      base.PLUNGE_SCALING = [
        {
          name: 'Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(0.6415, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'Low Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.2826, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'High Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.6021, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
      ]

      const a1Heal =
        a >= 1
          ? [
              {
                name: 'Healing On Hit [x4]',
                value: [{ scaling: 0.015, multiplier: Stats.HP }],
                element: TalentProperty.HEAL,
                property: TalentProperty.HEAL,
              },
            ]
          : []

      base.SKILL_SCALING = [
        {
          name: 'Plunging Attack: Charmed Cloudstrider DMG',
          value: [{ scaling: calcScaling(2.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.PA,
          bonus: form.gaming_a4 ? 0.2 : 0,
          cr: c >= 6 ? 0.2 : 0,
          cd: c >= 6 ? 0.4 : 0,
        },
        ...a1Heal,
      ]
      base.BURST_SCALING = [
        {
          name: `Suanni Man Chai Smash DMG`,
          value: [{ scaling: calcScaling(3.704, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Cast Healing`,
          value: [{ scaling: 0.3, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (!form.gaming_a4) base[Stats.I_HEALING] += 0.2
      if (c >= 1)
        base.BURST_SCALING.push({
          name: `C1 Meetup Healing`,
          value: [{ scaling: 0.15, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      if (form.gaming_c2) base[Stats.P_ATK] += 0.2

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

export default Gaming
