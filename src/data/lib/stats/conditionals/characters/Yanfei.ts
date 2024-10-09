import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yanfei = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Seal of Approval`,
      content: `<b>Normal Attack</b>
      <br />Shoots fireballs that deal up to three counts of <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />When Yanfei's Normal Attacks hit enemies, they will grant her a single <b class="text-red">Scarlet Seal</b>. Yanfei may possess a maximum of <span class="text-desc">3</span> <b class="text-red">Scarlet Seals</b>, and each time this effect is triggered, the duration of currently possessed <b class="text-red">Scarlet Seals</b> will refresh.
      <br />Each <b class="text-red">Scarlet Seal</b> will decrease Yanfei's Stamina consumption and will disappear when she leaves the field.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes Stamina and all <b class="text-red">Scarlet Seals</b> before dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> to the opponents after a short casting time.
      <br />This Charged Attack's AoE and DMG will increase according to the amount of <b class="text-red">Scarlet Seals</b> consumed.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the power of Pyro, Yanfei plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-pyro">AoE Pyro DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Signed Edict`,
      content: `Summons blistering flames that deal <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />Opponents hit by the flames will grant Yanfei the maximum number of <b class="text-red">Scarlet Seals</b>.
      `,
      image: 'Skill_S_Feiyan_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Done Deal`,
      content: `Triggers a spray of intense flames that rush at nearby opponents, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>, granting Yanfei the maximum number of <b class="text-red">Scarlet Seals</b>, and applying <b class="text-desc">Brilliance</b> to her.
      <br />
      <br /><b class="text-desc">Brilliance</b>
      <br />Has the following effects:
      <br />- Grants Yanfei a <b class="text-red">Scarlet Seal</b> at fixed intervals.
      <br />- Increases the DMG dealt by her Charged Attacks.
      <br />The effects of <b class="text-desc">Brilliance</b> will end if Yanfei leaves the field or falls in battle.
      `,
      image: 'Skill_E_Feiyan_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Proviso`,
      content: `When Yanfei consumes <b class="text-red">Scarlet Seals</b> by using a Charged Attack, each <b class="text-red">Scarlet Seal</b> will increase Yanfei's <b class="text-genshin-pyro">Pyro DMG Bonus</b> by <span class="text-desc">5%</span>. This effect lasts for <span class="text-desc">6</span>s. When a Charged Attack is used again during the effect's duration, it will dispel the previous effect.`,
      image: 'UI_Talent_S_Feiyan_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Blazing Eye`,
      content: `When Yanfei's Charged Attack deals a CRIT Hit to opponents, she will deal an additional instance of <b class="text-genshin-pyro">AoE Pyro DMG</b> equal to <span class="text-desc">80%</span> of her ATK. This DMG counts as Charged Attack DMG.`,
      image: 'UI_Talent_S_Feiyan_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Encyclopedic Expertise`,
      content: `Displays the location of nearby resources unique to Liyue on the mini-map.`,
      image: 'UI_Talent_Collect_Local_Liyue',
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Law Knows No Kindness`,
      content: `When Yanfei uses her Charged Attack, each existing <b class="text-red">Scarlet Seal</b> additionally reduces the stamina cost of this Charged Attack by <span class="text-desc">10%</span> and increases resistance against interruption during its release.`,
      image: 'UI_Talent_S_Feiyan_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Right of Final Interpretation`,
      content: `Increases Yanfei's Charged Attack CRIT Rate by <span class="text-desc">20%</span> against enemies below <span class="text-desc">50%</span> HP.`,
      image: 'UI_Talent_S_Feiyan_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Samadhi Fire-Forged`,
      content: `Increases the Level of <b>Signed Edict</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Feiyan_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Supreme Amnesty`,
      content: `When <b>Done Deal</b> is used:
      <br />Creates a shield that absorbs up to <span class="text-desc">45%</span> of Yanfei's Max HP for <span class="text-desc">15</span>s.
      <br />This shield absorbs <b class="text-genshin-pyro">Pyro DMG</b> <span class="text-desc">250%</span> more effectively.`,
      image: 'UI_Talent_S_Feiyan_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Abiding Affidavit`,
      content: `Increases the Level of <b>Done Deal</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Feiyan_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Extra Clause`,
      content: `Increases the maximum number of <b class="text-red">Scarlet Seals</b> by <span class="text-desc">1</span>.`,
      image: 'UI_Talent_S_Feiyan_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'seal_stack',
      text: `Seal Stacks`,
      ...talents.normal,
      show: true,
      default: c >= 6 ? 4 : 3,
      min: 0,
      max: c >= 6 ? 4 : 3,
    },
    {
      type: 'toggle',
      id: 'yanfei_burst',
      text: `Brilliance`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'yanfei_c2',
      text: `Target Current HP < 50%`,
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
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5834, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.5213, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7601, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.NA,
        },
      ]
      let sealMultiplier = calcScaling(0.9823, normal, 'elemental', '2')
      switch (form.seal_stack) {
        case 1:
          sealMultiplier = calcScaling(1.1556, normal, 'elemental', '2')
          break
        case 2:
          sealMultiplier = calcScaling(1.329, normal, 'elemental', '2')
          break
        case 3:
          sealMultiplier = calcScaling(1.5023, normal, 'elemental', '2')
          break
        case 4:
          sealMultiplier = calcScaling(1.6757, normal, 'elemental', '2')
      }
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: sealMultiplier, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
          cr: form.yanfei_c2 ? 0.2 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.PYRO)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.696, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.824, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.yanfei_burst)
        base.CHARGE_DMG.push({ value: calcScaling(0.334, burst, 'elemental', '2'), name: 'Brilliance', source: 'Self' })
      if (form.seal_stack && a >= 1)
        base[Stats.PYRO_DMG].push({ value: 0.05 * form.seal_stack, name: 'Ascension 1 Passive', source: `Self` })

      if (a >= 4)
        base.CHARGE_SCALING.push({
          name: 'CRIT Charged Attack',
          value: [{ scaling: 0.8, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        })

      if (c >= 4)
        base.BURST_SCALING.push({
          name: 'C4 Shield',
          value: [{ scaling: 0.45, multiplier: Stats.HP }],
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Yanfei
