import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Layla = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      trace: `Normal Attack`,
      title: `Sword of the Radiant Path`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Nights of Formal Focus`,
      content: `Puts forth a shield known as the <b class="text-blue">Curtain of Slumber</b>, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />The <b class="text-blue">Curtain of Slumber</b>'s DMG Absorption is based on Layla's Max HP and absorbs <b class="text-genshin-cryo">Cryo DMG</b> with 250% effectiveness. When the shield is deployed, Layla will have <b class="text-genshin-cryo">Cryo</b> applied to her briefly.
      <br />
      <br /><b class="text-genshin-cryo">Night Stars</b> and <b class="text-desc">Shooting Stars</b>
      <br />While the <b class="text-blue">Curtain of Slumber</b> is active, it will create <span class="text-desc">1</span> <b class="text-genshin-cryo">Night Star</b> that will be attached to it every <span class="text-desc">1.5</span>s. When a character protected by this shield uses an Elemental Skill, <span class="text-desc">2</span> <b class="text-genshin-cryo">Night Stars</b> will be created. <b class="text-genshin-cryo">Night Stars</b> can be created once every <span class="text-desc">0.3</span>s in this way. A maximum of <span class="text-desc">4</span> <b class="text-genshin-cryo">Night Stars</b> can be accumulated at any one time.
      <br />Once the <b class="text-blue">Curtain of Slumber</b> has accumulated <span class="text-desc">4</span> <b class="text-genshin-cryo">Night Stars</b> and there are opponents nearby, these <b class="text-genshin-cryo">Night Stars</b> will transform into homing <b class="text-desc">Shooting Stars</b> that will be fired off in sequence, dealing <b class="text-genshin-cryo">Cryo DMG</b> to any opponents hit.
      <br />If the <b class="text-blue">Curtain of Slumber</b>'s duration ends or it is destroyed, the <b class="text-genshin-cryo">Night Stars</b> will disappear. If they are already being fired off as <b class="text-desc">Shooting Stars</b>, these <b class="text-desc">Shooting Stars</b> will last until this wave of shots ends.
      <br />
      <br />New <b class="text-genshin-cryo">Night Stars</b> cannot be created until the previous wave of <b class="text-desc">Shooting Stars</b> has been fired completely.
      `,
      image: 'Skill_S_Layla_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Dream of the Star-Stream Shaker	`,
      content: `Unleashes a Celestial Dreamsphere that constantly fires <b>Starlight Slugs</b> at opponents within its AoE, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />When a <b>Starlight Slug</b> hits, it will generate <span class="text-desc">1</span> <b class="text-genshin-cryo">Night Star</b> for nearby <b class="text-blue">Curtains of Slumber</b>. Each <b class="text-blue">Curtain of Slumber</b> can gain <span class="text-desc">1</span> <b class="text-genshin-cryo">Night Star</b> this way every <span class="text-desc">0.5</span>s.`,
      image: 'Skill_E_Layla_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Like Nascent Light`,
      content: `While the <b class="text-blue">Curtain of Slumber</b> is active, the <b>Deep Sleep</b> effect will activate each time the <b class="text-blue">Curtain</b> gains <span class="text-desc">1</span> <b class="text-genshin-cryo">Night Star</b>:
      <br />- The Shield Strength of a character under the effect of the <b class="text-blue">Curtain of Slumber</b> increases by <span class="text-desc">6%</span>.
      <br />- This effect can have a maximum of <span class="text-desc">4</span> stacks and persists until the <b class="text-blue">Curtain of Slumber</b> disappears.`,
      image: 'UI_Talent_S_Layla_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Sweet Slumber Undisturbed`,
      content: `The DMG dealt by the <b class="text-desc">Shooting Stars</b> fired by <b>Nights of Formal Focus</b> is increased by <span class="text-desc">1.5%</span> of Layla's Max HP.`,
      image: 'UI_Talent_S_Layla_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Shadowy Dream-Signs`,
      content: `When Layla crafts Character Talent Materials, she has a <span class="text-desc">10%</span> chance to receive double the product.`,
      image: 'UI_Talent_Eula_Combine',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Fortress of Fantasy`,
      content: `The Shield Absorption of the <b class="text-blue">Curtain of Slumber</b> generated by <b>Nights of Formal Focus</b> is increased by <span class="text-desc">20%</span>.
      <br />Additionally, when unleashing <b>Nights of Formal Focus</b>, she will generate a shield for any nearby party members who are not being protected by a <b class="text-blue">Curtain of Slumber</b>. This shield will have <span class="text-desc">35%</span> of the absorption of a <b class="text-blue">Curtain of Slumber</b>, will last for <span class="text-desc">12</span>s, and will absorb <b class="text-genshin-cryo">Cryo DMG</b> with <span class="text-desc">250%</span> effectiveness.`,
      image: 'UI_Talent_S_Layla_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Light's Remit`,
      content: `When <b class="text-desc">Shooting Stars</b> from <b>Nights of Formal Focus</b> strike opponents, they will each restore <span class="text-desc">1</span> Energy to Layla. Each <b class="text-desc">Shooting Star</b> can restore Energy to her in this manner once.`,
      image: 'UI_Talent_S_Layla_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Secrets of the Night`,
      content: `Increases the Level of <b>Nights of Formal Focus</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Layla_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Starry Illumination`,
      content: `When <b>Nights of Formal Focus</b> starts to fire off <b class="text-desc">Shooting Stars</b>, it will grant all nearby party members the <b class="text-genshin-cryo">Dawn Star</b> effect, causing their Normal and Charged Attack DMG to increase based on <span class="text-desc">5%</span> of Layla's Max HP.
      <br /><b class="text-genshin-cryo">Dawn Star</b> can last up to <span class="text-desc">3</span>s and will be removed <span class="text-desc">0.05</span>s after dealing Normal or Charged Attack DMG.`,
      image: 'UI_Talent_S_Layla_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Stream of Consciousness`,
      content: `Increases the Level of <b>Dream of the Star-Stream Shaker</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Layla_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Radiant Soulfire`,
      content: `<b class="text-desc">Shooting Stars</b> from <b>Nights of Formal Focus</b> deal <span class="text-desc">40%</span> increased DMG, and <b>Starlight Slugs</b> from <b>Dream of the Star-Stream Shaker</b> deal <span class="text-desc">40%</span> increased DMG.
      <br />Additionally, the interval between the creation of <b class="text-genshin-cryo">Night Stars</b> via <b>Nights of Formal Focus</b>> is decreased by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Layla_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'layla_a1',
      text: `Deep Sleep Stacks`,
      ...talents.a1,
      show: a >= 1,
      default: 4,
      min: 0,
      max: 4,
    },
    {
      type: 'toggle',
      id: 'layla_c4',
      text: `Dawn Star`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'layla_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'layla_a1')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5122, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4848, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7297, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.4773, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.5255, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      const a4Dmg = a >= 4 ? [{ scaling: 0.015, multiplier: Stats.HP }] : []
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.128, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shooting Star DMG',
          value: [{ scaling: calcScaling(0.1472, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Dmg],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
          bonus: c >= 6 ? 0.4 : 0,
        },
        {
          name: 'Curtain of Slumber Shield',
          value: [{ scaling: calcScaling(0.108, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1040, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          multiplier: c >= 1 ? 1.2 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Starlight Slug DMG',
          value: [{ scaling: calcScaling(0.0465, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: c >= 6 ? 0.4 : 0,
        },
      ]

      if (form.layla_a1) base[Stats.SHIELD].push({ value: 0.06 * form.layla_a1, name: 'Deep Sleep', source: `Self` })
      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Allied Curtain of Slumber Shield',
          value: [{ scaling: calcScaling(0.108, skill, 'elemental', '1') * 0.35, multiplier: Stats.HP }],
          flat: calcScaling(1040, skill, 'special', 'flat') * 0.35,
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          bonus: 0.2,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.layla_a1) base[Stats.SHIELD].push({ value: 0.06 * form.layla_a1, name: 'Deep Sleep', source: `Layla` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.layla_c4) {
        base.CALLBACK.push(function (x, a) {
          const index = _.findIndex(team, (item) => item.cId === '10000074')
          _.forEach(a, (member, i) => {
            member.BASIC_F_DMG.push({
              value: a[index].getHP() * 0.05,
              name: 'Dawn Star',
              source: i === index ? 'Self' : 'Layla',
              base: a[index].getHP(),
              multiplier: toPercentage(0.05),
            })
            member.CHARGE_F_DMG.push({
              value: a[index].getHP() * 0.05,
              name: 'Dawn Star',
              source: i === index ? 'Self' : 'Layla',
              base: a[index].getHP(),
              multiplier: toPercentage(0.05),
            })
          })
          return x
        })
      }

      return base
    },
  }
}

export default Layla
