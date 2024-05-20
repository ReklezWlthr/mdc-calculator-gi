import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Chevreuse = (c: number, a: number, t: ITalentLevel, ...rest: [ITeamChar[]]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const [team] = rest
  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const pyro = _.filter(teamData, Element.PYRO).length
  const electro = _.filter(teamData, Element.ELECTRO).length
  const a1Active = pyro + electro === teamData.length && pyro >= 1 && electro >= 1

  const talents: ITalent = {
    normal: {
      title: `Line Bayonet Thrust EX`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Short-Range Rapid Interdiction Fire`,
      content: `Chevreuse quickly shoulders her musket and fires at her opponent(s), dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />For a short duration after Chevreuse fires a shot, she will continuously restore HP to the active character on the field. The amount healed is based on her Max HP.
      <br />Hold to fire in a different fashion.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode, locking a target in her sights to fire a precise interdiction shot. If Chevreuse has an Overcharged Ball, then she will fire the Overcharged Ball instead, dealing greater <b class="text-genshin-pyro">Pyro DMG</b> in a larger area.
      <br />Chevreuse gains <span class="text-desc">1</span> Overcharged Ball every time a nearby character in the party triggers an Overloaded reaction, and can have up to <span class="text-desc">1</span> Overcharged Ball at a time.
      <br />
      <br />Arkhe: <b class="text-genshin-ousia">Ousia</b>
      <br />Periodically, after Chevreuse's Short-Range Rapid Interdiction Fire hits, a Surging Blade will be called forth that deals <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-pyro">Pyro DMG</b>.
      `,
    },
    burst: {
      title: `Ring of Bursting Grenades`,
      content: `Chevreuse fires an explosive grenade at opponents with her musket, dealing <b class="text-genshin-pyro">AoE Pyro DMG</b>. After the projectile hits, it will split into many secondary explosive shells.
      <br />The secondary explosive shells will burst after a short interval, dealing <b class="text-genshin-pyro">Pyro DMG</b> to nearby opponents.`,
    },
    a1: {
      title: `A1: Vanguard's Coordinated Tactics`,
      content: `When all party members are <b class="text-genshin-pyro">Pyro</b> and <b class="text-genshin-electro">Electro</b> characters and there is at least one Pyro and one Electro character each in the party:
      <br />Chevreuse grants "Coordinated Tactics" to nearby party members: After a character triggers the Overloaded reaction, the <b class="text-genshin-pyro">Pyro</b> and <b class="text-genshin-electro">Electro RES</b> of the opponent(s) affected by this Overloaded reaction will be decreased by <span class="text-desc">40%</span> for <span class="text-desc">6</span>s.
      <br />The "Coordinated Tactics" effect will be removed when the Elemental Types of the characters in the party do not meet the basic requirements for the Passive Talent.`,
    },
    a4: {
      title: `A4: Vertical Force Coordination`,
      content: `After Chevreuse fires an Overcharged Ball using Short-Range Rapid Interdiction Fire, nearby <b class="text-genshin-pyro">Pyro</b> and <b class="text-genshin-electro">Electro</b> characters in the party gain <span class="text-desc">1%</span> increased ATK for every <span class="text-desc">1,000</span> Max HP Chevreuse has for <span class="text-desc">30</span>s. ATK can be increased by up to <span class="text-desc">40%</span> in this way.`,
      value: [
        {
          name: 'Current ATK Bonus',
          value: { stat: Stats.HP, scaling: (hp) => toPercentage(_.min([(hp / 1000) * 0.01, 0.4])) },
        },
      ],
    },
    util: {
      title: `Double Time March`,
      content: `Decreases sprinting Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      title: `C1: Stable Front Line's Resolve`,
      content: `When the active character with the "Coordinated Tactics" status (not including Chevreuse herself) triggers the Overloaded reaction, they will recover <span class="text-desc">6</span> Energy. This effect can be triggered once every <span class="text-desc">10</span>s.
      <br />You must first unlock the Passive Talent "Vanguard's Coordinated Tactics."`,
    },
    c2: {
      title: `C2: Sniper Induced Explosion`,
      content: `After Holding Short-Range Rapid Interdiction Fire and hitting a target, 2 chain explosions will be triggered near the location where said target is hit. Each explosion deals <b class="text-genshin-pyro">Pyro DMG</b> equal to <span class="text-desc">120%</span> of Chevreuse's ATK. This effect can be triggered up to once every <span class="text-desc">10</span>s, and DMG dealt this way is considered Elemental Skill DMG.`,
    },
    c3: {
      title: `C3: Practiced Field Stripping Technique`,
      content: `Increases the Level of Short-Range Rapid Interdiction Fire by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: The Secret to Rapid-Fire Multishots`,
      content: `After using Ring of Bursting Grenades, the Hold mode of Short-Range Rapid Interdiction Fire will not go on cooldown when Chevreuse uses it. This effect is removed after Short-Range Rapid Interdiction Fire has been fired twice using Hold or after <span class="text-desc">6</span>s.`,
    },
    c5: {
      title: `C5: Enhanced Incendiary Firepower`,
      content: `Increases the Level of Ring of Bursting Grenades by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: In Pursuit of Ending Evil`,
      content: `After 12s of the healing effect from Short-Range Rapid Interdiction Fire, all nearby party members recover HP equivalent to <span class="text-desc">10%</span> of Chevreuse's Max HP once.
      After a party member is healed by Short-Range Rapid Interdiction Fire, they gain a <span class="text-desc">20%</span> <b class="text-genshin-pyro">Pyro DMG Bonus</b> and <b class="text-genshin-electro">Electro DMG Bonus</b> for <span class="text-desc">8</span>s. Max <span class="text-desc">3</span> stacks. Each stack's duration is counted independently.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'chev_overload',
      text: `A1 Overloaded Buff`,
      ...talents.a1,
      show: a >= 1 && a1Active,
      default: true,
    },
    {
      type: 'toggle',
      id: 'chev_a4',
      text: `Overcharged Ball Shot`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'chev_c6',
      text: `C6 DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      min: 0,
      max: 3,
      default: 3,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'chev_a4'), findContentById(content, 'chev_c6')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.531, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.493, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.276, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.325, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.773, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(1.217, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(1.152, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(1.728, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Overcharged Ball DMG',
          value: [{ scaling: calcScaling(2.824, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Healing Over Time',
          value: [{ scaling: calcScaling(0.0267, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(257, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.288, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Explosive Grenade DMG',
          value: [{ scaling: calcScaling(3.6816, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Secondary Explosive Shell DMG',
          value: [{ scaling: calcScaling(0.4909, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.chev_overload) {
        base.PYRO_RES_PEN += 0.4
        base.ELECTRO_RES_PEN += 0.4
      }

      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'C2 Chain Explosion [x2]',
          value: [{ scaling: 1.2, multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        })

      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'C6 Additional Healing',
          value: [{ scaling: 0.1, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (form.chev_c6) {
        base[Stats.PYRO_DMG] += 0.2 * form.chev_c6
        base[Stats.ELECTRO_DMG] += 0.2 * form.chev_c6
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.chev_a4 && _.includes([Element.PYRO, Element.ELECTRO], form.element))
        base[Stats.P_ATK] += _.min([(own.getHP() / 1000) * 0.01, 0.4]) //Only apply to Pyro & Electro

      if (form.chev_c6) {
        base[Stats.PYRO_DMG] += 0.2 * form.chev_c6
        base[Stats.ELECTRO_DMG] += 0.2 * form.chev_c6
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.chev_a4) base[Stats.P_ATK] += _.min([(base.getHP() / 1000) * 0.01, 0.4])
      return base
    },
  }
}

export default Chevreuse
