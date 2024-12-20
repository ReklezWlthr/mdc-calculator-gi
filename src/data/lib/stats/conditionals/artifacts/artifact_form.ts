import { Element, IArtifact, Stats } from '@src/domain/constant'
import { StatsObject } from '../../baseConstant'
import _ from 'lodash'
import { IContent } from '@src/domain/conditional'
import { findContentById } from '@src/core/utils/finder'

export const ArtifactForm = () => {
  const content: IContent[] = [
    {
      type: 'toggle',
      text: `Noblesse Oblige`,
      title: `Noblesse Oblige`,
      content: `Using an Elemental Burst increases all party members' ATK by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s. This effect cannot stack.`,
      show: true,
      default: true,
      id: '1751039235',
    },
    {
      type: 'toggle',
      text: `Bloodstained Chivalry`,
      title: `Bloodstained Chivalry`,
      content: `After defeating an opponent, increases Charged Attack DMG by <span class="text-desc">50%</span>, and reduces its Stamina cost to <span class="text-desc">0</span> for <span class="text-desc">10</span>s. Also triggers with wild animals such as boars, squirrels and frogs.`,
      show: true,
      default: true,
      id: '1541919827',
    },
    {
      type: 'toggle',
      text: `Maiden Beloved`,
      title: `Maiden Beloved`,
      content: `Using an Elemental Skill or Burst increases healing received by all party members by <span class="text-desc">20%</span> for <span class="text-desc">10</span>s.`,
      show: true,
      default: true,
      id: '83115355',
    },
    {
      type: 'element',
      text: `Viridescent Venerer`,
      title: `Viridescent Venerer`,
      content: `Increases Swirl DMG by <span class="text-desc">60%</span>. Decreases opponent's <b>Elemental RES</b> to the element infused in the Swirl by <span class="text-desc">40%</span> for <span class="text-desc">10</span>s.`,
      show: true,
      default: Element.PYRO,
      id: '1562601179',
      debuff: true,
    },
    {
      type: 'element',
      text: `Archaic Petra`,
      title: `Archaic Petra`,
      content: `Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain <span class="text-desc">35%</span> <b>DMG Bonus</b> for that particular element for <span class="text-desc">10</span>s. Only one form of <b>Elemental DMG Bonus</b> can be gained in this manner at any one time.`,
      show: true,
      default: Element.PYRO,
      id: '2040573235',
    },
    {
      type: 'toggle',
      text: `Retracing Bolide`,
      title: `Retracing Bolide`,
      content: `While protected by a shield, gain an additional <span class="text-desc">40%</span> Normal and Charged Attack DMG.`,
      show: true,
      default: true,
      id: '1438974835',
    },
    {
      type: 'toggle',
      text: `Thundersoother`,
      title: `Thundersoother`,
      content: `Increases DMG against opponents affected by <b class="text-genshin-electro">Electro</b> by <span class="text-desc">35%</span>.`,
      show: true,
      default: true,
      id: '1873342283',
    },
    {
      type: 'toggle',
      text: `Lavawalker`,
      title: `Lavawalker`,
      content: `Increases DMG against opponents affected by <b class="text-genshin-pyro">Pyro</b> by <span class="text-desc">35%</span>.`,
      show: true,
      default: true,
      id: '1632377563',
    },
    {
      type: 'number',
      text: `Crimson Witch of Flames`,
      title: `Crimson Witch of Flames`,
      content: `Increases Overloaded and Burning, and Burgeon DMG by <span class="text-desc">40%</span>. Increases Vaporize and Melt DMG by <span class="text-desc">15%</span>. Using Elemental Skill increases the 2-Piece Set Bonus by <span class="text-desc">50%</span> of its starting value for <span class="text-desc">10</span>s. Max <span class="text-desc">3</span> stacks.`,
      show: true,
      default: 0,
      min: 0,
      max: 3,
      id: '1524173875',
    },
    {
      type: 'number',
      text: `Blizzard Strayer`,
      title: `Blizzard Strayer`,
      content: `When a character attacks an opponent affected by <b class="text-genshin-cryo">Cryo</b>, their CRIT Rate is increased by <span class="text-desc">20%</span>. If the opponent is <b class="text-genshin-cryo">Frozen</b>, CRIT Rate is increased by an additional <span class="text-desc">20%</span>.`,
      show: true,
      default: 0,
      min: 0,
      max: 2,
      id: '933076627',
    },
    {
      type: 'toggle',
      text: `Heart of Depth`,
      title: `Heart of Depth`,
      content: `After using an Elemental Skill, increases Normal Attack and Charged Attack DMG by <span class="text-desc">30%</span> for <span class="text-desc">15</span>s.`,
      show: true,
      default: true,
      id: '156294403',
    },
    {
      type: 'toggle',
      text: `Tenacity of the Millelith`,
      title: `Tenacity of the Millelith`,
      content: `When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by <span class="text-desc">20%</span> and their Shield Strength is increased by <span class="text-desc">30%</span> for <span class="text-desc">3</span>s. This effect can be triggered once every <span class="text-desc">0.5</span>s. This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
      show: true,
      default: true,
      id: '1337666507',
    },
    {
      type: 'number',
      text: `Pale Flame`,
      title: `Pale Flame`,
      content: `When an Elemental Skill hits an opponent, ATK is increased by <span class="text-desc">9%</span> for <span class="text-desc">7</span>s. This effect stacks up to <span class="text-desc">2</span> times and can be triggered once every <span class="text-desc">0.3</span>s. Once <span class="text-desc">2</span> stacks are reached, the 2-set effect is increased by <span class="text-desc">100%</span>.`,
      show: true,
      default: 0,
      min: 0,
      max: 2,
      id: ' 862591315',
    },
    {
      type: 'toggle',
      text: `Shimenawa's Reminiscence`,
      title: `Shimenawa's Reminiscence`,
      content: `When casting an Elemental Skill, if the character has <span class="text-desc">15</span> or more Energy, they lose <span class="text-desc">15</span> Energy and Normal/Charged/Plunging Attack DMG is increased by <span class="text-desc">50%</span> for <span class="text-desc">10</span>s. This effect will not trigger again during that duration.`,
      show: true,
      default: true,
      id: '4144069251',
    },
    {
      type: 'number',
      text: `Curiosity Stacks`,
      title: `Curiosity Stacks`,
      content: `A character equipped with this Artifact set will obtain the Curiosity effect in the following conditions:
      <br />When on the field, the character gains <span class="text-desc">1</span> stack after hitting an opponent with a <b class="text-genshin-geo">Geo</b> attack, triggering a maximum of once every <span class="text-desc">0.3</span>s.
      <br />When off the field, the character gains <span class="text-desc">1</span> stack every <span class="text-desc">3</span>s.
      <br />Curiosity can stack up to <span class="text-desc">4</span> times, each providing <span class="text-desc">6%</span> DEF and a <span class="text-desc">6%</span> <b class="text-genshin-geo">Geo DMG Bonus</b>.
      <br />When <span class="text-desc">6</span> seconds pass without gaining a Curiosity stack, <span class="text-desc">1</span> stack is lost.`,
      show: true,
      default: 0,
      min: 0,
      max: 4,
      id: '2546254811',
    },
    {
      type: 'number',
      text: `Total Healing`,
      title: `Total Healing`,
      content: `When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear for <span class="text-desc">3</span> seconds, accumulating the amount of HP recovered from healing (including overflow healing).
    <br />At the end of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on <span class="text-desc">90%</span> of the accumulated healing.
    <br />(This DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses).
    <br />Only one Sea-Dyed Foam can be produced every <span class="text-desc">3.5</span> seconds.
    <br />Each Sea-Dyed Foam can accumulate up to <span class="text-desc">30,000</span> HP (including overflow healing).
    <br />There can be no more than one Sea-Dyed Foam active at any given time.
    <br />This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
      show: true,
      default: 0,
      min: 0,
      max: 30000,
      id: '1756609915',
    },
    {
      type: 'toggle',
      text: `Nascent Light`,
      title: `Nascent Light`,
      content: `After using an Elemental Burst. this character will gain the Nascent Light effect, increasing their ATK by <span class="text-desc">8%</span> for <span class="text-desc">16</span>s. When the character's HP decreases, their ATK will further increase by <span class="text-desc">10%</span>. This increase can occur this way maximum of <span class="text-desc">4</span> times. This effect can be triggered once every <span class="text-desc">0.8</span>s. Nascent Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the duration of Nascent Light, the original Nascent Light will be dispelled.`,
      show: true,
      default: true,
      id: '1558036915',
    },
    {
      type: 'number',
      text: `Nascent Light Stacks`,
      title: `Nascent Light Stacks`,
      content: `After using an Elemental Burst. this character will gain the Nascent Light effect, increasing their ATK by <span class="text-desc">8%</span> for <span class="text-desc">16</span>s. When the character's HP decreases, their ATK will further increase by <span class="text-desc">10%</span>. This increase can occur this way maximum of <span class="text-desc">4</span> times. This effect can be triggered once every <span class="text-desc">0.8</span>s. Nascent Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the duration of Nascent Light, the original Nascent Light will be dispelled.`,
      show: true,
      default: 0,
      min: 0,
      max: 4,
      id: '1558036915_2',
    },
    {
      type: 'toggle',
      text: `Valley Rite`,
      title: `Valley Rite`,
      content: `When Normal Attacks hit opponents, there is a <span class="text-desc">36%</span> chance that it will trigger Valley Rite, which will increase Normal Attack DMG by <span class="text-desc">70%</span> of ATK.
    <br />This effect will be dispelled <span class="text-desc">0.05</span>s after a Normal Attack deals DMG.
    <br />If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by <span class="text-desc">20%</span>.
    <br />This trigger can occur once every <span class="text-desc">0.2</span>s.`,
      show: true,
      default: true,
      id: '3626268211',
    },
    {
      type: 'toggle',
      text: `Deepwood Memories`,
      title: `Deepwood Memories`,
      content: `After Elemental Skills or Bursts hit opponents, the targets' <b class="text-genshin-dendro">Dendro RES</b> will be decreased by <span class="text-desc">30%</span> for <span class="text-desc">8</span>s. This effect can be triggered even if the equipping character is not on the field.`,
      show: true,
      default: true,
      id: '1675079283',
      debuff: true,
    },
    {
      type: 'toggle',
      text: `Gilded Dreams`,
      title: `Gilded Dreams`,
      content: `Within 8s of triggering an Elemental Reaction, the character equipping this will obtain buffs based on the Elemental Type of the other party members. ATK is increased by <span class="text-desc">14%</span> for each party member whose Elemental Type is the same as the equipping character, and Elemental Mastery is increased by <span class="text-desc">50</span> for every party member with a different Elemental Type. Each of the aforementioned buffs will count up to <span class="text-desc">3</span> characters. This effect can be triggered once every <span class="text-desc">8</span>s. The character who equips this can still trigger its effects when not on the field.`,
      show: true,
      default: true,
      id: '4145306051',
    },
    {
      type: 'toggle',
      text: `Desert Pavilion Chronicle`,
      title: `Desert Pavilion Chronicle`,
      content: `When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by <span class="text-desc">10%</span> while Normal, Charged, and Plunging Attack DMG will increase by <span class="text-desc">40%</span> for <span class="text-desc">15</span>s.`,
      show: true,
      default: true,
      id: '2538235187',
    },
    {
      type: 'number',
      text: `Flower of Paradise Lost`,
      title: `Flower of Paradise Lost`,
      content: `The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by <span class="text-desc">40%</span>. Additionally, after the equipping character triggers Bloom, Hyperbloom, or Burgeon, they will gain another <span class="text-desc">25%</span> bonus to the effect mentioned prior. Each stack of this lasts <span class="text-desc">10</span>s. Max <span class="text-desc">4</span> stacks simultaneously. This effect can only be triggered once per second. The character who equips this can still trigger its effects when not on the field.`,
      show: true,
      default: 0,
      min: 0,
      max: 4,
      id: '3094139291',
    },
    {
      type: 'number',
      text: `Nymph's Dream`,
      title: `Nymph's Dream`,
      content: `After Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts hit opponents, <span class="text-desc">1</span> stack of Mirrored Nymph will triggered, lasting 8s. When under the effect of <span class="text-desc">1</span>, <span class="text-desc">2</span>, or <span class="text-desc">3 or more</span> Mirrored Nymph stacks, ATK will be increased by <span class="text-desc">7%/16%/25%</span>, and <b class="text-genshin-hydro">Hydro DMG</b> will be increased by <span class="text-desc">4%/9%/15%</span>. Mirrored Nymph created by Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts exist independently.`,
      show: true,
      default: 0,
      min: 0,
      max: 3,
      id: '1925210475',
    },
    {
      type: 'number',
      text: `Vourukasha's Glow`,
      title: `Vourukasha's Glow`,
      content: `Elemental Skill and Elemental Burst DMG will be increased by <span class="text-desc">10%</span>. After the equipping character takes DMG, the aforementioned DMG Bonus is increased by <span class="text-desc">80%</span> for <span class="text-desc">5</span>s. This effect increase can have <span class="text-desc">5</span> stacks. The duration of each stack is counted independently. These effects can be triggered even when the equipping character is not on the field.`,
      show: true,
      default: 0,
      min: 0,
      max: 5,
      id: ' 235897163',
    },
    {
      type: 'number',
      text: `Marechaussee Hunter`,
      title: `Marechaussee Hunter`,
      content: `When current HP increases or decreases, CRIT Rate will be increased by <span class="text-desc">12%</span> for <span class="text-desc">5</span>s. Max <span class="text-desc">3</span> stacks.`,
      show: true,
      default: 0,
      min: 0,
      max: 3,
      id: '1249831867',
    },
    {
      type: 'toggle',
      text: `Golden Troupe: Off-Field`,
      title: `Golden Troupe: Off-Field`,
      content: `Increases Elemental Skill DMG by <span class="text-desc">25%</span>.
    <br />Additionally, when not on the field, Elemental Skill DMG will be further increased by <span class="text-desc">25%</span>. This effect will be cleared <span class="text-desc">2</span>s after taking the field.`,
      show: true,
      default: true,
      id: '3410220315',
    },
    {
      type: 'number',
      text: `Accumulated Healing`,
      title: `Accumulated Healing`,
      content: `When the equipping character heals a party member, the Yearning effect will be created for <span class="text-desc">6</span>s, which records the total amount of healing provided (including overflow healing). When the duration expires, the Yearning effect will be transformed into the "Waves of Days Past" effect: When your active party member hits an opponent with a Normal Attack, Charged Attack, Plunging Attack, Elemental Skill, or Elemental Burst, the DMG dealt will be increased by <span class="text-desc">8%</span> of the total healing amount recorded by the Yearning effect. The "Waves of Days Past" effect is removed after it has taken effect <span class="text-desc">5</span> times or after <span class="text-desc">10</span>s. A single instance of the Yearning effect can record up to <span class="text-desc">15,000</span> healing, and only a single instance can exist at once, but it can record the healing from multiple equipping characters. Equipping characters on standby can still trigger this effect.`,
      show: true,
      default: 0,
      min: 0,
      max: 15000,
      id: '2803305851',
    },
    {
      type: 'toggle',
      text: `Nighttime Whispers in the Echoing Woods`,
      title: `Nighttime Whispers in the Echoing Woods`,
      content: `After using an Elemental Skill, gain a <span class="text-desc">20%</span> <b class="text-genshin-geo">Geo DMG Bonus</b> for <span class="text-desc">10</span>s. While under a shield granted by the Crystallize reaction, the above effect will be increased by <span class="text-desc">150%</span>, and this additional increase disappears 1s after that shield is lost.`,
      show: true,
      default: true,
      id: '279470883',
    },
    {
      type: 'toggle',
      text: `Shielded By Crystallize`,
      title: `Shielded By Crystallize`,
      content: `After using an Elemental Skill, gain a <span class="text-desc">20%</span> <b class="text-genshin-geo">Geo DMG Bonus</b> for <span class="text-desc">10</span>s. While under a shield granted by the Crystallize reaction, the above effect will be increased by <span class="text-desc">150%</span>, and this additional increase disappears 1s after that shield is lost.`,
      show: true,
      default: true,
      id: '279470883_2',
    },
    {
      type: 'number',
      text: `Fragment of Harmonic Whimsy`,
      title: `Fragment of Harmonic Whimsy`,
      content: `When the value of a <b class="text-genshin-bol">Bond of Life</b> increases or decreases, this character deals <span class="text-desc">18%</span> increased DMG for <span class="text-desc">6</span>s. Max <span class="text-desc">3</span> stacks.`,
      show: true,
      default: 0,
      min: 0,
      max: 3,
      id: '1492570003',
    },
    {
      type: 'number',
      text: `Unfinished Reverie`,
      title: `Unfinished Reverie`,
      content: `After leaving combat for <span class="text-desc">3</span>s, DMG dealt increased by <span class="text-desc">50%</span>. In combat, if no Burning opponents are nearby for more than <span class="text-desc">6</span>s, this DMG Bonus will decrease by <span class="text-desc">10%</span> per second until it reaches <span class="text-desc">0%</span>. When a Burning opponent exists, it will increase by <span class="text-desc">10%</span> instead until it reaches <span class="text-desc">50%</span>. This effect still triggers if the equipping character is off-field.`,
      show: true,
      default: 5,
      min: 0,
      max: 5,
      id: '352459163',
    },
    {
      type: 'element',
      text: `Tiny Miracle`,
      title: `Tiny Miracle`,
      content: `Incoming <b>Elemental DMG</b> increases corresponding <b>Elemental RES</b> by <span class="text-desc">30%</span> for 10s. Can only occur once every <span class="text-desc">10</span>s.`,
      show: true,
      default: Element.PYRO,
      options: _.map(Element, (item) => ({ name: item, value: item })),
      id: '1383639611',
    },
    {
      type: 'toggle',
      text: `Current HP < 70%`,
      title: `Current HP < 70%`,
      content: `When HP is below <span class="text-desc">70%</span>, CRIT Rate increases by an additional <span class="text-desc">24%</span>.`,
      show: true,
      default: true,
      id: '855894507',
    },
    {
      type: 'toggle',
      text: `Instructor`,
      title: `Instructor`,
      content: `Upon triggering an Elemental Reaction, increases all party members' Elemental Mastery by <span class="text-desc">120</span> for <span class="text-desc">8</span>s.`,
      show: true,
      default: true,
      id: '3890292467',
    },
    {
      type: 'toggle',
      text: `Target Current HP > 50%`,
      title: `Target Current HP > 50%`,
      content: `Increases DMG by <span class="text-desc">30%</span> against opponents with more than <span class="text-desc">50%</span> HP.`,
      show: true,
      default: true,
      id: '3535784755',
    },
    {
      type: 'toggle',
      text: `Martial Artist`,
      title: `Martial Artist`,
      content: `After using Elemental Skill, increases Normal Attack and Charged Attack DMG by <span class="text-desc">25%</span> for <span class="text-desc">8</span>s.`,
      show: true,
      default: true,
      id: '2890909531',
    },
    {
      type: 'toggle',
      text: `Nightsoul Point Consumed`,
      title: `Nightsoul Point Consumed`,
      content: `After the equipping character consumes <span class="text-desc">1</span> <b>Nightsoul</b> point while on the field, CRIT Rate increases by <span class="text-desc">40%</span> for <span class="text-desc">6</span>s. This effect can trigger once every second.`,
      show: true,
      default: true,
      id: '1774579403_2',
    },
    {
      type: 'multiple',
      text: `Cinder City Reaction Bonus`,
      title: `Cinder City Reaction Bonus`,
      content: `After the equipping character triggers a reaction related to their <b>Elemental Type</b>, all nearby party members gain a <span class="text-desc">12%</span> <b>Elemental DMG Bonus</b> for the <b>Elemental Types</b> involved in the elemental reaction for <span class="text-desc">15</span>s.`,
      show: true,
      default: [],
      options: _.map(
        _.filter(Element, (item) => item !== Element.PHYSICAL),
        (item) => ({ name: item, value: item })
      ),
      id: '2949388203',
    },
    {
      type: 'toggle',
      text: `Cinder City's Nightsoul Bonus`,
      title: `Cinder City's Nightsoul Bonus`,
      content: `If the equipping character is in the <b>Nightsoul's Blessing</b> state when triggering this effect, all nearby party members gain an additional <span class="text-desc">28%</span> <b>Elemental DMG Bonus</b> for the <b>Elemental Types</b> involved in the elemental reaction for <span class="text-desc">20</span>s.`,
      show: true,
      default: true,
      id: '2949388203_2',
    },
  ]

  const teamContent: IContent[] = [
    findContentById(content, '1751039235'),
    findContentById(content, '83115355'),
    findContentById(content, '1562601179'),
    findContentById(content, '2040573235'),
    findContentById(content, '1337666507'),
    findContentById(content, '1756609915'),
    findContentById(content, '1675079283'),
    findContentById(content, '2803305851'),
    findContentById(content, '3890292467'),
    findContentById(content, '2949388203'),
    findContentById(content, '2949388203_2'),
  ]

  const halfContent: IContent[] = [
    {
      type: 'toggle',
      text: `Nightsoul's Blessing`,
      title: `Nightsoul's Blessing`,
      content: `While the equipping character is in <b>Nightsoul's Blessing</b> and is on the field, their DMG dealt is increased by <span class="text-desc">15%</span>.`,
      show: true,
      default: true,
      id: '1774579403',
    },
  ]

  return { content, teamContent, halfContent }
}
