import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Yoimiya = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Firework Flare-Up`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Perform a more precise Aimed Shot with increased DMG.
      <br />While aiming, flames will accumulate on the arrowhead before being fired off as an attack. Has different effects based on how long the energy has been charged:
      <br />- <b>Charge Level 1</b>: Fires off a flaming arrow that deals <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />- <b>Charge Level 2</b>: Generates a maximum of <span class="text-desc">3</span> <b>Kindling Arrows</b> based on time spent charging, releasing them as part of this Aimed Shot. <b>Kindling Arrows</b> will home in on nearby opponents, dealing <b class="text-genshin-pyro">Pyro DMG</b> on hit.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Niwabi Fire-Dance	`,
      content: `Yoimiya waves a sparkler and causes a ring of saltpeter to surround her.
      <br />
      <br /><b class="text-red">Niwabi Enshou</b>
      <br />During this time, arrows fired by Yoimiya's Normal Attack will be <b>Blazing Arrows</b>, and their DMG will be increased and converted to <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />During this time, <b>Normal Attack: Firework Flare-Up</b> will not generate <b>Kindling Arrows</b> at <b>Charge Level</b> <span class="text-desc">2</span>.
      <br />
      <br />This effect will deactivate when Yoimiya leaves the field.`,
      image: 'Skill_S_Yoimiya_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Ryuukin Saxifrage`,
      content: `Yoimiya leaps into the air along with her original creation, the "Ryuukin Saxifrage," and fires forth blazing rockets bursting with surprises that deal <b class="text-genshin-pyro">AoE Pyro DMG</b> and mark one of the hit opponents with <b class="text-desc">Aurous Blaze</b>.
      <br />
      <br /><b class="text-desc">Aurous Blaze</b>
      <br />All Normal/Charged/Plunging Attacks, Elemental Skills, and Elemental Bursts by any party member other than Yoimiya that hit an opponent marked by <b class="text-desc">Aurous Blaze</b> will trigger an explosion, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />When an opponent affected by <b class="text-desc">Aurous Blaze</b> is defeated before its duration expires, the effect will pass on to another nearby opponent, who will inherit the remaining duration.
      <br />
      <br />One <b class="text-desc">Aurous Blaze</b> explosion can be triggered every <span class="text-desc">2</span>s. When Yoimiya is down, <b class="text-desc">Aurous Blaze</b> effects created through her skills will be deactivated.
      `,
      image: 'Skill_E_Yoimiya_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Tricks of the Trouble-Maker`,
      content: `During <b>Niwabi Fire-Dance</b>, shots from Yoimiya's Normal Attack will increase her <b class="text-genshin-pyro">Pyro DMG Bonus</b> by <span class="text-desc">2%</span> on hit. This effect lasts for <span class="text-desc">3</span>s and can have a maximum of <span class="text-desc">10</span> stacks.`,
      image: 'UI_Talent_S_Yoimiya_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Summer Night's Dawn`,
      content: `Using <b>Ryuukin Saxifrage</b> causes nearby party members (not including Yoimiya) to gain a <span class="text-desc">10%</span> ATK increase for <span class="text-desc">15</span>s. Additionally, a further ATK Bonus will be added on based on the number of <b>Tricks of the Trouble-Maker</b> stacks Yoimiya possesses when using <b>Ryuukin Saxifrage</b>. Each stack increases this ATK Bonus by <span class="text-desc">1%</span>.`,
      image: 'UI_Talent_S_Yoimiya_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Blazing Match`,
      content: `When Yoimiya crafts Decoration, Ornament, and Landscape-type Furnishings, she has a <span class="text-desc">100%</span> chance to refund a portion of the materials used.`,
      image: 'UI_Talent_S_Yoimiya_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Agate Ryuukin`,
      content: `The <b class="text-desc">Aurous Blaze</b> created by <b>Ryuukin Saxifrage</b> lasts for an extra <span class="text-desc">4</span>s.
      <br />Additionally, when an opponent affected by <b class="text-desc">Aurous Blaze</b> is defeated within its duration, Yoimiya's ATK is increased by <span class="text-desc">20%</span> for <span class="text-desc">20</span>s.`,
      image: 'UI_Talent_S_Yoimiya_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `A Procession of Bonfires`,
      content: `When Yoimiya's <b class="text-genshin-pyro">Pyro DMG</b> scores a CRIT Hit, Yoimiya will gain a <span class="text-desc">25%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> for <span class="text-desc">6</span>s.
      <br />This effect can be triggered even when Yoimiya is not the active character.`,
      image: 'UI_Talent_S_Yoimiya_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Trickster's Flare`,
      content: `Increases the Level of <b>Niwabi Fire-Dance</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yoimiya_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Pyrotechnic Professional`,
      content: `When Yoimiya's own <b class="text-desc">Aurous Blaze</b> triggers an explosion, <b>Niwabi Fire-Dance</b>'s CD is decreased by <span class="text-desc">1.2</span>.`,
      image: 'UI_Talent_S_Yoimiya_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `A Summer Festival's Eve`,
      content: `Increases the Level of <b>Ryuukin Saxifrage</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Yoimiya_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Naganohara Meteor Swarm`,
      content: `During <b>Niwabi Fire-Dance</b>, Yoimiya's Normal Attacks have a <span class="text-desc">50%</span> chance of firing an extra <b>Blazing Arrow</b> that deals <span class="text-desc">60%</span> of its original DMG. This DMG is considered Normal Attack DMG.`,
      image: 'UI_Talent_S_Yoimiya_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'niwabi',
      text: `Niwabi Enshou`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'yoimiya_a1',
      text: `Tricks of the Trouble-Maker Stacks`,
      ...talents.a1,
      show: a >= 1,
      default: 10,
      min: 0,
      max: 10,
    },
    {
      type: 'toggle',
      id: 'yoimiya_c1',
      text: `C1 ATK Buff`,
      ...talents.a1,
      show: c >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'yoimiya_c2',
      text: `C2 Pyro CRIT Hit Buff`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'yoimiya_a4',
      text: `A4 Ally ATK Buff`,
      ...talents.a4,
      show: a >= 4,
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
      base.MAX_ENERGY = 70

      // if (form.niwabi) base.infuse(Element.PYRO, true)

      const niwabi = form.niwabi ? calcScaling(1.3791, skill, 'special', 'yoimiya') : 0
      const element = form.niwabi ? Element.PYRO : Element.PHYSICAL
      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.356, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
          hit: 2,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.684, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.889, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.464, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
          hit: 2,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(1.059, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Aimed Shot',
          value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Fully-Charged Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Kindling Arrow DMG',
          value: [{ scaling: calcScaling(0.16, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.272, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Aurous Blaze Explosion DMG`,
          value: [{ scaling: calcScaling(1.22, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.yoimiya_a1)
        base[Stats.PYRO_DMG].push({ value: form.yoimiya_a1 * 0.02, name: 'Ascension 1 Passive', source: `Self` })
      if (form.yoimiya_c1) base[Stats.P_ATK].push({ value: 0.2, name: 'Constellation 1', source: `Self` })
      if (form.yoimiya_c2) base[Stats.PYRO_DMG].push({ value: 0.25, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yoimiya_a4) {
        base[Stats.P_ATK].push({ value: 0.1 + form.yoimiya_a1 * 0.01, name: 'Ascension 4 Passive', source: `Yoimiya` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Yoimiya
