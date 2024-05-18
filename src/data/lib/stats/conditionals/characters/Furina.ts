import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { toPercentage } from '@src/core/utils/converter'
import { calcScaling } from '@src/core/utils/data_format'

const Furina = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const maxFanfare = c >= 1 ? 400 : 300
  let salonA4Bonus = 0
  let salonA4Healing = 0

  const talents: ITalent = {
    normal: {
      title: "Soloist's Solicitation",
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash a solo dance, dealing Physical DMG to nearby opponents and changing her Arkhe alignment. If Salon Members or Singer of Many Waters summoned by her Elemental Skill "Salon Solitaire" are present, their lineup will switch in response.
      <br />
      <br /><b>Arkhe: Seats Sacred and Secular</b>
      <br />At intervals, when Furina's Normal Attacks hit, a Spiritbreath Thorn or a Surging Blade will descend based on her current alignment, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on her current alignment.
      <br />When Furina takes the field, her starting Arkhe will be <b class="text-genshin-ousia">Ousia</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      upgrade: ['c6'],
    },
    skill: {
      title: 'Salon Solitaire',
      content: `Invites the guests of the Salon Solitaire to come forth and aid in Furina's performance. Will summon either the Salon Members or the Singer of Many Waters based on Furina's current Arkhe alignment.
      <br />
      <br /><b class="text-genshin-ousia">Ousia</b>
      <br />Foaming bubbles like celebrants shall dance, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Furina's Max HP and summoning 3 Salon Members: the Ball Octopus-shaped Gentilhomme Usher, the Bubbly Seahorse-shaped Surintendante Chevalmarin, and the Armored Crab-shaped Mademoiselle Crabaletta.
      <br />They will attack nearby opponents at intervals, prioritizing the target of the active character, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on Max HP.
      <br />When they attack, if character(s) with more than <span class="text-desc">50%</span> HP are nearby, the Members will increase their current attack's power based on the number of such characters, and consume said characters' HP. If the characters who meet these requirements are <span class="text-desc">1/2/3/4</span> (or more), the Members' attacks will deal <span class="text-desc">110%/120%/130%/140%</span> of their original DMG.
      <br />
      <br /><b class="text-genshin-pneuma">Pneuma</b>
      <br />Summons the Singer of Many Waters, who will heal nearby active character(s) based on Max HP at intervals.
      <br />
      <br />The Salon Members and Singer of Many Waters share a duration, and when Furina uses her Charged Attack to change the guest type, the new guests will inherit the initial duration.
      <br />While the Salon Members and the Singer of Many Waters are on the field, Furina can move on the water's surface.
      `,
      upgrade: ['a4', 'c4', 'c5', 'c6'],
    },
    burst: {
      title: 'Let the People Rejoice',
      content: `Rouses the impulse to revel, creating a stage of foam that will deal <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Furina's Max HP and cause nearby party members to enter the Universal Revelry state: During this time, when nearby party members' HP increases or decreases, <span class="text-desc">1</span> Fanfare point will be granted to Furina for each percentage point of their Max HP by which their HP changes.
      <br />At the same time, Furina will increase the DMG dealt by and Incoming Healing Bonus of all nearby party members based on the amount of Fanfare she has.
      <br />When the duration ends, Furina's Fanfare points will be cleared.
      `,
      upgrade: ['c1', 'c2', 'c3'],
    },
    a1: {
      title: 'A1: Endless Waltz',
      content: `When the active character in your party receives healing, if the source of the healing is not Furina herself and the healing overflows, then Furina will heal nearby party members for <span class="text-desc">2%</span> of their Max HP once every <span class="text-desc">2</span>s within the next <span class="text-desc">4</span>s.`,
    },
    a4: {
      title: 'A4: Unheard Confession',
      content: `Every <span class="text-desc">1,000</span> points of Furina's Max HP can buff the different Arkhe-aligned Salon Solitaire in the following ways:
      <br />Will increase Salon Member DMG dealt by <span class="text-desc">0.7%</span>, up to a maximum of <span class="text-desc">28%</span>.
      <br />Will decrease active character healing interval of the Singer of Many Waters by <span class="text-desc">0.4%</span>, up to a maximum of <span class="text-desc">16%</span>.`,
      value: [
        {
          name: 'Current Bonus DMG',
          value: { stat: Stats.HP, scaling: (hp) => toPercentage(_.min([0.007 * (hp / 1000), 0.28])) },
        },
        {
          name: 'Current decreased interval',
          value: { stat: Stats.HP, scaling: (hp) => toPercentage(_.min([0.004 * (hp / 1000), 0.16])) },
        },
      ],
    },
    c1: {
      title: 'C1: "Love Is a Rebellious Bird That None Can Tame"',
      content: `When using Let the People Rejoice, Furina will gain <span class="text-desc">150</span> Fanfare.
      <br />Additionally, Furina's Fanfare limit is increased by <span class="text-desc">100</span>.`,
    },
    c2: {
      title: 'C2: "A Woman Adapts Like Duckweed in Water"',
      content: `While Let the People Rejoice lasts, Furina's Fanfare gain from increases or decreases in nearby characters' HP is increased by <span class="text-desc">250%</span>. Each point of Fanfare above the limit will increase Furina's Max HP by <span class="text-desc">0.35%</span>. Her maximum Max HP increase is <span class="text-desc">140%</span>.`,
    },
    c3: {
      title: 'C3: "My Secret Is Hidden Within Me, No One Will Know My Name"',
      content: `Increases the Level of Let the People Rejoice by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: 'C4: "They Know Not Life, Who Dwelt in the Netherworld Not!"',
      content: `When the Salon Members from Salon Solitaire hit an opponent, or the Singer of Many Waters restores HP to nearby active characters, Furina will restore 4 Energy. This effect can be triggered once every 5s.`,
    },
    c5: {
      title: 'C5: "His Name I Now Know, It Is...!"',
      content: `Increases the Level of Salon Solitaire by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: 'C6: "Hear Me — Let Us Raise the Chalice of Love!"',
      content: `When using Salon Solitaire, Furina gains "Center of Attention" for 10s.
      <br />Throughout the duration, Furina's Normal Attacks, Charged Attacks, and Plunging Attacks are converted into Hydro DMG which cannot be overridden by any other elemental infusion. DMG is also increased by an amount equivalent to <span class="text-desc">18%</span> of Furina's max HP.
      <br />Throughout the duration, Furina's Normal Attacks (not including Arkhe: Seats Sacred and Secular Attacks), Charged Attacks, and the impact of Plunging Attacks will cause different effects up to every <span class="text-desc">0.1</span>s after hitting opponents depending on her current Arkhe alignment:
      <br />
      <br />Arkhe: <b class="text-genshin-ousia">Ousia</b>
      <br />Every 1s, all nearby characters in the party will be healed by <span class="text-desc">4%</span> of Furina's max HP, for a duration of <span class="text-desc">2.9</span>s. Triggering this effect again will extend its duration.
      <br />Arkhe: <b class="text-genshin-pneuma">Pneuma</b>
      <br />This Normal Attack (not including Arkhe: Seats Sacred and Secular Attacks), Charged Attack, or Plunging Attack ground impact DMG will be further increased by an amount equivalent to <span class="text-desc">25%</span> of Furina's max HP. When any of the attacks mentioned previously hit an opponent, all nearby characters in the party will consume <span class="text-desc">1%</span> of their current HP.
      <br />
      <br />During the duration of each instance of "Center of Attention," the above effects can be triggered up to <span class="text-desc">6</span> times. "Center of Attention" will end when its effects have triggered <span class="text-desc">6</span> times or when the duration expires.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'pneuma',
      text: `Pneuma Alignment`,
      ...talents.normal,
      show: true,
      default: false,
    },
    {
      type: 'number',
      id: 'fanfare',
      text: `Fanfare Stacks`,
      ...talents.burst,
      show: true,
      min: c >= 1 ? 150 : 0,
      max: maxFanfare,
      default: maxFanfare,
    },
    {
      type: 'number',
      id: 'salonAlly',
      text: `Allies with >=50% HP`,
      ...talents.skill,
      show: true,
      min: 0,
      max: 4,
      default: 4,
    },
    {
      type: 'toggle',
      id: 'centerOfAttention',
      text: `Center of Attention`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'fanfare')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      const salonMultiplier = 1 + _.min([form.salonAlly * 0.1, 0.4])

      if (form.centerOfAttention) base.infuse(Element.HYDRO, true)
      const c6DmgBonus = form.centerOfAttention
        ? [{ scaling: 0.18 + (form.pneuma ? 0.25 : 0), multiplier: Stats.HP }]
        : []

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4839, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6DmgBonus],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4373, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6DmgBonus],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5512, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6DmgBonus],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.733, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6DmgBonus],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: 'Arkhe: Adaptive',
          value: [{ scaling: calcScaling(0.0946, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(0.7422, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6DmgBonus],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal, Element.PHYSICAL, c6DmgBonus)
      base.SKILL_SCALING = form.pneuma
        ? [
            {
              name: 'Singer of Many Waters Healing',
              value: [{ scaling: calcScaling(0.048, skill, 'physical', '1'), multiplier: Stats.HP }],
              flat: calcScaling(462, 10, 'special', 'flat'),
              element: TalentProperty.HEAL,
              property: TalentProperty.HEAL,
            },
          ]
        : [
            {
              name: 'Ousia Bubble DMG',
              value: [{ scaling: calcScaling(0.0786, skill, 'physical', '1'), multiplier: Stats.HP }],
              multiplier: salonMultiplier,
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
            {
              name: 'Gentilhomme Usher DMG',
              value: [{ scaling: calcScaling(0.0596, skill, 'physical', '1'), multiplier: Stats.HP }],
              multiplier: salonMultiplier,
              bonus: salonA4Bonus,
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
            {
              name: 'Surintendante Chevalmarin DMG',
              value: [{ scaling: calcScaling(0.0323, skill, 'physical', '1'), multiplier: Stats.HP }],
              multiplier: salonMultiplier,
              bonus: salonA4Bonus,
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
            {
              name: 'Mademoiselle Crabaletta DMG',
              value: [{ scaling: calcScaling(0.0829, skill, 'physical', '1'), multiplier: Stats.HP }],
              multiplier: salonMultiplier,
              bonus: salonA4Bonus,
              element: Element.HYDRO,
              property: TalentProperty.SKILL,
            },
          ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.1141, burst, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      base[Stats.ALL_DMG] += (0.0007 + burst * 0.0002) * form.fanfare
      base[Stats.I_HEALING] += (0.0001 + burst * 0.0001) * form.fanfare

      if (c >= 2 && form.fanfare > maxFanfare) base[Stats.P_HP] += _.min([(form.fanfare - maxFanfare) * 0.0035, 1.4])
      if (form.centerOfAttention)
        base.BASIC_SCALING.push({
          name: 'C6 Healing',
          value: [{ scaling: 0.04, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      base[Stats.ALL_DMG] += (0.0005 + burst * 0.0002) * form.fanfare
      base[Stats.I_HEALING] += burst * 0.0001 * form.fanfare

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      salonA4Bonus = a >= 4 ? _.min([0.007 * (base.getHP() / 1000), 0.28]) : 0
      salonA4Healing = a >= 4 ? _.min([0.004 * (base.getHP() / 1000), 0.16]) : 0

      return base
    },
  }
}

export default Furina
