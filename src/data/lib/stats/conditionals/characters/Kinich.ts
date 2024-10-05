import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kinich = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      trace: `Normal Attack`,
      title: `Nightsun Style`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 rapid strikes.
      <br />After using his Elemental Skill <b>Canopy Hunter: Riding High</b>'s mid-air swing, he can perform a Normal Attack in mid-air before landing.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to spin and throw his Claymore forward to attack opponents.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Canopy Hunter: Riding High`,
      content: `Kinich uses his big-game hunting skills to either move swiftly or attack his opponent.
      <br />When there is an opponent or object that can be attacked nearby, he will attach a grappling hook to the target and enter <b class="text-genshin-dendro">Nightsoul's Blessing</b> with <span class="text-desc">0</span> <b class="text-genshin-dendro">Nightsoul</b> points. If neither is nearby, he fires a grappling hook forward and swings in mid-air, and this Skill's CD is decreased by <span class="text-desc">60%</span>.
      <br />This skill can be Held to release. When it is Held, Kinich can aim the grappling hook.
      <br />
      <br /><b>Nightsoul's Blessing: Kinich</b>
      <br />Kinich's <b class="text-genshin-dendro">Nightsoul's Blessing</b> lasts <span class="text-desc">10</span>s and generates <span class="text-desc">2</span> <b class="text-genshin-dendro">Nightsoul</b> points every second.
      <br />In this state, Kinich will hook onto a nearby opponent and perform a variable attack:
      <br />- When using a Normal Attack, Kinich will fire <b>Loop Shots</b> as he loops around the grappled target based on his current movement direction, dealing Nightsoul-aligned <b class="text-genshin-dendro">Dendro DMG</b> and generating <span class="text-desc">3</span> <b class="text-genshin-dendro">Nightsoul</b> points. <b>Loop Shot</b> DMG is considered Elemental Skill DMG.
      <br />- When <b class="text-genshin-dendro">Nightsoul</b> points are at max, he can use the Elemental Skill <b>Scalespiker Cannon</b>: Consume all <b class="text-genshin-dendro">Nightsoul</b> points to deal Nightsoul-aligned <b class="text-genshin-dendro">Dendro DMG</b>. When <b>Scalespiker Cannon</b> is Held, Kinich can aim this shot. After firing the <b>Cannon</b>, Kinich will try to grapple to its target.
      <br />While in <b class="text-genshin-dendro">Nightsoul's Blessing</b>, after grappling an opponent or firing <b>Scalespiker Cannon</b>, a <b>Blind Spot</b> will be generated next to the opponent. When Kinich enters this <b>Blind Spot</b>, it will disappear and he will generate <span class="text-desc">4</span> <b class="text-genshin-dendro">Nightsoul</b> points.
      <br />If the grapple connection should snap due to exceeding the maximum distance or some other reason, using a Normal Attack will establish a new connection with a nearby opponent before performing <b>Loop Shots</b>.
      `,
      image: 'Skill_S_Kinich_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Hail to the Almighty Dragonlord`,
      content: `Unleashes the power of the Almighty Dragonlord, K'uhul Ajaw (on a limited, conditional, restricted, contractual, partial, temporary basis), dealing Nightsoul-aligned <b class="text-genshin-dendro">AoE Dendro DMG</b>. Ajaw will unleash his Dragon Breath at intervals, dealing Nightsoul-aligned <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />If Kinich is in <b class="text-genshin-dendro">Nightsoul's Blessing</b> when this is used, this Blessing's duration is extended by <span class="text-desc">1.7</span>s.`,
      image: 'Skill_E_Kinich_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `The Price of Desolation`,
      content: `When Kinich is in <b class="text-genshin-dendro">Nightsoul's Blessing</b> state, opponents hit by his Elemental Skill will enter the <b class="text-genshin-dendro">Desolation</b> state, and when affected by Burning or Burgeon reaction DMG, they will restore <span class="text-desc">7</span> <b class="text-genshin-dendro">Nightsoul</b> points to him. <b class="text-genshin-dendro">Nightsoul</b> points can be gained this way once every <span class="text-desc">0.8</span>s. The <b class="text-genshin-dendro">Desolation</b> state will persist until this instance of Kinich's <b class="text-genshin-dendro">Nightsoul's Blessing</b> state ends.`,
      image: 'UI_Talent_S_Kinich_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Flame Spirit Pact`,
      content: `After a nearby party member triggers a <b>Nightsoul Burst</b>, Kinich will gain <span class="text-desc">1</span> stack of <b>Hunter's Experience</b> that lasts <span class="text-desc">15</span>s. Max <span class="text-desc">2</span> stacks. When Kinich uses <b>Canopy Hunter: Riding High</b>'s <b>Scalespiker Cannon</b>, all stacks of <b>Hunter's Experience</b> will be consumed, with each stack consumed increasing the DMG dealt by this <b>Cannon</b> shot by <span class="text-desc">320%</span> of Kinich's ATK.`,
      image: 'UI_Talent_S_Kinich_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `A Rad Recipe`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, interacting with some harvestable items will increase your own party members' Movement SPD by <span class="text-desc">15%</span> for <span class="text-desc">10</span>s. Additionally, the location of nearby resources unique to Natlan will appear on your mini-map.`,
      image: 'UI_Talent_S_Kinich_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Night Realm's Gift: Repaid in Full`,
      content: `When Kinich is in the air following <b>Canopy Hunter: Riding High</b>'s mid-air swing, he can consume <span class="text-desc">10</span> <b class="text-genshin-pyro">Phlogiston</b> points to perform another mid-air swing.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, he can use <b>Nightsoul Transmission: Kinich</b>. When the current active character is sprinting, in movement states that result from specific Talents, or in the air, when you switch to Kinich: Kinich will perform one of the following actions depending on the conditions met:
      <br />- When facing a Coilgrass Sigil that can be interacted with: He will fire a grappling hook towards it to move;
      <br />- When there are nearby opponents and you are in combat: Kinich will use <b>Canopy Hunter: Riding High</b> in the direction of the opponents;
      <br />Otherwise, Kinich will fire a grappling hook and swing, prioritizing valid Coilgrass Sigils as grapple targets.
      <br /><b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own party.
      <br />
      <br />When interacting with Coilgrass Sigils and other items that Yumkasaurs can interact with, <b>Canopy Hunter: Riding High</b> will be converted to <b>Yumkasaur Mimesis</b> which causes interactions with such items to follow rules applicable to Yumkasaurs, and which will not put <b>Canopy Hunter: Riding High</b> on CD.`,
      image: `UI_Talent_S_Kinich_07`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Parrot's Beak`,
      content: `After Kinich lands from <b>Canopy Hunter: Riding High</b>'s mid-air swing, his Movement SPD will increase by <span class="text-desc">30%</span> for <span class="text-desc">6</span>s.
      <br />Additionally, <b>Scalespiker Cannon</b>'s CRIT DMG is increased by <span class="text-desc">100%</span>.`,
      image: 'UI_Talent_S_Kinich_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Tiger Beetle's Palm`,
      content: `When Kinich's Elemental Skill hits an opponent, it will decrease their <b class="text-genshin-dendro">Dendro RES</b> by <span class="text-desc">30%</span> for <span class="text-desc">6</span>s.
      <br />Additionally, the first <b>Scalespiker Cannon</b> Kinich fires after entering <b class="text-genshin-dendro">Nightsoul's Blessing</b> has increased AoE, and its DMG increases by <span class="text-desc">100%</span>.`,
      image: 'UI_Talent_S_Kinich_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Protosuchian's Claw`,
      content: `Increases the Level of <b>Canopy Hunter: Riding High</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kinich_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Hummingbird's Feather`,
      content: `When in <b class="text-genshin-dendro">Nightsoul's Blessing</b>, Kinich will restore <span class="text-desc">5</span> Energy after using his <b>Loop Shots</b> or after unleashing the <b>Scalespiker Cannon</b>. Energy can be regenerated this way once every <span class="text-desc">2.8</span>s.
      <br />Additionally, <b>Hail to the Almighty Dragonlord</b> deals <span class="text-desc">70%</span> more DMG.`,
      image: 'UI_Talent_S_Kinich_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Howler Monkey's Tail`,
      content: `Increases the Level of <b>Hail to the Almighty Dragonlord</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kinich_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Auspicious Beast's Shape`,
      content: `After <b>Scalespiker Cannon</b> hits an opponent, it will bounce between opponents once, dealing <span class="text-desc">700%</span> of Kinich's ATK as <b class="text-genshin-dendro">Dendro DMG</b>.
      <br />If this <b>Scalespiker Cannon</b> triggers the buffs that Passive Talent <b>Flame Spirit Pact</b> or the Constellation <b>Tiger Beetle's Palm</b> grant to the <b>Cannon</b>, the bouncing attack will also obtain the relevant buffs.`,
      image: 'UI_Talent_S_Kinich_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'hunter_experience',
      text: `Hunter's Experience Stacks`,
      ...talents.a4,
      show: a >= 4,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'toggle',
      id: 'kinich_c2',
      text: `C2 Dendro RES Reduction`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'kinich_c2_buff',
      text: `C2 First Cannon Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'kinich_c2')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.99, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.829, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(1.235, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [x3]',
          value: [{ scaling: calcScaling(0.484, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      base.SKILL_SCALING = [
        {
          name: 'Loop Shot DMG [x2]',
          value: [{ scaling: calcScaling(0.573, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Scalespiker Cannon DMG',
          value: [
            { scaling: calcScaling(6.874, skill, 'elemental', '1'), multiplier: Stats.ATK },
            ...(form.hunter_experience
              ? [
                  {
                    scaling: 3.2 * form.hunter_experience,
                    multiplier: Stats.ATK,
                  },
                ]
              : []),
          ],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          cd: c >= 1 ? 1 : 0,
          bonus: form.kinich_c2_buff ? 1 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(1.34, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Dragon Breath DMG`,
          value: [{ scaling: calcScaling(1.207, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.kinich_c2) base.DENDRO_RES_PEN.push({ value: 0.3, name: 'Constellation 2', source: `Self` })
      if (c >= 4) {
        base.BURST_DMG.push({ value: 0.7, name: 'Constellation 4', source: `Self` })
      }
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'C6 Bounce DMG',
          value: [
            { scaling: 7, multiplier: Stats.ATK },
            ...(form.hunter_experience
              ? [
                  {
                    scaling: 3.2 * form.hunter_experience,
                    multiplier: Stats.ATK,
                  },
                ]
              : []),
          ],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
          cd: 1,
          bonus: form.kinich_c2_buff ? 1 : 0,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.kinich_c2) base.DENDRO_RES_PEN.push({ value: 0.3, name: 'Constellation 2', source: `Kinich` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (c >= 6)
        base.CHARGE_SCALING = [
          {
            name: 'Charged Attack Cyclic DMG',
            value: [
              {
                scaling: calcScaling(0.6255, normal, 'physical', '1'),
                multiplier: Stats.ATK,
                override: base.getAtk() + (0.5 + base.getDef()),
              },
            ],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
          {
            name: 'Charged Attack Final DMG',
            value: [
              {
                scaling: calcScaling(1.1309, normal, 'physical', '1'),
                multiplier: Stats.ATK,
                override: base.getAtk() + (0.5 + base.getDef()),
              },
            ],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
        ]
      return base
    },
  }
}

export default Kinich
