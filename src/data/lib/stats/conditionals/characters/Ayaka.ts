import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ayaka = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Kamisato Art: Kabuki`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash a flurry of sword ki.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Kamisato Art: Hyouka`,
      content: `Summons blooming ice to launch nearby opponents, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      `,
    },
    burst: {
      title: `Kamisato Art: Soumetsu`,
      content: `Summons forth a snowstorm with flawless poise, unleashing a Frostflake Seki no To that moves forward continuously.
      <br />
      <br /><b>Frostflake Seki no To</b>
      <br />- A storm of whirling icy winds that slashes repeatedly at every enemy it touches, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />- The snowstorm explodes after its duration ends, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.`,
    },
    sprint: {
      title: `Kamisato Art: Senho`,
      content: `<b>Alternate Sprint</b>
      <br />Ayaka consumes Stamina and cloaks herself in a frozen fog that moves with her.
      <br />
      <br />In Senho form, she moves swiftly upon water.
      <br />When she reappears, the following effects occur:
      <br />- Ayaka unleashes frigid energy to apply <b class="text-genshin-cryo">Cryo</b> on nearby opponents.
      <br />- Coldness condenses around Ayaka's blade, infusing her attacks with <b class="text-genshin-cryo">Cryo</b> for a brief period.`,
    },
    a1: {
      title: `A1: Amatsumi Kunitsumi Sanctification`,
      content: `After using Kamisato Art: Hyouka, Kamisato Ayaka's Normal and Charged attacks deal <span class="text-desc">30%</span> increased DMG for <span class="text-desc">6</span>s.`,
    },
    a4: {
      title: `A4: Kanten Senmyou Blessing`,
      content: `When the Cryo application at the end of Kamisato Art: Senho hits an opponent, Kamisato Ayaka gains the following effects:
      <br />- Restores <span class="text-desc">10</span> Stamina
      <br />- Gains <span class="text-desc">18%</span> <b class="text-genshin-cryo">Cryo DMG Bonus</b> for <span class="text-desc">10</span>s.`,
    },
    util: {
      title: 'Fruits of Shinsa',
      content: `When Ayaka crafts Weapon Ascension Materials, she has a <span class="text-desc">10%</span> chance to receive double the product.`,
    },
    c1: {
      title: `C1: Snowswept Sakura`,
      content: `When Kamisato Ayaka's Normal or Charged Attacks deal <b class="text-genshin-cryo">Cryo DMG</b> to opponents, it has a <span class="text-desc">50%</span> chance of decreasing the CD of Kamisato Art: Hyouka by <span class="text-desc">0.3</span>s. This effect can occur once every <span class="text-desc">0.1</span>s.`,
    },
    c2: {
      title: `C2: Blizzard Blade Seki no To`,
      content: `When casting Kamisato Art: Soumetsu, unleashes <span class="text-desc">2</span> smaller additional Frostflake Seki no To, each dealing <span class="text-desc">20%</span> of the original storm's DMG.`,
    },
    c3: {
      title: `C3: Frostbloom Kamifubuki`,
      content: `Increases the Level of Kamisato Art: Soumetsu by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Ebb and Flow`,
      content: `Opponents damaged by Kamisato Art: Soumetsu's Frostflake Seki no To will have their DEF decreased by <span class="text-desc">30%</span> for <span class="text-desc">6</span>s.`,
    },
    c5: {
      title: `C5: Blossom Cloud Irutsuki`,
      content: `Increases the Level of Kamisato Art: Hyouka by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Dance of Suigetsu`,
      content: `Kamisato Ayaka gains Usurahi Butou every <span class="text-desc">10</span>s, increasing her Charged Attack DMG by <span class="text-desc">298%</span>. This buff will be cleared <span class="text-desc">0.5</span>s after Ayaka's Charged ATK hits an opponent, after which the timer for this ability will restart.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ayaka_infusion',
      text: `Cryo Infusion`,
      ...talents.sprint,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ayaka_a1',
      text: `A1 DMG Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ayaka_a4',
      text: `A4 Sprint Hit`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ayaka_c6',
      text: `Usurahi Butou`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
    {
      type: 'toggle',
      id: 'ayaka_c4',
      text: `C4 DEF Shred`,
      ...talents.c4,
      show: c >= 4,
      default: true,
      debuff: true
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'ayaka_c4')
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      if (form.ayaka_infusion) base.infuse(Element.CRYO)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4573, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4868, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.6262, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x3]',
          value: [{ scaling: calcScaling(0.2265, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.7818, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [x3]',
          value: [{ scaling: calcScaling(0.5513, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
          bonus: form.ayaka_c6 ? 2.98 : 0
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'SKill DMG',
          value: [{ scaling: calcScaling(2.392, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Cutting DMG',
          value: [{ scaling: calcScaling(1.123, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Bloom DMG',
          value: [{ scaling: calcScaling(1.6845, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.ayaka_a1) {
        base.BASIC_DMG += 0.3
        base.CHARGE_DMG += 0.3
      }
      if (form.ayaka_a4) base[Stats.CRYO_DMG] += 0.18

      if (c >= 2)
        base.BURST_SCALING.push(
          {
            name: 'Minor Cutting DMG',
            value: [{ scaling: calcScaling(1.123, burst, 'elemental', '1') * 0.2, multiplier: Stats.ATK }],
            element: Element.CRYO,
            property: TalentProperty.BURST,
          },
          {
            name: 'Minor Bloom DMG',
            value: [{ scaling: calcScaling(1.6845, burst, 'elemental', '1') * 0.2, multiplier: Stats.ATK }],
            element: Element.CRYO,
            property: TalentProperty.BURST,
          }
        )

        if(form.ayaka_c4) base.DEF_REDUCTION += 0.3

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if(form.ayaka_c4) base.DEF_REDUCTION += 0.3

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ayaka
