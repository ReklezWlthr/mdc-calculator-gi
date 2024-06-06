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
    },
    skill: {
      title: `Hunter's Vigil`,
      content: `Preparing her pistolet, she enters the "Night Vigil" state, using steel and shot together. In this state, Clorinde's Normal Attacks will be transformed into "Swift Hunt" pistolet attacks, and the DMG dealt is converted into <b class="text-genshin-electro">Electro DMG</b> that cannot be overridden by infusions, and she will be unable to use Charged Attacks. Using her Elemental Skill will transform it into "Impale the Night": Perform a lunging attack, dealing <b class="text-genshin-electro">Electro DMG</b>. The DMG done through the aforementioned method is considered Normal Attack DMG.
      <br />
      <br /><b>Swift Hunt</b>
      <br />- When her <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her max HP: Performs a pistolet shot.
      <br />- When her <b class="text-genshin-bol">Bond of Life</b> is less than <span class="text-desc">100%</span>, firing her pistolet will grant her <b class="text-genshin-bol">Bond of Life</b>, with the amount gained based on her max HP. The shots she fires can pierce opponents, and DMG dealt to opponents in their path is increased.
      <br />
      <br /><b>Impale the Night</b>
      <br />The current percentage value of Clorinde's <b class="text-genshin-bol">Bond of Life</b> determines its effect:
      <br />- When the <b class="text-genshin-bol">Bond of Life</b> value is <span class="text-desc">0%</span>, perform a normal lunging strike;
      <br />- When the <b class="text-genshin-bol">Bond of Life</b> value is less than <span class="text-desc">100%</span> of her max HP, Clorinde is healed based on the <b class="text-genshin-bol">Bond of Life</b> value, and the AoE of the lunging attack and the DMG dealt is increased;
      <br />- When the value of the <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her max HP, use Impale the Night: Pact. The healing multiplier is increased, and the AoE and DMG dealt by the lunge is increased even further.
      <br />
      <br />In addition, when Clorinde is in the Night Vigil state, healing effects other than Impale the Night will not take effect and will instead be converted into a <b class="text-genshin-bol">Bond of Life</b> that is a percentage of the healing that would have been received.
      <br />
      <br />Clorinde will exit the "Night Vigil" state when she leaves the field.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />Periodically, when Clorinde's Swift Hunt shots strike opponents, she will summon a Surging Blade at the position hit that deals <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-electro">Electro DMG</b>.
      `,
    },
    burst: {
      title: `Last Lightfall`,
      content: `Grants herself a <b class="text-genshin-bol">Bond of Life</b> based upon her own max HP before swiftly evading and striking with saber and sidearm as one, dealing <b class="text-genshin-electro">AoE Electro DMG</b>.`,
    },
    a1: {
      title: `A1: Dark-Shattering Flame`,
      content: `After a nearby party member triggers an <b class="text-genshin-electro">Electro</b>-related reaction against an opponent, <b class="text-genshin-electro">Electro DMG</b> dealt by Clorinde's Normal Attacks and Last Lightfall will be increased by <span class="text-desc">20%</span> of Clorinde's ATK for <span class="text-desc">15</span>s. Max <span class="text-desc">3</span> stacks. Each stack is counted independently. The Maximum DMG increase achievable this way for the above attacks is <span class="text-desc">1,800</span>.`,
      value: [
        {
          name: 'Bonus Flat DMG [1]',
          value: { stat: Stats.ATK, scaling: (atk) => _.round(_.min([flatStack * atk, maxFlat])).toLocaleString() },
        },
        {
          name: 'Bonus Flat DMG [2]',
          value: { stat: Stats.ATK, scaling: (atk) => _.round(_.min([flatStack * 2 * atk, maxFlat])).toLocaleString() },
        },
        {
          name: 'Bonus Flat DMG [3]',
          value: { stat: Stats.ATK, scaling: (atk) => _.round(_.min([flatStack * 3 * atk, maxFlat])).toLocaleString() },
        },
      ],
    },
    a4: {
      title: `A4: Lawful Remuneration`,
      content: `If Clorinde's <b class="text-genshin-bol">Bond of Life</b> is equal to or greater than <span class="text-desc">100%</span> of her Max HP, her CRIT Rate will increase by <span class="text-desc">10%</span> for <span class="text-desc">15</span>s whenever her Bond of Life value increases or decreases. Max <span class="text-desc">2</span> stacks. Each stack is counted independently.
      <br />Additionally, Hunter's Vigil's Night Vigil state is buffed: While it is active, the percent of healing converted to Bond of Life increases to 100%.`,
    },
    util: {
      title: `Night Vigil's Harvest`,
      content: `Displays the location of nearby resources unique to Fontaine on the mini-map.`,
    },
    c1: {
      title: `C1: "From This Day, I Pass the Candle's Shadow-Veil"`,
      content: `While Hunter's Vigil's Night Vigil state is active, when <b class="text-genshin-electro">Electro DMG</b> from Clorinde's Normal Attacks hit opponents, they will trigger <span class="text-desc">2</span> coordinated attacks from a Nightvigil Shade summoned near the hit opponent, each dealing <span class="text-desc">30%</span> of Clorinde's ATK as <b class="text-genshin-electro">Electro DMG</b>.
      <br />This effect can occur once every <span class="text-desc">1.2</span>s. DMG dealt this way is considered Normal Attack DMG.`,
    },
    c2: {
      title: `C2: "Now, As We Face the Perils of the Long Night"`,
      content: `Enhance the Passive Talent "Dark-Shattering Flame": After a nearby party member triggers an <b class="text-genshin-electro">Electro</b>-related reaction against an opponent, <b class="text-genshin-electro">Electro DMG</b> dealt by Clorinde's Normal Attacks and Last Lightfall will be increased by <span class="text-desc">30%</span> of Clorinde's ATK for <span class="text-desc">15</span>s. Max <span class="text-desc">3</span> stacks. Each stack is counted independently. When you have <span class="text-desc">3</span> stacks, Clorinde's interruption resistance will be increased. The Maximum DMG increase achievable this way for the above attacks is <span class="text-desc">2,700</span>.
      <br />You must first unlock the Passive Talent "Dark-Shattering Flame."`,
    },
    c3: {
      title: `C3: "I Pledge to Remember the Oath of Daylight"`,
      content: `Increases the Level of Hunter's Vigil by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: "To Enshrine Tears, Life, and Love"`,
      content: `When Last Lightfall deals DMG to opponent(s), DMG dealt is increased based on Clorinde's <b class="text-genshin-bol">Bond of Life</b> percentage. Every <span class="text-desc">1%</span> of her current <b class="text-genshin-bol">Bond of Life</b> will increase Last Lightfall DMG by <span class="text-desc">2%</span>. The maximum Last Lightfall DMG increase achievable this way is <span class="text-desc">200%</span>.`,
    },
    c5: {
      title: `C5: "Holding Dawn's Coming as My Votive"`,
      content: `Increases the Level of Last Lightfall by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: "And So Shall I Never Despair"`,
      content: `For <span class="text-desc">12</span>s after Hunter's Vigil is used, Clorinde's CRIT Rate will be increased by <span class="text-desc">10%</span>, and her CRIT DMG by <span class="text-desc">70%</span>.
      <br />Additionally, while Night Vigil is active, a Glimbright Shade will appear under specific circumstances, executing an attack that deals <span class="text-desc">200%</span> of Clorinde's ATK as <b class="text-genshin-electro">Electro DMG</b>. DMG dealt this way is considered Normal Attack DMG.
      <br />The Glimbright Shade will appear under the following circumstances:
      <br />- When Clorinde is about to be hit by an attack.
      <br />- When Clorinde uses Impale the Night: Pact.
      <br /><span class="text-desc">1</span> Glimbright Shade can be summoned in the aforementioned ways every <span class="text-desc">1</span>s. <span class="text-desc">6</span> Shades can be summoned per single Night Vigil duration.
      <br />In addition, while Night Vigil is active, the DMG Clorinde receives is decreased by <span class="text-desc">80%</span> and her interruption resistance is increased. This effect will disappear after the Night Vigil state ends or <span class="text-desc">1</span>s after she summons <span class="text-desc">6</span> Glimbright Shades.`,
    },
  }

  const content: IContent[] = [
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
      type: 'toggle',
      id: 'clorinde_skill',
      text: `Night Vigil`,
      ...talents.skill,
      show: true,
      default: true,
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
      text: `A6 Skill CRIT Buffs`,
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
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = form.clorinde_skill
        ? [
            {
              name: 'Swift Hunt DMG',
              value: [
                {
                  scaling: calcScaling(form.clorinde_bol >= 100 ? 0.2676 : 0.3879, skill, 'elemental', '1'),
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
              name: '3-Hit [x2]',
              value: [{ scaling: calcScaling(0.3419, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '4-Hit [x3]',
              value: [{ scaling: calcScaling(0.2313, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
            {
              name: '5-Hit',
              value: [{ scaling: calcScaling(0.9001, normal, 'physical', '1'), multiplier: Stats.ATK }],
              element: Element.PHYSICAL,
              property: TalentProperty.NA,
            },
          ]
      base.CHARGE_SCALING = form.clorinde_skill
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
          name: form.clorinde_bol >= 100 ? 'Impale the Night DMG [x3]' : 'Impale the Night DMG',
          value: [
            {
              scaling: calcScaling(
                form.clorinde_bol >= 100 ? 0.2511 : form.clorinde_bol > 0 ? 0.4396 : 0.3297,
                skill,
                'elemental',
                '1'
              ),
              multiplier: Stats.ATK,
            },
          ],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.432, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG [x5]',
          value: [{ scaling: calcScaling(1.2688, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
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
        })

      if (form.clorinde_a4) base[Stats.CRIT_RATE] += form.clorinde_a4 * 0.1
      if (c >= 1 && form.clorinde_skill)
        base.BASIC_SCALING.push({
          name: 'Nightvigil Shade DMG [x2]',
          value: [{ scaling: 0.3, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        })
      if (c >= 4 && form.clorinde_bol) base.BURST_DMG += _.min([2, (form.clorinde_bol * 2) / 100])
      if (form.clorinde_c6) {
        base[Stats.CRIT_RATE] += 0.1
        base[Stats.CRIT_DMG] += 0.7
      }
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'Glimbright Shade DMG',
          value: [{ scaling: 2, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.NA,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.clorinde_a1) {
        base.BASIC_F_DMG += _.min([maxFlat, form.clorinde_a1 * flatStack * base.getAtk()])
        base.BURST_F_DMG += _.min([maxFlat, form.clorinde_a1 * flatStack * base.getAtk()])
      }

      return base
    },
  }
}

export default Clorinde
