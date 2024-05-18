import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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
    },
    skill: {
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
      <br />Has <span class="text-desc">250%</span> <b class="text-genshin-electro">Electro DMG</b> Absorption Efficiency.
      <br />Applies the <b class="text-genshin-electro">Electro</b> element to Beidou upon activation.
      `,
    },
    burst: {
      title: `Stormbreaker`,
      content: `Recalling her slaying of the great beast Haishan, Beidou calls upon that monstrous strength and the lightning to create a Thunderbeast's Targe around herself, dealing <b class="text-genshin-electro">Electro DMG</b> to nearby opponents.
      <br />
      <br /><b>Thunderbeast's Targe</b>
      <br />- When Normal and Charged Attacks hit, they create a lightning discharge that can jump between opponents, dealing <b class="text-genshin-electro">Electro DMG</b>.
      <br />- Increases the character's resistance to interruption, and decreases DMG taken.
      <br />
      <br />A maximum of <span class="text-desc">1</span> lightning discharge can be triggered per second.`,
    },
    a1: {
      title: `A1: Retribution`,
      content: `Counterattacking with Tidecaller at the precise moment when the character is hit grants the maximum DMG Bonus.`,
    },
    a4: {
      title: `A4: Lightning Storm	`,
      content: `Gain the following effects for 10s after unleashing Tidecaller with its maximum DMG Bonus:
      <br />- DMG dealt by Normal and Charged Attacks is increased by <span class="text-desc">15%</span>. ATK SPD of Normal and Charged Attacks is increased by <span class="text-desc">15%</span>.
      <br />- Greatly reduced delay before unleashing Charged Attacks.`,
    },
    c1: {
      title: `C1: Sea Beast's Scourge`,
      content: `When Stormbreaker is used:
      <br />Creates a shield that absorbs up to <span class="text-desc">16%</span> of Beidou's Max HP for <span class="text-desc">15</span>s.
      <br />This shield absorbs <b class="text-genshin-electro">Electro DMG</b> <span class="text-desc">250%</span> more effectively.`,
    },
    c2: {
      title: `C2: Summoner of Storm`,
      content: `Stormbreaker's arc lightning can jump to <span class="text-desc">2</span> additional targets.`,
    },
    c3: {
      title: `C3: Star of Tomorrow`,
      content: `Increases the Level of Tidecaller by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Stunning Revenge`,
      content: `Upon being attacked, Beidou's Normal Attacks gain an additional instance of <span class="text-desc">20%</span> <b class="text-genshin-electro">Electro DMG</b> for <span class="text-desc">10</span>s.`,
    },
    c5: {
      title: `C5: Crimson Tidewalker`,
      content: `Increases the Level of Stormbreaker by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Bane of Evil`,
      content: `During the duration of Stormbreaker, the <b class="text-genshin-electro">Electro RES</b> of surrounding opponents is decreased by <span class="text-desc">15%</span>.`,
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

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'bar_burst',
      text: `Burst Hydro DMG`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    findContentById(content, 'c6_electro_res'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
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
          property: TalentProperty.SKILL,
        },
        {
          name: 'Lightning DMG',
          value: [{ scaling: calcScaling(0.96, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.beidou_burst) base.DMG_REDUCTION += calcScaling(0.2, burst, 'special', 'beidou')
      if (form.beidou_a4) {
        base.ATK_SPD += 0.15
        base.CHARGE_ATK_SPD += 0.15
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

      if (form.c6_electro_res) base.ELECTRO_RES_PEN += 0.15

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.bar_burst) base[Stats.HYDRO_DMG] += 0.15
      if (form.c6_electro_res) base.ELECTRO_RES_PEN += 0.15

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Beidou
