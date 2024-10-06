import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Navia = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const elementCount = _.filter(teamData, (item) =>
    _.includes([Element.PYRO, Element.HYDRO, Element.ELECTRO, Element.CRYO], item)
  ).length

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Blunt Refusal`,
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
      trace: `Elemental Skill`,
      title: `Ceremonial Crystalshot`,
      content: `When a character in the party obtains an Elemental Shard created from the Crystallize reaction, Navia will gain <span class="text-desc">1</span> <b class="text-genshin-geo">Crystal Shrapnel</b> stack. Navia can have up to <span class="text-desc">6</span> stacks of <b class="text-genshin-geo">Crystal Shrapnel</b> at once. Each time <b class="text-genshin-geo">Crystal Shrapnel</b> gain is triggered, the duration of the <b class="text-genshin-geo">Crystal Shrapnel</b> stacks you already have will be reset.
      <br />When she fires, Navia will consume all <b class="text-genshin-geo">Crystal Shrapnel</b> stacks and open her elegant yet lethal Gunbrella, firing multiple Rosula Shardshots that can penetrate opponents, dealing <b class="text-genshin-geo">Geo DMG</b> to opponents hit.
      <br />When <span class="text-desc">0/1/2/3</span> or more stacks of <b class="text-genshin-geo">Crystal Shrapnel</b> are consumed, <span class="text-desc">5/7/9/11</span> <b>Rosula Shardshots</b> will be fired respectively. The more <b>Rosula Shardshots</b> that strike a single opponent, the greater the DMG dealt to them. When all <span class="text-desc">11</span> <b>Rosula Shardshots</b> strike, <span class="text-desc">200%</span> of the original amount of DMG is dealt.
      <br />In addition, when more than <span class="text-desc">3</span> stacks of <b class="text-genshin-geo">Crystal Shrapnel</b> are consumed, every stack consumed beyond those <span class="text-desc">3</span> will increase the DMG dealt by this Gunbrella attack by an additional <span class="text-desc">15%</span>.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode, continually collecting nearby Elemental Shards created by Crystallize reactions. When released, fire <b>Rosula Shardshots</b> with the same effect as when the skill is <b>Pressed</b>.
      <br />
      <br />Two initial charges.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />Periodically, when Navia fires her Gunbrella, a <b class="text-genshin-ousia">Surging Blade</b> will be summoned, dealing <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-geo">Geo DMG</b>.
      `,
      image: 'Skill_S_Navia_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `As the Sunlit Sky's Singing Salute`,
      content: `On the orders of the President of the Spina di Rosula, call for a magnificent Rosula Dorata Salute. Unleashes a massive cannon bombardment on opponents in front of her, dealing <b class="text-genshin-geo">AoE Geo DMG</b> and providing <b>Cannon Fire Support</b> for a duration afterward, periodically dealing <b class="text-genshin-geo">Geo DMG</b> to nearby opponents.
      <br />When cannon attacks hit opponents, Navia will gain <span class="text-desc">1</span> stack of <b class="text-genshin-geo">Crystal Shrapnel</b>. This effect can be triggered up to once every <span class="text-desc">2.4</span>s.`,
      image: 'Skill_E_Navia_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Undisclosed Distribution Channels`,
      content: `For <span class="text-desc">4</span>s after using <b>Ceremonial Crystalshot</b>, the DMG dealt by Navia's Normal Attacks, Charged Attacks, and Plunging Attacks will be converted into <b class="text-genshin-geo">Geo DMG</b> which cannot be overridden by other Elemental infusions, and the DMG dealt by Navia's Normal Attacks, Charged Attacks, and Plunging Attacks will be increased by <span class="text-desc">40%</span>.`,
      image: 'UI_Talent_S_Navia_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Mutual Assistance Network`,
      content: `For each <b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-electro">Electro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-hydro">Hydro</b> party member, Navia gains <span class="text-desc">20%</span> increased ATK. This effect can stack up to <span class="text-desc">2</span> times.`,
      image: 'UI_Talent_S_Navia_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Painstaking Transaction`,
      content: `Gains <span class="text-desc">25%</span> more rewards when dispatched on an Fontaine Expedition for <span class="text-desc">20</span> hours.`,
      image: 'UI_Talent_S_Navia_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `A Lady's Rules for Keeping a Courteous Distance`,
      content: `Each stack of <b class="text-genshin-geo">Crystal Shrapnel</b> consumed when Navia uses <b>Ceremonial Crystalshot</b> will restore <span class="text-desc">3</span> Energy to her and decrease the CD of <b>As the Sunlit Sky's Singing Salute</b> by <span class="text-desc">1</span>s. Up to <span class="text-desc">9</span> Energy can be gained this way, and the CD of <b>As the Sunlit Sky's Singing Salute</b> can be decreased by up to <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Navia_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The President's Pursuit of Victory`,
      content: `Each stack of <b class="text-genshin-geo">Crystal Shrapnel</b> consumed will increase the CRIT Rate of this <b>Ceremonial Crystalshot</b> instance by <span class="text-desc">12%</span>. CRIT Rate can be increased by up to <span class="text-desc">36%</span> in this way.
      <br />In addition, when <b>Ceremonial Crystalshot</b> hits an opponent, one <b>Cannon Fire Support</b> shot from <b>As the Sunlit Sky's Singing Salute</b> will strike near the location of the hit. Up to one instance of <b>Cannon Fire Support</b> can be triggered each time <b>Ceremonial Crystalshot</b> is used, and DMG dealt by said <b>Cannon Fire Support</b> this way is considered Elemental Burst DMG.`,
      image: 'UI_Talent_S_Navia_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Businesswoman's Broad Vision`,
      content: `Increases the Level of <b>Ceremonial Crystalshot</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Navia_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `The Oathsworn Never Capitulate`,
      content: `When <b>As the Sunlit Sky's Singing Salute</b> hits an opponent, that opponent's <b class="text-genshin-geo">Geo RES</b> will be decreased by <span class="text-desc">20%</span> for <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Navia_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Negotiator's Resolute Negotiations`,
      content: `Increases the Level of <b>As the Sunlit Sky's Singing Salute</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Navia_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Flexible Finesse of the Spina's President`,
      content: `If more than <span class="text-desc">3</span> stacks of <b class="text-genshin-geo">Crystal Shrapnel</b> are consumed when using <b>Ceremonial Crystalshot</b>, each stack consumed beyond the first <span class="text-desc">3</span> increases the CRIT DMG of that <b>Ceremonial Crystalshot</b> by <span class="text-desc">45%</span>, and any stacks consumed beyond the first <span class="text-desc">3</span> are returned to Navia.`,
      image: 'UI_Talent_S_Navia_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'crystal_shrapnel',
      text: `Crystal Shrapnel Consumed`,
      ...talents.skill,
      show: true,
      default: 3,
      max: 6,
      min: 0,
    },
    {
      type: 'toggle',
      id: 'navia_infusion',
      text: `A1 Geo Infusion`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'navia_c4',
      text: `C4 Geo RES Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'navia_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      if (form.navia_infusion) {
        base.infuse(Element.GEO, true)
        base.BASIC_DMG.push({ value: 0.4, name: '', source: `` })
        base.CHARGE_DMG.push({ value: 0.4, name: '', source: `` })
        base.PLUNGE_DMG.push({ value: 0.4, name: '', source: `` })
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.9352, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.8651, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x3]',
          value: [{ scaling: calcScaling(0.3489, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.3343, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      let shrapnelBonus = 1
      switch (form.crystal_shrapnel) {
        case 0:
          shrapnelBonus = 1.2
          break
        case 1:
          shrapnelBonus = 1.4
          break
        case 2:
          shrapnelBonus = 1.667
          break
        default:
          shrapnelBonus = 2
      }
      const shrapnelOverflow = _.max([form.crystal_shrapnel - 3, 0]) * 0.15
      base.SKILL_SCALING = [
        {
          name: 'Rosula Shardshot DMG',
          value: [{ scaling: calcScaling(3.948, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
          bonus: shrapnelOverflow,
          cr: c >= 2 && form.crystal_shrapnel ? _.min([form.crystal_shrapnel, 3]) * 0.12 : 0,
          cd: c >= 6 && form.crystal_shrapnel ? _.max([form.crystal_shrapnel - 3, 0]) * 0.45 : 0,
          multiplier: shrapnelBonus,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.36, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.752, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: `Cannon Fire Support DMG`,
          value: [{ scaling: calcScaling(0.4315, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 4)
        base[Stats.P_ATK].push({
          value: _.min([elementCount, 2]) * 0.2,
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
      if (form.navia_c4) base.GEO_RES_PEN.push({ value: 0.2, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.navia_c4) base.GEO_RES_PEN.push({ value: 0.2, name: 'Constellation 4', source: `Navia` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Navia
