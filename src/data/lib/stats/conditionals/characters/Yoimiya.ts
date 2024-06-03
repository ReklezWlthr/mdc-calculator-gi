import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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
      title: `Firework Flare-Up`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Perform a more precise Aimed Shot with increased DMG.
      <br />While aiming, flames will accumulate on the arrowhead before being fired off as an attack. Has different effects based on how long the energy has been charged:
      <br />- Charge Level 1: Fires off a flaming arrow that deals <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />- Charge Level 2: Generates a maximum of <span class="text-desc">3</span> Kindling Arrows based on time spent charging, releasing them as part of this Aimed Shot. Kindling Arrows will home in on nearby opponents, dealing <b class="text-genshin-pyro">Pyro DMG</b> on hit.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Niwabi Fire-Dance	`,
      content: `Yoimiya waves a sparkler and causes a ring of saltpeter to surround her.
      <br />
      <br /><b>Niwabi Enshou</b>
      <br />During this time, arrows fired by Yoimiya's Normal Attack will be Blazing Arrows, and their DMG will be increased and converted to <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />During this time, Normal Attack: Firework Flare-Up will not generate Kindling Arrows at Charge Level 2.
      <br />
      <br />This effect will deactivate when Yoimiya leaves the field.`,
    },
    burst: {
      title: `Ryuukin Saxifrage`,
      content: `Yoimiya leaps into the air along with her original creation, the "Ryuukin Saxifrage," and fires forth blazing rockets bursting with surprises that deal <b class="text-genshin-pyro">AoE Pyro DMG</b> and mark one of the hit opponents with Aurous Blaze.
      <br />
      <br /><b>Aurous Blaze</b>
      <br />All Normal/Charged/Plunging Attacks, Elemental Skills, and Elemental Bursts by any party member other than Yoimiya that hit an opponent marked by Aurous Blaze will trigger an explosion, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />When an opponent affected by Aurous Blaze is defeated before its duration expires, the effect will pass on to another nearby opponent, who will inherit the remaining duration.
      <br />
      <br />One Aurous Blaze explosion can be triggered every <span class="text-desc">2</span>s. When Yoimiya is down, Aurous Blaze effects created through her skills will be deactivated.
      `,
    },
    a1: {
      title: `A1: Tricks of the Trouble-Maker`,
      content: `During Niwabi Fire-Dance, shots from Yoimiya's Normal Attack will increase her <b class="text-genshin-pyro">Pyro DMG Bonus</b> by <span class="text-desc">2%</span> on hit. This effect lasts for <span class="text-desc">3</span>s and can have a maximum of <span class="text-desc">10</span> stacks.`,
    },
    a4: {
      title: `A4: Summer Night's Dawn`,
      content: `Using Ryuukin Saxifrage causes nearby party members (not including Yoimiya) to gain a <span class="text-desc">10%</span> ATK increase for <span class="text-desc">15</span>s. Additionally, a further ATK Bonus will be added on based on the number of "Tricks of the Trouble-Maker" stacks Yoimiya possesses when using Ryuukin Saxifrage. Each stack increases this ATK Bonus by <span class="text-desc">1%</span>.`,
    },
    util: {
      title: `Blazing Match`,
      content: `When Yoimiya crafts Decoration, Ornament, and Landscape-type Furnishings, she has a <span class="text-desc">100%</span> chance to refund a portion of the materials used.`,
    },
    c1: {
      title: `C1: Agate Ryuukin`,
      content: `The Aurous Blaze created by Ryuukin Saxifrage lasts for an extra <span class="text-desc">4</span>s.
      <br />Additionally, when an opponent affected by Aurous Blaze is defeated within its duration, Yoimiya's ATK is increased by <span class="text-desc">20%</span> for <span class="text-desc">20</span>s.`,
    },
    c2: {
      title: `C2: A Procession of Bonfires`,
      content: `When Yoimiya's Pyro DMG scores a CRIT Hit, Yoimiya will gain a <span class="text-desc">25%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> for <span class="text-desc">6</span>s.
      <br />This effect can be triggered even when Yoimiya is not the active character.`,
    },
    c3: {
      title: `C3: Trickster's Flare`,
      content: `Increases the Level of Niwabi Fire-Dance by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Pyrotechnic Professional`,
      content: `When Yoimiya's own Aurous Blaze triggers an explosion, Niwabi Fire-Dance's CD is decreased by <span class="text-desc">1.2</span>.`,
    },
    c5: {
      title: `C5: A Summer Festival's Eve`,
      content: `Increases the Level of Ryuukin Saxifrage by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Naganohara Meteor Swarm`,
      content: `During Niwabi Fire-Dance, Yoimiya's Normal Attacks have a <span class="text-desc">50%</span> chance of firing an extra Blazing Arrow that deals <span class="text-desc">60%</span> of its original DMG. This DMG is considered Normal Attack DMG.`,
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
      text: `Blazing Arrows Fired`,
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
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 70

      // if (form.niwabi) base.infuse(Element.PYRO, true)

      const niwabi = form.niwabi ? calcScaling(1.3791, skill, 'special', 'yoimiya') : 0
      const element = form.niwabi ? Element.PYRO : Element.PHYSICAL
      base.BASIC_SCALING = [
        {
          name: '1-Hit [x2]',
          value: [{ scaling: calcScaling(0.356, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
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
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.464, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: element,
          property: TalentProperty.NA,
          multiplier: niwabi,
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

      if (form.yoimiya_a1) base[Stats.PYRO_DMG] += form.yoimiya_a1 * 0.02
      if (form.yoimiya_c1) base[Stats.P_ATK] += 0.2
      if (form.yoimiya_c2) base[Stats.PYRO_DMG] += 0.25

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.yoimiya_a4) {
        base[Stats.P_ATK] += 0.1
        if (form.yoimiya_a1) base[Stats.P_ATK] += form.yoimiya_a1 * 0.01
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Yoimiya
