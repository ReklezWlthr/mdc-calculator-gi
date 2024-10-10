import { IEnemyGroup } from '@src/domain/conditional'
import { Element } from '@src/domain/constant'
import _ from 'lodash'

// RES are array of Physical, Pyro, Cryo, Hydro, Electro, Anemo, Geo, Dendro respectively

const ElementIndex = _.map(Element)

const mapElement = (arr: Element[]) =>
  _.map(
    _.filter(Element, (item) => _.includes(arr, item)),
    (item) => ({ name: item, value: item })
  )

const saurian = [
  { name: 'Iktomisaurus (Cryo)', value: Element.CRYO },
  { name: 'Koholasaurus (Hydro)', value: Element.HYDRO },
  { name: 'Qucusaurus (Pyro)', value: Element.PYRO },
  { name: 'Tepetlisaurus (Geo)', value: Element.GEO },
  { name: 'Yumkasaurus (Dendro)', value: Element.DENDRO },
]

export const EnemyGroups: IEnemyGroup[] = [
  {
    name: 'Common Preset (Hilichurl, Abyss Mage, Maguu Kenki, etc.)',
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Slime, Specter, Hypostasis',
    options: mapElement(_.filter(Element, (item) => item != Element.PHYSICAL)),
    res: (e) => {
      console.log(
        _.findIndex(ElementIndex, (item) => item === e),
        e
      )
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] = Infinity
      return base
    },
  },
  {
    name: 'Mitachurl, Ruin Cruiser, and Ruin Destroyer',
    options: [],
    res: () => [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Ruin Hunter, Ruin Defender, Ruin Scout',
    options: [],
    res: () => [0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Ruin Guard, Ruin Grader',
    options: [],
    res: () => [0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Normal Human (Treasure Hoarder, Nobushi, etc.)',
    options: [],
    res: () => [-0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Samachurl',
    options: mapElement(_.filter(Element, (item) => !_.includes([Element.PHYSICAL, Element.PYRO], item))),
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: 'Lawachurl',
    options: [
      { name: 'Frostarm (Cryo)', value: Element.CRYO },
      { name: 'Stonehide (Geo)', value: Element.GEO },
      { name: 'Thunderhelm (Electro)', value: Element.ELECTRO },
    ],
    res: (e) => {
      let base = [0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.6
      return base
    },
  },
  {
    name: 'Whopperflower',
    options: mapElement([Element.CRYO, Element.ELECTRO, Element.PYRO]),
    res: (e, stun) => {
      let base = [0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35]
      if (stun) base = _.map(base, (item) => (item -= 0.25))
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Fatui Skirmisher',
    options: [],
    res: (_e, _s, shield) => {
      let base = [-0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 1))
      return base
    },
    shield: 'Armored',
  },
  {
    name: 'Fatui Pyro Agent',
    options: [],
    res: () => [-0.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Fatui Cicin Mage',
    options: mapElement([Element.CRYO, Element.ELECTRO]),
    res: (e) => {
      let base = [-0.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: 'Geovishap Hatching',
    options: [],
    res: () => [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.1],
  },
  {
    name: 'Geovishap',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (e, _s, shield) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.1]
      if (shield) base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
    shield: 'Infused',
  },
  {
    name: 'Eye of the Storm',
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.1, Infinity, 0.1, 0.1],
  },
  {
    name: 'Cicin',
    options: mapElement([Element.CRYO, Element.ELECTRO, Element.HYDRO]),
    res: (e) => {
      let base = [-0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: 'Hydro Mimic',
    options: [
      { name: 'Boar/Squirrel', value: Element.PYRO },
      { name: 'Crane/Raptor', value: Element.ELECTRO },
      { name: 'Crab/Mallard', value: Element.CRYO },
      { name: 'Finch/Frog', value: Element.GEO },
    ],
    res: (e) => {
      let base = [0.15, 0.15, 0.15, Infinity, 0.15, 0.15, 0.15, 0.15]
      base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.55
      return base
    },
  },
  {
    name: 'Cryo Regisvine',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.3, 0.1, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 1))
      return base
    },
    shield: 'Shielded',
  },
  {
    name: 'Pyro Regisvine',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.3, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 1))
      return base
    },
    shield: 'Shielded',
  },
  {
    name: 'Electro Regisvine',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 3))
      return base
    },
    shield: 'Shielded',
  },
  {
    name: 'Primo Geovishap',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (e, stun, shield) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.1]
      if (shield) base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      if (stun) base = _.map(base, (item) => (item -= 0.5))
      return base
    },
    shield: 'Infused',
    stun: 'Countered',
  },
  {
    name: 'Andrius',
    options: [],
    res: () => [0.1, 0.1, Infinity, 0.1, 0.1, Infinity, 0.1, 0.1],
  },
  {
    name: 'Childe (Phase 1)',
    options: [],
    res: (e, stun) => {
      let base = [0, 0, 0, 0.5, 0, 0, 0, 0]
      if (stun) base = _.map(base, (item) => (item -= 0.3))
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Childe (Phase 2)',
    options: [],
    res: (e, stun) => {
      let base = [0, 0, 0, 0, 0.5, 0, 0, 0]
      if (stun) base = _.map(base, (item) => (item -= 0.5))
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Childe (Phase 3)',
    options: [],
    res: () => [0, 0, 0, 0.7, 0.7, 0, 0, 0],
  },
  {
    name: 'Azhdaha',
    options: [
      { name: 'Pyro/Electro', value: `${Element.PYRO}_${Element.ELECTRO}` },
      { name: 'Pyro/Cryo', value: `${Element.PYRO}_${Element.CRYO}` },
      { name: 'Hydro/Electro', value: `${Element.HYDRO}_${Element.ELECTRO}` },
      { name: 'Hydro/Cryo', value: `${Element.HYDRO}_${Element.CRYO}` },
    ],
    res: (e, stun, shield) => {
      const [first, second] = e.split('_')
      let base = [0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.7, 0.1]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === first)] += 0.6
      if (shield) base[_.findIndex(ElementIndex, (item) => item === second)] += 0.5
      return base
    },
    stun: 'First Infusion',
    shield: 'Second Infusion',
  },
  {
    name: 'Perpetual Mechanical Array',
    options: [],
    res: (_e, stun) => {
      let base = [0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (stun) base = _.map(base, (item) => (item -= 0.5))
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Mirror Maiden',
    options: [],
    res: () => [-0.2, 0.1, 0.1, 0.5, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Thunder Manifestation',
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, Infinity, 0.1, 0.1, 0.1],
  },
  {
    name: 'La Signora (Phase 1)',
    options: [],
    res: () => [0.1, 0.1, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'La Signora (Phase 2)',
    options: [],
    res: () => [0.1, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Rifthound Whelp',
    options: mapElement([Element.ELECTRO, Element.GEO]),
    res: (e, stun) => {
      let base = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.3
      return base
    },
    stun: 'Elemental Devourer',
  },
  {
    name: 'Rifthound',
    options: mapElement([Element.ELECTRO, Element.GEO]),
    res: (e, stun) => {
      let base = [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.65
      return base
    },
    stun: 'Elemental Devourer',
  },
  {
    name: 'Golden Wolflord',
    options: [],
    res: (_e, stun) => {
      let base = [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === Element.GEO)] -= 0.45
      return base
    },
    stun: 'Elemental Devourer',
  },
  {
    name: 'Bathysmal Vishap Hatchling',
    options: [
      { name: 'Primordial', value: Element.HYDRO },
      { name: 'Bolteater', value: Element.ELECTRO },
      { name: 'Rimebiter', value: Element.CRYO },
    ],
    res: (e) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.1
      return base
    },
  },
  {
    name: 'Bathysmal Vishap',
    options: [
      { name: 'Primordial', value: Element.HYDRO },
      { name: 'Bolteater (Coral Defenders)', value: Element.ELECTRO },
      { name: 'Rimebiter (Coral Defenders)', value: Element.CRYO },
    ],
    res: (e) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Magatsu Mitake Narukami no Mikoto',
    options: [],
    res: (_e, stun, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (stun) base = _.map(base, (item) => (item -= 0.6))
      if (shield) base = _.map(base, (item) => (item += 2))
      return base
    },
    stun: 'Stunned',
    shield: 'Baleful Shadowlord',
  },
  {
    name: 'Shadowy Husk',
    options: [
      { name: 'Defender (Cryo)', value: Element.CRYO },
      { name: 'Linebreaker (Hydro)', value: Element.HYDRO },
      { name: 'Standard Bearer (Pyro)', value: Element.PYRO },
    ],
    res: (e) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Black Serpent Knight: Windcutter',
    options: [],
    res: () => [0.3, 0.1, 0.1, 0.1, 0.1, 0.5, 0.1, 0.1],
  },
  {
    name: 'Black Serpent Knight: Rockbreaker Ax',
    options: [],
    res: (_e, _stun, shield) => {
      let base = [0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.5))
      return base
    },
    shield: 'Rampage',
  },
  {
    name: 'Small Fungus',
    options: mapElement(_.filter(Element, (item) => item != Element.PHYSICAL)),
    res: (e) => {
      if (e === Element.DENDRO) return [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.25]
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.1
      return base
    },
  },
  {
    name: 'Large Fungus',
    options: mapElement(_.filter(Element, (item) => !_.includes([Element.PHYSICAL, Element.ELECTRO], item))),
    res: (e) => {
      if (e === Element.DENDRO) return [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.4]
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Ruin Serpent',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 3))
      return base
    },
    shield: 'Charging',
  },
  {
    name: 'Mid-Tier Eremites',
    options: [
      { name: 'Daythunder (Electro)', value: Element.ELECTRO },
      { name: 'Sunfrost (Electro)', value: Element.CRYO },
      { name: 'Desert Clearwater (Electro)', value: Element.HYDRO },
    ],
    res: (e, stun) => {
      let base = [-0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.6
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'High-Tier Eremites',
    options: [
      { name: 'Stone Enchanter (Geo)', value: Element.GEO },
      { name: 'Galehunter (Anemo)', value: Element.ANEMO },
      { name: 'Floral-Ring Dancer (Dendro)', value: Element.DENDRO },
      { name: 'Scorching Loremaster (Pyro)', value: Element.PYRO },
    ],
    res: (e, stun, shield) => {
      let base = [-0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.5))
      if (stun) base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.6
      return base
    },
    shield: 'Enhanced',
    stun: 'Stunned',
  },
  {
    name: 'Ruin Drake',
    options: mapElement(_.filter(Element, (item) => item !== Element.PHYSICAL)),
    res: (e, _s, shield) => {
      let base = [0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
    shield: 'Absorbed',
  },
  {
    name: 'Aeonblight Drake',
    options: mapElement(_.filter(Element, (item) => item !== Element.PHYSICAL)),
    res: (e, _s, shield) => {
      let base = [0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base[_.findIndex(ElementIndex, (item) => item === e)] += 0.6
      return base
    },
    shield: 'Absorbed',
  },
  {
    name: 'Jadeplume Terrorshroom',
    options: [],
    res: (e, stun) => {
      let base = [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.8]
      if (stun) base = _.map(base, (item) => (item -= 0.25))
      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Primal Construct',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.5))
      return base
    },
    shield: 'Invisible',
  },
  {
    name: 'ASIMON',
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 2))
      return base
    },
    shield: 'Invisible',
  },
  {
    name: 'Everlasting Lord of Arcane Wisdom (Phase 1)',
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.5, 0.1, 0.1, 0.1],
  },
  {
    name: 'Everlasting Lord of Arcane Wisdom (Phase 2)',
    options: [],
    res: (_e, stun, shield) => {
      let base = [0.3, 0.3, 0.3, 0.3, 0.9, 0.3, 0.3, 0.3]
      if (shield) base = _.map(base, (item) => (item += 2))
      if (stun) base = _.map(base, (item) => (item -= 1.7))
      return base
    },
    shield: 'Shielded',
    stun: 'Stunned',
  },
  {
    name: 'Consecrated Beast',
    options: [
      { name: 'Fanged Beast (Dendro)', value: Element.DENDRO },
      { name: 'Flying Serpent (Anemo)', value: Element.ANEMO },
      { name: 'Horned Crocodile (Hydro)', value: Element.HYDRO },
      { name: 'Red Vulture (Pyro)', value: Element.PYRO },
      { name: 'Scorpion (Electro)', value: Element.ELECTRO },
    ],
    res: (e, stun) => {
      let base = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
      if (!stun) base[_.findIndex(ElementIndex, (item) => item === e)] += 0.3
      if (stun) base = _.map(base, (item) => (item -= 0.3))

      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Setekh Wenut',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (e, stun) => {
      let base = [0.25, 0.25, 0.25, 0.25, 0.25, 0.6, 0.25, 0.25]
      if (stun) base[_.findIndex(ElementIndex, (item) => item === e)] -= 0.45

      return base
    },
    stun: 'Stunned',
  },
  {
    name: 'Hilichurl Rogue',
    options: mapElement([Element.ANEMO, Element.HYDRO]),
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: `Guardian of Apep's Oasis`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.7],
  },
  {
    name: `Tainted Hydro Phantasm`,
    options: [],
    res: () => [0.1, 0.1, 0.1, Infinity, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: 'Small Breacher Primus',
    options: [
      { name: 'Overgrown (Dendro)', value: Element.DENDRO },
      { name: 'Shatterstone (Geo)', value: Element.GEO },
    ],
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Large Breacher Primus',
    options: [
      { name: 'Overgrown (Dendro)', value: Element.DENDRO },
      { name: 'Shatterstone (Geo)', value: Element.GEO },
    ],
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: 'Emperor of Fire and Iron',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (e, _s, shield) => {
      let base = [0.1, 0.6, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.6))
      return base
    },
    shield: 'Shielded',
  },
  {
    name: 'Icewind Suite',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.7, 0.1, 0.1, 0.7, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.25))
      return base
    },
    shield: `Coppelia's Climax`,
  },
  {
    name: 'Fatui Operative',
    options: [
      { name: 'Frost Operative', value: Element.CRYO },
      { name: 'Wind Operative', value: Element.ANEMO },
    ],
    res: (e) => {
      let base = [-0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: 'Millennial Pearl Seahorse',
    options: mapElement([Element.PYRO, Element.HYDRO, Element.CRYO, Element.ELECTRO]),
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.6, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.6))
      return base
    },
    shield: `Shielded`,
  },
  {
    name: `Prototype Cal. Breguet`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.7, 0.1],
  },
  {
    name: `Cinease (Local Legend)`,
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.3, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.8))
      return base
    },
    shield: `Shielded`,
  },
  {
    name: `Hydro Tulpa`,
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, Infinity, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.45))
      return base
    },
    shield: `Rage`,
  },
  {
    name: `All-Devouring Narwhal`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: `All-Devouring Narwhal (Phantom)`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1],
  },
  {
    name: `Xuanwen Beast`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.5, 0.1, 0.5, 0.1, 0.1],
  },
  {
    name: `Solitary Suanni`,
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, 0.7, 0.1, 0.7, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 2))
      return base
    },
    shield: `Gathering Energy`,
  },
  {
    name: `Praetorian Golem`,
    options: [],
    res: (_e, _s, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.5))
      return base
    },
    shield: `Sheilded`,
  },
  {
    name: `"Statue of Marble and Brass"`,
    options: [],
    res: (_e, stun, shield) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      if (shield) base = _.map(base, (item) => (item += 0.6))
      if (stun) base = _.map(base, (item) => (item -= 0.8))
      return base
    },
    shield: `Shielded`,
    stun: `Paralyzed`,
  },
  {
    name: 'Saurian Whelp',
    options: [
      { name: 'Koholasaurus (Hydro)', value: Element.HYDRO },
      { name: 'Tepetlisaurus (Geo)', value: Element.GEO },
      { name: 'Yumkasaurus (Dendro)', value: Element.DENDRO },
    ],
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Saurian Whelp',
    options: saurian,
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.2
      return base
    },
  },
  {
    name: 'Saurian Adult',
    options: saurian,
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: `Holawaqa Ngoubou`,
    options: [],
    res: () => [0.1, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: `Kongamato`,
    options: [],
    res: () => [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.7],
  },
  {
    name: `Fluid Avatar of Lava`,
    options: [],
    res: () => [0.1, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    name: `Secret Source Automaton: Hunter-Seeker`,
    options: [],
    res: (_e, stun) => {
      let base = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
      if (stun) base = _.map(base, (item) => (item -= 0.4))
      return base
    },
    stun: `Weakened/Laser`,
  },
  {
    name: 'Wayob Manifestation',
    options: [
      { name: 'Biting-Cold (Cryo)', value: Element.CRYO },
      { name: 'Burning-Aflame (Pyro)', value: Element.PYRO },
      { name: 'Flow-Inverted (Hydro)', value: Element.HYDRO },
      { name: 'Follar-Swift (Dendro)', value: Element.DENDRO },
      { name: 'Rock-Cavernous (Geo)', value: Element.GEO },
    ],
    res: (e) => {
      let base = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
      base[_.findIndex(ElementIndex, (item) => item === e)] += 0.4
      return base
    },
  },
  {
    name: `Secret Source Automaton: Configuration Device`,
    options: [],
    res: (_e, stun) => {
      let base = [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6]
      if (stun) base = _.map(base, (item) => (item -= 0.9))
      return base
    },
    stun: `Weakened/Laser`,
  },
]
