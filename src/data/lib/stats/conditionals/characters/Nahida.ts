import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { IContent, ITalent } from '@src/domain/conditional'
import { toPercentage } from '@src/core/utils/converter'
import { calcScaling } from '@src/core/utils/data_format'

const Nahida = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const mapChar = _.map(team, (item) => findCharacter(item.cId)?.element)
  const pyroCount = _.filter(mapChar, (item) => item === Element.PYRO).length + (c >= 1 ? 1 : 0)
  const hydroCount = _.filter(mapChar, (item) => item === Element.HYDRO).length + (c >= 1 ? 1 : 0)
  const electroCount = _.filter(mapChar, (item) => item === Element.ELECTRO).length + (c >= 1 ? 1 : 0)

  const pyroBonus =
    pyroCount >= 2
      ? calcScaling(0.2232, burst, 'elemental', '1')
      : pyroCount === 1
      ? calcScaling(0.1488, burst, 'elemental', '1')
      : 0
  const hydroBonus =
    hydroCount >= 2
      ? calcScaling(0.372, burst, 'elemental', '1')
      : hydroCount === 1
      ? calcScaling(0.248, burst, 'elemental', '1')
      : 0
  const electroBonus =
    electroCount >= 2
      ? calcScaling(5.016, burst, 'elemental', '1')
      : electroCount === 1
      ? calcScaling(3.344, burst, 'elemental', '1')
      : 0

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: 'Akara',
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 attacks that deal <b class="text-genshin-dendro">Dendro DMG</b> to opponents in front of her.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-dendro">AoE Dendro DMG</b> to opponents in front of her after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Calling upon the might of Dendro, Nahida plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-dendro">AoE Dendro DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      trace: `Elemental Skill`,
      title: 'All Schemes to Know',
      content: `Sends forth karmic bonds of wood and tree from her side, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b> and marking up to <span class="text-desc">8</span> opponents hit with the <b class="text-genshin-dendro">Seed of Skandha</b>.
      <br />When held, this skill will trigger differently.
      <br />
      <br /><b>Hold</b>
      <br />Enters Aiming Mode, which will allow you to select a limited number of opponents within a limited area. During this time, Nahida's resistance to interruption will be increased.
      <br />When released, this skill deals <b class="text-genshin-dendro">Dendro DMG</b> to these opponents and marks them with the <b class="text-genshin-dendro">Seed of Skandha</b>.
      <br />Aiming Mode will last up to <span class="text-desc">5</span>s and can select a maximum of <span class="text-desc">8</span> opponents.
      <br />
      <br /><b class="text-genshin-dendro">Seed of Skandha</b>
      <br />Opponents who have been marked by the <b class="text-genshin-dendro">Seed of Skandha</b> will be linked to one another up till a certain distance.
      <br />After you trigger Elemental Reactions on opponents who are affected by the <b class="text-genshin-dendro">Seeds of Skandha</b> or when they take DMG from <b class="text-genshin-dendro">Dendro Cores</b> (including Burgeon and Hyperbloom DMG), Nahida will unleash <b class="text-genshin-dendro">Tri-Karma Purification</b> on the opponents and all connected opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b> based on her ATK and Elemental Mastery.
      <br />You can trigger at most <span class="text-desc">1</span> <b class="text-genshin-dendro">Tri-Karma Purification</b> within a short period of time.
      `,
      upgrade: ['a4', 'c2', 'c3', 'c4', 'c6'],
      image: 'Skill_S_Nahida_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: 'Illusory Heart',
      content: `Manifests the Court of Dreams and expands the <b>Shrine of Maya</b>.
      <br />
      <br />When the <b>Shrine of Maya</b> field is unleashed, the following effects will be separately unleashed based on the Elemental Types present within the party.
      <br />- <b class="text-genshin-pyro">Pyro</b>: While Nahida remains within the <b>Shrine of Maya</b>, the DMG dealt by <b class="text-genshin-dendro">Tri-Karma Purification</b> from <b>All Schemes to Know</b> is increased.
      <br />- <b class="text-genshin-electro">Electro</b>: While Nahida remains within the <b>Shrine of Maya</b>, the interval between each <b class="text-genshin-dendro">Tri-Karma Purification</b> from <b>All Schemes to Know</b> is decreased.
      <br />- <b class="text-genshin-hydro">Hydro</b>: The <b>Shrine of Maya</b>'s duration is increased.
      <br />
      <br />If there are at least <span class="text-desc">2</span> party members of the aforementioned Elemental Types present when the field is deployed, the aforementioned effects will be increased further.
      <br />
      <br />Even if Nahida is not on the field, these bonuses will still take effect so long as party members are within the <b>Shrine of Maya</b>.
      `,
      upgrade: ['a1', 'c1', 'c5'],
      image: 'Skill_E_Nahida_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: 'Compassion Illuminated',
      content: `When unleashing <b>Illusory Heart</b>, the <b>Shrine of Maya</b> will gain the following effects:
      <br />The Elemental Mastery of the active character within the field will be increased by <span class="text-desc">25%</span> of the Elemental Mastery of the party member with the highest Elemental Mastery.
      <br />You can gain a maximum of <span class="text-desc">250</span> Elemental Mastery in this manner.`,
      image: 'UI_Talent_S_Nahida_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: 'Awakening Elucidated',
      content: `Each point of Nahida's Elemental Mastery beyond <span class="text-desc">200</span> will grant <span class="text-desc">0.1%</span> Bonus DMG and <span class="text-desc">0.03%</span> CRIT Rate to <b class="text-genshin-dendro">Tri-Karma Purification</b> from <b>All Schemes to Know</b>.
      <br />A maximum of <span class="text-desc">80%</span> Bonus DMG and <span class="text-desc">24%</span> CRIT Rate can be granted to <b class="text-genshin-dendro">Tri-Karma Purification</b> in this manner.`,
      image: 'UI_Talent_S_Nahida_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `On All Things Meditated`,
      content: `Nahida can use <b>All Schemes to Know</b> to interact with some harvestable items within a fixed AoE. This skill may even have some other effects...`,
      image: 'UI_Talent_S_Nahida_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: 'The Seed of Stored Knowledge',
      content: `When the <b>Shrine of Maya</b> is unleashed and the Elemental Types of the party members are being tabulated, the count will add <span class="text-desc">1</span> to the number of <b class="text-genshin-pyro">Pyro</b>, <b class="text-genshin-electro">Electro</b>, and <b class="text-genshin-hydro">Hydro</b> characters respectively.`,
      image: 'UI_Talent_S_Nahida_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: 'The Root of All Fullness',
      content: `Opponents that are marked by <b class="text-genshin-dendro">Seeds of Skandha</b> applied by Nahida herself will be affected by the following effects:
      <br />- Burning, Bloom, Hyperbloom, and Burgeon Reaction DMG can score CRIT Hits. CRIT Rate and CRIT DMG are fixed at <span class="text-desc">20%</span> and <span class="text-desc">100%</span> respectively.
      <br />- Within <span class="text-desc">8</span>s of being affected by Quicken, Aggravate, Spread, DEF is decreased by <span class="text-desc">30%</span>.`,
      image: 'UI_Talent_S_Nahida_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: 'The Shoot of Conscious Attainment',
      content: `Increases the Level of <b>All Schemes to Know</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Nahida_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: 'The Stem of Manifest Inference',
      content: `When <span class="text-desc">1/2/3/(4 or more)</span> nearby opponents are affected by <b>All Schemes to Know</b>'s <b class="text-genshin-dendro">Seeds of Skandha</b>, Nahida's Elemental Mastery will be increased by <span class="text-desc">100/120/140/160</span>.`,
      image: 'UI_Talent_S_Nahida_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: 'The Leaves of Enlightening Speech',
      content: `Increases the Level of <b>Illusory Heart</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Nahida_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: "The Fruit of Reason's Culmination",
      content: `When Nahida hits an opponent affected by <b>All Schemes to Know</b>'s <b class="text-genshin-dendro">Seeds of Skandha</b> with Normal or Charged Attacks after unleashing <b>Illusory Heart</b>, she will use <b class="text-lime-600">Tri-Karma Purification: Karmic Oblivion</b> on this opponent and all connected opponents, dealing <b class="text-genshin-dendro">Dendro DMG</b> based on <span class="text-desc">200%</span> of Nahida's ATK and <span class="text-desc">400%</span> of her Elemental Mastery.
      <br />DMG dealt by <b class="text-lime-600">Tri-Karma Purification: Karmic Oblivion</b> is considered Elemental Skill DMG and can be triggered once every <span class="text-desc">0.2</span>s.
      <br />This effect can last up to <span class="text-desc">10</span>s and will be removed after Nahida has unleashed <span class="text-desc">6</span> instances of <b class="text-lime-600">Tri-Karma Purification: Karmic Oblivion</b>.`,
      image: 'UI_Talent_S_Nahida_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'nahida_burst',
      text: `Shrine of Maya: Pyro`,
      ...talents.burst,
      show: pyroCount >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'nahida_em_share',
      text: `Nahida A1 EM Share`,
      ...talents.a1,
      show: a >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'nahida_c2_def',
      text: `C2 DEF Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'nahida_c4',
      text: `Enemies marked by TKP`,
      ...talents.c4,
      show: c >= 4,
      default: 4,
      max: 8,
      min: 0,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'nahida_c2_def')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'nahida_em_share')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.403, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3697, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4587, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5841, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.32, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.DENDRO)
      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(0.984, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(1.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.nahida_c4)
        base[Stats.EM].push({
          value: 100 + _.min([20 * (form.nahida_c4 - 1), 60]),
          name: 'Ascension 4 Passive',
          source: 'Self',
        })

      if (form.nahida_c2_def) base.DEF_REDUCTION.push({ value: 0.3, name: 'Constellation 2', source: `Self` })
      if (c >= 2) {
        base.CORE_CR.push({ value: 0.2, name: 'Constellation 2', source: 'Self' })
        base.CORE_CD.push({ value: 1, name: 'Constellation 2', source: 'Self' })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (form.nahida_c2_def) base.DEF_REDUCTION.push({ value: 0.3, name: 'Constellation 2', source: `Nahida` })
      if (c >= 2) {
        base.CORE_CR.push({ value: 0.2, name: 'Constellation 2', source: 'Nahida' })
        base.CORE_CD.push({ value: 1, name: 'Constellation 2', source: 'Nahida' })
      }

      return base
    },
    postCompute: (
      base: StatsObject,
      form: Record<string, any>,
      allBase: StatsObject[],
      allForm: Record<string, any>[]
    ) => {
      const index = _.findIndex(team, (item) => item.cId === '10000073')
      _.last(allBase).CALLBACK.push((x, a) => {
        const em = _.min([_.max(_.map(a, (item) => item.getValue(Stats.EM))) * 0.25, 250])
        _.forEach(a, (member, i) => {
          if (allForm[i]?.nahida_em_share)
            member[Stats.EM].push({
              value: em,
              name: 'Ascension 1 Passive',
              source: i === index ? 'Self' : 'Nahida',
              base: _.min([_.max(_.map(a, (item) => item.getValue(Stats.EM))), 1000]),
              multiplier: toPercentage(0.25),
            })
        })
        return x
      })

      const a4Dmg = _.min([0.001 * _.max([base.getValue(Stats.EM) - 200, 0]), 0.8])
      const a4Cr = _.min([0.0003 * _.max([base.getValue(Stats.EM) - 200, 0]), 0.24])
      base.SKILL_SCALING.push({
        name: 'Tri-Karma Purification',
        value: [
          { scaling: calcScaling(1.032, skill, 'elemental', '1'), multiplier: Stats.ATK },
          { scaling: calcScaling(2.064, skill, 'elemental', '1'), multiplier: Stats.EM },
        ],
        element: Element.DENDRO,
        property: TalentProperty.SKILL,
        bonus: (a >= 4 ? a4Dmg : 0) + (form.nahida_burst ? pyroBonus : 0),
        cr: a >= 4 ? a4Cr : 0,
      })
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'Karmic Oblivion',
          value: [
            { scaling: 2, multiplier: Stats.ATK },
            { scaling: 4, multiplier: Stats.EM },
          ],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          bonus: (a >= 4 ? a4Dmg : 0) + (form.nahida_burst ? pyroBonus : 0),
          cr: a >= 4 ? a4Cr : 0,
        })

      return base
    },
  }
}

export default Nahida
