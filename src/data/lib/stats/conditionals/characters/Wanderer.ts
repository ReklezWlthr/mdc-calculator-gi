import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Wanderer = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Yuuban Meigen`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 attacks using wind blades, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina, gathers a build up of high wind pressure, and deals <b class="text-genshin-anemo">AoE Anemo DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Calling upon the power of Anemo, the Wanderer plunges towards the ground from mid-air, damaging all opponents in his path. Deals <b class="text-genshin-anemo">AoE Anemo DMG</b> upon impact with the ground.
      `,
    },
    skill: {
      title: `Hanega: Song of the Wind`,
      content: `Concentrates the power of the winds to break free from the shackles of the earth, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b> before leaping into the air and entering the Windfavored state.
      <br />
      <br /><b>Windfavored</b>
      <br />The Wanderer cannot perform Plunging Attacks in this state. When he uses Normal and Charged Attacks, they will be converted into Kuugo: Fushoudan and Kuugo: Toufukai respectively; the DMG they deal and their AoE will be increased, and their DMG will be considered Normal and Charged Attack DMG respectively. Kuugo: Toufukai will not consume Stamina.
      <br />The Wanderer will hover persistently during this time. While this state is active, the Wanderer's movements gain the following properties:
      <br />- Persistently consumes Kuugoryoku Points to maintain this hovering state.
      <br />- When sprinting, additional Kuugoryoku Points will be consumed for the Wanderer to accelerate mid-air. Holding sprint will cause persistent Kuugoryoku Point consumption to maintain speed. This effect will replace his default sprint.
      <br />- Jumping expends extra Kuugoryoku Points to increase hovering height. Holding jump will cause persistent Kuugoryoku Point consumption to keep increasing hovering height.
      <br />
      <br />Running out of Kuugoryoku Points will end the Windfavored state.
      <br />A second cast during the duration of Windfavored will also end it.
      `,
    },
    burst: {
      title: `Kyougen: Five Ceremonial Plays`,
      content: `Compresses the atmosphere into a singular vacuum that grinds all troubles away, dealing multiple instances of <b class="text-genshin-anemo">AoE Anemo DMG</b>. If the character is in the Windfavored state due to the skill "Hanega: Song of the Wind," Windfavored state will end after casting.`,
    },
    a1: {
      title: `A1: Jade-Claimed Flower`,
      content: `If Hanega: Song of the Wind comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b> when it is unleashed, this instance of the Windfavored state will obtain buffs according to the contacted element(s):
      <br /><b class="text-genshin-hydro">Hydro</b>: Kuugoryoku Point cap increases by <span class="text-yellow">20</span>.
      <br /><b class="text-genshin-pyro">Pyro</b>: ATK increases by <span class="text-yellow">30%</span>.
      <br /><b class="text-genshin-cryo">Cryo</b>: CRIT Rate increases by <span class="text-yellow">20%</span>.
      <br /><b class="text-genshin-electro">Electro</b>: When Normal and Charged Attacks hit an opponent, <span class="text-yellow">0.8</span> Energy will be restored. Energy can be restored this way every <span class="text-yellow">0.2</span>s.
      <br />
      <br />You can have up to <span class="text-yellow">2</span> different kinds of these buffs simultaneously.`,
    },
    a4: {
      title: `A4: Gales of Reverie`,
      content: `When the Wanderer hits opponents with Kuugo: Fushoudan or Kuugo: Toufukai in his Windfavored state, he has a <span class="text-yellow">16%</span> chance to obtain the Descent effect: The next time the Wanderer accelerates in mid-air while in this instance of the Windfavored state, this effect will be removed, this acceleration instance will not consume any Kuugoryoku Points, and he will fire off <span class="text-yellow">4</span> wind arrows that deal <span class="text-yellow">35%</span> of his ATK as <b class="text-genshin-anemo">Anemo DMG</b> each.
      <br />For each Kuugo: Fushoudan and Kuugo: Toufukai that does not produce this effect, the next attack of those types will have a <span class="text-yellow">12%</span> increased chance of producing it. The calculation of the effect production is done once every <span class="text-yellow">0.1</span>s.`,
    },
    util: {
      title: `Strum the Swirling Winds`,
      content: `Mora expended when ascending Bows and Catalysts is decreased by <span class="text-yellow">50%</span>.`,
    },
    c1: {
      title: `C1: Shoban: Ostentatious Plumage`,
      content: `When in the Windfavored state, the Attack SPD of the Wanderer's Kuugo: Fushoudan and Kuugo: Toufukai is increased by <span class="text-yellow">10%</span>.
      <br />Additionally, the wind arrows fired by the Passive Talent "Gales of Reverie" will deal an additional <span class="text-yellow">25%</span> of his ATK as DMG. You must unlock the Passive Talent "Gales of Reverie" first.`,
    },
    c2: {
      title: `C2: Niban: Isle Amidst White Waves`,
      content: `When in the Windfavored state, Kyougen: Five Ceremonial Plays will see its DMG increased by <span class="text-yellow">4%</span> per point of difference between the max amount of Kuugoryoku Points contrasted with Kuugoryoku's present capacity when using this skill.
      Through this method, you can increase Kyougen: Five Ceremonial Plays's DMG by a maximum of <span class="text-yellow">200%</span>.`,
    },
    c3: {
      title: `C3: Sanban: Moonflower Kusemai`,
      content: `Increases the Level of Kyougen: Five Ceremonial Plays by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c4: {
      title: `C4: Yonban: Set Adrift into Spring`,
      content: `When casting Hanega: Song of the Wind, should the Passive Talent "Jade-Claimed Flower" be triggered, the character will gain buffs in correspondence to the contacted Elemental Type(s), and also obtain a random untriggered buff. A maximum of <span class="text-yellow">3</span> such corresponding elemental buffs can exist simultaneously.
      You must unlock the Passive Talent "Jade-Claimed Flower" first.`,
    },
    c5: {
      title: `C5: Matsuban: Ancient Illuminator From Abroad`,
      content: `Increases the Level of Hanega: Song of the Wind by <span class="text-yellow">3</span>.
      <br />Maximum upgrade level is <span class="text-yellow">15</span>.`,
    },
    c6: {
      title: `C6: Shugen: The Curtains' Melancholic Sway`,
      content: `When the Wanderer actively hits an opponent with Kuugo: Fushoudan while in the Windfavored state, the following effects will occur:
      <br />Deals an additional instance of Kuugo: Fushoudan at the position hit, dealing <span class="text-yellow">40%</span> of the attack's original DMG. This DMG will be considered Normal Attack DMG.
      <br />When the Wanderer falls below <span class="text-yellow">40</span> Kuugoryoku Points, restores <span class="text-yellow">4</span> Points to him. Kuugoryoku Points can be restored in this manner once every <span class="text-yellow">0.2</span>s. This restoration can occur up to <span class="text-yellow">5</span> times within one Windfavored duration.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'windfavored',
      text: `Windfavored State`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'windfavored_pyro',
      text: `Windfavored State: Pyro`,
      ...talents.a1,
      show: a >= 1,
      default: false,
    },
    {
      type: 'toggle',
      id: 'windfavored_cryo',
      text: `Windfavored State: Cryo`,
      ...talents.a1,
      show: a >= 1,
      default: false,
    },
    {
      type: 'number',
      id: 'wanderer_c2',
      text: `C2 Burst DMG per Missing Point`,
      ...talents.c2,
      show: c >= 2,
      default: 100,
      min: 0,
      max: 140,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      const windNormal = form.windfavored ? calcScaling(1.3298, skill, 'special', 'wanderer_a') : 0
      const windCharge = form.windfavored ? calcScaling(1.2639, skill, 'special', 'wanderer_b') : 0
      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.6871, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6502, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
        {
          name: '3-Hit [x2]',
          value: [{ scaling: calcScaling(0.4764, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
          multiplier: windNormal,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.3208, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
          multiplier: windCharge,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ANEMO)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.952, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG [x5]`,
          value: [{ scaling: calcScaling(1.472, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
      ]
      if (form.windfavored_pyro) base[Stats.P_ATK] += 0.3
      if (form.windfavored_cryo) base[Stats.CRIT_RATE] += 0.2

      if (a >= 4)
        base.SKILL_SCALING.push({
          name: 'Wind Arrow DMG [x4]',
          value: [{ scaling: 0.35 + (c >= 1 ? 0.25 : 0), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.ADD,
        })
      if (c >= 1 && form.windfavored) base.ATK_SPD += 0.1
      if (form.wanderer_c2) base.BURST_DMG += _.min([form.wanderer_c2 * 0.04, 2])

      if (c >= 6)
        base.BASIC_SCALING.push({
          name: 'Kuugo: Fushoudan DMG',
          value: [{ scaling: 0.4, multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
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

export default Wanderer
