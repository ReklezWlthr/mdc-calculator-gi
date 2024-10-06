import { IArtifact, Stats, WeaponType } from '@src/domain/constant'
import _ from 'lodash'

export const ArtifactSets: IArtifact[] = [
  {
    id: '1212345779',
    name: "Gladiator's Finale",
    icon: 'UI_RelicIcon_15001',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    add: (base, weapon) => {
      if (_.includes([WeaponType.CLAYMORE, WeaponType.SWORD, WeaponType.POLEARM], weapon))
        base.BASIC_DMG.push({ value: 0.35, name: '', source: `` })
      return base
    },
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>.`,
      `If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.`,
    ],
  },
  {
    id: '147298547',
    name: "Wanderer's Troupe",
    icon: 'UI_RelicIcon_15003',
    rarity: [4, 5],
    bonus: [{ stat: Stats.EM, value: 80 }],
    add: (base, weapon) => {
      if (_.includes([WeaponType.CATALYST, WeaponType.BOW], weapon))
        base.CHARGE_DMG.push({ value: 0.35, name: '', source: `` })
      return base
    },
    desc: [
      `Increases Elemental Mastery by <span class="text-desc">80</span>.`,
      `Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.`,
    ],
  },
  {
    id: '1751039235',
    name: 'Noblesse Oblige',
    icon: 'UI_RelicIcon_15007',
    rarity: [4, 5],
    bonus: [],
    half: (base) => {
      base.BURST_DMG.push({ value: 0.6, name: '', source: `` })
      return base
    },
    desc: [
      `Elemental Burst DMG <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `Using an Elemental Burst increases all party members' ATK by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s. This effect cannot stack.`,
    ],
  },
  {
    id: '1541919827',
    name: 'Bloodstained Chivalry',
    icon: 'UI_RelicIcon_15008',
    rarity: [4, 5],
    bonus: [{ stat: Stats.PHYSICAL_DMG, value: 0.25 }],
    desc: [
      `<b>Physical DMG Bonus</b> +<span class="text-desc">25%</span>`,
      `After defeating an opponent, increases Charged Attack DMG by <span class="text-desc">50%</span>, and reduces its Stamina cost to 0 for <span class="text-desc">10</span>s. Also triggers with wild animals such as boars, squirrels and frogs.`,
    ],
  },
  {
    id: '83115355',
    name: 'Maiden Beloved',
    icon: 'UI_RelicIcon_14004',
    rarity: [4, 5],
    bonus: [{ stat: Stats.HEAL, value: 0.15 }],
    desc: [
      `Character Healing Effectiveness <span class="text-desc">+15%</span>`,
      `Using an Elemental Skill or Burst increases healing received by all party members by <span class="text-desc">20%</span> for <span class="text-desc">10</span>s.`,
    ],
  },
  {
    id: '1562601179',
    name: 'Viridescent Venerer',
    icon: 'UI_RelicIcon_15002',
    rarity: [4, 5],
    bonus: [{ stat: Stats.ANEMO_DMG, value: 0.15 }],
    add: (base) => {
      base.SWIRL_DMG.push({ value: 0.6, name: '', source: `` })
      return base
    },
    desc: [
      `<b class="text-genshin-anemo">Anemo DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `Increases Swirl DMG by 60%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for <span class="text-desc">10</span>s.`,
    ],
  },
  {
    id: '2040573235',
    name: 'Archaic Petra',
    icon: 'UI_RelicIcon_15014',
    rarity: [4, 5],
    bonus: [{ stat: Stats.GEO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-geo">Geo DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain 35% <b>DMG Bonus</b> for that particular element for <span class="text-desc">10</span>s. Only one form of <b>Elemental DMG Bonus</b> can be gained in this manner at any one time.`,
    ],
  },
  {
    id: '1438974835',
    name: 'Retracing Bolide',
    icon: 'UI_RelicIcon_15015',
    rarity: [4, 5],
    bonus: [{ stat: Stats.SHIELD, value: 0.35 }],
    desc: [
      `Increases Shield Strength by 35%.`,
      `While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.`,
    ],
  },
  {
    id: '1873342283',
    name: 'Thundersoother',
    icon: 'UI_RelicIcon_14002',
    rarity: [4, 5],
    bonus: [],
    desc: [
      `<b class="text-genshin-electro">Electro RES</b> increased by 40%.`,
      `Increases DMG against opponents affected by <b class="text-genshin-electro">Electro</b> by 35%.`,
    ],
  },
  {
    id: '2512309395',
    name: 'Thundering Fury',
    icon: 'UI_RelicIcon_15005',
    rarity: [4, 5],
    bonus: [{ stat: Stats.ELECTRO_DMG, value: 0.15 }],
    add: (base) => {
      base.OVERLOAD_DMG.push({ value: 0.4, name: '', source: `` })
      base.TASER_DMG.push({ value: 0.4, name: '', source: `` })
      base.SUPERCONDUCT_DMG.push({ value: 0.4, name: '', source: `` })
      base.HYPERBLOOM_DMG.push({ value: 0.4, name: '', source: `` })
      base.AGGRAVATE_DMG.push({ value: 0.2, name: '', source: `` })
      return base
    },
    desc: [
      `<b class="text-genshin-electro">Electro DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `Increases DMG caused by Overloaded, Electro-Charged, Superconduct, and Hyperbloom by 40%, and the DMG Bonus conferred by Aggravate is increased by <span class="text-desc">20%</span>. When Quicken or the aforementioned Elemental Reactions are triggered, Elemental Skill CD is decreased by <span class="text-desc">1</span>s. Can only occur once every 0.<span class="text-desc">8</span>s.`,
    ],
  },
  {
    id: '1632377563',
    name: 'Lavawalker',
    icon: 'UI_RelicIcon_14003',
    rarity: [4, 5],
    bonus: [],
    desc: [
      `<b class="text-genshin-pyro">Pyro RES</b> increased by 40%.`,
      `Increases DMG against opponents affected by <b class="text-genshin-pyro">Pyro</b> by 35%.`,
    ],
  },
  {
    id: '1524173875',
    name: 'Crimson Witch of Flames',
    icon: 'UI_RelicIcon_15006',
    rarity: [4, 5],
    bonus: [{ stat: Stats.PYRO_DMG, value: 0.15 }],
    add: (base) => {
      base.OVERLOAD_DMG.push({ value: 0.4, name: '', source: `` })
      base.BURNING_DMG.push({ value: 0.4, name: '', source: `` })
      base.BURGEON_DMG.push({ value: 0.4, name: '', source: `` })
      base.VAPE_DMG.push({ value: 0.15, name: '', source: `` })
      base.MELT_DMG.push({ value: 0.15, name: '', source: `` })
      return base
    },
    desc: [
      `<b class="text-genshin-pyro">Pyro DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `Increases Overloaded and Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by <span class="text-desc">50%</span> of its starting value for <span class="text-desc">10</span>s. Max 3 stacks.`,
    ],
  },
  {
    id: '933076627',
    name: 'Blizzard Strayer',
    icon: 'UI_RelicIcon_14001',
    rarity: [4, 5],
    bonus: [{ stat: Stats.CRYO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-cryo">Cryo DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `When a character attacks an opponent affected by <b class="text-genshin-cryo">Cryo</b>, their CRIT Rate is increased by <span class="text-desc">20%</span>. If the opponent is <b class="text-genshin-cryo">Frozen</b>, CRIT Rate is increased by an additional <span class="text-desc">20%</span>.`,
    ],
  },
  {
    id: '156294403',
    name: 'Heart of Depth',
    icon: 'UI_RelicIcon_15016',
    rarity: [4, 5],
    bonus: [{ stat: Stats.HYDRO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-hydro">Hydro DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `After using an Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for <span class="text-desc">15</span>s.`,
    ],
  },
  {
    id: '1337666507',
    name: 'Tenacity of the Millelith',
    icon: 'UI_RelicIcon_15017',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_HP, value: 0.2 }],
    desc: [
      `HP <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by <span class="text-desc">20%</span> and their Shield Strength is increased by 30% for <span class="text-desc">3</span>s. This effect can be triggered once every 0.<span class="text-desc">5</span>s. This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    ],
  },
  {
    id: '862591315',
    name: 'Pale Flame',
    icon: 'UI_RelicIcon_15018',
    rarity: [4, 5],
    bonus: [{ stat: Stats.PHYSICAL_DMG, value: 0.25 }],
    desc: [
      `<b>Physical DMG Bonus</b> +<span class="text-desc">25%</span>`,
      `When an Elemental Skill hits an opponent, ATK is increased by 9% for <span class="text-desc">7</span>s. This effect stacks up to 2 times and can be triggered once every 0.<span class="text-desc">3</span>s. Once 2 stacks are reached, the 2-set effect is increased by 100%.`,
    ],
  },
  {
    id: '4144069251',
    name: "Shimenawa's Reminiscence",
    icon: 'UI_RelicIcon_15019',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>`,
      `When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by <span class="text-desc">50%</span> for <span class="text-desc">10</span>s. This effect will not trigger again during that duration.`,
    ],
  },
  {
    id: '2276480763',
    name: 'Emblem of Severed Fate',
    icon: 'UI_RelicIcon_15020',
    rarity: [4, 5],
    bonus: [{ stat: Stats.ER, value: 0.2 }],
    desc: [
      `Energy Recharge <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `Increases Elemental Burst DMG by <span class="text-desc">25%</span> of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.`,
    ],
  },
  {
    id: '2546254811',
    name: 'Husk of Opulent Dreams',
    icon: 'UI_RelicIcon_15021',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_DEF, value: 0.3 }],
    desc: [
      `DEF +30%`,
      `A character equipped with this Artifact set will obtain the Curiosity effect in the following conditions:
    <br />When on the field, the character gains 1 stack after hitting an opponent with a <b class="text-genshin-geo">Geo</b> attack, triggering a maximum of once every 0.<span class="text-desc">3</span>s.
    <br />When off the field, the character gains 1 stack every <span class="text-desc">3</span>s.
    <br />Curiosity can stack up to 4 times, each providing 6% DEF and a 6% Geo DMG Bonus.
    <br />When 6 seconds pass without gaining a Curiosity stack, 1 stack is lost.`,
    ],
  },
  {
    id: '1756609915',
    name: 'Ocean-Hued Clam',
    icon: 'UI_RelicIcon_15022',
    rarity: [4, 5],
    bonus: [{ stat: Stats.HEAL, value: 0.15 }],
    desc: [
      `Healing Bonus <span class="text-desc">+15%</span>.`,
      `When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear for 3 seconds, accumulating the amount of HP recovered from healing (including overflow healing).
      <br />At the end of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on 90% of the accumulated healing.
      <br />(This DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses).
      <br />Only one Sea-Dyed Foam can be produced every 3.5 seconds.
      <br />Each Sea-Dyed Foam can accumulate up to 30,000 HP (including overflow healing).
      <br />There can be no more than one Sea-Dyed Foam active at any given time.
      <br />This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    ],
  },
  {
    id: '1558036915',
    name: 'Vermillion Hereafter',
    icon: 'UI_RelicIcon_15023',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>.`,
      `After using an Elemental Burst, this character will gain the Nascent Light effect, increasing their ATK by 8% for <span class="text-desc">16</span>s. When the character's HP decreases, their ATK will further increase by 10%. This increase can occur this way maximum of 4 times. This effect can be triggered once every 0.<span class="text-desc">8</span>s. Nascent Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the duration of Nascent Light, the original Nascent Light will be dispelled.`,
    ],
  },
  {
    id: '3626268211',
    name: 'Echoes of an Offering',
    icon: 'UI_RelicIcon_15024',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>.`,
      `When Normal Attacks hit opponents, there is a 36% chance that it will trigger Valley Rite, which will increase Normal Attack DMG by 70% of ATK.
      <br />This effect will be dispelled 0.<span class="text-desc">05</span>s after a Normal Attack deals DMG.
      <br />If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by <span class="text-desc">20%</span>.
      <br />This trigger can occur once every 0.<span class="text-desc">2</span>s.`,
    ],
  },
  {
    id: '1675079283',
    name: 'Deepwood Memories',
    icon: 'UI_RelicIcon_15025',
    rarity: [4, 5],
    bonus: [{ stat: Stats.DENDRO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-dendro">Dendro DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `After Elemental Skills or Bursts hit opponents, the targets' <b class="text-genshin-dendro">Dendro RES</b> will be decreased by 30% for <span class="text-desc">8</span>s. This effect can be triggered even if the equipping character is not on the field.`,
    ],
  },
  {
    id: '4145306051',
    name: 'Gilded Dreams',
    icon: 'UI_RelicIcon_15026',
    rarity: [4, 5],
    bonus: [{ stat: Stats.EM, value: 80 }],
    desc: [
      `Increases Elemental Mastery by <span class="text-desc">80</span>.`,
      `Within <span class="text-desc">8</span>s of triggering an Elemental Reaction, the character equipping this will obtain buffs based on the Elemental Type of the other party members. ATK is increased by 14% for each party member whose Elemental Type is the same as the equipping character, and Elemental Mastery is increased by 50 for every party member with a different Elemental Type. Each of the aforementioned buffs will count up to 3 characters. This effect can be triggered once every <span class="text-desc">8</span>s. The character who equips this can still trigger its effects when not on the field.`,
    ],
  },
  {
    id: '2538235187',
    name: 'Desert Pavilion Chronicle',
    icon: 'UI_RelicIcon_15027',
    rarity: [4, 5],
    bonus: [{ stat: Stats.ANEMO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-anemo">Anemo DMG Bonus</b> <span class="text-desc">+15%</span>.`,
      `When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by 10% while Normal, Charged, and Plunging Attack DMG will increase by 40% for <span class="text-desc">15</span>s.`,
    ],
  },
  {
    id: '3094139291',
    name: 'Flower of Paradise Lost',
    icon: 'UI_RelicIcon_15028',
    rarity: [4, 5],
    bonus: [{ stat: Stats.EM, value: 80 }],
    add: (base) => {
      base.BLOOM_DMG.push({ value: 0.4, name: '', source: `` })
      base.HYPERBLOOM_DMG.push({ value: 0.4, name: '', source: `` })
      base.BURGEON_DMG.push({ value: 0.4, name: '', source: `` })
      return base
    },
    desc: [
      `Increases Elemental Mastery by <span class="text-desc">80</span>.`,
      `The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by 40%. Additionally, after the equipping character triggers Bloom, Hyperbloom, or Burgeon, they will gain another <span class="text-desc">25%</span> bonus to the effect mentioned prior. Each stack of this lasts <span class="text-desc">10</span>s. Max 4 stacks simultaneously. This effect can only be triggered once per second. The character who equips this can still trigger its effects when not on the field.`,
    ],
  },
  {
    id: '1925210475',
    name: "Nymph's Dream",
    icon: 'UI_RelicIcon_15029',
    rarity: [4, 5],
    bonus: [{ stat: Stats.HYDRO_DMG, value: 0.15 }],
    desc: [
      `<b class="text-genshin-hydro">Hydro DMG Bonus</b> <span class="text-desc">+15%</span>`,
      `After Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts hit opponents, 1 stack of Mirrored Nymph will triggered, lasting <span class="text-desc">8</span>s. When under the effect of 1, 2, or 3 or more Mirrored Nymph stacks, ATK will be increased by 7%/16%/<span class="text-desc">25%</span>, and <b class="text-genshin-hydro">Hydro DMG</b> will be increased by 4%/9%/15%. Mirrored Nymph created by Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts exist independently.`,
    ],
  },
  {
    id: '235897163',
    name: "Vourukasha's Glow",
    icon: 'UI_RelicIcon_15030',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_HP, value: 0.2 }],
    add: (base) => {
      base.SKILL_DMG.push({ value: 0.1, name: '', source: `` })
      base.BURST_DMG.push({ value: 0.1, name: '', source: `` })
      return base
    },
    desc: [
      `HP <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `Elemental Skill and Elemental Burst DMG will be increased by 10%. After the equipping character takes DMG, the aforementioned DMG Bonus is increased by 80% for <span class="text-desc">5</span>s. This effect increase can have 5 stacks. The duration of each stack is counted independently. These effects can be triggered even when the equipping character is not on the field.`,
    ],
  },
  {
    id: '1249831867',
    name: 'Marechaussee Hunter',
    icon: 'UI_RelicIcon_15031',
    rarity: [4, 5],
    bonus: [],
    half: (base) => {
      base.BASIC_DMG.push({ value: 0.15, name: '', source: `` })
      base.CHARGE_DMG.push({ value: 0.15, name: '', source: `` })
      return base
    },
    desc: [
      `Normal and Charged Attack DMG <span class="text-desc">+15%</span>.`,
      `When current HP increases or decreases, CRIT Rate will be increased by 12% for <span class="text-desc">5</span>s. Max 3 stacks.`,
    ],
  },
  {
    id: '3410220315',
    name: 'Golden Troupe',
    icon: 'UI_RelicIcon_15032',
    rarity: [4, 5],
    bonus: [],
    half: (base) => {
      base.SKILL_DMG.push({ value: 0.2, name: '', source: `` })
      return base
    },
    add: (base) => {
      base.SKILL_DMG.push({ value: 0.25, name: '', source: `` })
      return base
    },
    desc: [
      `Increases Elemental Skill DMG by <span class="text-desc">20%</span>.`,
      `Increases Elemental Skill DMG by <span class="text-desc">25%</span>.
      <br />Additionally, when not on the field, Elemental Skill DMG will be further increased by <span class="text-desc">25%</span>. This effect will be cleared <span class="text-desc">2</span>s after taking the field.`,
    ],
  },
  {
    id: '2803305851',
    name: 'Song of Days Past',
    icon: 'UI_RelicIcon_15033',
    rarity: [4, 5],
    bonus: [{ stat: Stats.HEAL, value: 0.15 }],
    desc: [
      `Healing Bonus <span class="text-desc">+15%</span>`,
      `When the equipping character heals a party member, the Yearning effect will be created for <span class="text-desc">6</span>s, which records the total amount of healing provided (including overflow healing). When the duration expires, the Yearning effect will be transformed into the "Waves of Days Past" effect: When your active party member hits an opponent with a Normal Attack, Charged Attack, Plunging Attack, Elemental Skill, or Elemental Burst, the DMG dealt will be increased by 8% of the total healing amount recorded by the Yearning effect. The "Waves of Days Past" effect is removed after it has taken effect 5 times or after <span class="text-desc">10</span>s. A single instance of the Yearning effect can record up to 15,000 healing, and only a single instance can exist at once, but it can record the healing from multiple equipping characters. Equipping characters on standby can still trigger this effect.`,
    ],
  },
  {
    id: '279470883',
    name: 'Nighttime Whispers in the Echoing Woods',
    icon: 'UI_RelicIcon_15034',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>`,
      `After using an Elemental Skill, gain a <span class="text-desc">20%</span> <b class="text-genshin-geo">Geo DMG Bonus</b> for <span class="text-desc">10</span>s. While under a shield granted by the Crystallize reaction, the above effect will be increased by 1<span class="text-desc">50%</span>, and this additional increase disappears <span class="text-desc">1</span>s after that shield is lost.`,
    ],
  },
  {
    id: '1492570003',
    name: 'Fragment of Harmonic Whimsy',
    icon: 'UI_RelicIcon_15035',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>`,
      `When the value of a <b class="text-genshin-bol">Bond of Life</b> increases or decreases, this character deals <span class="text-desc">18%</span> increased DMG for <span class="text-desc">6</span>s. Max 3 stacks.`,
    ],
  },
  {
    id: '352459163',
    name: 'Unfinished Reverie',
    icon: 'UI_RelicIcon_15036',
    rarity: [4, 5],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [
      `ATK <span class="text-desc">+<span class="text-desc">18%</span></span>`,
      `After leaving combat for <span class="text-desc">3</span>s, DMG dealt increased by <span class="text-desc">50%</span>. In combat, if no Burning opponents are nearby for more than <span class="text-desc">6</span>s, this DMG Bonus will decrease by 10% per second until it reaches 0%. When a Burning opponent exists, it will increase by 10% instead until it reaches <span class="text-desc">50%</span>. This effect still triggers if the equipping character is off-field.`,
    ],
  },
  {
    id: '2949388203',
    name: 'Scroll of the Hero of Cinder City',
    icon: 'UI_RelicIcon_15037',
    rarity: [4, 5],
    bonus: [],
    desc: [
      `When a nearby party member triggers a <b>Nightsoul Burst</b>, the equipping character regenerates <span class="text-desc">6</span> Elemental Energy.`,
      `After the equipping character triggers a reaction related to their <b>Elemental Type</b>, all nearby party members gain a <span class="text-desc">12%</span> <b>Elemental DMG Bonus</b> for the <b>Elemental Types</b> involved in the elemental reaction for <span class="text-desc">15</span>s. If the equipping character is in the <b>Nightsoul's Blessing</b> state when triggering this effect, all nearby party members gain an additional <span class="text-desc">28%</span> <b>Elemental DMG Bonus</b> for the <b>Elemental Types</b> involved in the elemental reaction for <span class="text-desc">20</span>s. The equipping character can trigger this effect while off-field, and the DMG bonus from Artifact Sets with the same name do not stack.`,
    ],
  },
  {
    id: '1774579403',
    name: 'Obsidian Codex',
    icon: 'UI_RelicIcon_15038',
    rarity: [4, 5],
    bonus: [],
    desc: [
      `While the equipping character is in <b>Nightsoul's Blessing</b> and is on the field, their DMG dealt is increased by <span class="text-desc">15%</span>.`,
      `After the equipping character consumes <span class="text-desc">1</span> <b>Nightsoul</b> point while on the field, CRIT Rate increases by <span class="text-desc">40%</span> for <span class="text-desc">6</span>s. This effect can trigger once every second.`,
    ],
  },
  {
    id: '2364208851',
    name: 'Resolution of Sojourner',
    icon: 'UI_RelicIcon_10001',
    rarity: [3, 4],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    add: (base) => {
      base.CHARGE_CR.push({ value: 0.3, name: '', source: `` })
      return base
    },
    desc: [`ATK <span class="text-desc">+<span class="text-desc">18%</span></span>.`, `Increases Charged Attack CRIT Rate by 30%.`],
  },
  {
    id: '1383639611',
    name: 'Tiny Miracle',
    icon: 'UI_RelicIcon_10004',
    rarity: [3, 4],
    bonus: [],
    desc: [
      `<b>All Elemental RES</b> increased by <span class="text-desc">20%</span>.`,
      `Incoming Elemental DMG increases corresponding <b>Elemental RES</b> by 30% for <span class="text-desc">10</span>s. Can only occur once every <span class="text-desc">10</span>s.`,
    ],
  },
  {
    id: '855894507',
    name: 'Berserker',
    icon: 'UI_RelicIcon_10005',
    rarity: [3, 4],
    bonus: [{ stat: Stats.CRIT_RATE, value: 0.12 }],
    desc: [`CRIT Rate +12%`, `When HP is below 70%, CRIT Rate increases by an additional 24%.`],
  },
  {
    id: '3890292467',
    name: 'Instructor',
    icon: 'UI_RelicIcon_10007',
    rarity: [3, 4],
    bonus: [{ stat: Stats.EM, value: 80 }],
    desc: [
      `Increases Elemental Mastery by <span class="text-desc">80</span>.`,
      `Upon triggering an Elemental Reaction, increases all party members' Elemental Mastery by 120 for <span class="text-desc">8</span>s.`,
    ],
  },
  {
    id: '2764598579',
    name: 'The Exile',
    icon: 'UI_RelicIcon_10009',
    rarity: [3, 4],
    bonus: [{ stat: Stats.ER, value: 0.2 }],
    desc: [
      `Energy Recharge <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every <span class="text-desc">2</span>s for <span class="text-desc">6</span>s. This effect cannot stack.`,
    ],
  },
  {
    id: '4082302819',
    name: "Defender's Will",
    icon: 'UI_RelicIcon_10003',
    rarity: [3, 4],
    bonus: [{ stat: Stats.P_DEF, value: 0.3 }],
    desc: [
      `DEF +30%`,
      `For each different element present in your own party, the wearer's <b>Elemental RES</b> to that corresponding element is increased by 30%.`,
    ],
  },
  {
    id: '3535784755',
    name: 'Brave Heart',
    icon: 'UI_RelicIcon_10002',
    rarity: [3, 4],
    bonus: [{ stat: Stats.P_ATK, value: 0.18 }],
    desc: [`ATK <span class="text-desc">+<span class="text-desc">18%</span></span>.`, `Increases DMG by 30% against opponents with more than <span class="text-desc">50%</span> HP.`],
  },
  {
    id: '2890909531',
    name: 'Martial Artist',
    icon: 'UI_RelicIcon_10006',
    rarity: [3, 4],
    bonus: [],
    desc: [
      `Normal and Charged Attack DMG <span class="text-desc">+15%</span>`,
      `After using Elemental Skill, increases Normal Attack and Charged Attack DMG by <span class="text-desc">25%</span> for <span class="text-desc">8</span>s.`,
    ],
  },
  {
    id: '1186209435',
    name: 'Gambler',
    icon: 'UI_RelicIcon_10008',
    rarity: [3, 4],
    bonus: [],
    desc: [
      `Increases Elemental Skill DMG by <span class="text-desc">20%</span>.`,
      `Defeating an opponent has a 100% chance to remove Elemental Skill CD. Can only occur once every <span class="text-desc">15</span>s.`,
    ],
  },
  {
    id: '3618167299',
    name: 'Scholar',
    icon: 'UI_RelicIcon_10012',
    rarity: [3, 4],
    bonus: [{ stat: Stats.ER, value: 0.2 }],
    desc: [
      `Energy Recharge <span class="text-desc">+<span class="text-desc">20%</span></span>`,
      `Gaining Elemental Particles or Orbs gives 3 Energy to all party members who have a bow or a catalyst equipped. Can only occur once every <span class="text-desc">3</span>s.`,
    ],
  },
]
