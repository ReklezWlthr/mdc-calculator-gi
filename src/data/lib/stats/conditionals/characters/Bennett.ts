import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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

  let atkShare = 0

  const talents: ITalent = {
    normal: {
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
    },
    skill: {
      title: `Passion Overload`,
      content: `Bennett puts all his fire and passion for adventuring into his sword. Results may vary based on how fired up he is...
      <br />
      <br /><b>Press</b>
      <br />A single, swift flame strike that deals <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />
      <br /><b>Hold (Short)</b>
      <br />Charges up, resulting in different effects when unleashed based on the Charge Level.
      <br />- Level 1: Strikes twice, dealing <b class="text-genshin-pyro">Pyro DMG</b> and launching opponents.
      <br />- Level 2: Unleashes 3 consecutive attacks that deal impressive <b class="text-genshin-pyro">Pyro DMG</b>, but the last attack triggers an explosion that launches both Bennett and the enemy.
      <br />Bennett takes no damage from being launched.
      `,
    },
    burst: {
      title: `Fantastic Voyage`,
      content: `Bennett performs a jumping attack that deals Pyro DMG, creating an Inspiration Field.
      <br />
      <br /><b>Inspiration Field</b>
      <br />- If the health of a character within the AoE is equal to or falls below <span class="text-yellow">70%</span>, their health will continuously regenerate. The amount of HP restored scales off Bennett's Max HP.
      <br />- If the health of a character within the AoE is higher than <span class="text-yellow">70%</span>, they gain an ATK Bonus that is based on Bennett's Base ATK.
      <br />- Imbues characters within the AoE with <b class="text-genshin-pyro">Pyro</b>.
      <br /><br />Current ATK Bonus: <span class="text-yellow">${_.round(atkShare)}</span>`,
    },
    a1: {
      title: `A1: Rekindle`,
      content: `Decreases Passion Overload's CD by <span class="text-yellow">20%</span>.`,
    },
    a4: {
      title: `A4: Lightning Storm	`,
      content: `When inside Fantastic Voyage's circle, Passion Overload's CD is decreased by <span class="text-yellow">50%</span> and Bennett cannot be launched by this skill's explosion.`,
    },
    c1: {
      title: `C1: Grand Expectation`,
      content: `Fantastic Voyage's ATK increase no longer has an HP restriction, and gains an additional <span class="text-yellow">20%</span> of Bennett's Base ATK.`,
    },
    c2: {
      title: `C2: Impasse Conqueror`,
      content: `When Bennett's HP falls below <span class="text-yellow">70%</span>, his Energy Recharge is increased by <span class="text-yellow">30%</span>.`,
    },
    c3: {
      title: `C3: Unstoppable Fervor`,
      content: `Increases the Level of Passion Overload by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Unexpected Odyssey`,
      content: `Using a Normal Attack as the second attack of Passion Overload's Charge Level 1 will perform a follow-up attack.
      This additional attack does <span class="text-yellow">135%</span> of the second attack's DMG.`,
    },
    c5: {
      title: `C5: True Explorer`,
      content: `Increases the Level of Fantastic Voyage by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Fire Ventures With Me`,
      content: `Sword, Claymore, or Polearm-wielding characters inside Fantastic Voyage's radius gain a <span class="text-yellow">15%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> and their weapons are infused with <b class="text-genshin-pyro">Pyro</b>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'benny_atk_share',
      text: `Within Inspiration Field`,
      ...talents.burst,
      show: true,
      default: true,
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

  const teammateContent: IContent[] = [findContentById(content, 'benny_atk_share')]

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

      atkShare = (calcScaling(0.56, burst, 'elemental', '1') + (c >= 1 ? 0.2 : 0)) * base.BASE_ATK
      if (form.benny_atk_share) base[Stats.ATK] += atkShare
      if (a >= 1) base.SKILL_CD_RED += 0.2
      if (a >= 4 && form.benny_atk_share) base.SKILL_CD_RED += 0.5

      if (form.benny_c2) base[Stats.ER] += 0.3

      if (c >= 4)
        base.SKILL_SCALING.push({
          name: 'C4 Follow-Up DMG',
          value: [{ scaling: calcScaling(0.92, skill, 'elemental', '1') * 1.35, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        })

      if (c >= 6 && form.benny_atk_share) {
        base[Stats.PYRO_DMG] += 0.15
        base.INFUSION = Element.PYRO
      }

      return base
    },
    preComputeShared: (base: StatsObject, form: Record<string, any>) => {
      atkShare = (calcScaling(0.56, burst, 'elemental', '1') + (c >= 1 ? 0.2 : 0)) * base.BASE_ATK

      const canInfuse = !_.includes([WeaponType.BOW, WeaponType.CATALYST], form.weapon)
      if (form.benny_atk_share) base[Stats.ATK] += atkShare
      if (c >= 6 && form.benny_atk_share) {
        base[Stats.PYRO_DMG] += 0.15
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
