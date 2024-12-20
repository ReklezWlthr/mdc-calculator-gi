import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Beidou = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Oceanborne`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous slashes.
      <br />At the end of the sequence, perform a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Tidecaller`,
      content: `Nothing to worry about. Should anyone raise a hand against her or her men, she will avenge it ten-fold with sword and thunder.
      <br />
      <br /><b>Press</b>
      <br />Accumulating the power of lightning, Beidou swings her blade forward fiercely, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />Lifts her weapon up as a shield. Max DMG absorbed scales off Beidou's Max HP.
      <br />Attacks using the energy stored within the greatsword upon release or once this ability's duration expires, dealing <b class="text-genshin-electro">Electro DMG</b>. DMG dealt scales with the number of times Beidou is attacked in the skill's duration. The greatest DMG Bonus will be attained once this effect is triggered twice.
      <br />The shield possesses the following properties:
      <br />- Has <span class="text-desc">250%</span> <b class="text-genshin-electro">Electro DMG</b> Absorption Efficiency.
      <br />- Applies the <b class="text-genshin-electro">Electro</b> element to Beidou upon activation.
      `,
      image: 'Skill_S_Beidou_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Stormbreaker`,
      content: `Recalling her slaying of the great beast Haishan, Beidou calls upon that monstrous strength and the lightning to create a <b class="text-genshin-electro">Thunderbeast's Targe</b> around herself, dealing <b class="text-genshin-electro">Electro DMG</b> to nearby opponents.
      <br />
      <br /><b class="text-genshin-electro">Thunderbeast's Targe</b>
      <br />- When Normal and Charged Attacks hit, they create a lightning discharge that can jump between opponents, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />- Increases the character's resistance to interruption, and decreases DMG taken.
      <br />
      <br />A maximum of <span class="text-desc">1</span> lightning discharge can be triggered per second.`,
      image: 'Skill_E_Beidou_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Retribution`,
      content: `Counterattacking with <b>Tidecaller</b> at the precise moment when the character is hit grants the maximum DMG Bonus.`,
      image: 'UI_Talent_S_Beidou_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Lightning Storm	`,
      content: `Gain the following effects for 10s after unleashing <b>Tidecaller</b> with its maximum DMG Bonus:
      <br />- DMG dealt by Normal and Charged Attacks is increased by <span class="text-desc">15%</span>. ATK SPD of Normal and Charged Attacks is increased by <span class="text-desc">15%</span>.
      <br />- Greatly reduced delay before unleashing Charged Attacks.`,
      image: 'UI_Talent_S_Beidou_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Conqueror of Tides`,
      content: `Decreases swimming Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Swim',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Sea Beast's Scourge`,
      content: `When <b>Stormbreaker</b> is used:
      <br />Creates a shield that absorbs up to <span class="text-desc">16%</span> of Beidou's Max HP for <span class="text-desc">15</span>s.
      <br />This shield absorbs <b class="text-genshin-electro">Electro DMG</b> <span class="text-desc">250%</span> more effectively.`,
      image: 'UI_Talent_S_Beidou_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Summoner of Storm`,
      content: `<b>Stormbreaker</b>'s arc lightning can jump to <span class="text-desc">2</span> additional targets.`,
      image: 'UI_Talent_S_Beidou_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Star of Tomorrow`,
      content: `Increases the Level of <b>Tidecaller</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Beidou_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Stunning Revenge`,
      content: `Upon being attacked, Beidou's Normal Attacks gain an additional instance of <span class="text-desc">20%</span> <b class="text-genshin-electro">Electro DMG</b> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Beidou_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Crimson Tidewalker`,
      content: `Increases the Level of <b>Stormbreaker</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Beidou_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Bane of Evil`,
      content: `During the duration of <b>Stormbreaker</b>, the <b class="text-genshin-electro">Electro RES</b> of surrounding opponents is decreased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Beidou_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'beidou_shield_hit',
      text: `Hit Taken While Shielded`,
      ...talents.skill,
      show: true,
      min: 0,
      max: 2,
      default: 0,
    },
    {
      type: 'toggle',
      id: 'beidou_burst',
      text: `Thunderbeast's Tage`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'beidou_a4',
      text: `A4 Perfect Counter`,
      ...talents.a4,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'c6_electro_res',
      text: `C6 Electro RES PEN`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'c6_electro_res')]

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
          value: [{ scaling: calcScaling(0.7112, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.7086, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.8832, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.8652, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(1.1214, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.5624, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.0182, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [
            {
              scaling:
                calcScaling(1.216, skill, 'elemental', '1') +
                (form.beidou_shield_hit || 0) * calcScaling(1.6, skill, 'elemental', '1'),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield',
          value: [{ scaling: calcScaling(0.144, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1386, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.216, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Lightning DMG',
          value: [{ scaling: calcScaling(0.96, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.beidou_burst)
        base.DMG_REDUCTION.push({
          value: calcScaling(0.2, burst, 'special', 'beidou'),
          name: 'Elemental Burst',
          source: 'Self',
        })
      if (form.beidou_a4) {
        base.BASIC_DMG.push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
        base.CHARGE_DMG.push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
        base.ATK_SPD.push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
        base.CHARGE_ATK_SPD.push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
      }

      if (c >= 1)
        base.BURST_SCALING.push({
          name: 'C1 Shield',
          value: [{ scaling: 0.16, multiplier: Stats.HP }],
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })

      if (c >= 4) {
        base.BASIC_SCALING.push({
          name: 'Stunning Revenge',
          value: [{ scaling: 0.2, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        })
        base.CHARGE_SCALING.push({
          name: 'Stunning Revenge',
          value: [{ scaling: 0.2, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        })
      }

      if (form.c6_electro_res) base.ELECTRO_RES_PEN.push({ value: 0.15, name: 'Constellation 6', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.c6_electro_res) base.ELECTRO_RES_PEN.push({ value: 0.15, name: 'Constellation 6', source: `Beidou` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Beidou
