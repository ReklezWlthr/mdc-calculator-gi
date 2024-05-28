import {
  EnkaArtifactTypeMap,
  EnkaStatsMap,
  IArtifactEquip,
  ITeamChar,
  PropMap,
  Stats,
} from '@src/domain/genshin/constant'
import _ from 'lodash'

export const toPercentage = (value: number, precision: number = 1) => {
  return _.floor(value * 100, precision) + '%'
}

export const toLocalStructure = (rawData: Record<string, any>) => {
  if (!rawData) return null
  const displayChars = rawData.avatarInfoList
  const charData: ITeamChar[] = _.map<any, ITeamChar>(displayChars, (item, i) => {
    const weapon = _.find(item.equipList, 'weapon')
    const weaponId = weapon?.itemId?.toString()
    const talents = _.map<number>(item.skillLevelMap)
    const artifacts = _.filter(item.equipList, 'reliquary')
    return {
      level: parseInt(item.propMap[PropMap.level].val),
      ascension: parseInt(item.propMap[PropMap.ascension].val),
      cons: _.size(item.talentIdList || []),
      cId: item.avatarId.toString(),
      equipments: {
        weapon: {
          wId: weaponId,
          refinement: parseInt(weapon?.weapon?.affixMap?.['1' + weaponId]) + 1,
          ascension: parseInt(weapon?.weapon?.promoteLevel) || 0,
          level: parseInt(weapon?.weapon?.level),
        },
        artifacts: _.map(artifacts, (item) => `${item.itemId}_${i}`),
      },
      talents: {
        normal: talents[0],
        skill: talents[1],
        burst: talents[2],
      },
    }
  })
  const artifactData: IArtifactEquip[] = _.flatMap<any, IArtifactEquip>(displayChars, (item, i) =>
    _.map<any, IArtifactEquip>(_.filter(item.equipList, 'reliquary'), (artifact) => {
      return {
        id: `${artifact.itemId}_${i}`,
        setId: artifact.flat.setNameTextMapHash,
        level: artifact.reliquary.level - 1,
        type: EnkaArtifactTypeMap[artifact.flat.equipType],
        main: EnkaStatsMap[artifact.flat.reliquaryMainstat.mainPropId],
        quality: artifact.flat.rankLevel,
        subList: _.map(artifact.flat.reliquarySubstats, (sub) => ({
          stat: EnkaStatsMap[sub.appendPropId],
          value: sub.statValue,
        })),
      }
    })
  )
  return { charData, artifactData }
}
