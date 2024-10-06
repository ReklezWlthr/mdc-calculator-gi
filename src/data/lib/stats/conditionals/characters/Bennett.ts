import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Bennett = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Strike of Fortune`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
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
      title: `Passion Overload`,
      content: `Bennett puts all his fire and passion for adventuring into his sword. Results may vary based on how fired up he is...
      <br />
      <br /><b>Press</b>
      <br />A single, swift flame strike that deals <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />
      <br /><b>Hold (Short)</b>
      <br />Charges up, resulting in different effects when unleashed based on the Charge Level.
      <br />- <b>Level 1</b>: Strikes twice, dealing <b class="text-genshin-pyro">Pyro DMG</b> and launching opponents.
      <br />- <b>Level 2</b>: Unleashes 3 consecutive attacks that deal impressive <b class="text-genshin-pyro">Pyro DMG</b>, but the last attack triggers an explosion that launches both Bennett and the enemy.
      <br />Bennett takes no damage from being launched.
      `,
      image: 'Skill_S_Bennett_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Fantastic Voyage`,
      content: `Bennett performs a jumping attack that deals <b class="text-genshin-pyro">Pyro DMG</b>, creating an <b class="text-genshin-pyro">Inspiration Field</b>.
      <br />
      <br /><b class="text-genshin-pyro">Inspiration Field</b>
      <br />- If the health of a character within the AoE is equal to or falls below <span class="text-desc">70%</span>, their health will continuously regenerate. The amount of HP restored scales off Bennett's Max HP.
      <br />- If the health of a character within the AoE is higher than <span class="text-desc">70%</span>, they gain an ATK Bonus that is based on Bennett's Base ATK.
      <br />- Imbues characters within the AoE with <b class="text-genshin-pyro">Pyro</b>.`,
      image: 'Skill_E_Bennett_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Rekindle`,
      content: `Decreases <b>Passion Overload</b>'s CD by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Bennett_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Fearnaught`,
      content: `When inside <b>Fantastic Voyage</b>'s circle, <b>Passion Overload</b>'s CD is decreased by <span class="text-desc">50%</span> and Bennett cannot be launched by this skill's explosion.`,
      image: 'UI_Talent_S_Bennett_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `It Should Be Safe...`,
      content: `When dispatched on an expedition in Mondstadt, time consumed is reduced by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_Expedition_Mengde',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Grand Expectation`,
      content: `<b>Fantastic Voyage</b>'s ATK increase no longer has an HP restriction, and gains an additional <span class="text-desc">20%</span> of Bennett's Base ATK.`,
      image: 'UI_Talent_S_Bennett_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Impasse Conqueror`,
      content: `When Bennett's HP falls below <span class="text-desc">70%</span>, his Energy Recharge is increased by <span class="text-desc">30%</span>.`,
      image: 'UI_Talent_S_Bennett_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Unstoppable Fervor`,
      content: `Increases the Level of <b>Passion Overload</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Bennett_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Unexpected Odyssey`,
      content: `Using a Normal Attack as the second attack of <b>Passion Overload</b>'s Charge Level <span class="text-desc">1</span> will perform a follow-up attack.
      This additional attack does <span class="text-desc">135%</span> of the second attack's DMG.`,
      image: 'UI_Talent_S_Bennett_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `True Explorer`,
      content: `Increases the Level of <b>Fantastic Voyage</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Bennett_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Fire Ventures With Me`,
      content: `Sword, Claymore, or Polearm-wielding characters inside <b>Fantastic Voyage</b>'s radius gain a <span class="text-desc">15%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> and their weapons are infused with <b class="text-genshin-pyro">Pyro</b>.`,
      image: 'UI_Talent_S_Bennett_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'benny_atk_share',
      text: `Inspiration Field`,
      ...talents.burst,
      show: true,
      default: false,
    },
    {
      type: 'toggle',
      id: 'benny_c2',
      text: `C2 Energy Recharge`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'benny_atk_share')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4455, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4274, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5461, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.5968, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.719, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.559, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.6072, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(1.376, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 1 [1]',
          value: [{ scaling: calcScaling(0.84, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 1 [2]',
          value: [{ scaling: calcScaling(0.92, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 2 [1]',
          value: [{ scaling: calcScaling(0.88, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charge Level 2 [2]',
          value: [{ scaling: calcScaling(0.96, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Explosion DMG',
          value: [{ scaling: calcScaling(1.32, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.3238, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Healing Per Sec',
          value: [{ scaling: calcScaling(0.06, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(577, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      const multiplier = calcScaling(0.56, burst, 'elemental', '1') + (c >= 1 ? 0.2 : 0)
      if (form.benny_atk_share)
        base[Stats.ATK].push({
          name: 'Inspiration Field',
          source: 'Self',
          value: base.BASE_ATK * multiplier,
          base: base.BASE_ATK,
          multiplier,
        })
      if (a >= 1) base.SKILL_CD_RED.push({ value: 0.2, name: 'Ascension 1 Passive', source: `Self` })
      if (a >= 4 && form.benny_atk_share)
        base.SKILL_CD_RED.push({ value: 0.5, name: 'Inspiration Field', source: `Self` })

      if (form.benny_c2) base[Stats.ER].push({ value: 0.3, name: 'Constellation 2', source: `Self` })

      if (c >= 4)
        base.SKILL_SCALING.push({
          name: 'C4 Follow-Up DMG',
          value: [{ scaling: calcScaling(0.92, skill, 'elemental', '1') * 1.35, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        })

      if (c >= 6 && form.benny_atk_share) {
        base[Stats.PYRO_DMG].push({ value: 0.15, name: 'Inspiration Field', source: `Self` })
        base.INFUSION = Element.PYRO
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      const canInfuse = !_.includes([WeaponType.BOW, WeaponType.CATALYST], form.weapon)
      const multiplier = calcScaling(0.56, burst, 'elemental', '1') + (c >= 1 ? 0.2 : 0)
      if (aForm.benny_atk_share)
        base[Stats.ATK].push({
          name: 'Inspiration Field',
          source: 'Bennett',
          value: own.BASE_ATK * multiplier,
          base: own.BASE_ATK,
          multiplier,
        })
      if (c >= 6 && aForm.benny_atk_share) {
        base[Stats.PYRO_DMG].push({ value: 0.15, name: 'Inspiration Field', source: `Bennett` })
        if (canInfuse) base.infuse(Element.PYRO)
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Bennett
