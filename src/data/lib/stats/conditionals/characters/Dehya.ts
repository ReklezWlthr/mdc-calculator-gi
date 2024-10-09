import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Dehya = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Sandstorm Assault`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes using her Claymore and her martial arts.
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
      title: `Molten Inferno`,
      content: `This art of Dehya's own invention changes its method of use depending on the combat situation.
      <br />
      <br /><b>Indomitable Flame</b>
      <br />This skill will be unleashed should there be no <b class="text-genshin-pyro">Fiery Sanctum</b> field created by Dehya herself present at the time.
      <br />Deals <b class="text-genshin-pyro">AoE Pyro DMG</b>, and creates a field known as <b class="text-genshin-pyro">Fiery Sanctum</b>.
      <br />
      <br /><b>Ranging Flame</b>
      <br />This skill will be unleashed should a <b class="text-genshin-pyro">Fiery Sanctum</b> field created by Dehya herself already exist.
      <br />Dehya will perform a leaping attack, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> before recreating a <b class="text-genshin-pyro">Fiery Sanctum</b> field at her new position.
      <br />A <b class="text-genshin-pyro">Fiery Sanctum</b> field created this way will inherit the remaining duration of the previous field.
      <br />
      <br /><b>Ranging Flame</b> can be used only once throughout a single <b class="text-genshin-pyro">Fiery Sanctum</b> field's duration.
      <br />
      <br /><b class="text-genshin-pyro">Fiery Sanctum</b>
      <br />When an opponent within a <b class="text-genshin-pyro">Fiery Sanctum</b> field takes DMG, the field will unleash a coordinated attack, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> to them based on Dehya's ATK and Max HP. This effect can be triggered once every <span class="text-desc">2.5</span>s.
      <br />Active characters within this field have their resistance to interruption increased, and when such characters take DMG, a portion of that damage will be mitigated and flow into <b class="text-genshin-pyro">Redmane's Blood</b>. Dehya will then take this DMG over <span class="text-desc">10</span>s. When the mitigated DMG stored by <b class="text-genshin-pyro">Redmane's Blood</b> reaches or goes over a certain percentage of Dehya's Max HP, she will stop mitigating DMG in this way.
      <br />
      <br />Only <span class="text-desc">1</span> <b class="text-genshin-pyro">Fiery Sanctum</b> created by Dehya herself can exist at the same time.
      `,
      image: 'Skill_S_Dehya_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Leonine Bite`,
      content: `Unleashing her burning anger and casting her inconvenient blade aside, Dehya enters the <b class="text-genshin-pyro">Blazing Lioness</b> state and increases her resistance to interruption.
      <br />In this state, Dehya will automatically and continuously unleash the <b>Flame-Mane's Fists</b>, dealing <b class="text-genshin-pyro">Pyro DMG</b> based on her ATK and Max HP, and when its duration ends, she will unleash an <b>Incineration Drive</b>, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b> based on her ATK and Max HP.
      <br />If a <b class="text-genshin-pyro">Fiery Sanctum</b> field created by Dehya's own Elemental Skill <b>Molten Inferno</b> exists when this ability is unleashed, Dehya will retrieve it, and then create another field once <b class="text-genshin-pyro">Blazing Lioness</b>'s duration expires. This field will take on the retrieved field's duration at the moment of its retrieval.
      <br />In this state, Dehya will be unable to cast her Elemental Skill, or perform Normal, Charged, and Plunging Attacks. <b>Normal Attack: Sandstorm Assault</b> and Elemental Skill <b>Molten Inferno</b> will be replaced by <b>Roaring Barrage</b>
      <br />
      <br /><b>Roaring Barrage</b>
      <br />Unleashing <b>Roaring Barrage</b> within <span class="text-desc">0.4</span>s after each <b>Flame-Mane's Fist</b> strike will increase the speed at which the next <b>Flame-Mane's Fist</b> strike will be triggered.`,
      image: 'Skill_E_Dehya_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Unstinting Succor`,
      content: `Within <span class="text-desc">6</span> seconds after Dehya retrieves the <b class="text-genshin-pyro">Fiery Sanctum</b> field through <b>Molten Inferno: Ranging Flame</b> or <b>Leonine Bite</b>, she will take <span class="text-desc">60%</span> less DMG when receiving DMG from <b class="text-genshin-pyro">Redmane's Blood</b>. This effect can be triggered once every <span class="text-desc">2</span>s.
      <br />Additionally, within <span class="text-desc">9</span>s after Dehya unleashes <b>Molten Inferno: Indomitable Flame</b>, she will grant all party members the <b class="text-desc">Gold-Forged Form</b> state. This state will further increase a character's resistance to interruption when they are within the <b class="text-genshin-pyro">Fiery Sanctum</b> field. <b class="text-desc">Gold-Forged Form</b> can be activated once every <span class="text-desc">18</span>s.`,
      image: 'UI_Talent_S_Dehya_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Stalwart and True`,
      content: `When her HP is less than <span class="text-desc">40%</span>, Dehya will recover <span class="text-desc">20%</span> of her Max HP and will restore <span class="text-desc">6%</span> of her Max HP every <span class="text-desc">2</span>s for the next <span class="text-desc">10</span>s. This effect can be triggered once every <span class="text-desc">20</span>s.`,
      image: 'UI_Talent_S_Dehya_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Sunlit Way`,
      content: `During the day (6:00 - 18:00), your party members gain the Swift Stride effect: Movement SPD increased by <span class="text-desc">10%</span>.
      <br />This effect does not take effect in Domains, Trounce Domains and the Spiral Abyss. Swift Stride does not stack.`,
      image: 'UI_Talent_S_Dehya_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Flame Incandescent`,
      content: `Dehya's Max HP is increased by <span class="text-desc">20%</span>, and she deals bonus DMG based on her Max HP when using the following attacks:
      <br />- <b>Molten Inferno</b>'s DMG will be increased by <span class="text-desc">3.6%</span> of her Max HP.
      <br />- <b>Leonine Bite</b>'s DMG will be increased by <span class="text-desc">6%</span> of her Max HP.`,
      image: 'UI_Talent_S_Dehya_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The Sand-Blades Glittering`,
      content: `When Dehya uses <b>Molten Inferno: Ranging Flame</b>, the duration of the recreated <b class="text-genshin-pyro">Fiery Sanctum</b> field will be increased by <span class="text-desc">6</span>s.
      <br />Additionally, when a <b class="text-genshin-pyro">Fiery Sanctum</b> exists on the field, DMG dealt by its next coordinated attack will be increased by <span class="text-desc">50%</span> when active character(s) within the <b class="text-genshin-pyro">Fiery Sanctum</b> field are attacked.`,
      image: 'UI_Talent_S_Dehya_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `A Rage Swift as Fire`,
      content: `Increases the Level of <b>Leonine Bite</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Dehya_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `An Oath Abiding`,
      content: `When <b>Flame-Mane's Fist</b> and <b>Incineration Drive</b> attacks unleashed during <b>Leonine Bite</b> hit opponents, they will restore <span class="text-desc">1.5</span> Energy for Dehya and <span class="text-desc">2.5%</span> of her Max HP. This effect can be triggered once every <span class="text-desc">0.2</span>s.`,
      image: 'UI_Talent_S_Dehya_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Alpha Unleashed`,
      content: `Increases the Level of <b>Molten Inferno</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Dehya_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Burning Claws Cleaving`,
      content: `The CRIT Rate of <b>Leonine Bite</b> is increased by <span class="text-desc">10%</span>.
      <br />Additionally, after a <b>Flame-Mane's Fist</b> attack hits an opponent and deals CRIT Hits during a single <b class="text-genshin-pyro">Blazing Lioness</b> state, it will cause the CRIT DMG of <b>Leonine Bite</b> to increase by <span class="text-desc">15%</span> for the rest of <b class="text-genshin-pyro">Blazing Lioness</b>'s duration and extend that duration by <span class="text-desc">0.5</span>s. This effect can be triggered every <span class="text-desc">0.2</span>s. The duration can be extended for a maximum of <span class="text-desc">2</span>s and CRIT DMG can be increased by a maximum of <span class="text-desc">60%</span> this way.`,
      image: 'UI_Talent_S_Dehya_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'fiery_field',
      text: `Fiery Sanctum Field`,
      ...talents.skill,
      show: true,
      default: false,
    },
    {
      type: 'toggle',
      id: 'dehya_c2',
      text: `Active Character Attacked`,
      ...talents.c2,
      show: c >= 2,
      default: false,
    },
    {
      type: 'number',
      id: 'dehya_c6',
      text: `Leonine Bite Hits`,
      ...talents.c6,
      show: c >= 6,
      default: 0,
      min: 0,
      max: 4,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'fiery_field')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 70

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.6212, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6171, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7663, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.9529, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.5633, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.0182, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      const c1Scaling = c >= 1 ? [{ scaling: 0.036, multiplier: Stats.HP }] : []
      base.SKILL_SCALING = [
        {
          name: 'Indomitable Flame DMG',
          value: [{ scaling: calcScaling(1.1288, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...c1Scaling],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Ranging Flame DMG',
          value: [{ scaling: calcScaling(1.328, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...c1Scaling],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Field DMG',
          value: [
            { scaling: calcScaling(0.602, skill, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(0.0103, skill, 'elemental', '1') + (c >= 1 ? 0.036 : 0), multiplier: Stats.HP },
          ],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
          bonus: form.dehya_c2 ? 0.5 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Flame-Mane's Fist DMG`,
          value: [
            { scaling: calcScaling(0.987, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(0.0169, burst, 'elemental', '1') + (c >= 1 ? 0.06 : 0), multiplier: Stats.HP },
          ],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Incineration Drive DMG`,
          value: [
            { scaling: calcScaling(1.393, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(0.0239, burst, 'elemental', '1') + (c >= 1 ? 0.06 : 0), multiplier: Stats.HP },
          ],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.fiery_field)
        base.M_DMG_REDUCTION.push({ value: 0.3, name: 'Fiery Sanctum', source: `Self` }) + skill * 0.02

      if (c >= 1) base[Stats.P_HP].push({ value: 0.2, name: 'Constellation 1', source: `Self` })

      if (a >= 4) {
        base.SKILL_SCALING.push({
          name: `Total A4 Healing`,
          value: [{ scaling: 0.5, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
          self: true,
        })
      }

      if (c >= 4) {
        base.BURST_SCALING.push({
          name: `C4 Healing Per Hit`,
          value: [{ scaling: 0.025, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
          self: true,
        })
      }

      if (c >= 6) base.BURST_CR.push({ value: 0.1, name: 'Constellation 6', source: `Self` })
      if (form.dehya_c6) base.BURST_CD.push({ value: 0.15, name: 'Constellation 6', source: `Self` }) * form.dehya_c6

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.fiery_field)
        base.M_DMG_REDUCTION.push({ value: 0.3, name: 'Fiery Sanctum', source: `Dehya` }) + skill * 0.02

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Dehya
