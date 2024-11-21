import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Chasca = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
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
      title: `Phantom Feather Flurry`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, mighty winds will accumulate on the arrowhead. A fully charged wind arrow will deal <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Spirit Reins, Shadow Hunt`,
      content: `Chasca and the will residing in her weapon resonate, dealing Nightsoul-aligned <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />After using this Skill, Chasca gains <span class="text-desc">80</span> <b class="text-genshin-anemo">Nightsoul</b> points and enters the <b class="text-genshin-anemo">Nightsoul's Blessing</b> state.
      <br />
      <br /><b>Nightsoul's Blessing: Chasca</b>
      <br />Continually consume <b class="text-genshin-anemo">Nightsoul</b> points. When <b class="text-genshin-anemo">Nightsoul</b> points are fully depleted or the skill is used again, Chasca's <b class="text-genshin-anemo">Nightsoul's Blessing</b> state will end. Her <b class="text-genshin-anemo">Nightsoul's Blessing</b> has the following traits:
      <br />- Mounts <b>Soulsniper: Ritual Staff</b>, increasing Chasca's Movement SPD and interruption resistance. In this state, Chasca will continually consume <b class="text-genshin-anemo">Nightsoul</b> points or <b class="text-genshin-pyro">Phlogiston</b> to remain airborne. When Sprinting or increasing height, extra <b class="text-genshin-anemo">Nightsoul</b> points or <b class="text-genshin-pyro">Phlogiston</b> will be consumed.
      <br />- When using Normal or Charged Attacks, Tap or Hold to switch between using <b>Multitarget Fire</b> in different ways.
      <br />
      <br /><b>Multitarget Fire</b>
      <br /><b>Tap</b>
      <br />Deal Nightsoul-aligned <b class="text-genshin-anemo">Anemo DMG</b> to opponents in front. This DMG is considered Normal Attack DMG.
      <br /><b>Hold</b>
      <br />Enter Aiming Mode and choose a certain number of opponents within a certain range, before loading up to <span class="text-desc">6</span> <b class="text-indigo-300">Shadowhunt Shells</b> based on the duration for which the skill was charged. When <span class="text-desc">6</span> <b class="text-indigo-300">Shells</b> have been loaded or charging is stopped, these <b class="text-indigo-300">Shells</b> will be fired at the chosen opponents in sequence.
      <br />
      <br /><b class="text-indigo-300">Shadowhunt Shells</b>
      <br />- Deal Nightsoul-aligned <b class="text-genshin-anemo">Anemo DMG</b>, which is considered Charged Attack DMG.
      <br />- The <span class="text-desc">4th</span>, <span class="text-desc">5th</span>, and <span class="text-desc">6th</span> <b class="text-indigo-300">Shells</b> loaded into the cylinder will undergo <b>Elemental Conversion</b> based on the <b>Elemental Types</b> of the other characters in the party: For each <b class="text-genshin-pyro">Pyro</b>, <b class="text-genshin-hydro">Hydro</b>, <b class="text-genshin-cryo">Cryo</b>, or <b class="text-genshin-electro">Electro</b> character in the party, one <b class="text-indigo-300">Shadowhunt Shell</b> will be randomly converted into a <b class="text-indigo-300">Shining Shadowhunt Shells</b> of one of these corresponding <b>Elemental Types</b>, dealing Nightsoul-aligned DMG corresponding to that <b>Elemental Type</b>. This DMG is considered Charged Attack DMG.
      <br />- The <b class="text-indigo-300">Shells</b> loaded into the cylinder are fired starting from the last <b class="text-indigo-300">Shadowhunt Shell</b> to be loaded, in a "last in, first out" order.
      <br />
      <br />Additionally, when Chasca is in the <b class="text-genshin-anemo">Nightsoul's Blessing</b> state, Holding her Elemental Skill <b>Spirit Reins, Shadow Hunt</b> will cause her to execute a Nightsoul-aligned Plunging Attack. Release the Elemental Skill to interrupt this Plunging Attack and maintain her airborne state. Should Chasca hit the ground with her Plunging Attack, her <b class="text-genshin-anemo">Nightsoul's Blessing</b> state will end.`,
      image: 'Skill_S_Chasca_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Soul Reaper's Fatal Round`,
      content: `Chasca concentrates her will, firing a single <b>Galesplitting Soulseeker Shell</b> that deals Nightsoul-aligned <b class="text-genshin-anemo">AoE Anemo DMG</b>. Afterward, the <b>Galesplitting Soulseeker Shell</b> will split into <span class="text-desc">6</span> <b class="text-violet-300">Soulseeker Shells</b>, which attack nearby opponents.
      <br />
      <br /><b class="text-violet-300">Soulseeker Shells</b>
      <br />- Deal Nightsoul-aligned <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />- For each <b class="text-genshin-pyro">Pyro</b>, <b class="text-genshin-hydro">Hydro</b>, <b class="text-genshin-cryo">Cryo</b>, or <b class="text-genshin-electro">Electro</b> character in the party, <span class="text-desc">two</span> <b class="text-violet-300">Soulseeker Shells</b> will undergo corresponding <b>Elemental Conversions</b> to become <b class="text-violet-300">Radiant Soulseeker Shells</b> which deal Nightsoul-aligned <b>Elemental DMG</b> from a randomly selected one of the corresponding <b>Elemental Types</b>.`,
      image: 'Skill_E_Chasca_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Bullet Trick`,
      content: `When the Elemental Skill <b>Spirit Reins, Shadow Hunt</b>'s <b>Multitarget Fire</b> is being charged, if there are party members has who meet the <b>Elemental Conversion Type</b> requirements, gain the following effects based on the number of different eligible <b>Elemental Types</b> present:
      <br />- There is a <span class="text-desc">33.3%</span>/<span class="text-desc">66.7%</span>/<span class="text-desc">100%</span> chance for each <b>Type</b> to trigger <b>Spiritbinding Conversion</b> and causes the <span class="text-desc">3rd</span> <b class="text-indigo-300">Shadowhunt Shell</b> loaded into the cylinder to be randomly converted into a <b class="text-indigo-300">Shining Shadowhunt Shells</b> from one of the corresponding <b>Elemental Types</b>.
      <br />- Each <b>Elemental Type</b> will grant Chasca <span class="text-desc">1</span> stack of <b>Spirit of the Radiant Shadow</b>, increasing the DMG of <b class="text-indigo-300">Shining Shadowhunt Shell</b> by <span class="text-desc">15%</span>/<span class="text-desc">35%</span>/<span class="text-desc">65%</span>. This effect lasts until the current <b>Multitarget Fire</b> ends. Max <span class="text-desc">3</span> stacks`,
      image: 'UI_Talent_S_Chasca_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Intent to Cover`,
      content: `When a nearby party member triggers a <b>Nightsoul Burst</b>, Chasca will fire a <b>Burning Shadowhunt Shot</b> at a nearby opponent, dealing Nightsoul-aligned <b class="text-genshin-anemo">Anemo DMG</b> equal to <span class="text-desc">150%</span> of the <b class="text-indigo-300">Shadowhunt Shell</b> DMG from her Elemental Skill <b>Spirit Reins, Shadow Hunt</b>. If the party has <b class="text-genshin-pyro">Pyro</b>, <b class="text-genshin-hydro">Hydro</b>, <b class="text-genshin-cryo">Cryo</b>, or <b class="text-genshin-electro">Electro</b> characters, the <b>Burning Shadowhunt Shot</b> will be converted to deal Nightsoul-aligned <b>Elemental DMG</b> of the corresponding Elemental Type equal to <span class="text-desc">150%</span> of the DMG dealt by <b>Spirit Reins, Shadow Hunt</b>'s <b class="text-indigo-300">Shining Shadowhunt Shells</b>.
      <br />The DMG done in this way is considered Charged Attack DMG.`,
      image: 'UI_Talent_S_Chasca_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Mediation's True Meaning`,
      content: `<span class="text-desc">25</span> <b class="text-genshin-pyro">Phlogiston</b> will be restored when your own party members defeat an opponent. This effect can trigger once every <span class="text-desc">12</span>s.
      <br />This has no effect in Domains, Trounce Domains, or the Spiral Abyss.`,
      image: 'UI_Talent_S_Chasca_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Everburning Heart`,
      content: `After her <b class="text-genshin-anemo">Nightsoul</b> points are exhausted, Chasca will switch to consuming <b class="text-genshin-pyro">Phlogiston</b> to maintain her <b class="text-genshin-anemo">Nightsoul's Blessing</b>.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, she can use <b>Nightsoul Transmission: Chasca</b>. When the active character is at a certain height in the air, the following will occur when switching to Chasca: Chasca will enter the <b class="text-genshin-anemo">Nightsoul's Blessing</b> state and gain <span class="text-desc">32</span> <b class="text-genshin-anemo">Nightsoul</b> points. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own team.`,
      image: 'UI_Talent_S_Chasca_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Cylinder, the Restless Roulette`,
      content: `When triggering the Passive Talent <b>Bullet Trick</b>'s <b>Spiritbinding Conversion</b>, the <span class="text-desc">2nd</span> <b class="text-indigo-300">Shadowhunt Shell</b> loaded into the cylinder will be additionally converted into a <b class="text-indigo-300">Shining Shadowhunt Shell</b>.
      <br />The chance to trigger <b>Spiritbinding Conversion</b> is increased: If there are party members who meet the <b>Elemental Conversion Type</b> requirements, the chance to trigger <b>Spiritbinding Conversion</b> is increased by <span class="text-desc">33.3%</span>, up to a maximum of <span class="text-desc">100%</span>.
      <br />
      <br />You must first unlock the Passive Talent <b>Bullet Trick</b>.
      <br />
      <br />In addition, Chasca's <b class="text-genshin-anemo">Nightsoul</b> point and <b class="text-genshin-pyro">Phlogiston</b> consumption in her <b class="text-genshin-anemo">Nightsoul's Blessing</b> state is decreased by <span class="text-desc">30%</span> while out of combat.`,
      image: 'UI_Talent_S_Chasca_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Muzzle, the Searing Smoke`,
      content: `When Chasca takes the field, she will obtain <span class="text-desc">1</span> stack of <b>Spirit of the Radiant Shadow</b> from the Passive Talent <b>Bullet Trick</b>. You must first unlock the Passive Talent <b>Bullet Trick</b> for this effect.
      <br />In addition, when the <b class="text-indigo-300">Shining Shadowhunt Shells</b> from <b>Spirit Reins, Shadow Hunt</b>'s <b>Multitarget Fire</b> hit opponents, they will deal <b>AoE Elemental DMG</b> of the corresponding <b>Elemental Type</b> of the <b class="text-indigo-300">Shining Shadowhunt Shells</b> equal to <span class="text-desc">400%</span> of Chasca's ATK. This DMG is considered Charged Attack DMG. This effect can be triggered once each time Chasca uses <b>Multitarget Fire</b>.`,
      image: 'UI_Talent_S_Chasca_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Reins, her Careful Control`,
      content: `Increases the Level of <b>Spirit Reins, Shadow Hunt</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chasca_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Sparks, the Sudden Shot`,
      content: `When the <b class="text-violet-300">Radiant Soulseeker Shells</b> from <b>Soul Reaper's Fatal Round</b> hit opponents, they will restore <span class="text-desc">1.5</span> Elemental Energy to Chasca, and deal <b>AoE Elemental DMG</b> of the corresponding <b>Elemental Type</b> of the <b class="text-violet-300">Radiant Soulseeker Shells</b> equal to <span class="text-desc">400%</span> of Chasca's ATK. This DMG is considered Charged Attack DMG.
      <br />The aforementioned corresponding elemental AoE DMG effect can be triggered once each time Chasca uses <b>Soul Reaper's Fatal Round</b>.`,
      image: 'UI_Talent_S_Chasca_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Brim, the Sandshadow's Silhouette`,
      content: `Increases the Level of <b>Soul Reaper's Fatal Round</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Chasca_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Showdown, the Glory of Battle`,
      content: `Chasca's <b>Multitarget Fire</b> charge time is decreased, and after the Passive Talent <b>Bullet Trick</b>'s <b>Spiritbinding Conversion</b> is triggered, Chasca will gain the <b class="text-genshin-anemo">Fatal Rounds</b> state: For the next <span class="text-desc">3</span>s, the next time Chasca uses <b>Spirit Reins, Shadow Hunt</b>'s <b>Multitarget Fire</b>, the shots will finish charging instantly, and the CRIT DMG of that instance of <b>Multitarget Fire</b>'s <b class="text-indigo-300">Shadowhunt Shells</b> and <b class="text-indigo-300">Shining Shadowhunt Shells</b> increases by <span class="text-desc">120%</span>. <span class="text-desc">1</span> <b class="text-genshin-anemo">Fatal Rounds</b> effect can be gained once every <span class="text-desc">3</span>s.
      <br />
      <br />You must first unlock the Passive Talent <b>Bullet Trick</b> to gain access to the above effect.`,
      image: 'UI_Talent_S_Chasca_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'multitarget',
      text: `Multitarget Fire`,
      ...talents.skill,
      default: true,
      show: true,
      sync: true,
    },
    {
      type: 'toggle',
      id: 'chasca_c6',
      text: `Fatal Rounds`,
      ...talents.c6,
      show: c >= 6,
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

      base.BASIC_SCALING = form.multitarget
        ? [
            {
              name: 'Multitarget Fire Tap DMG',
              value: [{ scaling: calcScaling(0.36, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.ANEMO,
              property: TalentProperty.NA,
              cd: form.chasca_c6 ? 1.2 : 0,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.48008, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.44588, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.29697, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.25467, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 3,
            },
          ]
      const size = _.min([_.size(uniqueElements) + (c >= 2 ? 1 : 0), 3])
      const radiantShadow = size === 1 ? 0.15 : size === 2 ? 0.35 : 0.65
      base.CHARGE_SCALING = form.multitarget
        ? [
            {
              name: 'Shadowhunt Shell DMG',
              value: [{ scaling: calcScaling(0.488, skill, 'elemental', '1'), multiplier: Stats.ATK }],
              element: Element.ANEMO,
              property: TalentProperty.CA,
              cd: form.chasca_c6 ? 1.2 : 0,
            },
          ]
        : [
            {
              name: 'Aimed Shot',
              value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
            {
              name: 'Fully-Charged Aimed Shot',
              value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
              element: Element.ANEMO,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Resonance DMG',
          value: [{ scaling: calcScaling(0.6, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Galesplitting Soulseeker Shell DMG`,
          value: [{ scaling: calcScaling(0.88, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Soulreaping Shell DMG`,
          value: [{ scaling: calcScaling(1.034, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 4) {
        base.SKILL_SCALING.push({
          name: 'Burning Shadowhunt Shot DMG',
          value: [{ scaling: calcScaling(0.608, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
          multiplier: 1.5,
        })
      }
      _.forEach(uniqueElements, (e) => {
        if (form.multitarget)
          base.CHARGE_SCALING.push({
            name: `${e} Shining Shadowhunt Shell DMG`,
            value: [{ scaling: calcScaling(1.9184, skill, 'elemental', '1'), multiplier: Stats.ATK }],
            element: e,
            property: TalentProperty.CA,
            cd: form.chasca_c6 ? 1.2 : 0,
            bonus: form.multitarget && a >= 1 ? radiantShadow : 0,
          })
        base.BURST_SCALING.push({
          name: `${e} Radiant Soulreaping Shell DMG`,
          value: [{ scaling: calcScaling(2.068, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: e,
          property: TalentProperty.BURST,
        })
        if (a >= 4) {
          base.SKILL_SCALING.push({
            name: `${e} Burning Shadowhunt Shot DMG`,
            value: [{ scaling: calcScaling(1.9184, skill, 'elemental', '1'), multiplier: Stats.ATK }],
            element: e,
            property: TalentProperty.CA,
            multiplier: 1.5,
          })
        }
        if (c >= 2 && form.multitarget) {
          base.CHARGE_SCALING.push({
            name: `C2 ${e} Explosion DMG`,
            value: [{ scaling: 4, multiplier: Stats.ATK }],
            element: e,
            property: TalentProperty.CA,
          })
        }
        if (c >= 4) {
          base.BURST_SCALING.push({
            name: `C4 ${e} Explosion DMG`,
            value: [{ scaling: 4, multiplier: Stats.ATK }],
            element: e,
            property: TalentProperty.CA,
          })
        }
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

export default Chasca
