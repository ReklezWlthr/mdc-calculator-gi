import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Mavuika = (c: number, a: number, t: ITalentLevel) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: `Flames Weave Life`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 1 consecutive claymore strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to perform an especially powerful <b>Severing Splendor</b> strike toward the front.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `The Named Moment`,
      content: `Calling upon her authority over "conflict," Mavuika summons the <b>All-Fire Armaments</b> passed down through the line of human Archons, dealing Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />After using this, Mavuika's <b class="text-genshin-pyro">Nightsoul</b> points are restored to max value, and she enters the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state.
      <br />
      <br /><b>All-Fire Armaments</b>
      <br />Has different forms when Tapped or Held.
      <br />
      <br /><b>Tap</b>
      <br /><b>Divine Name Unleashed</b>: The <b>All-Fire Armaments</b> manifest as <b>Rings of Searing Radiance</b>. The <b>Rings</b> follow the current active character and attack nearby opponents at intervals, dealing Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b>.
      <br />
      <br /><b>Hold</b>
      <br /><b>Ancient Name Unbound</b>: The <b>All-Fire Armaments</b> manifest as a <b>Flamestrider</b>. In this state, Mavuika can ride the <b>Flamestrider</b> at high speed, or activate its hidden backup propulsion module to temporarily cross various terrain types and glide in mid-air temporarily. Mavuika's Normal, Charged, and Plunging Attacks will also be converted to deal Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b>, which cannot be overridden. When sprinting, she also deals Nightsoul-aligned <b class="text-genshin-pyro">Pyro DMG</b> to opponents along her path.
      <br />
      <br />While in the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state, Tapping the Elemental Skill can switch the <b>All-Fire Armaments</b>' form. The <b>Armaments</b> will disappear once Mavuika's <b class="text-genshin-pyro">Nightsoul's Blessing</b> state ends.
      <br />
      <br /><b>Nightsoul's Blessing: Mavuika</b>
      <br />Continuously consumes <b class="text-genshin-pyro">Nightsoul</b> points according to the <b>All-Fire Armaments</b>' form. Mavuika's <b class="text-genshin-pyro">Nightsoul's Blessing</b> state ends once <b class="text-genshin-pyro">Nightsoul</b> points are exhausted.
      `,
      image: 'Skill_S_Mavuika_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Hour of Burning Skies`,
      content: `Let the inner voices of the people reach the divine throne in the heavens.
      <br /><i>Mavuika's Elemental Burst is not reliant on Energy, but instead, on <b class="text-red">Fighting Spirit</b>.</i>
      <br />
      <br /><b class="text-red">Fighting Spirit</b>
      <br />When Mavuika has at least <span class="text-desc">50%</span> <b class="text-red">Fighting Spirit</b>, she can consume it all to unleash her Elemental Burst.
      <br />Mavuika can obtain <b class="text-red">Fighting Spirit</b> via the following methods:
      <br />· When in combat, <b class="text-genshin-pyro">Nightsoul</b> points consumed by nearby party members are converted to <b class="text-red">Fighting Spirit</b>.
      <br />· When nearby party members' Normal Attacks hit opponents, Mavuika gains <span class="text-desc">1.5</span> <b class="text-red">Fighting Spirit</b>. This can trigger once every <span class="text-desc">0.1</span>s.
      <br />
      <br />After using this, Mavuika gains <span class="text-desc">10</span> <b class="text-genshin-pyro">Nightsoul</b> points and enters the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state. Riding her <b>Flamestrider</b> high in the air, she uses a powerful <b>Sunfell Slice</b> against opponents on the ground, dealing Nightsoul-aligned <b class="text-genshin-pyro">AoE Pyro DMG</b> and entering the <b class="text-desc">Crucible of Death and Life</b> state.
      <br />
      <br /><b class="text-desc">Crucible of Death and Life</b>
      <br />During this time, Mavuika's various actions will no longer consume <b class="text-genshin-pyro">Nightsoul</b> points, and her interruption resistance is increased. Also, the DMG dealt by <b>Sunfell Slice</b> and the <b>Flamestrider</b> form's Normal and Charged Attacks is increased based on the amount of <b class="text-red">Fighting Spirit</b> she has when using the Elemental Burst.
      <br />The <b class="text-desc">Crucible of Death and Life</b> will be canceled when Mavuika leaves the field.`,
      image: 'Skill_E_Mavuika_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Gift of Flaming Flowers`,
      content: `When a nearby party member triggers a <b>Nightsoul Burst</b>, Mavuika's ATK increases by <span class="text-desc">35%</span> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Mavuika_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `"Kiongozi"`,
      content: `After using her Elemental Burst, <b>Hour of Burning Skies</b>, every point of <b class="text-red">Fighting Spirit</b> present when it is used increases the DMG that the current active character deals by <span class="text-desc">0.25%</span>. The maximum increase obtainable this way is <span class="text-desc">50%</span>, and this effect lasts <span class="text-desc">20</span>s. The increase will decay over <span class="text-desc">20</span>s until it reaches <span class="text-desc">0</span>.`,
      image: 'UI_Talent_S_Mavuika_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `-`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, triggering <b>Nightsoul Burst</b> restores <span class="text-desc">20</span> <b class="text-genshin-pyro">Phlogiston</b>.
      <br />This cannot take effect in Domains, Trounce Domains, or the Spiral Abyss.`,
      image: 'UI_Talent_S_Mavuika_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Exhaust Mode`,
      content: `After <b class="text-genshin-pyro">Nightsoul</b> points have been fully depleted, Mavuika will switch to using <b class="text-genshin-pyro">Phlogiston</b> to maintain the <b>All-Fire Armaments</b>' <b>Flamestrider</b> form.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, <b>Nightsoul Transmission: Mavuika</b>, can be used. When the current active character is sprinting, climbing, swimming, in movement modes caused by certain Talents, or at a certain height in the air, switching to Mavuika will trigger the following: Mavuika enters the <b class="text-genshin-pyro">Nightsoul's Blessing</b> state and obtains <span class="text-desc">50%</span> of her maximum <b class="text-genshin-pyro">Nightsoul</b> points. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own party.`,
      image: 'UI_Talent_S_Mavuika_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `The Night-Lord's Explication`,
      content: `Mavuika's maximum <b class="text-genshin-pyro">Nightsoul</b> points are increased to <span class="text-desc">120</span>, and she gains <b class="text-red">Fighting Spirit</b> <span class="text-desc">25%</span> more efficiently.
      <br />Additionally, she gains <span class="text-desc">40%</span> ATK for <span class="text-desc">8</span>s after gaining <b class="text-red">Fighting Spirit</b>.`,
      image: 'UI_Talent_S_Mavuika_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The Ashen Price`,
      content: `When in the <b class="text-genshin-pyro">Nightsoul's Blessing</b> State, Mavuika's Base ATK is increased by <span class="text-desc">300</span>, and she obtains the following effects based on <b>All-Fire Armaments</b>' form:
      <br />- <b>Rings of Searing Radiance</b>: Nearby opponents' DEF decreased by <span class="text-desc">20%</span>.
      <br />- <b>Flamestrider</b>: Each point of Mavuika's ATK increases her Normal Attack DMG by <span class="text-desc">1</span>, and her Charged Attack DMG by <span class="text-desc">1.5</span>.`,
      image: 'UI_Talent_S_Mavuika_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `The Burning Sun`,
      content: `Increases the Level of <b>Hour of Burning Skies</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mavuika_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `The Leader's Resolve`,
      content: `Enhances the effects of the Passive Talent <b>"Kiongozi"</b>:
      <br />The DMG increase gained after using the Elemental Burst <b>Hour of Burning Skies</b> will not decay over time.
      <br />You must first unlock the Passive Talent <b>"Kiongozi."</b>`,
      image: 'UI_Talent_S_Mavuika_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `The Meaning of Truth`,
      content: `Increases the Level of <b>The Named Moment</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Mavuika_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `"Humanity's Name" Unfettered`,
      content: `The <b>All-Fire Armaments</b> from the Elemental Skill <b>The Named Moment</b> receive all-around improvements:
      <br />- <b>Rings of Searing Radiance</b>: When the <b>Rings</b>' attacks hit opponents, a <b>Flamestrider</b> will crash into the struck opponent, dealing <span class="text-desc">200%</span> of ATK as Nightsoul-aligned <b class="text-genshin-pyro">AoE Pyro DMG</b>.
      <br />- <b>Flamestrider</b>: When Mavuika is riding the <b>Flamestrider</b>, <b>Rings of Searing Radiance</b> will also follow her, dealing <span class="text-desc">400%</span> of ATK as Nightsoul-aligned <b class="text-genshin-pyro">AoE Pyro DMG</b> to nearby opponents once every <span class="text-desc">3</span>s.
      <br />
      <br />Additionally, the terrain-crossing abilities of the <b>Flamestrider</b> form will be further improved, and when not in combat, when Mavuika's <b class="text-genshin-pyro">Nightsoul</b> points drop to <span class="text-desc">5</span>, she will gain an additional <span class="text-desc">80</span> points. This effect can trigger once every <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Mavuika_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'flamestrider',
      text: `Flamestrider Mode`,
      ...talents.skill,
      show: true,
      default: true,
      sync: true,
    },
    {
      type: 'number',
      id: 'fighting_spirit',
      text: `Fighting Spirit`,
      ...talents.burst,
      show: true,
      default: 100,
      min: 0,
      max: 200,
    },
    {
      type: 'toggle',
      id: 'mavuika_a1',
      text: `A1 ATK Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'mavuika_a4',
      text: `"Kiongozi" DMG Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'mavuika_c1',
      text: `C1 ATK Bonus`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'mavuika_c2',
      text: `C2 Base ATK & DMG Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'mavuika_c2_2',
      text: `C2 DEF Shred`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'mavuika_c2_2')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'mavuika_a4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      if (form.flamestrider) base.infuse(Element.PYRO, true)

      const burstNa = form.fighting_spirit
        ? [{ scaling: calcScaling(0.004, burst, 'elemental', '1') * form.fighting_spirit, multiplier: Stats.ATK }]
        : []
      base.BASIC_SCALING = form.flamestrider
        ? [
            {
              name: 'Flamestrider 1-Hit',
              value: [{ scaling: calcScaling(0.573, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstNa],
              element: Element.PYRO,
              property: TalentProperty.NA,
            },
            {
              name: 'Flamestrider 2-Hit',
              value: [{ scaling: calcScaling(0.591, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstNa],
              element: Element.PYRO,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: 'Flamestrider 3-Hit',
              value: [{ scaling: calcScaling(0.7, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstNa],
              element: Element.PYRO,
              property: TalentProperty.NA,
              hit: 3,
            },
            {
              name: 'Flamestrider 4-Hit',
              value: [{ scaling: calcScaling(0.697, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstNa],
              element: Element.PYRO,
              property: TalentProperty.NA,
            },
            {
              name: 'Flamestrider 5-Hit',
              value: [{ scaling: calcScaling(0.91, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstNa],
              element: Element.PYRO,
              property: TalentProperty.NA,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.8, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.365, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.332, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 3,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(1.162, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      const burstCa = form.fighting_spirit
        ? [{ scaling: calcScaling(0.008, burst, 'elemental', '1') * form.fighting_spirit, multiplier: Stats.ATK }]
        : []
      base.CHARGE_SCALING = form.flamestrider
        ? [
            {
              name: 'Flamestrider Charged Attack Cyclic DMG',
              value: [{ scaling: calcScaling(1.101, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstCa],
              element: Element.PYRO,
              property: TalentProperty.CA,
            },
            {
              name: 'Flamestrider Charged Attack Final DMG',
              value: [{ scaling: calcScaling(1.514, skill, 'physical', '1'), multiplier: Stats.ATK }, ...burstCa],
              element: Element.PYRO,
              property: TalentProperty.CA,
            },
          ]
        : [
            {
              name: 'Charged Attack Final DMG',
              value: [{ scaling: calcScaling(1.94, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)
      if (form.flamestrider) {
        base.PLUNGE_SCALING.shift()
        base.PLUNGE_SCALING.unshift({
          name: 'Flamestrider Plunge DMG',
          value: [{ scaling: calcScaling(1.6, skill, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.PA,
        })
      }

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.744, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Rings of Searing Radiance DMG',
          value: [{ scaling: calcScaling(1.28, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Flamestrider Sprint DMG',
          value: [{ scaling: calcScaling(0.808, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.PYRO,
          property: TalentProperty.SKILL,
        },
      ]
      const burstSunfell = form.fighting_spirit
        ? [{ scaling: calcScaling(0.016, burst, 'elemental', '1') * form.fighting_spirit, multiplier: Stats.ATK }]
        : []
      base.BURST_SCALING = [
        {
          name: `Sunfell Slice DMG`,
          value: [{ scaling: calcScaling(4.448, burst, 'elemental', '1'), multiplier: Stats.ATK }, ...burstSunfell],
          element: Element.PYRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.mavuika_a1) {
        base[Stats.P_ATK].push({ value: 0.35, name: 'Ascension 1 Passive', source: `Self` })
      }
      if (form.mavuika_a4) {
        base[Stats.ALL_DMG].push({
          value: _.min([0.0025 * form.fighting_spirit, 0.5]),
          name: 'Asecnsion 4 Passive',
          source: `Self`,
        })
      }
      if (form.mavuika_c1) {
        base[Stats.P_ATK].push({ value: 0.4, name: 'Constellation 1', source: `Self` })
      }
      if (form.mavuika_c2_2) {
        base.DEF_REDUCTION.push({ value: 0.2, name: 'Constellation 2', source: `Self` })
      }
      if (c >= 6) {
        base.SKILL_SCALING.push(
          {
            name: 'C6 Assisted Flamestrider DMG',
            value: [{ scaling: 2, multiplier: Stats.ATK }],
            element: Element.PYRO,
            property: TalentProperty.SKILL,
          },
          {
            name: 'C6 Assisted Rings DMG',
            value: [{ scaling: 4, multiplier: Stats.ATK }],
            element: Element.PYRO,
            property: TalentProperty.SKILL,
          }
        )
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.mavuika_a4) {
        base[Stats.ALL_DMG].push({
          value: _.min([0.0025 * form.fighting_spirit, 0.5]),
          name: 'Asecnsion 4 Passive',
          source: `Mavuika`,
        })
      }
      if (form.mavuika_c2_2) {
        base.DEF_REDUCTION.push({ value: 0.2, name: 'Constellation 2', source: `Mavuika` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.mavuika_c2) {
        base.ADD_BASE_ATK.push({ value: 300, name: 'Constellation 2', source: `Add Base ATK` })
        base.BASIC_F_DMG.push({ value: base.getAtk(), name: 'Constellation 2', source: `Self` })
        base.CHARGE_F_DMG.push({
          value: 1.5 * base.getAtk(),
          name: 'Constellation 2',
          source: `Self`,
          base: base.getAtk(),
          multiplier: '150%',
        })
      }

      return base
    },
  }
}

export default Mavuika
