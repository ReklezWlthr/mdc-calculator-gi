import { EnkaArtifactTypeMap, EnkaStatsMap, IArtifactEquip, ITeamChar, PropMap, Stats } from '@src/domain/constant'
import _ from 'lodash'

export const toPercentage = (value: number, precision: number = 1, round?: boolean) => {
  return (
    (round
      ? _.round(value * 100, precision)
      : _.floor(_.round(value * 100, precision + 1), precision)
    ).toLocaleString() + '%'
  )
}

export const toLocalStructure = (rawData: Record<string, any>) => {
  if (!rawData) return null
  const displayChars = rawData.avatarInfoList
  const charData: ITeamChar[] = _.map<any, ITeamChar>(displayChars, (item) => {
    const weapon = _.find(item.equipList, 'weapon')
    const weaponId = weapon?.itemId?.toString()
    const talents = _.map<number>(item.skillLevelMap)
    const artifacts = _.map(_.filter(item.equipList, 'reliquary'), (a) => (a ? crypto.randomUUID() : null))
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
        artifacts,
      },
      talents: {
        normal: talents[0],
        skill: talents[1],
        burst: talents[2],
      },
    }
  })
  const artifactData: IArtifactEquip[] = _.flatMap<any, IArtifactEquip>(displayChars, (item, i: number) =>
    _.map<any, IArtifactEquip>(_.filter(item.equipList, 'reliquary'), (artifact, aI) => {
      return {
        id: charData[i]?.equipments?.artifacts?.[aI],
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
