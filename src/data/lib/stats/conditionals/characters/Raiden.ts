import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { IContent, ITalent } from '@src/domain/conditional'
import { toPercentage } from '@src/core/utils/converter'
import { calcScaling } from '@src/core/utils/data_format'

const Raiden = (c: number, a: number, t: ITalentLevel) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: 'Origin',
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to perform an upward slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      upgrade: ['c6'],
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: 'Transcendence: Baleful Omen',
      content: `The Raiden Shogun unveils a shard of her Euthymia, dealing <b class="text-genshin-electro">Electro DMG</b> to nearby opponents, and granting nearby party members the <b class="text-violet-400">Eye of Stormy Judgment</b>.
      <br />
      <br /><b class="text-violet-400">Eye of Stormy Judgment</b>
      <br />When characters with this buff attack and deal DMG to opponents, the <b class="text-violet-400">Eye</b> will unleash a coordinated attack, dealing <b class="text-genshin-electro">AoE Electro DMG</b> at the opponent's position.
      <br />Characters who gain the <b class="text-violet-400">Eye of Stormy Judgment</b> will have their Elemental Burst DMG increased based on the Energy Cost of the Elemental Burst during the <b class="text-violet-400">Eye</b>'s duration.
      <br />
      <br />The <b class="text-violet-400">Eye</b> can initiate one coordinated attack every <span class="text-desc">0.9</span>s per party.
      <br />Coordinated attacks generated by characters not controlled by you deal <span class="text-desc">20%</span> of the normal DMG.
      `,
      upgrade: ['a4', 'c4', 'c5', 'c6'],
      image: 'Skill_S_Shougun_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: 'Secret Art: Musou Shinsetsu',
      content: `Gathering truths unnumbered and wishes uncounted, the Raiden Shogun unleashes the <b>Musou no Hitotachi</b> and deals <b class="text-genshin-electro">AoE Electro DMG</b>, using <b class="text-indigo-400">Musou Isshin</b> in combat for a certain duration afterward. The DMG dealt by <b>Musou no Hitotachi</b> and <b class="text-indigo-400">Musou Isshin</b>'s attacks will be increased based on the number of <b>Chakra Desiderata</b>'s <b class="text-desc">Resolve</b> stacks consumed when this skill is used.
      <br />
      <br /><b class="text-indigo-400">Musou Isshin</b>
      <br />While in this state, the Raiden Shogun will wield her tachi in battle, while her Normal, Charged, and Plunging Attacks will be infused with <b class="text-genshin-electro">Electro DMG</b>, which cannot be overridden. When such attacks hit opponents, she will regenerate Energy for all nearby party members. Energy can be restored this way once every <span class="text-desc">1</span>s, and this effect can be triggered <span class="text-desc">5</span> times throughout this skill's duration.
      <br />While in this state, the Raiden Shogun's resistance to interruption is increased, and she is immune to Electro-Charged reaction DMG.
      <br />While <b class="text-indigo-400">Musou Isshin</b> is active, the Raiden Shogun's Normal, Charged, and Plunging Attack DMG will be considered Elemental Burst DMG.
      <br />
      <br />The effects of <b class="text-indigo-400">Musou Isshin</b> will be cleared when the Raiden Shogun leaves the field.
      <br />
      <br /><b>Chakra Desiderata</b>
      <br />When nearby party members (excluding the Raiden Shogun herself) use their Elemental Bursts, the Raiden Shogun will build up <b class="text-desc">Resolve</b> stacks based on the Energy Cost of these Elemental Bursts.
      <br />The maximum number of <b class="text-desc">Resolve</b> stacks is <span class="text-desc">60</span>.
      <br />
      <br />The <b class="text-desc">Resolve</b> gained by <b>Chakra Desiderata</b> will be cleared <span class="text-desc">300</span>s after the Raiden Shogun leaves the field.
      `,
      upgrade: ['c1', 'c2', 'c3'],
      image: 'Skill_E_Shougun_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: 'Wishes Unnumbered',
      content: `When nearby party members gain Elemental Orbs or Particles, <b>Chakra Desiderata</b> gains <span class="text-desc">2</span> <b class="text-desc">Resolve</b> stacks.
      <br />This effect can occur once every 3s.`,
      image: 'UI_Talent_S_Shougun_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: 'Enlightened One',
      content: `Each <span class="text-desc">1%</span> above <span class="text-desc">100%</span> Energy Recharge that the Raiden Shogun possesses grants her:
      <br />- <span class="text-desc">0.6%</span> greater Energy restoration from <b class="text-indigo-400">Musou Isshin</b>
      <br />- <span class="text-desc">0.4%</span> <b class="text-genshin-electro">Electro DMG Bonus</b>.
      `,
      image: 'UI_Talent_S_Shougun_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `All-Preserver`,
      content: `Mora expended when ascending Swords and Polearms is decreased by <span class="text-desc">50%</span>.`,
      image: 'UI_Talent_S_Shougun_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: 'Ominous Inscription',
      content: `<b>Chakra Desiderata</b> will gather <b class="text-desc">Resolve</b> even faster. When <b class="text-genshin-electro">Electro</b> characters use their Elemental Bursts, the <b class="text-desc">Resolve</b> gained is increased by <span class="text-desc">80%</span>. When characters of other Elemental Types use their Elemental Bursts, the <b class="text-desc">Resolve</b> gained is increased by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Shougun_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: 'Steelbreaker',
      content: `While using <b>Musou no Hitotachi</b> and in the <b class="text-indigo-400">Musou Isshin</b> state applied by Secret Art: Musou Shinsetsu, the Raiden Shogun's attacks ignore <span class="text-desc">60%</span> of opponents' DEF.`,
      image: 'UI_Talent_S_Shougun_03',
    },
    c3: {
      trace: `Constellation 3`,
      title: 'Shinkage Bygones',
      content: `Increases the Level of <b>Secret Art: Musou Shinsetsu</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Shougun_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: 'Pledge of Propriety',
      content: `When the <b class="text-indigo-400">Musou Isshin</b> state applied by <b>Secret Art: Musou Shinsetsu</b> expires, all nearby party members (excluding the Raiden Shogun) gain <span class="text-desc">30%</span> bonus ATK for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Shougun_02',
    },
    c5: {
      trace: `Constellation 5`,
      title: "Shogun's Descent",
      content: `Increases the Level of <b>Transcendence: Baleful Omen</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Shougun_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: 'Wishbearer',
      content: `While in the <b class="text-indigo-400">Musou Isshin</b> state applied by <b>Secret Art: Musou Shinsetsu</b>, attacks by the Raiden Shogun that are considered part of her Elemental Burst will decrease all nearby party members' (but not including the Raiden Shogun herself) Elemental Burst CD by <span class="text-desc">1</span>s when they hit opponents.
      <br />This effect can trigger once every <span class="text-desc">1</span>s, and can trigger a total of <span class="text-desc">5</span> times during the state's duration.`,
      image: 'UI_Talent_S_Shougun_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'raidenSkill',
      text: `Eye of Stormy Judgement`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'resolve',
      text: `Resolve Stacks`,
      ...talents.burst,
      show: true,
      min: 0,
      max: 60,
      default: 60,
    },
    {
      type: 'toggle',
      id: 'musou',
      text: `Musou Isshin`,
      ...talents.burst,
      show: true,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'raidenSkill'),
    {
      type: 'toggle',
      id: 'raidenC4',
      text: `Pledge of Propriety`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      const resolveMainBonus = calcScaling(0.0389, burst, 'elemental', '1') * form.resolve
      const resolveAtkBonus = calcScaling(0.0073, burst, 'elemental', '1') * form.resolve

      base.BASIC_SCALING = form.musou
        ? [
            {
              name: '1-Hit',
              value: [
                { scaling: calcScaling(0.4474, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: '2-Hit',
              value: [
                { scaling: calcScaling(0.4396, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: '3-Hit',
              value: [
                { scaling: calcScaling(0.5382, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: '4-Hit [1]',
              value: [
                { scaling: calcScaling(0.3089, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: '4-Hit [2]',
              value: [
                { scaling: calcScaling(0.3098, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: '5-Hit',
              value: [
                { scaling: calcScaling(0.7394, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.3965, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.3973, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.4988, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.2898, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.6545, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.musou
        ? [
            {
              name: 'Charged Attack [1]',
              value: [
                { scaling: calcScaling(0.616, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: 'Charged Attack [2]',
              value: [
                { scaling: calcScaling(0.7436, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
          ]
        : [
            {
              name: 'Charged Attack',
              value: [{ scaling: calcScaling(0.9959, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = form.musou
        ? [
            {
              name: 'Plunge DMG',
              value: [
                { scaling: calcScaling(0.6393, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: 'Low Plunge DMG',
              value: [
                { scaling: calcScaling(1.2784, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
            {
              name: 'High Plunge DMG',
              value: [
                { scaling: calcScaling(1.5968, burst, 'physical', '1'), multiplier: Stats.ATK },
                { scaling: resolveAtkBonus, multiplier: Stats.ATK },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.BURST,
            },
          ]
        : getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.172, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Coordinated ATK DMG',
          value: [{ scaling: calcScaling(0.42, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Musou no Hitotachi DMG',
          value: [
            { scaling: calcScaling(4.008, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: resolveMainBonus, multiplier: Stats.ATK },
          ],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.raidenSkill)
        base.BURST_DMG.push({
          value: calcScaling(0.0022, skill, 'elemental', '1') * base.MAX_ENERGY,
          name: 'Eye of Stormy Judgment',
          source: 'Self',
          base: base.MAX_ENERGY,
          multiplier: toPercentage(calcScaling(0.0022, skill, 'elemental', '1'), 2),
        })

      if (form.musou) {
        base.infuse(Element.ELECTRO, true)
        if (c >= 2) base.DEF_PEN.push({ value: 0.6, name: 'Constellation 2', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.raidenSkill)
        base.BURST_DMG.push({
          value: calcScaling(0.0022, skill, 'elemental', '1') * base.MAX_ENERGY,
          name: 'Eye of Stormy Judgment',
          source: 'Raiden Shogun',
          base: base.MAX_ENERGY,
          multiplier: toPercentage(calcScaling(0.0022, skill, 'elemental', '1'), 2),
        })
      if (form.raidenC4) base[Stats.P_ATK].push({ value: 0.3, name: 'Constellation 4', source: `Raiden Shogun` })
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4)
        base[Stats.ELECTRO_DMG].push({
          value: 0.4 * (base.getValue(Stats.ER) - 1),
          name: 'Ascension 4 Passive',
          source: `Raiden Shogun`,
        })

      return base
    },
  }
}

export default Raiden
