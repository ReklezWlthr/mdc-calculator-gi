import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Emilie = (c: number, a: number, t: ITalentLevel) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: `Shadow-Hunting Spear (Custom)`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to perform an upward slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      <br />Emilie does not take DMG from performing Plunging Attacks.
      `,
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Fragrance Extraction`,
      content: `Creates a <b class="text-genshin-dendro">Lumidouce Case</b> that deals <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />
      <br /><b class="text-genshin-dendro">Lumidouce Case</b>
      <br />- Fires <b>Puffs of Puredew</b> at nearby opponents at intervals, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />- When nearby opponents are affected by Burning, they will give off <b class="text-desc">Scents</b> at intervals, and <span class="text-desc">1</span> <b class="text-desc">Scent</b> can be created this way every <span class="text-desc">2</span>s. The <b class="text-genshin-dendro">Lumidouce Case</b> collects nearby <b class="text-desc">Scents</b>. The <b class="text-genshin-dendro">Lumidouce Case</b> will level up after gathering <span class="text-desc">1</span> of them, after which it will fire <span class="text-desc">1</span> extra <b>Puffs of Puredew</b> when firing, while the DMG dealt by and DMG AoE of the above attack will also be increased.
      <br />- <span class="text-desc">1</span> <b class="text-genshin-dendro">Lumidouce Case</b> created by Emilie herself can exist at any one time. The <b class="text-genshin-dendro">Case</b> starts at Level <span class="text-desc">1</span> and can go up to Level <span class="text-desc">2</span>. If the <b class="text-genshin-dendro">Case</b> does not collect any <b class="text-desc">Scents</b> for <span class="text-desc">8</span>s while it is on the field, it will go back to Level <span class="text-desc">1</span>.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />At intervals, after Emilie creates a <b class="text-genshin-dendro">Lumidouce Case</b> this way, a <b class="text-genshin-pneuma">Spiritbreath Thorn</b> will descend in front of her and pierce her opponent, dealing <b class="text-genshin-pneuma">Pneuma</b>-aligned <b class="text-genshin-dendro">Dendro DMG</b>.
      `,
      image: 'Skill_S_Emilie_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Aromatic Explication`,
      content: `Guiding the fragrances collected within the <b class="text-genshin-dendro">Case</b>, Emilie converts them into pure Dendro energy, creating a Level <span class="text-desc">3</span> <b class="text-genshin-dendro">Lumidouce Case</b> and stowing existing <b class="text-genshin-dendro">Cases</b> away.
      <br />While it exists, the Level <span class="text-desc">3</span> <b class="text-genshin-dendro">Lumidouce Case</b> will not gather nearby <b class="text-desc">Scents</b>, but it will continuously cause <b>Scented Dew</b> to descend, attacking opponents within range and dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>. During this time, <span class="text-desc">1</span> drop of <b>Scented Dew</b> will descend every <span class="text-desc">0.3</span> seconds, and <span class="text-desc">1</span> opponent can become the target every <span class="text-desc">0.7</span> seconds.
      <br />When the duration ends, a Level <span class="text-desc">1</span> <b class="text-genshin-dendro">Lumidouce Case</b> will be recreated. If a <b class="text-genshin-dendro">Lumidouce Case</b> was stowed away when using <b>Aromatic Explication</b>, then the <b class="text-genshin-dendro">Case</b> that was stowed away will be deployed instead, and its duration will be reset.
      <br />While <b>Aromatic Explication</b> is active, the Elemental Skill <b>Fragrance Extraction</b> will not create a <b class="text-genshin-dendro">Lumidouce Case</b>.`,
      image: 'Skill_E_Emilie_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Lingering Fragrance`,
      content: `Each time it collects <span class="text-desc">2</span> <b class="text-desc">Scents</b>, the Level <span class="text-desc">2</span> <b class="text-genshin-dendro">Lumidouce Case</b> will consume <b class="text-desc">Scents</b> and release <b class="text-green-400">Cleardew Cologne</b> that deals <b class="text-genshin-dendro">AoE Dendro DMG</b> equal to <span class="text-desc">600%</span> of Emilie's ATK to opponents. This DMG is not considered Elemental Skill DMG.`,
      image: 'UI_Talent_S_Emilie_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Rectification`,
      content: `Emilie deals increased DMG to Burning opponents based on her ATK, with every <span class="text-desc">1,000</span> ATK increasing DMG dealt by <span class="text-desc">15%</span>. The maximum DMG bonus that can be gained this way is <span class="text-desc">36%</span>.`,
      image: 'UI_Talent_S_Emilie_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Headspace Capture`,
      content: `When the <b class="text-genshin-dendro">Lumidouce Case</b> created by Emilie is on the field, all party members gain <span class="text-desc">85%</span> <b class="text-genshin-pyro">Pyro RES</b> against Burning DMG.`,
      image: 'UI_Talent_S_Emilie_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Light Fragrance Leaching`,
      content: `Increases the DMG dealt by <b>Fragrance Extraction</b> and her Passive Talent's <b class="text-green-400">Cleardew Cologne</b> <b>Lingering Fragrance</b> by <span class="text-desc">20%</span>. The latter requires unlocking said Passive Talent first.
      <br />Additionally, when nearby party members trigger the Burning reaction on opponents or deal <b class="text-genshin-dendro">Dendro DMG</b> to Burning opponents, they will generate an additional <b class="text-desc">Scent</b>. This effect can be triggered once every <span class="text-desc">2.9</span>s.`,
      image: 'UI_Talent_S_Emilie_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Lakelight Top Note`,
      content: `When <b>Fragrance Extraction</b>, <b>Aromatic Explication</b>, or <b class="text-green-400">Cleardew Cologne</b> produced by the Passive Talent <b>Lingering Fragrance</b> (the last of which requires Passive Talent activation) hits opponents, those opponents' <b class="text-genshin-dendro">Dendro RES</b> is decreased by <span class="text-desc">30%</span> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Emilie_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Exquisite Essence`,
      content: `Increases the Level of <b>Fragrance Extraction</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Emilie_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Lumidouce Heart Note`,
      content: `<b>Aromatic Explication</b>'s duration is increased by <span class="text-desc">2</span>s. The interval between opponents being selected as the target for <b>Scented Dew</b> is decreased by <span class="text-desc">0.3</span>s.`,
      image: 'UI_Talent_S_Emilie_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Puredew Aroma`,
      content: `Increases the Level of <b>Aromatic Explication</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Emilie_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Marcotte Sillage`,
      content: `When using <b>Fragrance Extraction</b> or <b>Aromatic Explication</b>, Emilie will gain <b class="text-genshin-dendro">Abiding Fragrance</b> for <span class="text-desc">5</span>s.
      <br />While this is active, after Emilie uses Normal or Charged Attacks, she will generate <span class="text-desc">1</span> <b class="text-desc">Scent</b>, and her Normal and Charged Attack DMG will be converted into <b class="text-genshin-dendro">Dendro DMG</b> that cannot be overridden, and the DMG dealt will be increased by <span class="text-desc">300%</span> of Emilie's ATK.
      <br />
      <br />The <b class="text-genshin-dendro">Abiding Fragrance</b> effect will be removed after <span class="text-desc">4</span> <b class="text-desc">Scents</b> are created this way or after its duration expires. <b class="text-genshin-dendro">Abiding Fragrance</b> can be triggered once every <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Emilie_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'emilie_c2',
      text: `C2 Dendro RES Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'emilie_c6',
      text: `Abiding Fragrance`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'emilie_c2')]

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
          value: [{ scaling: calcScaling(0.48561, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.emilie_c6 ? Element.DENDRO : Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.44895, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.emilie_c6 ? Element.DENDRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.593, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.emilie_c6 ? Element.DENDRO : Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.75103, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.emilie_c6 ? Element.DENDRO : Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(0.91332, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: form.emilie_c6 ? Element.DENDRO : Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.4708, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Level 1 Lumidouce Case Attack DMG',
          value: [{ scaling: calcScaling(0.396, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Level 2 Lumidouce Case Attack DMG',
          value: [{ scaling: calcScaling(0.84, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          hit: 2,
        },
        {
          name: 'Spiritbreath Thorn DMG',
          value: [{ scaling: calcScaling(0.3852, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Level 3 Lumidouce Case Attack DMG',
          value: [{ scaling: calcScaling(2.172, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'Cleardew Cologne DMG',
          value: [{ scaling: 6, multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          bonus: c >= 1 ? 0.2 : 0,
        })
      if (c >= 1)
        base.SKILL_DMG.push({
          value: 0.2,
          name: 'Constellation 1',
          source: `Self`,
        })
      if (form.emilie_c2) base.DENDRO_RES_PEN.push({ value: 0.3, name: 'Constellation 2', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.emilie_c2) base.DENDRO_RES_PEN.push({ value: 0.3, name: 'Constellation 2', source: `Emilie` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      base.CALLBACK.push(function (x) {
        if (a >= 4) {
          x[Stats.ALL_DMG].push({
            value: _.min([0.15 * (x.getAtk() / 1000), 0.36]),
            name: 'Ascension 4 Passive',
            source: `Self`,
            base: _.min([x.getAtk() / 1000, 2.4]).toFixed(2),
            multiplier: 0.15,
          })
        }
        if (form.emilie_c6) {
          x.INFUSION_LOCKED = true
          x.BASIC_F_DMG.push({
            value: 3 * x.getAtk(),
            name: 'Constellation 6',
            source: `Self`,
            base: x.getAtk(),
            multiplier: toPercentage(3),
          })
          x.CHARGE_F_DMG.push({
            value: 3 * x.getAtk(),
            name: 'Constellation 6',
            source: `Self`,
            base: x.getAtk(),
            multiplier: toPercentage(3),
          })
        }
        return x
      })

      return base
    },
  }
}

export default Emilie
