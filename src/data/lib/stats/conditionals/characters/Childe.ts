import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Childe = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Cutting Torrent`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, the power of Hydro will accumulate on the arrowhead. An arrow fully charged with the torrent will deal <b class="text-genshin-hydro">Hydro DMG</b> and apply the Riptide status.
      <br />
      <br /><b>Riptide</b>
      <br />Opponents affected by Riptide will suffer from <b class="text-genshin-hydro">AoE Hydro DMG</b> effects when attacked by Tartaglia in various ways. DMG dealt in this way is considered Normal Attack DMG.
      <br />- <b>Riptide Flash</b>: A fully-charged Aimed Shot that hits an opponent affected by Riptide deals consecutive bouts of AoE DMG. Can occur once every <span class="text-desc">0.7</span>s.
      <br />- <b>Riptide Burst</b>: Defeating an opponent affected by Riptide creates a <b class="text-genshin-hydro">Hydro</b> burst that inflicts the Riptide status on nearby opponents hit.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      <br />When Tartaglia is in Foul Legacy: Raging Tide's Melee Stance, he cannot perform a plunging attack.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Foul Legacy: Raging Tide`,
      content: `Unleashes a set of weaponry made of pure water, dealing <b class="text-genshin-hydro">Hydro DMG</b> to surrounding opponents and entering Melee Stance.
      <br />In this Stance, Tartaglia's Normal and Charged Attacks are converted to <b class="text-genshin-hydro">Hydro DMG</b> that cannot be overridden by any other elemental infusion and change as follows:
      <br />
      <br /><b>Normal Attack</b>
      <br />Performs up to 6 consecutive <b class="text-genshin-hydro">Hydro</b> strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash a cross slash, dealing <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Riptide Slash</b>
      <br />Hitting an opponent affected by Riptide with a melee attack unleashes a Riptide Slash that deals <b class="text-genshin-hydro">AoE Hydro DMG</b>. DMG dealt in this way is considered Elemental Skill DMG, and can only occur once every <span class="text-desc">1.5</span>s.
      <br />
      <br />After <span class="text-desc">30</span>s, or when the ability is unleashed again, this skill will end. Tartaglia will return to his Ranged Stance and this ability will enter CD.
      <br />The longer Tartaglia stays in his Melee Stance, the longer the CD.
      <br />If the return to a ranged stance occurs automatically after <span class="text-desc">30</span>s, the CD is even longer.`,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Havoc: Obliteration`,
      content: `Performs different attacks based on what stance Tartaglia is in when casting.
      <br />
      <br /><b>Ranged Stance: Flash of Havoc</b>
      <br />Swiftly fires a Hydro-imbued magic arrow, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b> and applying the Riptide status.
      <br />Returns a portion of its Energy Cost after use.
      <br />
      <br /><b>Melee Stance: Light of Obliteration</b>
      <br />Performs a slash with a large AoE, dealing massive <b class="text-genshin-hydro">Hydro DMG</b> to all surrounding opponents, which triggers Riptide Blast.
      <br />
      <br /><b>Riptide Blast</b>
      <br />When the obliterating waters hit an opponent affected by Riptide, it clears their Riptide status and triggers a Hydro Explosion that deals <b class="text-genshin-hydro">AoE Hydro DMG</b>.
      <br />DMG dealt in this way is considered Elemental Burst DMG.
      `,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Never Ending`,
      content: `Extends Riptide duration by <span class="text-desc">8</span>s.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Sword of Torrents`,
      content: `When Tartaglia is in Foul Legacy: Raging Tide's Melee stance, on dealing a CRIT hit, Normal and Charged Attacks apply the Riptide status effects to opponents.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Master of Weaponry`,
      content: `Increases your own party members' Normal Attack Level by <span class="text-desc">1</span>.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Foul Legacy: Tide Withholder`,
      content: `Decreases the CD of Foul Legacy: Raging Tide by <span class="text-desc">20%</span>.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Foul Legacy: Understream`,
      content: `When opponents affected by Riptide are defeated, Tartaglia regenerates <span class="text-desc">4</span> Elemental Energy.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Abyssal Mayhem: Vortex of Turmoil`,
      content: `Increases the Level of Foul Legacy: Raging Tide by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Abyssal Mayhem: Hydrospout`,
      content: `If Tartaglia is in Foul Legacy: Raging Tide's Melee Stance, triggers Riptide Slash against opponents on the field affected by Riptide every <span class="text-desc">4</span>s, otherwise, triggers Riptide Flash.
      <br />Riptide Slashes and Riptide Flashes triggered by this Constellation effect are not subject to the time intervals that would typically apply to these two Riptide effects, nor do they have any effect on those time intervals.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Havoc: Formless Blade`,
      content: `Increases the Level of Havoc: Obliteration by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Havoc: Annihilation`,
      content: `When Havoc: Obliteration is cast in Melee Stance, the CD of Foul Legacy: Raging Tide is reset.
      <br />This effect will only take place once Tartaglia returns to his Ranged Stance.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'childe_melee',
      text: `Melee Stance`,
      ...talents.skill,
      show: true,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'sara_atk')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = form.childe_melee
        ? [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.3887, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.4162, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.5633, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.5994, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.553, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '6-Hit [1]',
              value: [{ scaling: calcScaling(0.3543, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
            {
              name: '6-Hit [2]',
              value: [{ scaling: calcScaling(0.3767, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.NA,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.4128, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.4627, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.5538, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.5702, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.6089, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '6-Hit',
              value: [{ scaling: calcScaling(0.7276, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.childe_melee
        ? [
            {
              name: 'Charged Attack DMG [1]',
              value: [{ scaling: calcScaling(0.602, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.CA,
            },
            {
              name: 'Charged Attack DMG [2]',
              value: [{ scaling: calcScaling(0.7198, skill, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.CA,
            },
          ]
        : [
            {
              name: 'Aimed Shot',
              value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
            {
              name: 'Fully-Charged Aimed Shot',
              value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
              element: Element.HYDRO,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Stance Change DMG',
          value: [{ scaling: calcScaling(0.72, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Riptide Slash',
          value: [{ scaling: calcScaling(0.602, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Flash of Havoc DMG`,
          value: [{ scaling: calcScaling(4.64, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Light of Obliteration DMG`,
          value: [{ scaling: calcScaling(3.784, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Riptide Blast`,
          value: [{ scaling: calcScaling(1.2, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      base.CHARGE_SCALING.push(
        {
          name: 'Riptide Flash [x3]',
          value: [{ scaling: calcScaling(0.124, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: 'Riptide Burst',
          value: [{ scaling: calcScaling(0.62, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        }
      )

      if (c>=1) base.SKILL_CD_RED.push({value: 0.2, name: '', source: ``})

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

export default Childe
