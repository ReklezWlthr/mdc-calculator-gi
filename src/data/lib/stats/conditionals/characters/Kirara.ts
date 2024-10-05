import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kirara = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Boxcutter`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 3 rapid claw strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Meow-teor Kick`,
      content: `<b>Press</b>
      <br />Leaps into the air with all the agility of a cat passing through the bushes, and thwacks her foes with a flying kick that deals <b class="text-genshin-dendro">AoE Dendro DMG</b> while creating a Shield of Safe Transport. This will also briefly apply <b class="text-genshin-dendro">Dendro</b> to Kirara.
      <br />The shield will absorb <b class="text-genshin-dendro">Dendro DMG</b> with <span class="text-desc">250%</span> effectiveness. The shield's DMG absorption will be based on Kirara's Max HP and will not exceed a certain percentage of that Max HP. The remaining DMG absorption on a Shield of Safe Transport will stack on a new one when it is created, and its duration will reset.
      <br />
      <br /><b>Hold</b>
      <br />Out of her desire to "deliver within half a day," Kirara deploys a Shield of Safe Transport identical to the one that can be created by pressing the skill. She will also curl up into a special express delivery box, entering the Urgent Neko Parcel state in order to move and fight more swiftly.
      <br />
      <br /><b>Urgent Neko Parcel</b>
      <br />Deals <b class="text-genshin-dendro">Dendro DMG</b> to opponents she crashes into. This effect can be triggered once on each opponent every <span class="text-desc">0.5</span>s.
      <br />When in this state, Kirara's movement speed, climbing speed, and jumping power are all increased, and her Stamina Consumption from climbing is increased.
      <br />When the duration ends or the skill is used again, a Flipclaw Strike more powerful than the attack in the <b>Press</b> Mode will be unleashed, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />The Urgent Neko Parcel state lasts a maximum of <span class="text-desc">10</span>s. When the state ends, the skill will enter CD. The longer Kirara spends in this state, the longer the CD will be.
      <br />Sprinting or actively canceling climbing will end this state early.
      `,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Secret Art: Surprise Dispatch`,
      content: `Smash opponents with a Special Delivery Package used for punishing parcel thieves, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>. After the Special Delivery Package explodes, it will split up into many Cat Grass Cardamoms that will explode either upon contact with opponents or after a period of time, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.`,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Bewitching, Betwitching Tails`,
      content: `When Kirara is in the Urgent Neko Parcel state of Meow-teor Kick, each impact against an opponent will grant her a stack of Reinforced Packaging. This effect can be triggered once for each opponent hit every <span class="text-desc">0.5</span>s. Max <span class="text-desc">3</span> stacks. When the Urgent Neko Parcel state ends, each stack of Reinforced Packaging will create <span class="text-desc">1</span> Shield of Safe Transport for Kirara. The shields that are created this way will have <span class="text-desc">20%</span> of the DMG absorption that the Shield of Safe Transport produced by Meow-teor Kick would have. If Kirara is already protected by a Shield of Safe Transport created by Meow-teor Kick, its DMG absorption will stack with these shields and its duration will reset.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Pupillary Variance`,
      content: `Every <span class="text-desc">1,000</span> Max HP Kirara possesses will increase the DMG dealt by Meow-teor Kick by <span class="text-desc">0.4%</span>, and the DMG dealt by Secret Art: Surprise Dispatch by <span class="text-desc">0.3%</span>.`,
      value: [
        {
          name: 'Meow-teor Kick DMG Bonus',
          value: { stat: Stats.HP, scaling: (hp) => toPercentage((hp / 1000) * 0.004) },
        },
        {
          name: 'Secret Art: Surprise Dispatch DMG Bonus',
          value: { stat: Stats.HP, scaling: (hp) => toPercentage((hp / 1000) * 0.003) },
        },
      ],
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Cat's Creeping Carriage`,
      content: `When Kirara is in the party, animals who produce Fowl, Raw Meat, or Chilled Meat will not be startled when party members approach them.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Material Circulation`,
      content: `Every <span class="text-desc">8,000</span> Max HP Kirara possesses will cause her to create <span class="text-desc">1</span> extra Cat Grass Cardamom when she uses Secret Art: Surprise Dispatch. A maximum of <span class="text-desc">4</span> extra can be created this way.`,
      value: [
        {
          name: 'Extra Cat Grass Cardamoms',
          value: { stat: Stats.HP, scaling: (hp) => _.min([_.floor(hp / 8000), 4]) },
        },
      ],
    },
    c2: {
      trace: `Constellation 2`,
      title: `Perfectly Packaged`,
      content: `When Kirara is in the Urgent Neko Parcel state of Meow-teor Kick, she will grant other party members she crashes into Critical Transport Shields.
      The DMG absorption of Critical Transport Shield is <span class="text-desc">40%</span> of the maximum absorption Meow-teor Kick's normal Shields of Safe Transport are capable of, and will absorb <b class="text-genshin-dendro">Dendro DMG</b> with <span class="text-desc">250%</span> effectiveness.
      Critical Transport Shields last <span class="text-desc">12</span>s and can be triggered once on each character every <span class="text-desc">10</span>s.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Universal Recognition`,
      content: `Increases the Level of Meow-teor Kick by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Steed of Skanda`,
      content: `After active character(s) protected by Shields of Safe Transport or Critical Transport Shields hit opponents with Normal, Charged, or Plunging Attacks, Kirara will perform a coordinated attack with them using Small Cat Grass Cardamoms, dealing <span class="text-desc">200%</span> of her ATK as <b class="text-genshin-dendro">Dendro DMG</b>. DMG dealt this way is considered Elemental Burst DMG. This effect can be triggered once every <span class="text-desc">3.8</span>s. This CD is shared between all party members.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `A Thousand Miles in a Day`,
      content: `Increases the Level of Secret Art: Surprise Dispatch by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Countless Sights to See`,
      content: `All nearby party members will gain <span class="text-desc">12%</span> All Elemental DMG Bonus within <span class="text-desc">15</span>s after Kirara uses her Elemental Skill or Burst.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'kirara_c6',
      text: `C6 DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'kirara_c6')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 40

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.479, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4635, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.2542, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.3813, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.7327, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.2238, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.4475, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [3]',
          value: [{ scaling: calcScaling(0.4475, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Tail-Flicking Flying Kick DMG',
          value: [{ scaling: calcScaling(1.04, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.1, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(962.2313, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Max Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.16, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1541.0796, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Urgent Neko Parcel Hit DMG',
          value: [{ scaling: calcScaling(0.336, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Flipclaw Strike DMG',
          value: [{ scaling: calcScaling(1.44, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(5.7024, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Cat Grass Cardamom Explosion DMG',
          value: [{ scaling: calcScaling(0.3564, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'A1 Neko-Parcel Shield Stack',
          value: [{ scaling: calcScaling(0.1, skill, 'elemental', '1') * 0.2, multiplier: Stats.HP }],
          flat: calcScaling(962.2313, skill, 'special', 'flat') * 0.2,
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })

      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Critical Transport Shield',
          value: [{ scaling: calcScaling(0.16, skill, 'elemental', '1') * 0.4, multiplier: Stats.HP }],
          flat: calcScaling(1541.0796, skill, 'special', 'flat') * 0.4,
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })
      if (c >= 4)
        base.BASIC_SCALING.push({
          name: 'C4 Coordinated Attack DMG',
          value: [{ scaling: 2, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        })

      if (form.kirara_c6) {
        base[Stats.ANEMO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.PYRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.HYDRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.ELECTRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.CRYO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.GEO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.DENDRO_DMG].push({value: 0.12, name: '', source: ``})
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        base.SKILL_DMG += (base.getHP() / 1000) * 0.004
        base.BURST_DMG += (base.getHP() / 1000) * 0.003
      }
      if (form.kirara_c6) {
        base[Stats.ANEMO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.PYRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.HYDRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.ELECTRO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.CRYO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.GEO_DMG].push({value: 0.12, name: '', source: ``})
        base[Stats.DENDRO_DMG].push({value: 0.12, name: '', source: ``})
      }

      return base
    },
  }
}

export default Kirara
