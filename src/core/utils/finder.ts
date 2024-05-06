import { Characters } from '@src/data/db/characters'
import { Weapons } from '@src/data/db/weapons'
import { ArtifactSets } from '@src/domain/genshin/artifact'
import _ from 'lodash'

export const findWeapon = (wId: string) => _.find(Weapons, (item) => item.id === wId)

export const findCharacter = (cId: string) => _.find(Characters, (item) => item.id === cId)

export const findArtifactSet = (id: string) => _.find(ArtifactSets, (item) => item.id === id)
