import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { IContent, ITalent } from '@src/domain/conditional'
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

  const hardCap = c >= 1 ? 400 : 300
  const maxFanfare = c >= 2 ? 800 : hardCap

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: "Soloist's Solicitation",
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash a solo dance, dealing <b>Physical DMG</b> to nearby opponents and changing her <b>Arkhe</b> alignment. If <b>Salon Members</b> or <b>Singer of Many Waters</b> summoned by her Elemental Skill <b>Salon Solitaire</b> are present, their lineup will switch in response.
      <br />
      <br /><b>Arkhe: Seats Sacred and Secular</b>
      <br />At intervals, when Furina's Normal Attacks hit, a <b class="text-genshin-pneuma">Spiritbreath Thorn</b> or a <b class="text-genshin-ousia">Surging Blade</b> will descend based on her current alignment, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on her current alignment.
      <br />When Furina takes the field, her starting <b>Arkhe</b> will be <b class="text-genshin-ousia">Ousia</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      upgrade: ['c6'],
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: 'Salon Solitaire',
      content: `Invites the guests of the <b>Salon Solitaire</b> to come forth and aid in Furina's performance. Will summon either the <b>Salon Members</b> or the <b>Singer of Many Waters</b> based on Furina's current <b>Arkhe</b> alignment.
      <br />
      <br /><b class="text-genshin-ousia">Ousia</b>
      <br />Foaming bubbles like celebrants shall dance, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Furina's Max HP and summoning 3 <b>Salon Members</b>: the Ball Octopus-shaped <b>Gentilhomme Usher</b>, the Bubbly Seahorse-shaped <b>Surintendante Chevalmarin</b>, and the Armored Crab-shaped <b>Mademoiselle Crabaletta</b>.
      <br />They will attack nearby opponents at intervals, prioritizing the target of the active character, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on Max HP.
      <br />When they attack, if character(s) with more than <span class="text-desc">50%</span> HP are nearby, the <b>Members</b> will increase their current attack's power based on the number of such characters, and consume said characters' HP. If the characters who meet these requirements are <span class="text-desc">1/2/3/4</span> (or more), the Members' attacks will deal <span class="text-desc">110%/120%/130%/140%</span> of their original DMG.
      <br />
      <br /><b class="text-genshin-pneuma">Pneuma</b>
      <br />Summons the <b>Singer of Many Waters</b>, who will heal nearby active character(s) based on Max HP at intervals.
      <br />
      <br />The <b>Salon Members</b> and <b>Singer of Many Waters</b> share a duration, and when Furina uses her Charged Attack to change the guest type, the new guests will inherit the initial duration.
      <br />While the <b>Salon Members</b> and the <b>Singer of Many Waters</b> are on the field, Furina can move on the water's surface.
      `,
      upgrade: ['a4', 'c4', 'c5', 'c6'],
      image: 'Skill_S_Furina_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: 'Let the People Rejoice',
      content: `Rouses the impulse to revel, creating a stage of foam that will deal <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Furina's Max HP and cause nearby party members to enter the <b class="text-genshin-hydro">Universal Revelry</b> state: During this time, when nearby party members' HP increases or decreases, <span class="text-desc">1</span> <b class="text-genshin-hydro">Fanfare</b> point will be granted to Furina for each percentage point of their Max HP by which their HP changes.
      <br />At the same time, Furina will increase the DMG dealt by and Incoming Healing Bonus of all nearby party members based on the amount of Fanfare she has.
      <br />When the duration ends, Furina's <b class="text-genshin-hydro">Fanfare</b> points will be cleared.
      `,
      upgrade: ['c1', 'c2', 'c3'],
      image: 'Skill_E_Furina_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: 'Endless Waltz',
      content: `When the active character in your party receives healing, if the source of the healing is not Furina herself and the healing overflows, then Furina will heal nearby party members for <span class="text-desc">2%</span> of their Max HP once every <span class="text-desc">2</span>s within the next <span class="text-desc">4</span>s.`,
      image: 'UI_Talent_S_Furina_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: 'Unheard Confession',
      content: `Every <span class="text-desc">1,000</span> points of Furina's Max HP can buff the different <b>Arkhe</b>-aligned <b>Salon Solitaire</b> in the following ways:
      <br />Will increase <b>Salon Member</b> DMG dealt by <span class="text-desc">0.7%</span>, up to a maximum of <span class="text-desc">28%</span>.
      <br />Will decrease active character healing interval of the <b>Singer of Many Waters</b> by <span class="text-desc">0.4%</span>, up to a maximum of <span class="text-desc">16%</span>.`,
      image: 'UI_Talent_S_Furina_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `The Sea Is My Stage`,
      content: `Xenochromatic Fontemer Aberrant ability CD decreased by <span class="text-desc">30%</span>.`,
      image: 'UI_Talent_S_Furina_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: '"Love Is a Rebellious Bird That None Can Tame"',
      content: `When using <b>Let the People Rejoice</b>, Furina will gain <span class="text-desc">150</span> <b class="text-genshin-hydro">Fanfare</b>.
      <br />Additionally, Furina's <b class="text-genshin-hydro">Fanfare</b> limit is increased by <span class="text-desc">100</span>.`,
      image: 'UI_Talent_S_Furina_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: '"A Woman Adapts Like Duckweed in Water"',
      content: `While <b>Let the People Rejoice</b> lasts, Furina's <b class="text-genshin-hydro">Fanfare</b> gain from increases or decreases in nearby characters' HP is increased by <span class="text-desc">250%</span>. Each point of <b class="text-genshin-hydro">Fanfare</b> above the limit will increase Furina's Max HP by <span class="text-desc">0.35%</span>. Her maximum Max HP increase is <span class="text-desc">140%</span>.`,
      image: 'UI_Talent_S_Furina_04',
    },
    c3: {
      trace: `Constellation 3`,
      title: '"My Secret Is Hidden Within Me, No One Will Know My Name"',
      content: `Increases the Level of <b>Let the People Rejoice</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Furina_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: '"They Know Not Life, Who Dwelt in the Netherworld Not!"',
      content: `When the <b>Salon Members</b> from <b>Salon Solitaire</b> hit an opponent, or the <b>Singer of Many Waters</b> restores HP to nearby active characters, Furina will restore <span class="text-desc">4</span> Energy. This effect can be triggered once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Furina_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: '"His Name I Now Know, It Is...!"',
      content: `Increases the Level of <b>Salon Solitaire</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Furina_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: '"Hear Me — Let Us Raise the Chalice of Love!"',
      content: `When using <b>Salon Solitaire</b>, Furina gains <b class="text-genshin-hydro">Center of Attention</b> for <span class="text-desc">10</span>s.
      <br />Throughout the duration, Furina's Normal Attacks, Charged Attacks, and Plunging Attacks are converted into <b class="text-genshin-hydro">Hydro DMG</b> which cannot be overridden by any other elemental infusion. DMG is also increased by an amount equivalent to <span class="text-desc">18%</span> of Furina's max HP.
      <br />Throughout the duration, Furina's Normal Attacks (not including <b>Arkhe: Seats Sacred and Secular Attacks</b>), Charged Attacks, and the impact of Plunging Attacks will cause different effects up to every <span class="text-desc">0.1</span>s after hitting opponents depending on her current <b>Arkhe</b> alignment:
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />Every <span class="text-desc">1</span>s, all nearby characters in the party will be healed by <span class="text-desc">4%</span> of Furina's max HP, for a duration of <span class="text-desc">2.9</span>s. Triggering this effect again will extend its duration.
      <br /><b>Arkhe: </b><b class="text-genshin-pneuma">Pneuma</b>
      <br />This Normal Attack (not including <b>Arkhe: Seats Sacred and Secular Attacks</b>), Charged Attack, or Plunging Attack ground impact DMG will be further increased by an amount equivalent to <span class="text-desc">25%</span> of Furina's max HP. When any of the attacks mentioned previously hit an opponent, all nearby characters in the party will consume <span class="text-desc">1%</span> of their current HP.
      <br />
      <br />During the duration of each instance of <b class="text-genshin-hydro">Center of Attention</b>, the above effects can be triggered up to <span class="text-desc">6</span> times. <b class="text-genshin-hydro">Center of Attention</b> will end when its effects have triggered <span class="text-desc">6</span> times or when the duration expires.`,
      image: 'UI_Talent_S_Furina_02',
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
      min: 0,
      max: maxFanfare,
      default: hardCap,
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
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

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
          name: 'Spiritbreath Thorn/Surging Blade DMG',
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
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.1141, burst, 'physical', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      base[Stats.ALL_DMG].push({
        value: (0.0005 + burst * 0.0002) * _.min([form.fanfare, hardCap]),
        name: 'Fanfare',
        source: 'Self',
        base: _.min([form.fanfare, hardCap]),
        multiplier: toPercentage(0.0005 + burst * 0.0002, 2),
      })
      base[Stats.I_HEALING].push({
        value: burst * 0.0001 * _.min([form.fanfare, hardCap]),
        name: 'Fanfare',
        source: 'Self',
        base: _.min([form.fanfare, hardCap]),
        multiplier: toPercentage(burst * 0.0001, 2),
      })

      if (c >= 2 && form.fanfare > hardCap)
        base[Stats.P_HP].push({
          value: _.min([(form.fanfare - hardCap) * 0.0035, 1.4]),
          name: 'Constellation 2',
          source: 'Self',
        })
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
      base[Stats.ALL_DMG].push({
        value: (0.0005 + burst * 0.0002) * _.min([form.fanfare, hardCap]),
        name: 'Fanfare',
        source: 'Furina',
        base: _.min([form.fanfare, hardCap]),
        multiplier: toPercentage(0.0005 + burst * 0.0002, 2),
      })
      base[Stats.I_HEALING].push({
        value: burst * 0.0001 * _.min([form.fanfare, hardCap]),
        name: 'Fanfare',
        source: 'Furina',
        base: _.min([form.fanfare, hardCap]),
        multiplier: toPercentage(burst * 0.0001, 2),
      })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const salonA4Bonus = a >= 4 ? _.min([0.007 * (base.getHP() / 1000), 0.28]) : 0
      const salonMultiplier = 1 + _.min([form.salonAlly * 0.1, 0.4])

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

      return base
    },
  }
}

export default Furina
