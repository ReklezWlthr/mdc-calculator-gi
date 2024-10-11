import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Lyney = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const pyroCount = _.filter(teamData, (item) => item === Element.PYRO).length

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Card Force Translocation`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive shots with a bow.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, flames will run across the arrowhead before being fired. Different effects will occur based on the time spent charging.
      <br />- <b>Charge Level 1</b>: Fires off a Pyro-infused arrow, dealing <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />- <b>Charge Level 2</b>: Fires off a <b>Prop Arrow</b> that deals <b class="text-genshin-pyro">Pyro DMG</b>, and upon hit, it will summon a <b class="text-red">Grin-Malkin Hat</b>.
      <br />When firing the <b>Prop Arrow</b>, and when Lyney has more than <span class="text-desc">60%</span> HP, he will consume a portion of his HP to obtain <span class="text-desc">1</span> <b class="text-genshin-pyro">Prop Surplus</b> stack. Max <span class="text-desc">5</span> stacks. The effect will be removed after the character spends <span class="text-desc">30</span>s out of combat.
      <br />The lowest Lyney can drop to through this method is <span class="text-desc">60%</span> of his Max HP.
      <br />
      <br /><b class="text-red">Grin-Malkin Hat</b>
      <br />- Can taunt nearby opponents and attract their attacks. Each opponent can only be taunted by the <b class="text-red">Hat</b> once every <span class="text-desc">5</span>s.
      <br />- The <b class="text-red">Hat</b> will inherit a percentage of Lyney's Max HP.
      <br />- If destroyed, or if its duration expires, it will fire off a <b>Pyrotechnic Strike</b> at <span class="text-desc">1</span> nearby opponent, dealing <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />Only <span class="text-desc">1</span> <b class="text-red">Hat</b> can exist at any given time.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At certain intervals, the <b>Prop Arrow</b> will cause a <b class="text-genshin-pneuma">Spiritbreath Thorn</b> to descend upon its hit location, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-pyro">Pyro DMG</b>.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Bewildering Lights`,
      content: `Lyney does a flourish with his hat, unleashing a firework surprise!
      <br />When used, he will clear all current <b class="text-genshin-pyro">Prop Surplus</b> stacks and deal <b class="text-genshin-pyro">AoE Pyro DMG</b> to opponents in front of him. DMG will be increased according to the stacks cleared, and this will also regenerate Lyney's HP based on his Max HP.
      <br />
      <br />When a <b class="text-red">Grin-Malkin Hat</b> created by Lyney is on the field, the fireworks will cause it to explode, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> equal to that of a <b>Pyrotechnic Strike</b>.
      <br />The DMG dealt through the <b class="text-red">Grin-Malkin Hat</b> in this way is considered Charged Attack DMG.`,
      image: 'Skill_S_Liney_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Wondrous Trick: Miracle Parade`,
      content: `Unleashing his magic, Lyney turns himself into a <b>Grin-Malkin Cat</b> that can move around quickly. (Not to be mistaken for the <b class="text-red">Grin-Malkin Hat</b>. They're two different props!)
      <br />When the <b>Grin-Malkin Cat</b> gets close to opponents, it will send flames falling down on them, dealing at most <span class="text-desc">1</span> instance of <b class="text-genshin-pyro">Pyro DMG</b> to each opponent. When the duration ends, he will dismiss the <b>Grin-Malkin Cat</b> and ignite fireworks that deal <b class="text-genshin-pyro">AoE Pyro DMG</b>, summon <span class="text-desc">1</span> <b class="text-red">Grin-Malkin Hat</b>, and grant himself <span class="text-desc">1</span> <b class="text-genshin-pyro>Prop Surplus</b> stack.
      <br />
      <br /><b>Grin-Malkin Cat</b> can be actively canceled.
      `,
      image: 'Skill_E_Liney_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Perilous Performance`,
      content: `If Lyney consumes HP when firing off a <b>Prop Arrow</b>, the <b class="text-red">Grin-Malkin Hat</b> summoned by the arrow will, upon hitting an opponent, restore <span class="text-desc">3</span> Energy to Lyney and increase DMG dealt by <span class="text-desc">80%</span> of his ATK.`,
      image: 'UI_Talent_S_Liney_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Conclusive Ovation`,
      content: `The DMG Lyney deals to opponents affected by <b class="text-genshin-pyro">Pyro</b> will receive the following buffs:
      <br />- Increases the DMG dealt by <span class="text-desc">60%</span>.
      <br />- Each <b class="text-genshin-pyro">Pyro</b> party member other than Lyney will cause the DMG dealt to increase by an additional <span class="text-desc">20%</span>.
      <br />Lyney can deal up to <span class="text-desc">100%</span> increased DMG to opponents affected by <b class="text-genshin-pyro">Pyro</b> in this way.`,
      image: 'UI_Talent_S_Liney_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Trivial Observations`,
      content: `Displays the location of nearby resources unique to Fontaine on the mini-map.`,
      image: 'UI_Talent_S_Liney_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Whimsical Wonders`,
      content: `Lyney can have <span class="text-desc">2</span> <b class="text-red">Grin-Malkin Hats</b> present at once.
      <br />Additionally, <b>Prop Arrows</b> will summon <span class="text-desc">2</span> <b class="text-red">Grin-Malkin Hats</b> and grant Lyney <span class="text-desc">1</span> extra stack of <b class="text-genshin-pyro">Prop Surplus</b>. This effect can occur once every <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Liney_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Loquacious Cajoling`,
      content: `When Lyney is on the field, he will gain a stack of <b class="text-desc">Crisp Focus</b> every <span class="text-desc">2</span>s. This will increase his CRIT DMG by <span class="text-desc">20%</span>. Max <span class="text-desc">3</span> stacks. This effect will be canceled when Lyney leaves the field.`,
      image: 'UI_Talent_S_Liney_03',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Prestidigitation`,
      content: `Increases the Level of <b>Normal Attack: Card Force Translocation</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Liney_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Well-Versed, Well-Rehearsed`,
      content: `After an opponent is hit by Lyney's <b class="text-genshin-pyro">Pyro</b> Charged Attack, this opponent's <b class="text-genshin-pyro">Pyro RES</b> will be decreased by <span class="text-desc">20%</span> for <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Liney_02',
    },
    c5: {
      trace: `Constellation 5`,
      title: `To Pierce Enigmas`,
      content: `Increases the Level of <b>Wondrous Trick: Miracle Parade</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Liney_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Guarded Smile`,
      content: `When Lyney fires a <b>Prop Arrow</b>, he will fire a <b>Pyrotechnic Strike: Reprised</b> that will deal <span class="text-desc">80%</span> of a <b>Pyrotechnic Strike</b>'s DMG. This DMG is considered Charged Attack DMG.`,
      image: 'UI_Talent_S_Liney_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'prop_surplus',
      text: `Prop Surplus Stacks`,
      ...talents.skill,
      show: true,
      default: 2,
      min: 0,
      max: 5,
    },
    {
      type: 'toggle',
      id: 'lyney_a1',
      text: `A1 Enhanced Grin-Malkin Hat`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'lyney_a4',
      text: `Conclusive Ovation`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'lyney_c2',
      text: `Crisp Focus Stacks`,
      ...talents.c2,
      show: c >= 2,
      default: 3,
      min: 0,
      max: 3,
    },
    {
      type: 'toggle',
      id: 'lyney_c4',
      text: `C4 Pyro RES Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'lyney_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3879, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3801, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.2726, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5693, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.581, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Aimed Shot',
          value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Aimed Shot Charge Level 1',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Prop Arrow DMG',
          value: [{ scaling: calcScaling(1.728, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Pyrotechnic Strike DMG',
          value: [{ scaling: calcScaling(2.12, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
          bonus: form.lyney_a1 ? 0.8 : 0,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.2755, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [
            {
              scaling:
                calcScaling(1.672, skill, 'elemental', '1') +
                calcScaling(0.532, skill, 'elemental', '1') * (form.prop_surplus || 0),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.54, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Explosive Firework DMG`,
          value: [{ scaling: calcScaling(4.14, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.lyney_a4)
        base[Stats.ALL_DMG].push({
          value: _.min([0.6 + (pyroCount - 1) * 0.2, 1]),
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
      if (form.lyney_c2) base[Stats.CRIT_DMG].push({ value: 0.2 * form.lyney_c2, name: 'Crisp Focus', source: `Self` })
      if (form.lyney_c4) base.PYRO_RES_PEN.push({ value: 0.2, name: 'Constellation 4', source: `Self` })

      if (c >= 6)
        base.CHARGE_SCALING.push({
          name: 'Pyrotechnic Strike: Reprised DMG',
          value: [{ scaling: calcScaling(2.12, normal, 'elemental', '1_alt') * 0.8, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.lyney_c4) base.PYRO_RES_PEN.push({ value: 0.2, name: 'Constellation 4', source: `Lyney` })
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Lyney
