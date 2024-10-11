import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Chiori = (c: number, a: number, t: ITalentLevel) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: `Weaving Blade`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Fluttering Hasode`,
      content: `Dashes nimbly forward with silken steps. Once this dash ends, Chiori will summon the automaton doll <b class="text-genshin-geo">Tamoto</b> beside her and sweep her blade upward, dealing <b class="text-genshin-geo">AoE Geo DMG</b> to nearby opponents based on her ATK and DEF.
      <br />Holding the Skill will cause it to behave differently.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode to adjust the dash direction.
      <br />
      <br /><b class="text-genshin-geo">Tamoto</b>
      <br />Will slash at nearby opponents at intervals, dealing <b class="text-genshin-geo">AoE Geo DMG</b> based on Chiori's ATK and DEF.
      <br />While active, if there are nearby <b class="text-genshin-geo">Geo Construct(s)</b> or <b class="text-genshin-geo">Geo Construct(s)</b> are created nearby, an additional <b class="text-genshin-geo">Tamoto</b> will be summoned next to your active character. Only <span class="text-desc">1</span> additional <b class="text-genshin-geo">Tamoto</b> can be summoned in this manner, and its duration is independently counted.
      `,
      image: 'Skill_S_Chiori_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Hiyoku: Twin Blades`,
      content: `Twin blades leave their sheaths as Chiori slices with the clean cuts of a master tailor, dealing <b class="text-genshin-geo">AoE Geo DMG</b> based on her ATK and DEF.`,
      image: 'Skill_E_Chiori_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Tailor-Made`,
      content: `Gain different effects depending on the next action you take within a short duration after using <b>Fluttering Hasode</b>'s upward sweep. If you <b>Press</b> the Elemental Skill, you will trigger the <b class="text-genshin-geo">Tapestry</b> effect. If you <b>Press</b> your Normal Attack, the <b class="text-genshin-geo">Tailoring</b> effect will be triggered instead.
      <br />
      <br /><b class="text-genshin-geo">Tapestry</b>
      <br />Switches to the next character in your roster.
      <br />Grants all your party members <b class="text-genshin-geo">Seize the Moment</b>: When your active party member's Normal Attacks, Charged Attacks, and Plunging Attacks hit a nearby opponent, <b class="text-genshin-geo">Tamoto</b> will execute a coordinated attack, dealing <span class="text-desc">100%</span> of <b>Fluttering Hasode</b>'s upward sweep DMG as <b class="text-genshin-geo">AoE Geo DMG</b> at the opponent's location. DMG dealt this way is considered Elemental Skill DMG.
      <br /><b class="text-genshin-geo">Seize the Moment</b> lasts <span class="text-desc">8</span>s, and <span class="text-desc">1</span> of <b class="text-genshin-geo">Tamoto</b>'s coordinated attack can be unleashed every <span class="text-desc">2</span>s. <span class="text-desc">2</span> such coordinated attacks can occur per <b class="text-genshin-geo">Seize the Moment</b> effect duration.
      <br />
      <br /><b class="text-genshin-geo">Tailoring</b>
      <br />Chiori gains <b class="text-genshin-geo">Geo infusion</b> for <span class="text-desc">5</span>s.
      <br />
      <br />When on the field, if Chiori does not either <b>Press</b> her Elemental Skill or use a Normal Attack within a short time after using <b>Fluttering Hasode</b>'s upward sweep, the <b class="text-genshin-geo">Tailoring</b> effect will be triggered by default.`,
      image: 'UI_Talent_S_Chiori_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `The Finishing Touch`,
      content: `When a nearby party member creates a <b class="text-genshin-geo">Geo Construct</b>, Chiori will gain <span class="text-desc">20%</span> <b class="text-genshin-geo">Geo DMG Bonus</b> for 20s.`,
      image: 'UI_Talent_S_Chiori_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Brocaded Collar's Beauteous Silhouette`,
      content: `When any party member is wearing an outfit apart from their default outfit, or is wearing a wind glider other than the Wings of First Flight, your party members will obtain the Swift Stride effect: Movement SPD is increased by <span class="text-desc">10%</span>.
      <br />This effect does not take effect in Domains, Trounce Domains and the Spiral Abyss. Swift Stride does not stack.`,
      image: 'UI_Talent_S_Chiori_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Six Paths of Sage Silkcraft`,
      content: `The AoE of the automaton doll <b class="text-genshin-geo">Tamoto</b> summoned by <b>Fluttering Hasode</b> is increased by <span class="text-desc">50%</span>.
      <br />Additionally, if there is a <b class="text-genshin-geo">Geo</b> party member other than Chiori, <b>Fluttering Hasode</b> will trigger the following after the dash is completed:
      <br />- Summon an additional <b class="text-genshin-geo">Tamoto</b>. Only one additional <b class="text-genshin-geo">Tamoto</b> can exist at the same time, whether summoned by Chiori this way or through the presence of a <b class="text-genshin-geo">Geo Construct</b>.
      <br />- Triggers the Passive Talent <b>The Finishing Touch</b>. This effect requires you to first unlock the Passive Talent <b>The Finishing Touch</b>.`,
      image: 'UI_Talent_S_Chiori_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `In Five Colors Dyed`,
      content: `For <span class="text-desc">10</span>s after using <b>Hiyoku: Twin Blades</b>, a simplified automaton doll, <b class="text-genshin-geo">Kinu</b>, will be summoned next to your active character every <span class="text-desc">3</span>s. <b class="text-genshin-geo">Kinu</b> will attack nearby opponents, dealing <b class="text-genshin-geo">AoE Geo DMG</b> equivalent to <span class="text-desc">170%</span> of Tamoto's DMG. DMG dealt this way is considered Elemental Skill DMG.
      <br /><b class="text-genshin-geo">Kinu</b> will leave the field after <span class="text-desc">1</span> attack or after lasting <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_Chiori_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Four Brocade Embellishments`,
      content: `Increases the Level of <b>Fluttering Hasode</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chiori_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `A Tailor's Three Courtesies`,
      content: `For <span class="text-desc">8</span>s after triggering either follow-up effect of the Passive Talent <b>Tailor-Made</b>, when your current active character's Normal, Charged, or Plunging Attacks hit a nearby opponent, a simplified automaton doll, <b class="text-genshin-geo">Kinu</b>, will be summoned near this opponent. You can summon <span class="text-desc">1</span> <b class="text-genshin-geo">Kinu</b> every <span class="text-desc">1</span>s in this way, and up to <span class="text-desc">3</span> <b class="text-genshin-geo">Kinu</b> may be summoned this way during each instance of <b>Tailor-Made</b>'s <b class="text-genshin-geo">Seize the Moment</b> or <b class="text-genshin-geo">Tailoring</b> effect. The above effect can be triggered up to once every <span class="text-desc">15</span>s.
      <br />Must unlock the Passive Talent <b>Tailor-Made</b> first.`,
      image: 'UI_Talent_S_Chiori_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Two Silken Plumules`,
      content: `Increases the Level of <b>Hiyoku: Twin Blades</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chiori_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Sole Principle Pursuit`,
      content: `After triggering a follow-up effect of the Passive Talent <b>Tailor-Made</b>, Chiori's own <b>Fluttering Hasode</b>'s CD is decreased by <span class="text-desc">12</span>s. Must unlock the Passive <b>Tailor-Made</b> first.
      <br />In addition, the DMG dealt by Chiori's own Normal Attacks is increased by an amount equal to <span class="text-desc">235%</span> of her own DEF.`,
      image: 'UI_Talent_S_Chiori_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'tailoring',
      text: `Tailoring`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'chiori_a4',
      text: `The Finishing Touch`,
      ...talents.a4,
      show: a >= 4,
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
      base.MAX_ENERGY = 50

      if (form.tailoring) base.infuse(Element.GEO, true)

      const c6Scaling = c >= 6 ? [{ scaling: 2.35, multiplier: Stats.DEF }] : []

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4941, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4683, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.3042, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.7512, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(0.5431, normal, 'physical', '1'), multiplier: Stats.ATK }, ...c6Scaling],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
          hit: 2,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      const tamotoAtk = calcScaling(0.8208, skill, 'elemental', '1')
      const tamotoDef = calcScaling(1.026, skill, 'elemental', '1')

      base.SKILL_SCALING = [
        {
          name: 'Tamoto DMG',
          value: [
            { scaling: tamotoAtk, multiplier: Stats.ATK },
            { scaling: tamotoDef, multiplier: Stats.DEF },
          ],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Upward Sweep Attack DMG',
          value: [
            { scaling: calcScaling(1.4928, skill, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(1.866, skill, 'elemental', '1'), multiplier: Stats.DEF },
          ],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [
            { scaling: calcScaling(2.5632, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(3.204, burst, 'elemental', '1'), multiplier: Stats.DEF },
          ],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.chiori_a4) base[Stats.GEO_DMG].push({ value: 0.2, name: 'Ascension 4 Passive', source: `Self` })

      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Kinu DMG',
          value: [
            { scaling: tamotoAtk * 1.7, multiplier: Stats.ATK },
            { scaling: tamotoDef * 1.7, multiplier: Stats.DEF },
          ],
          element: Element.GEO,
          property: TalentProperty.SKILL,
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

export default Chiori
