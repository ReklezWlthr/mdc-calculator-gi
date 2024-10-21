import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Clorinde = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const maxFlat = c >= 2 ? 2700 : 1800
  const flatStack = c >= 2 ? 0.3 : 0.2

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Oath of Hunting Shadows`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina and fires Suppressing Shots in a fan pattern with her pistolet.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Hunter's Vigil`,
      content: `Preparing her pistolet, she enters the <b class="text-violet-400">Night Vigil</b> state, using steel and shot together. In this state, Clorinde's Normal Attacks will be transformed into <b>Swift Hunt</b> pistolet attacks, and the DMG dealt is converted into <b class="text-genshin-electro">Electro DMG</b> that cannot be overridden by infusions, and she will be unable to use Charged Attacks. Using her Elemental Skill will transform it into <b>Impale the Night</b>: Perform a lunging attack, dealing <b class="text-genshin-electro">Electro DMG</b>. The DMG done through the aforementioned method is considered Normal Attack DMG.
      <br />
      <br /><b>Swift Hunt</b>
      <br />- When her <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her max HP: Performs a pistolet shot.
      <br />- When her <b class="text-genshin-bol">Bond of Life</b> is less than <span class="text-desc">100%</span>, firing her pistolet will grant her <b class="text-genshin-bol">Bond of Life</b>, with the amount gained based on her max HP. The shots she fires can pierce opponents, and DMG dealt to opponents in their path is increased.
      <br />
      <br /><b>Impale the Night</b>
      <br />The current percentage value of Clorinde's <b class="text-genshin-bol">Bond of Life</b> determines its effect:
      <br />- When the <b class="text-genshin-bol">Bond of Life</b> value is <span class="text-desc">0%</span>, perform a normal lunging strike;
      <br />- When the <b class="text-genshin-bol">Bond of Life</b> value is less than <span class="text-desc">100%</span> of her max HP, Clorinde is healed based on the <b class="text-genshin-bol">Bond of Life</b> value, and the AoE of the lunging attack and the DMG dealt is increased;
      <br />- When the value of the <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her max HP, use <b>Impale the Night: Pact</b>. The healing multiplier is increased, and the AoE and DMG dealt by the lunge is increased even further.
      <br />
      <br />In addition, when Clorinde is in the <b class="text-violet-400">Night Vigil</b> state, healing effects other than <b>Impale the Night</b> will not take effect and will instead be converted into a <b class="text-genshin-bol">Bond of Life</b> that is a percentage of the healing that would have been received.
      <br />
      <br />Clorinde will exit the <b class="text-violet-400">Night Vigil</b> state when she leaves the field.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />Periodically, when Clorinde's <b>Swift Hunt</b> shots strike opponents, she will summon a <b class="text-genshin-ousia">Surging Blade</b> at the position hit that deals <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-electro">Electro DMG</b>.
      `,
      image: 'Skill_S_Clorinde_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Last Lightfall`,
      content: `Grants herself a <b class="text-genshin-bol">Bond of Life</b> based upon her own max HP before swiftly evading and striking with saber and sidearm as one, dealing <b class="text-genshin-electro">AoE Electro DMG</b>.`,
      image: 'Skill_E_Clorinde_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Dark-Shattering Flame`,
      content: `After a nearby party member triggers an <b class="text-genshin-electro">Electro</b>-related reaction against an opponent, <b class="text-genshin-electro">Electro DMG</b> dealt by Clorinde's Normal Attacks and <b>Last Lightfall</b> will be increased by <span class="text-desc">20%</span> of Clorinde's ATK for <span class="text-desc">15</span>s. Max <span class="text-desc">3</span> stacks. Each stack is counted independently. The Maximum DMG increase achievable this way for the above attacks is <span class="text-desc">1,800</span>.`,
      image: 'UI_Talent_S_Clorinde_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Lawful Remuneration`,
      content: `If Clorinde's <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her Max HP, her CRIT Rate will increase by <span class="text-desc">10%</span> for <span class="text-desc">15</span>s whenever her <b class="text-genshin-bol">Bond of Life</b> value increases or decreases. Max <span class="text-desc">2</span> stacks. Each stack is counted independently.
      <br />Additionally, <b>Hunter's Vigil</b>'s <b class="text-violet-400">Night Vigil</b> state is buffed: While it is active, the percent of healing converted to <b class="text-genshin-bol">Bond of Life</b> increases to <span class="text-desc">100%</span>.`,
      image: 'UI_Talent_S_Clorinde_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Night Vigil's Harvest`,
      content: `Displays the location of nearby resources unique to Fontaine on the mini-map.`,
      image: 'UI_Talent_S_Liney_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `"From This Day, I Pass the Candle's Shadow-Veil"`,
      content: `While <b>Hunter's Vigil</b>'s <b class="text-violet-400">Night Vigil</b> state is active, when <b class="text-genshin-electro">Electro DMG</b> from Clorinde's Normal Attacks hit opponents, they will trigger <span class="text-desc">2</span> coordinated attacks from a <b class="text-genshin-electro">Nightvigil Shade</b> summoned near the hit opponent, each dealing <span class="text-desc">30%</span> of Clorinde's ATK as <b class="text-genshin-electro">Electro DMG</b>.
      <br />This effect can occur once every <span class="text-desc">1.2</span>s. DMG dealt this way is considered Normal Attack DMG.`,
      image: 'UI_Talent_S_Clorinde_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `"Now, As We Face the Perils of the Long Night"`,
      content: `Enhance the Passive Talent <b>Dark-Shattering Flame</b>: After a nearby party member triggers an <b class="text-genshin-electro">Electro</b>-related reaction against an opponent, <b class="text-genshin-electro">Electro DMG</b> dealt by Clorinde's Normal Attacks and <b>Last Lightfall</b> will be increased by <span class="text-desc">30%</span> of Clorinde's ATK for <span class="text-desc">15</span>s. Max <span class="text-desc">3</span> stacks. Each stack is counted independently. When you have <span class="text-desc">3</span> stacks, Clorinde's interruption resistance will be increased. The Maximum DMG increase achievable this way for the above attacks is <span class="text-desc">2,700</span>.
      <br />You must first unlock the Passive Talent <b>Dark-Shattering Flame</b>.`,
      image: 'UI_Talent_S_Clorinde_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `"I Pledge to Remember the Oath of Daylight"`,
      content: `Increases the Level of <b>Hunter's Vigil</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Clorinde_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `"To Enshrine Tears, Life, and Love"`,
      content: `When <b>Last Lightfall</b> deals DMG to opponent(s), DMG dealt is increased based on Clorinde's <b class="text-genshin-bol">Bond of Life</b> percentage. Every <span class="text-desc">1%</span> of her current <b class="text-genshin-bol">Bond of Life</b> will increase <b>Last Lightfall</b> DMG by <span class="text-desc">2%</span>. The maximum <b>Last Lightfall</b> DMG increase achievable this way is <span class="text-desc">200%</span>.`,
      image: 'UI_Talent_S_Clorinde_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `"Holding Dawn's Coming as My Votive"`,
      content: `Increases the Level of <b>Last Lightfall</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Clorinde_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `"And So Shall I Never Despair"`,
      content: `For <span class="text-desc">12</span>s after <b>Hunter's Vigil</b> is used, Clorinde's CRIT Rate will be increased by <span class="text-desc">10%</span>, and her CRIT DMG by <span class="text-desc">70%</span>.
      <br />Additionally, while <b class="text-violet-400">Night Vigil</b> is active, a <b class="text-genshin-electro">Glimbright Shade</b> will appear under specific circumstances, executing an attack that deals <span class="text-desc">200%</span> of Clorinde's ATK as <b class="text-genshin-electro">Electro DMG</b>. DMG dealt this way is considered Normal Attack DMG.
      <br />The <b class="text-genshin-electro">Glimbright Shade</b> will appear under the following circumstances:
      <br />- When Clorinde is about to be hit by an attack.
      <br />- When Clorinde uses <b>Impale the Night: Pact</b>.
      <br /><span class="text-desc">1</span> <b class="text-genshin-electro">Glimbright Shade</b> can be summoned in the aforementioned ways every <span class="text-desc">1</span>s. <span class="text-desc">6</span> <b class="text-genshin-electro">Shades</b> can be summoned per single <b class="text-violet-400">Night Vigil</b> duration.
      <br />In addition, while <b class="text-violet-400">Night Vigil</b> is active, the DMG Clorinde receives is decreased by <span class="text-desc">80%</span> and her interruption resistance is increased. This effect will disappear after the <b class="text-violet-400">Night Vigil</b> state ends or <span class="text-desc">1</span>s after she summons <span class="text-desc">6</span> <b class="text-genshin-electro">Glimbright Shades</b>.`,
      image: 'UI_Talent_S_Clorinde_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'night_vigil',
      text: `Night Vigil`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'number',
      id: 'clorinde_bol',
      text: `Bond of Life (%)`,
      ...talents.skill,
      show: true,
      default: 105,
      min: 0,
      max: 200,
    },
    {
      type: 'number',
      id: 'clorinde_a1',
      text: `A1 Electro Reaction Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: 3,
      min: 0,
      max: 3,
    },
    {
      type: 'number',
      id: 'clorinde_a4',
      text: `A4 CRIT Rate Bonus`,
      ...talents.a4,
      show: a >= 4,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'toggle',
      id: 'clorinde_c6',
      text: `C6 Skill CRIT Buffs`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
    {
      type: 'toggle',
      id: 'clorinde_c6_red',
      text: `C6 DMG Reduction`,
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
      

      base.BASIC_SCALING = form.night_vigil
        ? [
            {
              name: 'Swift Hunt DMG',
              value: [
                {
                  scaling: calcScaling(form.clorinde_bol >= 100 ? 0.2676 : 0.3879, skill, 'physical', '1'),
                  multiplier: Stats.ATK,
                },
              ],
              element: Element.ELECTRO,
              property: TalentProperty.NA,
            },
          ]
        : [
            {
              name: '1-Hit',
              value: [{ scaling: calcScaling(0.5406, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '2-Hit',
              value: [{ scaling: calcScaling(0.5163, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '3-Hit',
              value: [{ scaling: calcScaling(0.3419, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 2,
            },
            {
              name: '4-Hit',
              value: [{ scaling: calcScaling(0.2313, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
              hit: 3,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.9001, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.night_vigil
        ? []
        : [
            {
              name: 'Charged Attack DMG',
              value: [{ scaling: calcScaling(1.2814, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.CA,
            },
          ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: form.clorinde_bol >= 100 ? 'Impale the Night: Pact DMG' : 'Impale the Night DMG',
          value: [
            {
              scaling: calcScaling(
                form.clorinde_bol >= 100 ? 0.2511 : form.clorinde_bol > 0 ? 0.4396 : 0.3297,
                skill,
                'physical',
                '1'
              ),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
          hit: form.clorinde_bol >= 100 ? 3 : 1,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.432, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.2688, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
          hit: 5,
        },
      ]

      if (form.clorinde_bol > 0)
        base.SKILL_SCALING.push({
          name: 'Impale the Night Healing',
          value: [
            { scaling: (form.clorinde_bol >= 100 ? 0.1 : 0.04) * (form.clorinde_bol / 100), multiplier: Stats.HP },
          ],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
          self: true,
        })

      if (form.clorinde_a4)
        base[Stats.CRIT_RATE].push({ value: form.clorinde_a4 * 0.1, name: 'Ascension 4 Passive', source: 'Self' })
      if (c >= 1 && form.night_vigil)
        base.BASIC_SCALING.push({
          name: 'Nightvigil Shade DMG',
          value: [{ scaling: 0.3, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
          hit: 2,
        })
      if (c >= 4 && form.clorinde_bol)
        base.BURST_DMG.push({
          value: _.min([2, (form.clorinde_bol * 2) / 100]),
          name: 'Constellation 4',
          source: 'Self',
        })
      if (form.clorinde_c6) {
        base[Stats.CRIT_RATE].push({ value: 0.1, name: 'Constellation 6', source: `Self` })
        base[Stats.CRIT_DMG].push({ value: 0.7, name: 'Constellation 6', source: `Self` })
      }
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'Glimbright Shade DMG',
          value: [{ scaling: 2, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        })
      if (form.clorinde_c6_red) base.DMG_REDUCTION.push({ value: 0.8, name: 'Glimbright Shade', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.clorinde_a1) {
        base.BASIC_F_DMG.push({
          value: _.min([maxFlat, form.clorinde_a1 * flatStack * base.getAtk()]),
          name: 'Ascension 1 Passive',
          source: 'Self',
          base: base.getAtk(),
          multiplier: toPercentage(form.clorinde_a1 * flatStack),
        })
        base.BURST_F_DMG.push({
          value: _.min([maxFlat, form.clorinde_a1 * flatStack * base.getAtk()]),
          name: 'Ascension 1 Passive',
          source: 'Self',
          base: base.getAtk(),
          multiplier: toPercentage(form.clorinde_a1 * flatStack),
        })
      }

      return base
    },
  }
}

export default Clorinde
