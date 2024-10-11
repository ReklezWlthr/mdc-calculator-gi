import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Nilou = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const hydro = _.filter(teamData, (item) => item === Element.HYDRO).length
  const dendro = _.filter(teamData, (item) => item === Element.DENDRO).length
  const a1Active = hydro + dendro === _.filter(teamData, (item) => !!item).length && hydro >= 1 && dendro >= 1

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Dance of Samser`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive sword strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to perform a twirling slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Dance of Haftkarsvar`,
      content: `Enters the Pirouette state, dealing <b class="text-genshin-hydro">Hydro DMG</b> to nearby opponents based on Nilou's Max HP.
      <br />While she is in the <b class="text-genshin-hydro">Pirouette</b> state, Nilou's Normal Attacks and Elemental Skill will cause her to enter the <b>Sword Dance</b> and <b>Whirling Steps</b> stances respectively, causing DMG she deals to be converted to <b class="text-genshin-hydro">Hydro DMG</b> that cannot be overridden and that is considered Elemental Skill DMG.
      <br />
      <br />In these stances, Nilou's third dance step will end <b class="text-genshin-hydro">Pirouette</b>, and has the following effects:
      <br />- <b>Sword Dance</b>: unleashes a <b>Luminous Illusion</b> that deals <b class="text-genshin-hydro">Hydro DMG</b> to opponents it touches and grants Nilou the <b class="text-blue">Lunar Prayer</b> effect. This effect converts Nilou's Normal Attacks into <b>Sword Dance</b> techniques, and her final hit will unleash a <b>Luminous Illusion</b>.
      <br />- <b>Whirling Steps</b>: Nilou unleashes a <b>Whirling Water Wheel</b> that deals <b class="text-genshin-hydro">AoE Hydro DMG</b> and creates a <b class="text-blue">Tranquility Aura</b> that follows your active character around and applies <b class="text-genshin-hydro">Wet</b> to opponents within its AoE.
      <br />
      <br />Nilou is unable to perform Charged Attacks when under the effect of <b class="text-genshin-hydro">Pirouette</b> or <b class="text-blue">Lunar Prayer</b>. These effects will be removed once she leaves the field.
      `,
      image: 'Skill_S_Nilou_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Dance of Abzendegi: Distant Dreams, Listening Spring`,
      content: `Begins the dance of faraway dreams and springs that hear, causing a Lotus of Distant Waters to bloom, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Nilou's Max HP and applying the <b>Lingering Aeon</b> effect to all opponents hit.
      <br />After an interval, opponents affected by <b>Lingering Aeon</b> will take <b class="text-genshin-hydro">Hydro DMG</b>.`,
      image: 'Skill_E_Nilou_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Court of Dancing Petals	`,
      content: `When all characters in the party are all <b class="text-genshin-dendro">Dendro</b> or <b class="text-genshin-hydro">Hydro</b>, and there are at least one <b class="text-genshin-dendro">Dendro</b> character and one <b class="text-genshin-hydro">Hydro</b> character:
      <br />The completion of the third dance step of Nilou's <b>Dance of Haftkarsvar</b> will grant all nearby characters the <b class="text-desc">Golden Chalice's Bounty</b> for <span class="text-desc">30</span>s.
      <br />Characters under the effect of <b class="text-desc">Golden Chalice's Bounty</b> will increase the Elemental Mastery of all nearby characters by <span class="text-desc">100</span> for <span class="text-desc">10</span>s whenever they are hit by <b class="text-genshin-dendro">Dendro attacks</b>. Also, triggering the Bloom reaction will create <b class="text-genshin-dendro">Bountiful Cores</b> instead of <b class="text-genshin-dendro">Dendro Cores</b>.
      <br />Such <b class="text-genshin-dendro">Cores</b> will burst very quickly after being created, and they have larger AoEs.
      <br /><b class="text-genshin-dendro">Bountiful Cores</b> cannot trigger Hyperbloom or Burgeon, and they share an upper numerical limit with <b class="text-genshin-dendro">Dendro Cores</b>. <b class="text-genshin-dendro">Bountiful Core DMG</b> is considered DMG dealt by <b class="text-genshin-dendro">Dendro Cores</b> produced by Bloom.
      <br />Should the party not meet the conditions for this Passive Talent, any existing <b class="text-desc">Golden Chalice's Bounty</b> effects will be canceled.`,
      image: 'UI_Talent_S_Nilou_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Dreamy Dance of Aeons`,
      content: `Every <span class="text-desc">1,000</span> points of Nilou's Max HP above <span class="text-desc">30,000</span> will cause the DMG dealt by <b class="text-genshin-dendro">Bountiful Cores</b> created by characters affected by <b class="text-desc">Golden Chalice's Bounty</b> to increase by <span class="text-desc">9%</span>.
      <br />The maximum increase in <b class="text-genshin-dendro">Bountiful Core DMG</b> that can be achieved this way is <span class="text-desc">400%</span>.`,
      image: 'UI_Talent_S_Nilou_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `White Jade Lotus`,
      content: `When Perfect Cooking is achieved on Food with Adventure-related effects, there is a <span class="text-desc">12%</span> chance to obtain double the product.`,
      image: 'UI_Talent_S_Yunjin_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Dance of the Waning Moon`,
      content: `<b>Dance of Haftkarsvar</b> will be enhanced as follows:
      <br />- <b>Luminous Illusion</b> DMG is increased by <span class="text-desc">65%</span>.
      <br />- The <b class="text-blue">Tranquility Aura</b>'s duration is extended by <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Nilou_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The Starry Skies Their Flowers Rain`,
      content: `After characters affected by the <b class="text-desc">Golden Chalice's Bounty</b> deal <b class="text-genshin-hydro">Hydro DMG</b> to an opponent, that opponent's <b class="text-genshin-hydro">Hydro RES</b> will be decreased by <span class="text-desc">35%</span> for <span class="text-desc">10</span>s. After a triggered Bloom reaction deals DMG to opponents, their <b class="text-genshin-dendro">Dendro RES</b> will be decreased by <span class="text-desc">35%</span> for <span class="text-desc">10</span>s.
      <br />You need to have unlocked the <b>Court of Dancing Petals</b> Talent.`,
      image: 'UI_Talent_S_Nilou_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Beguiling Shadowstep`,
      content: `Increases the Level of <b>Dance of Abzendegi: Distant Dreams, Listening Spring</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Nilou_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Fricative Pulse`,
      content: `After the third dance step of <b>Dance of Haftkarsvar</b>'s <b class="text-genshin-hydro">Pirouette</b> hits opponents, Nilou will gain <span class="text-desc">15</span> Elemental Energy, and DMG from her <b>Dance of Abzendegi: Distant Dreams, Listening Spring</b> will be increased by <span class="text-desc">50%</span> for <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Nilou_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Twirling Light`,
      content: `Increases the Level of <b>Dance of Haftkarsvar</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Nilou_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Frostbreaker's Melody`,
      content: `For every <span class="text-desc">1,000</span> points of Max HP, Nilou's CRIT Rate and CRIT DMG will increase by <span class="text-desc">0.6%</span> and <span class="text-desc">1.2%</span> respectively.
      <br />The maximum increase in CRIT Rate and CRIT DMG via this method is <span class="text-desc">30%</span> and <span class="text-desc">60%</span> respectively.`,
      image: 'UI_Talent_S_Nilou_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'sword_dance',
      text: `Lunar Prayer`,
      ...talents.skill,
      show: true,
      default: false,
    },
    {
      type: 'toggle',
      id: 'bountiful_core',
      text: `Golden Chalice's Bounty`,
      ...talents.a1,
      show: a >= 1 && a1Active,
      default: true,
    },
    {
      type: 'toggle',
      id: 'c2_hydro_shred',
      text: `C2 Hydro RES Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'c2_dendro_shred',
      text: `C2 Dendro RES Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'nilou_c4',
      text: `C4 Burst DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'bountiful_core'),
    findContentById(content, 'c2_hydro_shred'),
    findContentById(content, 'c2_dendro_shred'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = form.sword_dance
        ? [
            {
              name: 'Sword Dance 1-Hit',
              value: [{ scaling: calcScaling(0.0455, skill, 'physical', '1'), multiplier: Stats.HP }],
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
            {
              name: 'Sword Dance 2-Hit',
              value: [{ scaling: calcScaling(0.0514, skill, 'physical', '1'), multiplier: Stats.HP }],
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
            {
              name: 'Luminous Illusion DMG',
              value: [{ scaling: calcScaling(0.0717, skill, 'physical', '1'), multiplier: Stats.HP }],
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
              bonus: c >= 1 ? 0.65 : 0,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.5031, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.4544, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.7035, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.sword_dance
        ? []
        : [
            {
              name: 'Charged Attack DMG [1]',
              value: [{ scaling: calcScaling(0.5022, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
            {
              name: 'Charged Attack DMG [2]',
              value: [{ scaling: calcScaling(0.5444, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.0334, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Whirling Steps 1-Hit',
          value: [{ scaling: calcScaling(0.0326, skill, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Whirling Steps 2-Hit',
          value: [{ scaling: calcScaling(0.0396, skill, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Water Wheel DMG',
          value: [{ scaling: calcScaling(0.0506, skill, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.1843, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Lingering Aeon DMG',
          value: [{ scaling: calcScaling(0.2253, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.bountiful_core) base[Stats.EM].push({ value: 100, name: `Golden Chalice's Bounty`, source: 'Self' })

      if (form.c2_hydro_shred) base.HYDRO_RES_PEN.push({ value: 0.35, name: 'Constellation 2', source: 'Self' })
      if (form.c2_dendro_shred) base.DENDRO_RES_PEN.push({ value: 0.35, name: 'Constellation 2', source: 'Self' })
      if (form.nilou_c4) base.BURST_DMG.push({ value: 0.5, name: 'Constellation 4', source: 'Self' })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.bountiful_core) base[Stats.EM].push({ value: 100, name: `Golden Chalice's Bounty`, source: 'Nilou' })

      if (form.c2_hydro_shred) base.HYDRO_RES_PEN.push({ value: 0.35, name: 'Constellation 2', source: 'Nilou' })
      if (form.c2_dendro_shred) base.DENDRO_RES_PEN.push({ value: 0.35, name: 'Constellation 2', source: 'Nilou' })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>, allBase: StatsObject[]) => {
      if (form.bountiful_core && a >= 4) {
        const index = _.findIndex(team, (item) => item.cId === '10000070')
        _.forEach(allBase, (item, i) => {
          item.BLOOM_DMG.push({
            value: _.min([(_.max([base.getHP() - 30000, 0]) / 1000) * 0.09, 4]),
            name: `Golden Chalice's Bounty`,
            source: index === i ? 'Self' : 'Nilou',
            base: _.min([_.max([base.getHP() - 30000, 0]) / 1000, 4 / 0.09]).toFixed(2),
            multiplier: 0.09,
          })
        })
      }
      if (c >= 6) {
        base[Stats.CRIT_RATE].push({
          value: _.min([(base.getHP() / 1000) * 0.006, 0.3]),
          name: 'Constellation 6',
          source: 'Self',
          base: _.min([base.getHP() / 1000, 50]),
          multiplier: toPercentage(0.006),
        })
        base[Stats.CRIT_DMG].push({
          value: _.min([(base.getHP() / 1000) * 0.012, 0.6]),
          name: 'Constellation 6',
          source: 'Self',
          base: _.min([base.getHP() / 1000, 50]),
          multiplier: toPercentage(0.012),
        })
      }

      return base
    },
  }
}

export default Nilou
