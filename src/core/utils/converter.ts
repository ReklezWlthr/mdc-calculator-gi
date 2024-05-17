import { ITeamChar, PropMap } from '@src/domain/genshin/constant'
import _ from 'lodash'

export const toPercentage = (value: number, precision: number = 1) => {
  return _.floor(value * 100, precision) + '%'
}

export const toLocalStructure = (rawData: Record<string, any>) => {
  if (!rawData) return null
  const displayChars = rawData.avatarInfoList
  const charData: ITeamChar[] = _.map(displayChars, (item) => ({
    level: item.propMap[PropMap.level],
    ascension: item.propMap[PropMap.ascension],
    cons: _.size(item.talentListId || []),
    cId: item.avatarId,
    equipments: null,
    talents: {
      normal: 1,
      skill: 1,
      burst: 1,
    },
  }))
}
