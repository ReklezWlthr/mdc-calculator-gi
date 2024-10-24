import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Mona = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Ripple of Fate`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 water splash attacks that deal <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-hydro">AoE Hydro DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Hydro, Mona plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Mirror Reflection of Doom`,
      content: `Creates an illusory <b>Phantom of Fate</b> from coalesced waterspouts.
      <br />
      <br /><b>Phantom</b>
      <br />Has the following special properties:
      <br />- Continuously taunts nearby opponents, attracting their fire.
      <br />- Continuously deals <b class="text-genshin-hydro">Hydro DMG</b> to nearby opponents.
      <br />- When its duration expires, the <b>Phantom</b> explodes, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />Utilizes water currents to move backwards swiftly before conjuring a <b>Phantom</b>.
      <br />
      <br />Only one <b>Phantom</b> created by <b>Mirror Reflection of Doom</b> can exist at any time.
      `,
      image: 'Skill_S_Mona_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Stellaris Phantasm`,
      content: `Mona summons the sparkling waves and creates a reflection of the starry sky, applying the <b class="text-genshin-hydro">Illusory Bubble</b> status to opponents in a large AoE.
      <br />
      <br /><b class="text-genshin-hydro">Illusory Bubble</b>
      <br />Traps opponents inside a pocket of destiny and also makes them <b class="text-genshin-hydro">Wet</b>.
      <br />Renders weaker opponents immobile.
      <br />When an opponent affected by <b class="text-genshin-hydro">Illusory Bubble</b> sustains DMG, it has the following effects:
      <br />- Applies an <b class="text-blue">Omen</b> to the opponent, which gives a DMG Bonus, also increasing the DMG of the attack that causes it.
      <br />- Removes the <b class="text-genshin-hydro">Illusory Bubble</b>, dealing <b class="text-genshin-hydro">Hydro DMG</b> in the process.
      <br />
      <br /><b class="text-blue">Omen</b>
      <br />During its duration, increases DMG taken by opponents.`,
      image: 'Skill_E_Mona_01',
    },
    sprint: {
      trace: `Alternate Sprint`,
      title: `Illusory Torrent`,
      content: `<b>Alternate Sprint</b>
      <br />Mona cloaks herself within the water's flow, consuming stamina to move rapidly.
      <br />
      <br />When under the effect of <b>Illusory Torrent</b>, Mona can move at high speed on water.
      <br />Applies the <b class="text-genshin-hydro">Wet</b> status to nearby opponents when she reappears.`,
      image: 'Skill_S_Mona_02',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `"Come 'n' Get Me, Hag!"`,
      content: `After she has used <b>Illusory Torrent</b> for <span class="text-desc">2</span>s, if there are any opponents nearby, Mona will automatically create a <b>Phantom</b>.
      <br />A <b>Phantom</b> created in this manner lasts for <span class="text-desc">2</span>s, and its explosion DMG is equal to <span class="text-desc">50%</span> of <b>Mirror Reflection of Doom</b>.`,
      image: 'UI_Talent_S_Mona_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Waterborne Destiny`,
      content: `Increases Mona's <b class="text-genshin-hydro">Hydro DMG Bonus</b> by a degree equivalent to <span class="text-desc">20%</span> of her Energy Recharge rate.`,
      image: 'UI_Talent_S_Mona_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: 'Principium of Astrology',
      content: `When Mona crafts Weapon Ascension Materials, she has a <span class="text-desc">1250%</span> chance to refund a portion of the crafting material used.`,
      image: 'UI_Talent_Combine_Weapon',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Prophecy of Submersion`,
      content: `When any of your own party members hits an opponent affected by an <b class="text-blue">Omen</b>, the effects of <b class="text-genshin-hydro">Hydro</b>-related Elemental Reactions are enhanced for 8s:
      <br />- Electro-Charged DMG increases by <span class="text-desc">15%</span>.
      <br />- Vaporize DMG increases by <span class="text-desc">15%</span>.
      <br />- Hydro Swirl DMG increases by <span class="text-desc">15%</span>.
      <br />- Frozen duration is extended by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Mona_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Lunar Chain`,
      content: `When a Normal Attack hits, there is a <span class="text-desc">20%</span> chance that it will be automatically followed by a Charged Attack.
      <br />This effect can only occur once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Mona_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Restless Revolution`,
      content: `Increases the Level of <b>Stellaris Phantasm</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mona_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Prophecy of Oblivion`,
      content: `When any party member attacks an opponent affected by an <b class="text-blue">Omen</b>, their CRIT Rate is increased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Mona_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Mockery of Fortuna`,
      content: `Increases the Level of <b>Mirror Reflection of Doom</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mona_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Rhetorics of Calamitas`,
      content: `Upon entering <b>Illusory Torrent</b>, Mona gains a <span class="text-desc">60%</span> increase to the DMG of her next Charged Attack per second of movement.
      <br />A maximum DMG Bonus of <span class="text-desc">180%</span> can be achieved in this manner. The effect lasts for no more than <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Mona_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'mona_omen',
      text: `Omen`,
      ...talents.burst,
      show: true,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'mona_sprint',
      text: `C6 Charged Attack Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: 3,
      min: 0,
      max: 3,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'mona_omen')]

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
          value: [{ scaling: calcScaling(0.376, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.36, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.448, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5616, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.4972, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.HYDRO)
      base.SKILL_SCALING = [
        {
          name: 'DoT',
          value: [{ scaling: calcScaling(0.32, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Explosion DMG',
          value: [{ scaling: calcScaling(1.328, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Illusory Bubble Explosion DMG`,
          value: [{ scaling: calcScaling(4.4424, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.mona_omen) {
        base.VULNERABILITY.push({
          value: _.min([0.4 + burst * 0.02, 0.6]),
          name: 'Omen',
          source: 'Self',
        })
        if (c >= 1) {
          base.TASER_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
          base.VAPE_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
          base.HYDRO_SWIRL_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Self` })
        }
        if (c >= 4) base[Stats.CRIT_RATE].push({ value: 0.15, name: 'Constellation 4', source: `Self` })
      }
      if (a >= 1)
        base.SKILL_SCALING.push({
          name: 'A1 Phantom Explosion DMG',
          value: [{ scaling: calcScaling(1.328, skill, 'elemental', '1') * 0.5, multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        })

      if (form.mona_sprint)
        base.CHARGE_DMG.push({
          value: form.mona_sprint * 0.6,
          name: 'Constellation 6',
          source: 'Self',
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.mona_omen) {
        base.VULNERABILITY.push({
          value: _.min([0.4 + burst * 0.02, 0.6]),
          name: 'Omen',
          source: 'Mona',
        })
        if (c >= 1) {
          base.TASER_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Mona` })
          base.VAPE_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Mona` })
          base.HYDRO_SWIRL_DMG.push({ value: 0.15, name: 'Constellation 1', source: `Mona` })
        }
        if (c >= 4) base[Stats.CRIT_RATE].push({ value: 0.15, name: 'Constellation 4', source: `Mona` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4)
        base[Stats.HYDRO_DMG].push({
          value: 0.2 * base.getValue(Stats.ER),
          name: 'Ascension 4 Passive',
          source: `Self`,
          base: toPercentage(base.getValue(Stats.ER)),
          multiplier: 0.2
        })

      return base
    },
  }
}

export default Mona
