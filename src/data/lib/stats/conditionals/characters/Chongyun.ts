import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Chongyun = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Demonbane`,
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
      title: `Spirit Blade: Chonghua's Layered Frost`,
      content: `Chongyun strikes the ground with his greatsword, causing a <b class="text-genshin-cryo">Cryo</b> explosion in a circular AoE in front of him that deals <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />After a short delay, the cold air created by the <b class="text-genshin-cryo">Cryo</b> explosion will coalesce into a <b class="text-genshin-cryo">Chonghua Frost Field</b>, within which all Sword, Claymore and Polearm-wielding characters' weapons will be infused with <b class="text-genshin-cryo">Cryo</b>.
      `,
      image: 'Skill_S_Chongyun_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Spirit Blade: Cloud-Parting Star`,
      content: `Performing the secret hand seals, Chongyun summons 3 giant spirit blades in mid-air that fall to the earth one by one after a short delay, exploding as they hit the ground.
      <br />When the spirit blades explode, they will deal <b class="text-genshin-cryo">AoE Cryo DMG</b> and launch opponents.`,
      image: 'Skill_E_Chongyun_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Steady Breathing`,
      content: `Sword, Claymore, or Polearm-wielding characters within the field created by <b>Spirit Blade: Chonghua's Layered Frost</b> have their Normal ATK SPD increased by <span class="text-desc">8%</span>.`,
      image: 'UI_Talent_S_Chongyun_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Rimechaser Blade`,
      content: `When the field created by <b>Spirit Blade: Chonghua's Layered Frost</b> disappears, another spirit blade will be summoned to strike nearby opponents, dealing <span class="text-desc">100%</span> of <b>Chonghua's Layered Frost</b>'s Skill DMG as <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />Opponents hit by this blade will have their <b class="text-genshin-cryo">Cryo RES</b> decreased by <span class="text-desc">10%</span> for <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Chongyun_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Gallant Journey`,
      content: `When dispatched on an expedition in Liyue, time consumed is reduced by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_Expedition_Liyue',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Ice Unleashed`,
      content: `The last attack of Chongyun's Normal Attack combo releases <span class="text-desc">3</span> ice blades. Each blade deals <span class="text-desc">50%</span> of Chongyun's ATK as <b class="text-genshin-cryo">Cryo DMG</b> to all opponents in its path.`,
      image: 'UI_Talent_S_Chongyun_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Atmospheric Revolution`,
      content: `Elemental Skills and Elemental Bursts cast within the <b class="text-genshin-cryo">Frost Field</b> created by <b>Spirit Blade: Chonghua's Layered Frost</b> have their CD time decreased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Chongyun_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Cloudburst`,
      content: `Increases the Level of <b>Spirit Blade: Cloud-Parting Star</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chongyun_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Frozen Skies`,
      content: `Chongyun regenerates <span class="text-desc">1</span> Energy every time he hits an opponent affected by <b class="text-genshin-cryo">Cryo</b>.
      <br />This effect can only occur once every <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Chongyun_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The True Path`,
      content: `Increases the Level of <b>Spirit Blade: Chonghua's Layered Frost</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chongyun_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Rally of Four Blades`,
      content: `<b>Spirit Blade: Cloud-Parting Star</b> deals <span class="text-desc">15%</span> more DMG to opponents with a lower percentage of their Max HP remaining than Chongyun.
      <br />This skill will also summon <span class="text-desc">1</span> additional spirit blade.`,
      image: 'UI_Talent_S_Chongyun_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'chongyun_infusion',
      text: `Chonghua Frost Field`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'chongyun_a4',
      text: `A4 Cryo RES Shred`,
      ...talents.a4,
      show: a >= 4,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'chongyun_c6',
      text: `C6 Low Health DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'chongyun_a4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'chongyun_infusion')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 40

      if (form.chongyun_infusion) {
        base.infuse(Element.CRYO)
        if (a >= 1) base.ATK_SPD.push({ value: 0.08, name: '', source: `` })
      }

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.7, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6312, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.8032, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.0122, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.5629, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.0178, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      const skillScaling = calcScaling(1.7204, skill, 'elemental', '1')

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: skillScaling, multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG Per Blade [x${c >= 6 ? 4 : 3}]`,
          value: [{ scaling: calcScaling(1.424, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: form.chongyun_c6 ? 0.15 : 0,
        },
      ]

      if (form.chongyun_infusion && a >= 1)
        base.ATK_SPD.push({ value: 0.08, name: 'Ascension 1 Passive', source: `Self` })

      if (a >= 4)
        base.SKILL_SCALING.push({
          name: 'Rimechaser Blade DMG',
          value: [{ scaling: skillScaling, multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        })

      if (form.chongyun_a4) base.CRYO_RES_PEN.push({ value: 0.1, name: 'Ascension 4 Passive', source: `Self` })

      if (c >= 1)
        base.BASIC_SCALING.push({
          name: 'Ice Unleashed DMG [x3]',
          value: [{ scaling: 0.5, multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
        })

      if (form.chongyun_infusion && c >= 2) {
        base.SKILL_CD_RED.push({ value: 0.15, name: 'Constellation 2', source: `Self` })
        base.BURST_CD_RED.push({ value: 0.15, name: 'Constellation 2', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.chongyun_infusion) {
        if (!_.includes([WeaponType.BOW, WeaponType.CATALYST], form.weapon)) base.infuse(Element.CRYO)
        if (a >= 1) base.ATK_SPD.push({ value: 0.08, name: 'Ascension 1 Passive', source: `Chongyun` })
      }
      if (form.chongyun_a4) base.CRYO_RES_PEN.push({ value: 0.1, name: 'Ascension 4 Passive', source: `Chongyun` })

      if (aForm.chongyun_infusion && c >= 2) {
        base.SKILL_CD_RED.push({ value: 0.15, name: 'Constellation 2', source: `Chongyun` })
        base.BURST_CD_RED.push({ value: 0.15, name: 'Constellation 2', source: `Chongyun` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Chongyun
