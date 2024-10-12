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
      level: normal,
      trace: `Normal Attack`,
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
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Bestial Ascent`,
      content: `Pounces forward using the Wushou arts, leaping high into the air after coming into contact with a target or surface.
      <br />After Gaming has used <b>Bestial Ascent</b> to rise into the air, he will use the especially powerful <b>Plunging Attack: Charmed Cloudstrider</b> when performing a Plunging Attack.
      <br />
      <br /><b>Plunging Attack: Charmed Cloudstrider</b>
      <br />The DMG from Plunging Attacks caused by <b>Bestial Ascent</b> is converted to <b class="text-genshin-pyro">Pyro DMG</b> that cannot be overridden by other elemental infusions. Upon landing, Gaming will consume a fixed amount of HP. Gaming's HP cannot be reduced below <span class="text-desc">10%</span> by this method.
      <br /><b>Charmed Cloudstrider</b> DMG is considered Plunging Attack DMG.
      `,
      image: 'Skill_S_Gaming_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Suanni's Gilded Dance`,
      content: `Gaming enters <b class="text-genshin-pyro">Wushou Stance</b>, briefly applying <b class="text-genshin-pyro">Pyro</b> to him, recovering a fixed amount of HP, and summons his companion, the Suanni Man Chai, to smash into his target, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />After bashing its target, Man Chai will roll to a nearby location before moving towards Gaming. When it links up with Gaming, Man Chai will leave the field and reset the CD for Gaming's Elemental Skill, <b>Bestial Ascent</b>.
      <br />While <b class="text-genshin-pyro">Wushou Stance</b> is active, his resistance to interruption is increased, and when Gaming lands with <b>Charmed Cloudstrider</b> attack or completes the forward pounce attack from <b>Bestial Ascent</b> with over <span class="text-desc">50%</span> HP, he will summon Man Chai again.
      <br />Each Gaming can only have <span class="text-desc">1</span> Man Chai on the field simultaneously.
      <br />This effect will be canceled once Gaming leaves the field.`,
      image: 'Skill_E_Gaming_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Dance of Amity`,
      content: `After <b>Bestial Ascent</b>'s <b>Plunging Attack: Charmed Cloudstrider</b> hits an opponent, Gaming will regain <span class="text-desc">1.5%</span> of his Max HP once every <span class="text-desc">0.2</span>s for <span class="text-desc">0.8</span>s.`,
      image: 'UI_Talent_S_Gaming_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Air of Prosperity`,
      content: `When Gaming has less than <span class="text-desc">50%</span> HP, he will receive a <span class="text-desc">20%</span> Incoming Healing Bonus. When Gaming has <span class="text-desc">50%</span> HP or more, <b>Plunging Attack: Charmed Cloudstrider</b> will deal <span class="text-desc">20%</span> more DMG.`,
      image: 'UI_Talent_S_Gaming_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Striding Beast`,
      content: `During the day (6:00 - 18:00), your party members gain the Swift Stride effect: Movement SPD increased by <span class="text-desc">10%</span>.
      <br />This effect does not take effect in Domains, Trounce Domains and the Spiral Abyss. Swift Stride does not stack.`,
      image: 'UI_Talent_S_Dehya_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Bringer of Blessing`,
      content: `When the Suanni Man Chai from <b>Suanni's Gilded Dance</b> meets back up with Gaming, it will heal <span class="text-desc">15%</span> of Gaming's HP.`,
      image: 'UI_Talent_S_Gaming_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Plum Blossoms Underfoot`,
      content: `When Gaming receives healing and this instance of healing overflows, his ATK will be increased by <span class="text-desc">20%</span> for <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Gaming_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Awakening Spirit`,
      content: `Increases the Level of <b>Bestial Ascent</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Gaming_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Soar Across Mountains`,
      content: `When <b>Bestial Ascent</b>'s <b>Plunging Attack: Charmed Cloudstrider</b> hits an opponent, it will restore <span class="text-desc">2</span> Energy to Gaming. This effect can be triggered once every <span class="text-desc">0.2</span>s.`,
      image: 'UI_Talent_S_Gaming_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Evil-Daunting Roar`,
      content: `Increases the Level of <b>Suanni's Gilded Dance</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Gaming_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `To Tame All Beasts`,
      content: `<b>Bestial Ascent</b>'s <b>Plunging Attack: Charmed Cloudstrider</b> CRIT Rate increased by <span class="text-desc">20%</span> and CRIT DMG increased by <span class="text-desc">40%</span>, and its attack radius will be increased.`,
      image: 'UI_Talent_S_Gaming_04',
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
      

      if (form.diluc_infusion) {
        base.INFUSION = Element.PYRO
        if (a >= 4) base[Stats.PYRO_DMG].push({ value: 0.2, name: '', source: `` })
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.8386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
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
                name: 'Healing On Hit',
                value: [{ scaling: 0.015, multiplier: Stats.HP }],
                element: TalentProperty.HEAL,
                property: TalentProperty.HEAL,
                self: true,
                hit: 4,
              },
            ]
          : []

      base.SKILL_SCALING = [
        {
          name: 'Charmed Cloudstrider DMG',
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
          self: true,
        },
      ]

      if (!form.gaming_a4) base[Stats.I_HEALING].push({ value: 0.2, name: 'Ascension 4 Passive', source: `Self` })
      if (c >= 1)
        base.BURST_SCALING.push({
          name: `C1 Meetup Healing`,
          value: [{ scaling: 0.15, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
          self: true,
        })
      if (form.gaming_c2) base[Stats.P_ATK].push({ value: 0.2, name: 'Constellation 2', source: `Self` })

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
