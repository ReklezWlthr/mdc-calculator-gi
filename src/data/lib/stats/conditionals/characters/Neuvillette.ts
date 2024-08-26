import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Neuvillette = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `As Water Seeks Equilibrium`,
      content: `<b>Normal Attack</b>
      <br />With light flourishes, Neuvillette commands the tides to unleash a maximum of 3 attacks, dealing <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Charged Attack Empowerment: Legal Evaluation</b>
      <br />While charging up, Neuvillette will gather the power of water, forming it into a Seal of Arbitration. In this state, Neuvillette can move and change facing, and also absorb any Sourcewater Droplets in a certain AoE.
      <br />Every Droplet he absorbs will increase the formation speed of the Seal, and will heal Neuvillette.
      <br />When the charging is stopped, if the Symbol has yet to be formed, then a Charged Attack will be unleashed. If it has been formed, then a Charged Attack: Equitable Judgment will be unleashed.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina to attack opponents with a rupturing blast of water, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b>.
      <br />
      <br /><b>Charged Attack: Equitable Judgment</b>
      <br />Unleashes surging torrents, dealing continuous <b class="text-genshin-hydro">AoE Hydro DMG</b> to all opponents in a straight-line area in front of him.
      <br />Equitable Judgment will not consume any Stamina and lasts <span class="text-desc">3</span>s.
      <br />If Neuvillette's HP is above <span class="text-desc">50%</span>, he will continuously lose HP while using this attack.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Hydro, Neuvillette plunges towards the ground from mid-air, damaging all opponents in his path. Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `O Tears, I Shall Repay`,
      content: `Summons a Raging Waterfall that will deal <b class="text-genshin-hydro">AoE Hydro DMG</b> to opponents in front of Neuvillette based on his Max HP. After hitting an opponent, this skill will generate <span class="text-desc">3</span> Sourcewater Droplets near that opponent.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At certain intervals, when the Raging Waterfall descends, a Spiritbreath Thorn will descend that will pierce opponents, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-hydro">Hydro DMG</b>.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `O Tides, I Have Returned`,
      content: `Unleashes waves that will deal <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Neuvillette's Max HP. After a short interval, <span class="text-desc">2</span> waterfalls will descend and deal <b class="text-genshin-hydro">Hydro DMG</b> in a somewhat smaller AoE, and will generate <span class="text-desc">6</span> Sourcewater Droplets within an area in front.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Heir to the Ancient Sea's Authority`,
      content: `When a party member triggers a Vaporize, Frozen, Electro-Charged, Bloom, Hydro Swirl, or a Hydro Crystallize reaction on opponents, <span class="text-desc">1</span> stack of Past Draconic Glories will be granted to Neuvillette for <span class="text-desc">30</span>s. Max <span class="text-desc">3</span> stacks. Past Draconic Glories causes Charged Attack: Equitable Judgment to deal <span class="text-desc">110%/125%/160%</span> of its original DMG.
      <br />The stacks of Past Draconic Glories created by each kind of Elemental Reaction exist independently.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Discipline of the Supreme Arbitration`,
      content: `For each <span class="text-desc">1%</span> of Neuvillette's current HP greater than <span class="text-desc">30%</span> of Max HP, he will gain <span class="text-desc">0.6%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b>. A maximum bonus of <span class="text-desc">30%</span> can be obtained this way.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Gather Like the Tide`,
      content: `Increases underwater Sprint SPD for your own party members by <span class="text-desc">15%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Venerable Institution`,
      content: `When Neuvillette takes the field, he will obtain <span class="text-desc">1</span> stack of Past Draconic Glories from the Passive Talent "Heir to the Ancient Sea's Authority." You must first unlock the Passive Talent "Heir to the Ancient Sea's Authority."
      <br />Additionally, his interruption resistance will be increased while using the Charged Attack Empowerment: Legal Evaluation and the Charged Attack: Equitable Judgment.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Juridical Exhortation`,
      content: `The Passive Talent "Heir to the Ancient Sea's Authority" will be enhanced: Each stack of Past Draconic Glories will increase the CRIT DMG of Charged Attack: Equitable Judgment by <span class="text-desc">14%</span>. The maximum increase that can be achieved this way is <span class="text-desc">42%</span>.
      <br />You must first unlock the Passive Talent "Heir to the Ancient Sea's Authority."`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Ancient Postulation`,
      content: `Increases the Level of Normal Attack: As Water Seeks Equilibrium by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Crown of Commiseration`,
      content: `When Neuvillette is on the field and is healed, <span class="text-desc">1</span> Sourcewater Droplet will be generated. This effect can occur once every <span class="text-desc">4</span>s.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Axiomatic Judgment`,
      content: `Increases the Level of O Tides, I Have Returned by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Wrathful Recompense`,
      content: `When using Charged Attack: Equitable Judgment, Neuvillette can absorb nearby Sourcewater Droplets in an AoE. Each absorbed Droplet will increase the duration of Charged Attack: Equitable Judgment by <span class="text-desc">1</span>s.
      <br />Additionally, when Equitable Judgment hits opponents, it will fire off <span class="text-desc">2</span> additional currents every <span class="text-desc">2</span>s, each of which will deal <span class="text-desc">10%</span> of Neuvillette's Max HP as <b class="text-genshin-hydro">Hydro DMG</b>. DMG dealt this way will count as DMG dealt by Equitable Judgment.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'neuv_a1',
      text: `Past Draconic Glories`,
      ...talents.a1,
      show: a >= 1,
      default: 0,
      min: 0,
      max: 3,
    },
    {
      type: 'number',
      id: 'neuv_a4',
      text: `Current HP%`,
      ...talents.a4,
      show: a >= 4,
      default: 100,
      min: 0,
      max: 100,
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

      let a1Bonus = 1
      if (form.neuv_a1) {
        switch (form.neuv_a1) {
          case 1:
            a1Bonus = 1.1
            break
          case 2:
            a1Bonus = 1.25
            break
          case 3:
            a1Bonus = 1.6
            break
        }
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5458, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4625, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7234, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.368, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack: Equitable Judgment',
          value: [{ scaling: calcScaling(0.0732, normal, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
          multiplier: a1Bonus,
          cd: c >= 2 ? form.neuv_a1 * 0.14 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.HYDRO)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.1286, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.208, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.2226, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Waterfall DMG [x2]`,
          value: [{ scaling: calcScaling(0.0911, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.neuv_a4) base[Stats.HYDRO_DMG] += _.min([_.max([form.neuv_a4 - 30, 0]) * 0.006, 0.3])

      if (c >= 6)
        base.CHARGE_SCALING.push({
          name: 'C6 Additional Currents [x2]',
          value: [{ scaling: 0.1, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
          multiplier: a1Bonus,
          cd: c >= 2 ? form.neuv_a1 * 0.14 : 0,
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

export default Neuvillette
