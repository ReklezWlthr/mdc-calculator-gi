import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Xilonen = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const elements = _.uniq(_.map(team, (item) => findCharacter(item.cId)?.element || Element.GEO))

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Ehecatl's Roar`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a fixed amount of Stamina and performs a forward kick.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact, both based on Xilonen's DEF.
      <br />
      <br /><b>Nightsoul's Blessing: Blade Roller</b>
      <br />When in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state, Xilonen will enter the <b class="text-genshin-geo">Blade Roller</b> mode. While in this mode, Xilonen's Normal Attacks will allow her to perform up to 4 kicks using her roller blades, and she will be unable to use Charged Attacks.
      <br />When she uses Normal and Plunging Attacks in this mode, they will switch to being based on her DEF, and she will deal Nightsoul-aligned <b class="text-genshin-geo">Geo DMG</b> that cannot be overridden.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Yohual's Scratch`,
      content: `Let the rhythms of passion resound throughout the land! Xilonen switches to high-speed combat blading gear and rushes forward a certain distance before dealing Nightsoul-aligned <b class="text-genshin-geo">Geo DMG</b> based on her DEF.
      <br />After using this, Xilonen will gain <span class="text-desc">45</span> <b class="text-genshin-geo">Nightsoul</b> points and enter the <b class="text-genshin-geo">Nightsoul's Blessing</b> state. In this state, she will shift to the <b class="text-genshin-geo">Blade Roller</b> mode.
      <br />
      <br /><b class="text-desc">Source Samples</b>
      <br />Xilonen has <span class="text-desc">3</span> <b class="text-desc">Samplers</b> with her that can generate different <b>Soundscapes</b> based on her other party members' <b>Elemental Types</b>, decreasing nearby opponents' corresponding <b>Elemental RES</b> while active.
      <br />The initial recorded <b class="text-desc">Source Sample</b> within each <b class="text-desc">Sampler</b> will be <b class="text-genshin-geo">Geo</b>, and for each party member who is <b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, <span class="text-desc">1</span> <b class="text-genshin-geo">Geo</b> <b class="text-desc">Sampler</b> will change to that corresponding Element.
      <br />While Xilonen is in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state, the <b class="text-genshin-geo">Geo</b> <b class="text-desc">Source Sample</b> she carries will always be active. After unlocking her Passive Talent, <b>Netotiliztli's Echoes</b>, Xilonen can trigger said Passive Talent's effects to regenerate <b class="text-genshin-geo">Nightsoul</b> points for herself. When her <b class="text-genshin-geo">Nightsoul</b> points hit the maximum, she will consume all her <b class="text-genshin-geo">Nightsoul</b> points and activate the <span class="text-desc">3</span> <b class="text-desc">Source Samples</b> she has on hand for <span class="text-desc">15</span>s.
      <br />When the <b class="text-desc">Source Samples</b> are active, nearby opponents' corresponding <b>Elemental RES</b> will decrease. <b class="text-desc">Source Sample</b> effects of the same <b>Elemental Type</b> cannot stack. Xilonen can trigger these effects even when off-field.
      <br />
      <br /><b class="text-genshin-geo">Nightsoul's Blessing: Xilonen</b>
      <br />Continuously consume <b class="text-genshin-geo">Nightsoul</b> points. When these points are depleted or if used again, this <b class="text-genshin-geo">Nightsoul's Blessing</b> state will end. This state has the following traits:
      <br />- Switches to the <b class="text-genshin-geo">Blade Roller</b> mode, increasing Xilonen's Movement SPD and climbing speed, and she can perform high-speed leaps in Ocelot Form while climbing.
      <br />- Xilonen's <b class="text-genshin-geo">Nightsoul's Blessing</b> has the following restrictions: When in this state, Xilonen's <b class="text-genshin-geo">Nightsoul</b> points have a <span class="text-desc">9</span>s time limit. After this limit passes, her <b class="text-genshin-geo">Nightsoul</b> points will immediately expire.
      <br />
      <br />After Xilonen's <b class="text-genshin-geo">Nightsoul</b> points have expired while she is in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state, she will no longer be able to generate <b class="text-genshin-geo">Nightsoul</b> points via the Passive Talent <b>Netotiliztli's Echoes</b>.
      `,
      image: 'Skill_S_Xilonen_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Bane of All Evil`,
      content: `Activates the Phlogiston Stereo DJ Controller (Portable) at full power, dealing Nightsoul-aligned <b class="text-genshin-geo">AoE Geo DMG</b> based on Xilonen's DEF.
      <br />
      <br />Additionally, she will trigger the following effects based on her different <b class="text-desc">Source Samples</b>:
      <br />- If she has at least <span class="text-desc">2</span> <b class="text-desc">Source Samples</b> that have had their <b>Elemental Types</b> changed, Xilonen will play an <b class="text-heal">Ebullient</b> rhythm, healing nearby active characters at intervals based on her DEF.
      <br />- If she has fewer than <span class="text-desc">2</span> <b class="text-desc">Source Samples</b> that have had their <b>Elemental Types</b> changed, Xilonen will start up an <b class="text-red">Ardent</b> rhythm, which will play two additional beats that deal Nightsoul-aligned <b class="text-genshin-geo">AoE Geo DMG</b> based on her DEF.
      `,
      image: 'Skill_E_Xilonen_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Netotiliztli's Echoes`,
      content: `While in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state:
      <br />- If Xilonen has at least <span class="text-desc">2</span> <b class="text-desc">Source Samples</b> that have had their <b>Elemental Types</b> changed, she gains <span class="text-desc">35</span> <b class="text-genshin-geo">Nightsoul</b> points when her Normal or Plunging Attacks hit opponents. Can be triggered once every <span class="text-desc">0.1</span>s.
      <br />- If Xilonen has fewer than <span class="text-desc">2</span> <b class="text-desc">Source Samples</b> that have had their <b>Elemental Types</b> changed, her Normal and Plunging Attacks deal <span class="text-desc">30%</span> increased DMG.`,
      image: 'UI_Talent_S_Xilonen_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Portable Armored Sheath`,
      content: `While in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state, when Xilonen's <b class="text-genshin-geo">Nightsoul</b> points reach the maximum, she will trigger an effect equal to that of her <b>Nightsoul Burst</b>. This effect can be triggered once every <span class="text-desc">14</span>s.
      <br />Additionally, when nearby party members trigger a <b>Nightsoul Burst</b>, Xilonen's DEF is increased by <span class="text-desc">20%</span> for <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Xilonen_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Tour of Tepeilhuitl`,
      content: `Triggering <b>Nightsoul Transmission</b> restores <span class="text-desc">15</span> <b class="text-genshin-pyro">Phlogiston</b>.`,
      image: 'UI_Talent_S_Xilonen_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Blessing of Forge-Fire`,
      content: `After her <b class="text-genshin-geo">Nightsoul</b> points are fully depleted, Xilonen will switch to consuming <b class="text-genshin-pyro">Phlogiston</b> to maintain her <b class="text-genshin-geo">Nightsoul's Blessing</b>.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, she can use <b>Nightsoul Transmission: Xilonen</b>. When the active character is currently sprinting, climbing, in a movement mode caused by certain Talents, or at a certain height in the air, the following will trigger when switching to Xilonen: Xilonen will enter the <b class="text-genshin-geo">Nightsoul's Blessing</b> state and gain <span class="text-desc">20</span> <b class="text-genshin-geo">Nightsoul</b> points. In this situation, Xilonen's <b class="text-genshin-geo">Nightsoul</b> points have a <span class="text-desc">4</span>s time limit, after which her <b class="text-genshin-geo">Nightsoul</b> points will immediately expire. After she uses <b>Yohual's Scratch</b> within this time limit, her <b class="text-genshin-geo">Nightsoul</b> point time limit will be extended by <span class="text-desc">9</span>s. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own team.
      <br />
      <br />Additionally, while in Natlan, Xilonen will not consume Stamina when climbing while in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state.`,
      image: 'UI_Talent_S_Xilonen_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Sabbatical Phrase`,
      content: `Xilonen's <b class="text-genshin-geo">Nightsoul</b> point and <b class="text-genshin-pyro">Phlogiston</b> consumption in her <b class="text-genshin-geo">Nightsoul's Blessing</b> state is decreased by <span class="text-desc">30%</span>, and her <b class="text-genshin-geo">Nightsoul</b> point time limit is extended by <span class="text-desc">45%</span>.
      <br />Additionally, when Xilonen's <b class="text-desc">Source Samples</b> are active, she can also increase nearby active characters' interruption resistance.`,
      image: 'UI_Talent_S_Xilonen_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Chiucue Mix`,
      content: `Xilonen's <b class="text-genshin-geo">Geo</b> <b class="text-desc">Source Sample</b> will always remain active. Additionally, when her <b class="text-desc">Source Samples</b> activate, all nearby party members will gain effects corresponding to the active <b class="text-desc">Source Sample</b> that matches their <b>Elemental Type</b>:
      <br />- <b class="text-genshin-geo">Geo</b>: DMG <span class="text-desc">+50%</span>.
      <br />- <b class="text-genshin-pyro">Pyro</b>: ATK <span class="text-desc">+45%</span>.
      <br />- <b class="text-genshin-hydro">Hydro</b>: Max HP <span class="text-desc">+45%</span>.
      <br />- <b class="text-genshin-cryo">Cryo</b>: CRIT DMG <span class="text-desc">+60%</span>.
      <br />- <b class="text-genshin-electro">Electro</b>: Restore <span class="text-desc">25</span> Energy, decrease Elemental Burst CD by <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Xilonen_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Tonalpohualli's Loop`,
      content: `Increases the Level of <b>Yohual's Scratch</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xilonen_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Suchitl's Trance`,
      content: `After Xilonen uses <b>Yohual's Scratch</b>, she will grant all nearby party members the <b class="text-genshin-geo">Blooming Blessing</b> effect for <span class="text-desc">15</span>s.
      <br />Characters with <b class="text-genshin-geo">Blooming Blessing</b> deal <span class="text-desc">65%</span> of Xilonen's DEF as increased Normal, Charged, and Plunging Attack DMG. This effect will be removed after triggering <span class="text-desc">6</span> times or when the duration ends.
      <br />When you hit more than one opponent, trigger counts will be consumed based on the number of opponents hit. The counts for each party member with <b class="text-genshin-geo">Blooming Blessing</b> are counted independently.`,
      image: 'UI_Talent_S_Xilonen_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Tlaltecuhtli's Crossfade`,
      content: `Increases the Level of <b>Ocelotlicue Point!</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Xilonen_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Imperishable Night Carnival`,
      content: `When Xilonen is in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state, when she sprints, leaps, or uses Normal or Plunging Attacks, she will gain <b class="text-genshin-geo">Imperishable Night's Blessing</b>, ignoring the limitations of her <b class="text-genshin-geo">Nightsoul's Blessing</b> state and increasing the DMG dealt by her Normal and Plunging Attacks for 5s.
      <br />During this time:
      <br />- Her <b class="text-genshin-geo">Nightsoul's Blessing</b> time limit countdown will be paused. Xilonen's <b class="text-genshin-geo">Nightsoul</b> points, <b class="text-genshin-pyro">Phlogiston</b>, and Stamina will not decrease, and when her <b class="text-genshin-geo">Nightsoul</b> points reach the maximum, her <b class="text-genshin-geo">Nightsoul's Blessing</b> state will not end either.
      <br />- Xilonen deals <span class="text-desc">300%</span> of her DEF as increased Normal and Plunging Attack DMG while in the <b class="text-genshin-geo">Nightsoul's Blessing</b> state.
      <br />- She heals nearby party members for <span class="text-desc">120%</span> of her DEF every <span class="text-desc">1.5</span>s.
      <br />She can gain <span class="text-desc">1</span> <b class="text-genshin-geo">Imperishable Night's Blessing</b> once every <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Xilonen_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'roller_blade',
      text: `Roller Blade`,
      ...talents.normal,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xilonen_sample',
      text: `Source Sample RES Shred`,
      ...talents.skill,
      show: true,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'xilonen_a1',
      text: `A1 Pure Geo Nightsoul`,
      ...talents.a1,
      show: a >= 1 && _.size(elements) - 1 < 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xilonen_a4',
      text: `A4 DEF Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xilonen_c4',
      text: `Blooming Blessing`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'xilonen_c6',
      text: `Imperishable Night's Blessing`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'xilonen_sample'),
    findContentById(content, 'xilonen_c4'),
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      if (form.roller_blade) base.infuse(Element.GEO, true)
      base.BASIC_SCALING = form.roller_blade
        ? [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.56022, normal, 'physical', '1'), multiplier: Stats.DEF }],
              element: Element.GEO,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.55048, normal, 'physical', '1'), multiplier: Stats.DEF }],
              element: Element.GEO,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.65816, normal, 'physical', '1'), multiplier: Stats.DEF }],
              element: Element.GEO,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.86027, normal, 'physical', '1'), multiplier: Stats.DEF }],
              element: Element.GEO,
              property: TalentProperty.NA,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.51792, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit [x2]',
              value: [{ scaling: calcScaling(0.27374, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.72949, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.roller_blade
        ? []
        : [
            {
              name: 'Charged Attack DMG',
              value: [{ scaling: calcScaling(0.91332, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = [
        {
          name: 'Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(0.6392, normal, 'physical', '1'), multiplier: Stats.DEF }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'Low Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.27838, normal, 'physical', '1'), multiplier: Stats.DEF }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
        {
          name: 'High Plunge DMG',
          scale: Stats.ATK,
          value: [{ scaling: calcScaling(1.59676, normal, 'physical', '1'), multiplier: Stats.DEF }],
          element: Element.PHYSICAL,
          property: TalentProperty.PA,
        },
      ]
      base.SKILL_SCALING = [
        {
          name: 'Rush DMG',
          value: [{ scaling: calcScaling(1.792, skill, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.8128, burst, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Continuous Healing',
          value: [{ scaling: calcScaling(1.04, burst, 'elemental', '1'), multiplier: Stats.DEF }],
          flat: calcScaling(500.73764, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Follow-Up Beat DMG',
          value: [{ scaling: calcScaling(2.8128, burst, 'elemental', '1'), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.xilonen_sample) {
        _.forEach(elements, (e) => {
          base[`${e.toUpperCase()}_RES_PEN`].push({
            value: 0.06 + 0.03 * skill,
            name: 'Source Sample',
            source: 'Self',
          })
          if (c >= 2)
            switch (e) {
              case Element.GEO:
                base[Stats.ALL_DMG].push({
                  value: 0.5,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.PYRO:
                base[Stats.P_ATK].push({
                  value: 0.45,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.HYDRO:
                base[Stats.P_HP].push({
                  value: 0.45,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.CRYO:
                base[Stats.CRIT_DMG].push({
                  value: 0.6,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
            }
        })
      }
      if (form.xilonen_a1) {
        base.BASIC_DMG.push({
          value: 0.3,
          name: 'Ascension 1 Passive',
          source: 'Self',
        })
        base.PLUNGE_DMG.push({
          value: 0.3,
          name: 'Ascension 1 Passive',
          source: 'Self',
        })
      }
      if (form.xilonen_a4) {
        base[Stats.P_DEF].push({
          value: 0.2,
          name: 'Ascension 4 Passive',
          source: 'Self',
        })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.xilonen_sample) {
        _.forEach(elements, (e) => {
          base[`${e.toUpperCase()}_RES_PEN`].push({
            value: 0.06 + 0.03 * skill,
            name: 'Source Sample',
            source: 'Xilonen',
          })
          if (c >= 2)
            switch (e) {
              case Element.GEO:
                base[Stats.ALL_DMG].push({
                  value: 0.5,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.PYRO:
                base[Stats.P_ATK].push({
                  value: 0.45,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.HYDRO:
                base[Stats.P_HP].push({
                  value: 0.45,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
              case Element.CRYO:
                base[Stats.CRIT_DMG].push({
                  value: 0.6,
                  name: 'Source Sample [C2]',
                  source: 'Self',
                })
                break
            }
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>, allBase: StatsObject[]) => {
      _.last(allBase).CALLBACK.push(function (x, a) {
        const index = _.findIndex(team, (item) => item.cId === '10000103')
        if (form.xilonen_c4)
          _.forEach(a, (item, i) => {
            item.BASIC_F_DMG.push({
              value: a[index].getDef() * 0.65,
              name: 'Blooming Blessing',
              source: item === i ? 'Self' : 'Xilonen',
              base: a[index].getDef(),
              multiplier: toPercentage(0.65),
            })
            item.CHARGE_F_DMG.push({
              value: a[index].getDef() * 0.65,
              name: 'Blooming Blessing',
              source: item === i ? 'Self' : 'Xilonen',
              base: a[index].getDef(),
              multiplier: toPercentage(0.65),
            })
            item.PLUNGE_F_DMG.push({
              value: a[index].getDef() * 0.65,
              name: 'Blooming Blessing',
              source: item === i ? 'Self' : 'Xilonen',
              base: a[index].getDef(),
              multiplier: toPercentage(0.65),
            })
          })
        if (form.xilonen_c6) {
          a[index].BASIC_F_DMG.push({
            value: a[index].getDef() * 3,
            name: `Imperishable Night's Blessing`,
            source: 'Self',
            base: a[index].getDef(),
            multiplier: toPercentage(3),
          })
          a[index].PLUNGE_F_DMG.push({
            value: a[index].getDef() * 3,
            name: `Imperishable Night's Blessing`,
            source: 'Self',
            base: a[index].getDef(),
            multiplier: toPercentage(3),
          })
          a[index].SKILL_SCALING.push({
            name: 'C6 Continuous Healing',
            value: [{ scaling: 1.2, multiplier: Stats.DEF }],
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          })
        }
        return x
      })

      return base
    },
  }
}

export default Xilonen
