import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Sayu = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Shuumatsuban Ninja Blade`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Drains Stamina over time to perform continuous spinning attacks against all nearby opponents.
      <br />At the end of the sequence, performs a more powerful slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Yoohoo Art: Fuuin Dash`,
      content: `The special technique of the Yoohoo Ninja Arts!
      <br />Sayu curls up into a rolling <b>Fuufuu Windwheel</b> and smashes into opponents at high speed, dealing <b class="text-genshin-anemo">Anemo DMG</b>. When the duration ends, she unleashes a <b>Fuufuu Whirlwind Kick</b>, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />
      <br /><b>Press</b>
      <br />Enters the <b>Fuufuu Windwheel</b> state, rolling forward a short distance before using the <b>Fuufuu Whirlwind Kick</b>.
      <br />
      <br /><b>Hold</b>
      <br />Rolls about continuously in the <b>Fuufuu Windwheel</b> state, increasing Sayu's resistance to interruption while within that state.
      <br />During this time, Sayu can control the direction of her roll, and can use the skill again to end her <b>Windwheel</b> state early and unleash a stronger version of the <b>Fuufuu Whirlwind Kick</b>.
      <br />The Hold version of this skill can trigger Elemental Absorption.
      <br />
      <br />This skill has a maximum duration of <span class="text-desc">10</span>s and enters CD once its effects end.
      <br />The longer Sayu remains in her <b>Windwheel</b> state, the longer the CD.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If Sayu comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b> while in her <b>Windwheel</b> state, she will deal additional elemental DMG of that type.
      <br />Elemental Absorption may only occur once per use of this skill.
      `,
      image: 'Skill_S_Sayu_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Yoohoo Art: Mujina Flurry`,
      content: `The other super special technique of the Yoohoo Ninja Arts! It summons a pair of helping hands for Sayu.
      <br />Deals <b class="text-genshin-anemo">Anemo DMG</b> to nearby opponents and heals all nearby party members. The amount of HP restored is based on Sayu's ATK. This skill then summons a <b class="text-genshin-anemo">Muji-Muji Daruma</b>.
      <br />
      <br /><b class="text-genshin-anemo">Muji-Muji Daruma</b>
      <br />At specific intervals, the <b class="text-genshin-anemo">Daruma</b> will take one of several actions based on the situation around it:
      <br />- If the HP of nearby characters is above <span class="text-desc">70%</span>, it will attack a nearby opponent, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />- If there are active characters with <span class="text-desc">70%</span> or less HP nearby, it will heal the active character with the lowest percentage HP left. If there are no opponents nearby, it will heal active characters nearby even if they have <span class="text-desc">70%</span> HP or more.`,
      image: 'Skill_E_Sayu_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Someone More Capable`,
      content: `When Sayu triggers a Swirl reaction while active, she heals all your characters and nearby allies for <span class="text-desc">300</span> HP. She will also heal an additional <span class="text-desc">1.2</span> HP for every point of Elemental Mastery she has.
      <br />This effect can be triggered once every <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Sayu_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `No Work Today!`,
      content: `The <b class="text-genshin-anemo">Muji-Muji Daruma</b> created by <b>Yoohoo Art: Mujina Flurry</b> gains the following effects:
      <br />- When healing a character, it will also heal characters near that healed character for <span class="text-desc">20%</span> the amount of HP.
      <br />- Increases the AoE of its attack against opponents.`,
      image: 'UI_Talent_S_Sayu_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Yoohoo Art: Silencer's Secret`,
      content: `When Sayu is in the party, your characters will not startle Crystalflies and certain other animals when getting near them.
      <br />Check the "Other" sub-category of the "Living Beings / Wildlife" section in the Archive for creatures this skill works on.`,
      image: 'UI_Talent_S_Sayu_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Multi-Task no Jutsu`,
      content: `The <b class="text-genshin-anemo">Muji-Muji Daruma</b> created by <b>Yoohoo Art: Mujina Flurry</b> will ignore HP limits and can simultaneously attack nearby opponents and heal characters.`,
      image: 'UI_Talent_S_Sayu_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Egress Prep`,
      content: `Yoohoo Art: Fuuin Dash gains the following effects:
      <br />- DMG of <b>Fuufuu Whirlwind Kick</b> in Press Mode increased by <span class="text-desc">3.3%</span>.
      <br />- Every <span class="text-desc">0.5</span>s in the <b>Fuufuu Windwheel</b> state will increase the DMG of this <b>Fuufuu Whirlwind Kick</b> by <span class="text-desc">3.3%</span>. The maximum DMG increase possible through this method is <span class="text-desc">66%</span>.`,
      image: 'UI_Talent_S_Sayu_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Eh, the Bunshin Can Handle It`,
      content: `Increases the Level of <b>Yoohoo Art: Mujina Flurry</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sayu_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Skiving: New and Improved`,
      content: `Sayu recovers <span class="text-desc">1.2</span> Energy when she triggers a Swirl reaction.
      <br />This effect occurs once every <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Sayu_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Speed Comes First`,
      content: `Increases the Level of <b>Yoohoo Art: Fuuin Dash</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sayu_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Sleep O'Clock`,
      content: `The <b class="text-genshin-anemo">Muji-Muji Daruma</b> created by Sayu's <b>Yoohoo Art: Mujina Flurry</b> will now also benefit from her Elemental Mastery. Each point of Sayu's Elemental Mastery will produce the following effects:
      <br />- Increases the damage dealt by the <b class="text-genshin-anemo">Muji-Muji Daruma</b>'s attacks by <span class="text-desc">0.2%</span> ATK. A maximum DMG increase of <span class="text-desc">400%</span> ATK can be gained via this method.
      <br />- Increases the HP restored by the <b class="text-genshin-anemo">Muji-Muji Daruma</b> by <span class="text-desc">3</span>. A maximum of <span class="text-desc">6,000</span> additional HP can be restored in this manner.`,
      image: 'UI_Talent_S_Sayu_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'sayu_absorption',
      text: `Skill Elemental Absorption`,
      ...talents.skill,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'number',
      id: 'sayu_c2',
      text: `C2 Stacks [1 per 0.5s]`,
      ...talents.c2,
      show: c >= 2,
      default: 20,
      min: 1,
      max: 20,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'razor_c4')]

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
          value: [{ scaling: calcScaling(0.722, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.714, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.981, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack Cyclic DMG',
          value: [{ scaling: calcScaling(0.625, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack Final DMG',
          value: [{ scaling: calcScaling(1.13, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('claymore', normal)

      base.SKILL_SCALING = [
        {
          name: 'Fuufuu Windwheel DMG',
          value: [{ scaling: calcScaling(0.36, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Fuufuu Windwheel Kick Press DMG',
          value: [{ scaling: calcScaling(1.584, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Fuufuu Windwheel Kick Hold DMG',
          value: [{ scaling: calcScaling(2.176, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
          bonus: form.sayu_c2 ? form.sayu_c2 * 0.033 : 0,
        },
        {
          name: 'Fuufuu Windwheel Elemental DMG',
          value: [{ scaling: calcScaling(0.168, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.sayu_absorption,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Fuufuu Windwheel Kick Elemental DMG',
          value: [{ scaling: calcScaling(0.762, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.sayu_absorption,
          property: TalentProperty.SKILL,
          bonus: form.sayu_c2 ? form.sayu_c2 * 0.033 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill Activation DMG`,
          value: [{ scaling: calcScaling(1.17, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Skill Activation Healing`,
          value: [{ scaling: calcScaling(0.922, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(577, burst, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.razor_c4) base.DEF_REDUCTION.push({ value: 0.15, name: '', source: `` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      base.BURST_SCALING.push(
        {
          name: `Muji-Muji Daruma DMG`,
          value: [
            {
              scaling:
                calcScaling(0.52, burst, 'elemental', '1') + (c >= 6 ? _.min([base.getEM() * 0.002, 4]) : 0),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Muji-Muji Daruma Healing`,
          value: [{ scaling: calcScaling(0.799, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(500, burst, 'special', 'flat') + (c >= 6 ? _.min([base.getEM() * 3, 6000]) : 0),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        }
      )

      if (a >= 1)
        base.BURST_SCALING.push({
          name: `A1 Swirl Healing`,
          value: [{ scaling: 1.2, multiplier: Stats.EM }],
          flat: 300,
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      if (a >= 4)
        base.BURST_SCALING.push({
          name: `A4 Shared Healing`,
          value: [{ scaling: calcScaling(0.799, burst, 'elemental', '1') * 0.2, multiplier: Stats.ATK }],
          flat: (calcScaling(500, burst, 'special', 'flat') + (c >= 6 ? _.min([base.getEM() * 3, 6000]) : 0)) * 0.2,
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })

      return base
    },
  }
}

export default Sayu
