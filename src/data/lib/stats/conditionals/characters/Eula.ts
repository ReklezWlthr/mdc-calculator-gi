import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Eula = (c: number, a: number, t: ITalentLevel) => {
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
      trace: `Normal Attack`,
      title: `Favonius Bladework - Edel`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive strikes.
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
      title: `Icetide Vortex`,
      content: `Sharp frost, swift blade.
      <br />
      <br /><b>Press</b>
      <br />Slashes swiftly, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />When it hits an opponent, Eula gains a stack of <b class="text-genshin-cryo">Grimheart</b> that stacks up to <span class="text-desc">2</span> times. These stacks can only be gained once every <span class="text-desc">0.3</span>s.
      <br />
      <br /><b class="text-genshin-cryo">Grimheart</b>
      <br />Increases Eula's resistance to interruption and DEF.
      <br />
      <br /><b>Hold</b>
      <br />Wielding her sword, Eula consumes all the stacks of <b class="text-genshin-cryo">Grimheart</b> and lashes forward, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b> to opponents in front of her.
      <br />If <b class="text-genshin-cryo">Grimheart</b> stacks are consumed, surrounding opponents will have their <b>Physical RES</b> and <b class="text-genshin-cryo">Cryo RES</b> decreased.
      <br />Each consumed stack of <b class="text-genshin-cryo">Grimheart</b> will be converted into an <b class="text-genshin-cryo">Icewhirl Brand</b> that deals <b class="text-genshin-cryo">Cryo DMG</b> to nearby opponents.
      `,
      image: 'Skill_S_Eula_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Glacial Illumination`,
      content: `Brandishes her greatsword, dealing <b class="text-genshin-cryo">Cryo DMG</b> to nearby opponents and creating a <b class="text-genshin-cryo">Lightfall Sword</b> that follows her around for a duration of up to <span class="text-desc">7</span>s.
      <br />While present, the <b class="text-genshin-cryo">Lightfall Sword</b> increases Eula's resistance to interruption. When Eula's own Normal Attack, Elemental Skill, and Elemental Burst deal DMG to opponents, they will charge the <b class="text-genshin-cryo">Lightfall Sword</b>, which can gain an energy stack once every <span class="text-desc">0.1</span>s.
      <br />Once its duration ends, the <b class="text-genshin-cryo">Lightfall Sword</b> will descend and explode violently, dealing <b>Physical DMG</b> to nearby opponents.
      <br />This DMG scales on the number of energy stacks the <b class="text-genshin-cryo">Lightfall Sword</b> has accumulated.
      <br />If Eula leaves the field, the <b class="text-genshin-cryo">Lightfall Sword</b> will explode immediately.`,
      image: 'Skill_E_Eula_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Roiling Rime`,
      content: `If <span class="text-desc">2</span> stacks of <b class="text-genshin-cryo">Grimheart</b> are consumed upon unleashing the Holding Mode of <b>Icetide Vortex</b>, a <b class="text-genshin-cryo">Shattered Lightfall Sword</b> will be created that will explode immediately, dealing <span class="text-desc">50%</span> of the basic <b>Physical DMG</b> dealt by a <b class="text-genshin-cryo">Lightfall Sword</b> created by <b>Glacial Illumination</b>.`,
      image: 'UI_Talent_S_Eula_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Wellspring of War-Lust`,
      content: `When <b>Glacial Illumination</b> is cast, the CD of Icetide Vortex is reset and Eula gains <span class="text-desc">1</span> stack of <b class="text-genshin-cryo">Grimheart</b>.`,
      image: 'UI_Talent_S_Eula_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Aristocratic Introspection`,
      content: `When Eula crafts Character Talent Materials, she has a <span class="text-desc">10%</span> chance to receive double the product.`,
      image: 'UI_Talent_Eula_Combine',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Tidal Illusion`,
      content: `Every time <b>Icetide Vortex</b>'s <b class="text-genshin-cryo">Grimheart</b> stacks are consumed, Eula's <b>Physical DMG</b> is increased by <span class="text-desc">30%</span> for <span class="text-desc">6</span>s.
      <br />Each stack consumed will increase the duration of this effect by 6s up to a maximum of <span class="text-desc">18</span>s.`,
      image: 'UI_Talent_S_Eula_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Lady of Seafoam`,
      content: `Decreases the CD of <b>Icetide Vortex</b>'s Holding Mode, rendering it identical to Press CD.`,
      image: 'UI_Talent_S_Eula_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Lawrence Pedigree`,
      content: `Increases the Level of <b>Glacial Illumination</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Eula_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `The Obstinacy of One's Inferiors`,
      content: `<b class="text-genshin-cryo">Lightfall Swords</b> deal <span class="text-desc">25%</span> increased DMG against opponents with less than <span class="text-desc">50%</span> HP.`,
      image: 'UI_Talent_S_Eula_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Chivalric Quality`,
      content: `Increases the Level of <b>Icetide Vortex</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Eula_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Noble Obligation`,
      content: `<b class="text-genshin-cryo">Lightfall Swords</b> created by <b>Glacial Illumination</b> start with <span class="text-desc">5</span> stacks of energy. Normal Attacks, Elemental Skills, and Elemental Bursts have a <span class="text-desc">50%</span> chance to grant the <b class="text-genshin-cryo">Lightfall Swords</b> an additional stack of energy.`,
      image: 'UI_Talent_S_Eula_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'grimheart',
      text: `Grimheart Stacks`,
      ...talents.skill,
      show: true,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'number',
      id: 'burst_energy',
      text: `Lightfall Sword Energy`,
      ...talents.burst,
      show: true,
      default: c >= 6 ? 5 : 0,
      min: c >= 6 ? 5 : 0,
      max: 30,
    },
    {
      type: 'toggle',
      id: 'c1_grimheart_consume',
      text: `C1 Grimheart DMG Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'eula_c4',
      text: `Target Current HP < 50%`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'grimheart_consume',
      text: `Grimheart RES Reduction`,
      ...talents.skill,
      show: true,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'grimheart_consume')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.8973, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.9355, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.568, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.1264, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit [x2]',
          value: [{ scaling: calcScaling(0.7183, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.688, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.244, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = [
        {
          name: 'Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(0.7459, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'Low Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.4914, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'High Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.8629, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
      ]

      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(1.464, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(2.456, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Icewhirl Brand DMG',
          value: [{ scaling: calcScaling(0.96, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(2.456, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: `Lightfall Sword DMG`,
          value: [
            {
              scaling:
                calcScaling(3.6705, burst, 'physical', '1_alt') +
                calcScaling(0.7499, burst, 'physical', '1_alt') * (form.burst_energy || 0),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.PHYSICAL,
          property: TalentProperty.BURST,
          bonus: form.eula_c4 ? 0.25 : 0,
        },
      ]

      if (form.grimheart) base[Stats.DEF].push({ value: 0.3 * form.grimheart, name: 'Grimheart', source: `Self` })
      if (form.grimheart_consume) {
        base.PHYSICAL_RES_PEN.push({ value: 0.15 * _.min([skill * 0.01, 0.1]), name: 'Grimheart', source: `Self` })
        base.CRYO_RES_PEN.push({ value: 0.15 * _.min([skill * 0.01, 0.1]), name: 'Grimheart', source: `Self` })
      }

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: `Shattered Lightfall Sword DMG`,
          value: [{ scaling: 0.5, multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.BURST,
          bonus: form.eula_c4 ? 0.25 : 0,
        })
      if (form.c1_grimheart_consume)
        base[Stats.PHYSICAL_DMG].push({ value: 0.3, name: 'Grimheart [C1]', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.grimheart_consume) {
        base.PHYSICAL_RES_PEN.push({ value: 0.15 * _.min([skill * 0.01, 0.1]), name: 'Grimheart', source: `Self` })
        base.CRYO_RES_PEN.push({ value: 0.15 * _.min([skill * 0.01, 0.1]), name: 'Grimheart', source: `Self` })
      }
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Eula
