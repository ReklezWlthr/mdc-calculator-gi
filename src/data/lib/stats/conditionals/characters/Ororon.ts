import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ororon = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamElements = _.filter(
    _.map(team, (item) => findCharacter(item.cId)?.element),
    (item) => _.includes([Element.PYRO, Element.HYDRO, Element.ELECTRO, Element.CRYO], item)
  )
  const uniqueElements = _.uniq(teamElements)

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Spiritvessel Snapshot`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, Electro energy will accumulate on the arrowhead. A fully charged arrow will deal immense <b class="text-genshin-electro">Electro DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Night's Tightrope`,
      content: `Ororon manifests an ancient mystical technique from the Masters of the Night-Wind as a <b class="text-genshin-electro">Spirit Orb</b> of midnight shade and throws it at his foe, dealing Nightsoul-aligned <b class="text-genshin-electro">Electro DMG</b>.
      <br />When other opponents are nearby, the <b class="text-genshin-electro">Spirit Orb</b> will bounce between them, dealing Nightsoul-aligned <b class="text-genshin-electro">Electro DMG</b>. Each time <b>Night's Tightrope</b> is used, each opponent can only be selected as a target once.
      <br />After <span class="text-desc">3</span> bounces, or if there are no eligible targets left, the <b class="text-genshin-electro">Oculus</b> will disappear. Only <span class="text-desc">1</span> <b class="text-genshin-electro">Oculus</b> created by Ororon himself can exist at any one time.`,
      image: 'Skill_S_Olorun_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Dark Voices Echo`,
      content: `Ororon works an ancient ritual, dealing Nightsoul-aligned <b class="text-genshin-electro">AoE Electro DMG</b>, summoning forth a <b class="text-genshin-electro">Supersonic Oculus</b>.
      <br />
      <br /><b class="text-genshin-electro">Supersonic Oculus</b>
      <br />- Continuously taunts nearby opponents and attracts attacks from them.
      <br />- Continuously rotates and fires off sonic waves that deal Nightsoul-aligned <b class="text-genshin-electro">Electro DMG</b>.`,
      image: 'Skill_E_Olorun_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Nightshade Synesthesia`,
      content: `When a nearby party member triggers <b>Nightsoul Burst</b>, Ororon will gain <span class="text-desc">40</span> <b class="text-genshin-electro">Nightsoul</b> points. Within <span class="text-desc">15</span>s after using his Elemental Skill, when other characters deal <b class="text-genshin-hydro">Hydro</b> or <b class="text-genshin-electro">Electro DMG</b>, Ororon will gain <span class="text-desc">5</span> <b class="text-genshin-electro">Nightsoul</b> points, an effect that can occur every <span class="text-desc">0.3</span>s for a maximum of <span class="text-desc">10</span> times during this <span class="text-desc">15</span>s duration.
      <br />
      <br />Also, when nearby opponents take Electro-Charged reaction DMG or Nightsoul-aligned DMG dealt by other nearby characters, Ororon will consume <span class="text-desc">10</span> <b class="text-genshin-electro">Nightsoul</b> points (provided he has at least that amount), entering the <b class="text-genshin-electro">Nightsoul's Blessing</b> state and triggering the <b>Hypersense</b> effect: Deal Nightsoul-aligned <b class="text-genshin-electro">Electro DMG</b> based on <span class="text-desc">160%</span> of Ororon's ATK to at most <span class="text-desc">4</span> nearby opponents. The aforementioned effect can trigger once every <span class="text-desc">1.8</span>s.
      <br />
      <br /><b>Nightsoul's Blessing: Ororon</b>
      <br />Ororon's <b class="text-genshin-electro">Nightsoul's Blessing</b> state lasts <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Olorun_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Aspect Catalyst`,
      content: `After the Elemental Skill <b>Night's Tightrope</b>'s <b class="text-genshin-electro">Spirit Orb</b> hits an opponent, Ororon will gain the <b>Aspect Sigil</b> effect for <span class="text-desc">15</span>s.
      <br />
      <br /><b>Aspect Sigil</b>
      <br />When a nearby active party member Normal Attack, Charged Attack or Plunge Attack hits an opponent, that character will restore <span class="text-desc">3</span> Energy. If Ororon is off-field, Ororon will also restore <span class="text-desc">3</span> Energy. This effect can trigger once every <span class="text-desc">1</span>s, and can trigger <span class="text-desc">3</span> times per duration.`,
      image: 'UI_Talent_S_Olorun_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `-`,
      content: `Increases gliding SPD for your own party members by <span class="text-desc">15%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_S_Olorun_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Flowing Fog, Spritely Shadows`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, he can use <b>Nightsoul Transmission: Ororon</b>. When the active character is currently in the air, the following will trigger when switching to Ororon: Ororon will leap up high. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your party.
      <br />
      <br />Holding Aiming Mode will cause Ororon to enter the <b>Spiritspeaker</b> state, which will allow him to interact with <b>Nightspirit Graffiti</b> and <b>Nightspirit Bodies</b>, extracting information and power from them. The rules for interacting with these objects follow the same rules as those governing Iktomisaurus interactions.
      <br />
      <br />Additionally, holding the jump button will cause Ororon to consume <span class="text-desc">75</span> Stamina and leap. In areas within Natlan where <b class="text-genshin-pyro">Phlogiston</b> mechanics are present, Ororon will prioritize consuming <span class="text-desc">5</span> <b class="text-genshin-pyro">Phlogiston</b> to leap to a height higher still.
      <br />While in the air, hold Ororon's Normal Attack to aim, consuming <b class="text-genshin-pyro">Phlogiston</b> or Stamina.`,
      image: 'UI_Talent_S_Olorun_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Trails Amidst the Forest Fog`,
      content: `The Elemental Skill <b>Night's Tightrope</b>'s <b class="text-genshin-electro">Spirit Orb</b> can bounce <span class="text-desc">2</span> additional times.
      <br />Additionally, after the <b class="text-genshin-electro">Spirit Orb</b> hits an opponent, it will apply the <b class="text-violet-300">Nighttide</b> effect to them for <span class="text-desc">12</span>s. Opponents affected by <b class="text-violet-300">Nighttide</b> take <span class="text-desc">50%</span> increased DMG from <b>Hypersense</b> triggered by the Passive Talent, <b>Nightshade Synesthesia</b>. Unlock the aforementioned Passive Talent to trigger this effect.`,
      image: 'UI_Talent_S_Olorun_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `King Bee of the Hidden Honeyed Wine`,
      content: `After using his Elemental Burst, <b>Dark Voices Echo</b>, Ororon will obtain the <b>Spiritual Supersense</b> effect for <span class="text-desc">9</span>s.
      <br />
      <br /><b>Spiritual Supersense</b>
      <br />Gain <span class="text-desc">8%</span> <b class="text-genshin-electro">Electro DMG Bonus</b>.
      <br />During this time, every additional opponent hit by the Elemental Burst <b>Dark Voices Echo</b> or <b class="text-genshin-electro">Supersonic Oculus</b> will grant Ororon a further <span class="text-desc">8%</span> <b class="text-genshin-electro">Electro DMG Bonus</b>. The maximum that can be gained this way is <span class="text-desc">40%</span> <b class="text-genshin-electro">Electro DMG Bonus</b>.`,
      image: 'UI_Talent_S_Olorun_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Roosting Bat's Spiritcage`,
      content: `Increases the Level of <b>Dark Voices Echo</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Olorun_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `As the Mysteries of the Night-Wind`,
      content: `The <b class="text-genshin-electro">Supersonic Oculus</b> summoned by the Elemental Burst, <b>Dark Voices Echo</b> rotates <span class="text-desc">25%</span> faster.`,
      image: 'UI_Talent_S_Olorun_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `A Gift For the Soul`,
      content: `Increases the Level of <b>Night's Tightrope</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Olorun_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Ode to Deep Springs`,
      content: `After triggering <b>Hypersense</b> through the Passive Talent, <b>Nightshade Synesthesia</b>, your current active character's ATK is increased by <span class="text-desc">10%</span> for <span class="text-desc">9</span>s. Max <span class="text-desc">3</span> stacks, each stack is counted independently.
      <br />Additionally, when you use the Elemental Burst <b>Dark Voices Echo</b>, you will trigger one instance of an effect equivalent to <b>Hypersense</b>, dealing <span class="text-desc">200%</span> of its original DMG.
      You must unlock the Passive Talent <b>Nightshade Synesthesia</b> first.`,
      image: 'UI_Talent_S_Olorun_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ororon_c1',
      text: `Nighttide`,
      ...talents.c1,
      show: c >= 1,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'ororon_c2',
      text: `Spiritual Supersense`,
      ...talents.c2,
      show: c >= 2,
      default: 5,
      max: 5,
      min: 0,
    },
    {
      type: 'number',
      id: 'ororon_c6',
      text: `C6 ATK Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: 3,
      min: 0,
      max: 3,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'ororon_c6')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.50642, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.44373, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.69821, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
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
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Spirit Orb DMG',
          value: [{ scaling: calcScaling(1.976, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Ritual DMG`,
          value: [{ scaling: calcScaling(1.74384, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Soundwave Collision DMG`,
          value: [{ scaling: calcScaling(0.332, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1) {
        base.SKILL_SCALING.push({
          name: 'Hypersense DMG',
          value: [{ scaling: 1.6, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
          bonus: form.ororon_c1 ? 0.5 : 0,
        })
      }
      if (form.ororon_c2) {
        base[Stats.ELECTRO_DMG].push({
          value: 0.08 * form.ororon_c2,
          name: 'Constellation 2',
          source: 'Self',
        })
      }
      if (form.ororon_c6) {
        base[Stats.P_ATK].push({
          value: 0.1 * form.ororon_c6,
          name: 'Constellation 6',
          source: 'Self',
        })
      }
      if (c >= 6) {
        base.SKILL_SCALING.push({
          name: 'C6 Hypersense DMG',
          value: [{ scaling: 1.6, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
          bonus: form.ororon_c1 ? 0.5 : 0,
          multiplier: 2,
        })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.ororon_c6) {
        base[Stats.P_ATK].push({
          value: 0.1 * form.ororon_c6,
          name: 'Constellation 6',
          source: 'Self',
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ororon
