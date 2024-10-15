import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Candace = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Gleaming Spear - Guardian Stance`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Sacred Rite: Heron's Sanctum`,
      content: `Candace's fighting style is capable of warding off an entire tide of foes.
      <br />
      <br /><b>Tap</b>
      <br />Rushes forward with her shield, dealing <b class="text-genshin-hydro">Hydro DMG</b> to opponents in front of her.
      <br />
      <br /><b>Hold</b>
      <br />Raises her shield to block incoming attacks from nearby opponents, forming a barrier that absorbs DMG based on her Max HP and absorbs <b class="text-genshin-hydro">Hydro DMG</b> <span class="text-desc">250%</span> more effectively. This barrier lasts until the Elemental Skill is unleashed.
      <br />After holding for a certain period of time, Candace will finish charging, and when the skill button is released, the skill duration expires, or when the barrier is broken, she will perform a leaping strike that deals <b class="text-genshin-hydro">Hydro DMG</b> to opponents in front of her.
      `,
      image: 'Skill_S_Candace_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Sacred Rite: Wagtail's Tide`,
      content: `Raising her weapon on high, Candace calls upon a divine blessing that deals <b class="text-genshin-hydro">AoE Hydro DMG</b> based on her Max HP and continuously confers the <b class="text-genshin-hydro">Prayer of the Crimson Crown</b> on your active character.
      <br />
      <br /><b class="text-genshin-hydro">Prayer of the Crimson Crown</b>
      <br />This effect has the following properties:
      <br />- Characters deal increased <b>Elemental DMG</b> with their Normal Attacks.
      <br />- Whenever a character takes the field, they will unleash a rippling wave of water that deals <b class="text-genshin-hydro">Hydro DMG</b> to nearby opponents. There is a limited number of waves that can be triggered in the duration of this skill.
      <br />- Sword, Claymore, and Polearm-wielding characters under this effect will obtain a <b class="text-genshin-hydro">Hydro Infusion</b>.`,
      image: 'Skill_E_Candace_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Aegis of Crossed Arrows`,
      content: `If Candace is hit by an attack in the Hold duration of <b>Sacred Rite: Heron's Sanctum</b>, that skill will finish charging instantly.`,
      image: 'UI_Talent_S_Candace_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Celestial Dome of Sand`,
      content: `Characters affected by the <b class="text-genshin-hydro">Prayer of the Crimson Crown</b> caused by <b>Sacred Rite: Wagtail's Tide</b> will deal <span class="text-desc">0.5%</span> increased DMG to opponents for every <span class="text-desc">1,000</span> points of Candace's Max HP when they deal <b>Elemental DMG</b> with their Normal Attacks.`,
      image: 'UI_Talent_S_Candace_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `To Dawn's First Light`,
      content: `Decreases climbing Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Climb',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Returning Heiress of the Scarlet Sands`,
      content: `The duration of <b class="text-genshin-hydro">Prayer of the Crimson Crown</b> effect triggered by <b>Sacred Rite: Wagtail's Tide</b> is increased by <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Candace_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Moon-Piercing Brilliance`,
      content: `When <b>Sacred Rite: Heron's Sanctum</b> hits opponents, Candace's Max HP will be increased by <span class="text-desc">20%</span> for <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Candace_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Hunter's Supplication`,
      content: `Increases the Level of <b>Sacred Rite: Wagtail's Tide</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Candace_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sentinel Oath`,
      content: `Shortens the Hold CD of <b>Sacred Rite: Heron's Sanctum</b> to be the same as that of the Tapping CD.`,
      image: 'UI_Talent_S_Candace_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Heterochromatic Gaze`,
      content: `Increases the Level of <b>Sacred Rite: Heron's Sanctum</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Candace_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `The Overflow`,
      content: `When characters (excluding Candace herself) affected by the <b class="text-genshin-hydro">Prayer of the Crimson Crown</b> caused by <b>Sacred Rite: Wagtail's Tide</b> deal <b>Elemental DMG</b> to opponents using Normal Attacks, an attack wave will be unleashed that deals <b class="text-genshin-hydro">AoE Hydro DMG</b> equal to <span class="text-desc">15%</span> of Candace's Max HP.
      <br />This effect can trigger once every <span class="text-desc">2.3</span>s and is considered Elemental Burst DMG.`,
      image: 'UI_Talent_S_Candace_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'candace_burst',
      text: `Prayer of the Crimson Crown`,
      ...talents.burst,
      show: true,
      default: false,
    },
    {
      type: 'toggle',
      id: 'candace_c2',
      text: `C2 Skill Hit`,
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
    allyContent: [findContentById(content, 'candace_burst')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.608, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6115, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.3549, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.4337, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.9494, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.2418, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Shield',
          value: [{ scaling: calcScaling(0.12, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1155, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Base DMG',
          value: [{ scaling: calcScaling(0.12, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Charged DMG',
          value: [{ scaling: calcScaling(0.1904, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.0661, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Wave Impact DMG',
          value: [{ scaling: calcScaling(0.0661, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.candace_burst) {
        base.ELEMENTAL_NA_DMG.push({ value: 0.2, name: 'Elemental Burst', source: `Self` })
        base.infuse(Element.HYDRO)
      }
      if (form.candace_c2) base[Stats.P_HP].push({ value: 0.2, name: 'Constellation 2', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      const canInfuse = !_.includes([WeaponType.BOW, WeaponType.CATALYST], form.weapon)
      if (aForm.candace_burst) {
        base.ELEMENTAL_NA_DMG.push({ value: 0.2, name: 'Elemental Burst', source: `Candace` })
        if (canInfuse) base.infuse(Element.HYDRO)
      }

      if (a >= 4) {
        const b = own.getHP() / 1000
        base.ELEMENTAL_NA_DMG.push({
          value: b * 0.005,
          name: 'Ascension 4 Passive',
          source: 'Candace',
          base: b,
          multiplier: 0.005,
        })
      }
      if (form.candace_burst && c >= 6)
        base.BASIC_SCALING.push({
          name: 'C6 Wave DMG',
          value: [
            { scaling: calcScaling(0.0661, burst, 'elemental', '1'), multiplier: Stats.HP, override: own.getHP() },
          ],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        const b = base.getHP() / 1000
        base.ELEMENTAL_NA_DMG.push({
          value: b * 0.005,
          name: 'Ascension 4 Passive',
          source: 'Self',
          base: b,
          multiplier: 0.005,
        })
      }

      return base
    },
  }
}

export default Candace
