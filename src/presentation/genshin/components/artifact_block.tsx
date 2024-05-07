import { useStore } from '@src/data/providers/app_store_provider'
import { ArtifactPiece, Stats } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { ArtifactModal } from './artifact_modal'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { getMainStat, getRolls } from '@src/core/utils/data_format'
import { toPercentage } from '@src/core/utils/converter'
import { StatIcons } from '../../../domain/genshin/constant'
import { findArtifactSet, findCharacter } from '@src/core/utils/finder'
import classNames from 'classnames'

interface ArtifactBlockProps {
  index?: number
  piece: number
  aId: string
  showWearer?: boolean
  canEdit?: boolean
}

export const ArtifactBlock = observer(({ canEdit = true, ...props }: ArtifactBlockProps) => {
  const pieceName = ArtifactPiece[props.piece]

  const { modalStore, teamStore, artifactStore } = useStore()
  const artifact = _.find(artifactStore.artifacts, ['id', props.aId])
  const setData = findArtifactSet(artifact?.setId)

  const mainStat = getMainStat(artifact?.main, artifact?.quality, artifact?.level)

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal type={props.piece} index={props.index} aId={props.aId} />)
  }, [modalStore, props.index, props.aId])

  const subListWithRolls = useMemo(() => {
    const rolls = _.map(artifact?.subList, (item) => getRolls(item.stat, item.value))
    const sum = _.sum(rolls)
    if (sum > 9) {
      const max = _.max(rolls)
      const index = _.findIndex(rolls, (item) => item === max)
      rolls[index] -= 1
    }
    return _.map(artifact?.subList, (item, index) => ({ ...item, roll: rolls[index] }))
  }, [artifact])

  const wearer = _.find(teamStore.characters, (item) => _.includes(item.equipments.artifacts, props.aId))
  const charData = findCharacter(wearer?.cId)

  return (
    <div
      className={classNames(
        'flex flex-col w-full font-bold text-white duration-200 rounded-lg bg-primary-dark h-[300px]',
        {
          'hover:scale-[97%] cursor-pointer': canEdit,
        }
      )}
      onClick={() => canEdit && onOpenModal()}
    >
      <div className="flex items-center justify-center gap-1 px-5 py-2 rounded-t-lg bg-primary-light">
        <img src={`/icons/${_.snakeCase(pieceName)}.png`} className="w-5 h-5" />
        <p>{pieceName}</p>
      </div>
      {props.aId ? (
        <div className="p-3 space-y-3">
          <div className="flex gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <img src={`https://enka.network/ui/${setData?.icon}_${artifact?.type}.png`} className="w-full h-full" />
              <div className="absolute flex items-center justify-center px-1.5 py-0.5 text-xs bg-opacity-75 rounded-full -bottom-0 -right-2 bg-primary-light">
                +{artifact?.level}
              </div>
              {charData?.codeName && props.showWearer && (
                <div className="absolute flex items-center justify-center p-1 text-xs bg-opacity-75 rounded-full -top-1 w-7 h-7 -right-3 bg-primary-light">
                  <img
                    src={`https://enka.network/ui/UI_AvatarIcon_Side_${charData?.codeName}.png`}
                    className="absolute scale-125 bottom-1.5"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center w-full gap-1">
              <RarityGauge rarity={artifact?.quality} textSize="text-sm" />
              <p className="text-xs text-center">{setData?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <img className="w-4 h-4" src={`/icons/${StatIcons[artifact?.main]}`} />
              {artifact?.main}
            </div>
            <hr className="w-full border border-primary-border" />
            <p className="font-normal text-gray">
              {_.includes([Stats.HP, Stats.ATK, Stats.EM], artifact?.main)
                ? _.round(mainStat).toLocaleString()
                : toPercentage(mainStat)}
            </p>
          </div>
          <p className="flex items-center justify-center text-xs text-primary-lighter">✦✦✦✦✦</p>
          {_.map(subListWithRolls, (item) => (
            <div className="flex items-center gap-2 text-xs" key={item.stat}>
              <div className="flex items-center gap-1.5 shrink-0">
                <img className="w-4 h-4" src={`/icons/${StatIcons[item.stat]}`} />
                {item.stat}
              </div>
              <div className="text-primary-lighter">{_.repeat('\u{2771}', item.roll)}</div>
              <hr className="w-full border border-primary-border" />
              <p className="font-normal text-gray">
                {_.includes([Stats.HP, Stats.ATK, Stats.DEF, Stats.EM], item.stat)
                  ? _.round(item.value).toLocaleString()
                  : toPercentage(item.value / 100)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray">Click to Add</p>
        </div>
      )}
    </div>
  )
})
