import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Heizou = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Fudou Style Martial Arts`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 fisticuffs empowered by a mighty wind, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina and performs a sweeping kick that deals <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Calling upon the surging wind, Heizou plunges towards the ground from mid-air, damaging all opponents in his path. Deals <b class="text-genshin-anemo">AoE Anemo DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Heartstopper Strike	`,
      content: `<b>Press</b>
      <br />Wields the swift winds to launch a <b>Heartstopper Strike</b> that deals <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br />Charges energy to unleash an even stronger blow. He will obtain the <b class="text-genshin-anemo">Declension</b> effect while charging, which will increase the power of the <b>Heartstopper Strike</b>. When the skill button is released or the skill finishes charging, he will strike forward, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b class="text-genshin-anemo">Declension</b>
      <br />Increases the power of the next <b>Heartstopper Strike</b>. Max <span class="text-desc">4</span> stacks. When you possess <span class="text-desc">4</span> <b class="text-genshin-anemo">Declension</b> stacks, the <b class="text-genshin-anemo">Conviction</b> effect will be produced, which will cause the next <b>Heartstopper Strike</b> to be even stronger and have a larger AoE.
      `,
      image: 'Skill_S_Heizo_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Windmuster Kick`,
      content: `Leaps into the air and uses the Fudou Style Vacuum Slugger and kicks his opponent. The Vacuum Slugger will explode upon hit and create an <b>Arresting Windtunnel</b> that pulls in nearby objects and opponents, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />When Vacuum Slugger hits opponents affected by <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, these opponents will be afflicted with <b>Windmuster Iris</b>. This <b>Windmuster Iris</b> will explode after a moment and dissipate, dealing AoE DMG of the corresponding elemental type.
      <br />Vacuum Slugger can afflict a maximum of <span class="text-desc">4</span> opponents with the <b>Windmuster Iris</b>. A single opponent cannot be under the effect of <b>Windmuster Irises</b> of different elements at the same time.`,
      image: 'Skill_E_Heizo_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Paradoxical Practice`,
      content: `When Shikanoin Heizou activates a Swirl reaction while on the field, he will gain <span class="text-desc">1</span> <b class="text-genshin-anemo">Declension</b> stack for <b>Heartstopper Strike</b>. This effect can be triggered every <span class="text-desc">0.1</span>s.`,
      image: 'UI_Talent_S_Heizo_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Penetrative Reasoning`,
      content: `After Shikanoin Heizou's <b>Heartstopper Strike</b> hits an opponent, increases all party members' (excluding Shikanoin Heizou) Elemental Mastery by <span class="text-desc">80</span> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Heizo_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Pre-Existing Guilt`,
      content: `Decreases sprinting Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Sprint',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Named Juvenile Casebook`,
      content: `For <span class="text-desc">5</span>s after Shikanoin Heizou takes the field, his Normal Attack SPD is increased by <span class="text-desc">15%</span>. He also gains <span class="text-desc">1</span> <b class="text-genshin-anemo">Declension</b> stack for <b>Heartstopper Strike</b>. This effect can be triggered once every <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Heizo_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Investigative Collection`,
      content: `The pull effect of the <b>Arresting Windtunnel</b> created by <b>Windmuster Kick</b> is enhanced, and its duration is increased to <span class="text-desc">1</span>s.`,
      image: 'UI_Talent_S_Heizo_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Esoteric Puzzle Book`,
      content: `Increases the Level of <b>Heartstopper Strike</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Heizo_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Tome of Lies`,
      content: `The first <b>Windmuster Iris</b> explosion in each <b>Windmuster Kick</b> will regenerate <span class="text-desc">9</span> Elemental Energy for Shikanoin Heizou. Every subsequent explosion in that <b>Windmuster Kick</b> will each regenerate an additional <span class="text-desc">1.5</span> Energy for Heizou.
      <br />One <b>Windmuster Kick</b> can regenerate a total of <span class="text-desc">13.5</span> Energy for Heizou in this manner.`,
      image: 'UI_Talent_S_Heizo_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Secret Archive`,
      content: `Increases the Level of <b>Windmuster Kick</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_S_Heizo_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Curious Casefiles`,
      content: `Each <b class="text-genshin-anemo">Declension</b> stack will increase the CRIT Rate of the <b>Heartstopper Strike</b> unleashed by <span class="text-desc">4%</span>. When Heizou possesses <b class="text-genshin-anemo">Conviction</b>, this <b>Heartstopper Strike</b>'s CRIT DMG is increased by <span class="text-desc">32%</span>.`,
      image: 'UI_Talent_S_Heizo_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'declension',
      text: `Declension`,
      ...talents.skill,
      show: true,
      default: 4,
      min: 0,
      max: 4,
    },
    {
      type: 'element',
      id: 'heizou_burst',
      text: `Windmuster Iris Element`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'heizou_c1',
      text: `C1 ATK SPD Buff`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'heizou_a4',
      text: `A4 Heizou EM Share`,
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

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3747, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3685, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5106, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [1]',
          value: [{ scaling: calcScaling(0.1478, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [2]',
          value: [{ scaling: calcScaling(0.1626, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [3]',
          value: [{ scaling: calcScaling(0.1922, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(0.73, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ANEMO)

      const declensionScaling = calcScaling(0.5688, skill, 'elemental', '1')
      const convictionScaling = calcScaling(1.1376, skill, 'elemental', '1')
      const cr = form.declension && c >= 6 ? form.declension * 0.04 : 0
      const cd = form.declension >= 4 && c >= 6 ? 0.32 : 0
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [
            {
              scaling:
                calcScaling(2.2752, skill, 'elemental', '1') +
                form.declension * declensionScaling +
                (form.declension >= 4 ? convictionScaling : 0),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
          cr,
          cd,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Fudou Style Vacuum Slugger DMG`,
          value: [{ scaling: calcScaling(3.1469, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Windmuster Iris DMG',
          value: [{ scaling: calcScaling(0.2146, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.heizou_burst,
          property: TalentProperty.BURST,
        },
      ]

      if (form.heizou_c1) base.ATK_SPD.push({ value: 0.15, name: 'Constellation 1', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.heizou_a4) base[Stats.EM].push({ value: 80, name: 'Ascension 4 Passive', source: `Shikanoin Heizou` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Heizou
