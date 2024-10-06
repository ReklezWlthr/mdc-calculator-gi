import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Wriothesley = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Forceful Fists of Frost`,
      content: `<b>Normal Attack</b>
      <br />Coalescing frost about his fist, Wriothesley will unleash powerful <b>Repelling Fists</b>, performing up to 5 rapid attacks that deal <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />Apart from this, Normal Attack combo count will not reset for a short time after using <b>Icefang Rush</b> or sprinting.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina to leap and unleash a <b>Vaulting Fist</b>, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing <b class="text-genshin-cryo">AoE Cryo DMG</b> upon impact.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Icefang Rush`,
      content: `Adjusting his breathing, rhythm, and pace, Wriothesley sprints forward a short distance, entering the <b class="text-genshin-cryo">Chilling Penalty</b> state and unleashing more powerful attacks than before.
      <br />
      <br /><b class="text-genshin-cryo">Chilling Penalty</b>
      <br />- Increases Wriothesley's interruption resistance
      <br />- When his HP is above <span class="text-desc">50%</span>, it will enhance the <b>Repelling Fists</b> of <b>Normal Attack: Forceful Fists of Frost</b> and increase its DMG. When such an attack hits, it will consume a fixed amount of Wriothesley's HP. HP can be lost this way once every <span class="text-desc">0.1</span>s.
      <br />This effect will be canceled should Wriothesley leave the field.
      `,
      image: 'Skill_S_Wriothesley_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Darkgold Wolfbite`,
      content: `Activating his boxing gloves, Wriothesley strikes out with an icy straight, then uses Icicle Impact to cause multiple instances of <b class="text-genshin-cryo">AoE Cryo DMG</b> in a frontal area.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />After Icicle Impact ends, a <b class="text-genshin-ousia">Surging Blade</b> will descend upon the opponent's position, dealing <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-cryo">Cryo DMG</b>.`,
      image: 'Skill_E_Wriothesley_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `There Shall Be a Plea for Justice`,
      content: `When Wriothesley's HP is less than <span class="text-desc">60%</span>, he will obtain a <b class="text-genshin-bol">Gracious Rebuke</b>. The next Charged Attack of his <b>Normal Attack: Forceful Fists of Frost</b> will be enhanced to become <b>Rebuke: Vaulting Fist</b>. It will not consume Stamina, will deal <span class="text-desc">50%</span> increased DMG, and after hitting will restore HP for Wriothesley equal to <span class="text-desc">30%</span> of his Max HP.
      <br />You can gain a <b class="text-genshin-bol">Gracious Rebuke</b> this way once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Wriothesley_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `There Shall Be a Reckoning for Sin`,
      content: `When Wriothesley's current HP increases or decreases, if he is in the <b class="text-genshin-cryo">Chilling Penalty</b> state conferred by <b>Icefang Rush</b>, <b class="text-genshin-cryo">Chilling Penalty</b> will gain one stack of <b class="text-blue">Prosecution Edict</b>. Max <span class="text-desc">5</span> stacks. Each stack will increase Wriothesley's ATK by <span class="text-desc">6%</span>.`,
      image: 'UI_Talent_S_Wriothesley_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Duke's Grace`,
      content: `When Wriothesley crafts Weapon Ascension Materials, he has a <span class="text-desc">10%</span> chance to receive double the product.`,
      image: 'UI_Talent_S_Alhatham_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Terror for the Evildoers`,
      content: `The <b class="text-genshin-bol">Gracious Rebuke</b> from the Passive Talent <b>There Shall Be a Plea for Justice</b> is changed to this:
      <br />When Wriothesley's HP is less than <span class="text-desc">60%</span> or while he is in the <b class="text-genshin-cryo">Chilling Penalty</b> state caused by <b>Icefang Rush</b>, when the fifth attack of <b>Repelling Fists</b> hits, it will create a <b class="text-genshin-bol">Gracious Rebuke</b>. <span class="text-desc">1</span> <b class="text-genshin-bol">Gracious Rebuke</b> effect can be obtained every <span class="text-desc">2.5</span>s.
      <br />
      <br />Additionally, <b>Rebuke: Vaulting Fist</b> will obtain the following enhancement:
      <br />The DMG Bonus gained will be further increased to <span class="text-desc">200%</span>.
      <br />When it hits while Wriothesley is in the <b class="text-genshin-cryo">Chilling Penalty</b> state, that state's duration is extended by <span class="text-desc">4</span>s. <span class="text-desc">1</span> such extension can occur per <span class="text-desc">1</span> <b class="text-genshin-cryo">Chilling Penalty</b> duration.
      <br />
      <br />You must first unlock the Passive Talent <b>There Shall Be a Plea for Justice</b>.`,
      image: 'UI_Talent_S_Wriothesley_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Punishment for the Frauds`,
      content: `When using <b>Darkgold Wolfbite</b>, each <b class="text-blue">Prosecution Edict</b> stack from the Passive Talent <b>There Shall Be a Reckoning for Sin</b> will increase said ability's DMG dealt by <span class="text-desc">40%</span>.
      <br />You must first unlock the Passive Talent <b>There Shall Be a Reckoning for Sin</b>.`,
      image: 'UI_Talent_S_Wriothesley_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Sanban: Moonflower Kusemai`,
      content: `Increases the Level of <b>Normal Attack: Forceful Fists of Frost</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Wriothesley_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Redemption for the Suffering`,
      content: `The HP restored to Wriothesley through <b>Rebuke: Vaulting Fist</b> will be increased to <span class="text-desc">50%</span> of his Max HP. You must first unlock the Passive Talent <b>There Shall Be a Plea for Justice</b>.
      <br />Additionally, when Wriothesley is healed, if the amount of healing overflows, the following effects will occur depending on whether he is on the field or not. If he is on the field, his ATK SPD will be increased by <span class="text-desc">20%</span> for <span class="text-desc">4</span>s. If he is off-field, all of your own party members' ATK SPD will be increased by <span class="text-desc">10%</span> for <span class="text-desc">6</span>s. These two methods of increasing ATK SPD cannot stack.`,
      image: 'UI_Talent_S_Wriothesley_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Mercy for the Wronged`,
      content: `Increases the Level of <b>Darkgold Wolfbite</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Wriothesley_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Esteem for the Innocent`,
      content: `The CRIT Rate of <b>Rebuke: Vaulting Fist</b> will be increased by <span class="text-desc">10%</span>, and its CRIT DMG by <span class="text-desc">80%</span>. When unleashed, it will also create an additional icicle that deals <span class="text-desc">100%</span> of <b>Rebuke: Vaulting Fist</b>'s Base DMG as <b class="text-genshin-cryo">Cryo DMG</b>. DMG dealt this way is regarded as Charged Attack DMG.
      <br />You must first unlock the Passive Talent <b>There Shall Be a Plea for Justice</b>.`,
      image: 'UI_Talent_S_Wriothesley_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'penalty',
      text: `Chilling Penalty`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'rebuke',
      text: `Rebuke: Vaulting Fist`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'edict',
      text: `Prosecution Edict Stacks`,
      ...talents.a4,
      show: a >= 4,
      default: 5,
      min: 0,
      max: 5,
    },
    {
      type: 'toggle',
      id: 'wrio_c4_self',
      text: `C4 ATK SPD Buff`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'wrio_c4_ally',
      text: `C4 ATK SPD Buff`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const windNormal = form.penalty ? calcScaling(1.4317, skill, 'special', 'wriothesley') : 0
      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5336, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.518, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.6722, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.379, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.9074, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.5296, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
          bonus: form.rebuke ? (c >= 1 ? 2 : 0.5) : 0,
          cr: form.rebuke && c >= 6 ? 0.1 : 0,
          cd: form.rebuke && c >= 6 ? 0.8 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.CRYO)
      base.BURST_SCALING = [
        {
          name: 'Skill DMG [x5]',
          value: [{ scaling: calcScaling(1.272, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.424, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.rebuke)
        base.CHARGE_SCALING.push({
          name: 'Rebuke Healing',
          value: [{ scaling: c >= 4 ? 0.5 : 0.3, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
      if (form.edict) {
        base[Stats.P_ATK].push({ value: form.edict * 0.05, name: 'Constellation 2', source: 'Self' })
        if (c >= 2) base.BURST_DMG.push({ value: form.edict * 0.4, name: 'Constellation 2', source: 'Self' })
      }
      if (form.wrio_c4_self) base.ATK_SPD.push({ value: 0.2, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.wrio_c4_ally) base.ATK_SPD.push({ value: 0.1, name: 'Constellation 4', source: `Wriothesley` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Wriothesley
