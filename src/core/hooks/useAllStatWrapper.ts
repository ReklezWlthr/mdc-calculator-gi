import { ITeamChar } from "@src/domain/genshin/constant"
import { useStat } from "./useStat"
import { StatsObject } from "@src/data/lib/stats/baseConstant"

export const useAllStatWrapper = (chars: ITeamChar[], stats: StatsObject[]) => {
  const stat1 = useStat(
    chars?.[0]?.cId,
    chars?.[0]?.level,
    chars?.[0]?.ascension,
    chars?.[0]?.equipments?.weapon?.wId,
    chars?.[0]?.equipments?.weapon?.level,
    chars?.[0]?.equipments?.weapon?.ascension,
    chars?.[0]?.equipments?.artifacts,
    stats?.[0]
  )

  const stat2 = useStat(
    chars?.[1]?.cId,
    chars?.[1]?.level,
    chars?.[1]?.ascension,
    chars?.[1]?.equipments?.weapon?.wId,
    chars?.[1]?.equipments?.weapon?.level,
    chars?.[1]?.equipments?.weapon?.ascension,
    chars?.[1]?.equipments?.artifacts,
    stats?.[1]
  )

  const stat3 = useStat(
    chars?.[2]?.cId,
    chars?.[2]?.level,
    chars?.[2]?.ascension,
    chars?.[2]?.equipments?.weapon?.wId,
    chars?.[2]?.equipments?.weapon?.level,
    chars?.[2]?.equipments?.weapon?.ascension,
    chars?.[2]?.equipments?.artifacts,
    stats?.[2]
  )

  const stat4 = useStat(
    chars?.[3]?.cId,
    chars?.[3]?.level,
    chars?.[3]?.ascension,
    chars?.[3]?.equipments?.weapon?.wId,
    chars?.[3]?.equipments?.weapon?.level,
    chars?.[3]?.equipments?.weapon?.ascension,
    chars?.[3]?.equipments?.artifacts,
    stats?.[3]
  )

  return [stat1, stat2, stat3, stat4]
}