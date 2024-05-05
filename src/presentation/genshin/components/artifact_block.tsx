import { useStore } from '@src/data/providers/app_store_provider'
import { ArtifactPiece, Stats } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { ArtifactModal } from './artifact_modal'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { getMainStat } from '@src/core/utils/data_format'
import { toPercentage } from '@src/core/utils/converter'
import { StatIcons } from '../../../domain/genshin/constant'

interface ArtifactBlockProps {
  index: number
  piece: number
}

export const ArtifactBlock = observer((props: ArtifactBlockProps) => {
  const pieceName = ArtifactPiece[props.piece]

  const { modalStore, teamStore, artifactStore } = useStore()
  const aId = teamStore.characters[props.index]?.equipments?.artifacts?.[props.piece - 1]
  const artifact = _.find(artifactStore.artifacts, ['id', aId])

  const mainStat = getMainStat(artifact?.main, artifact?.quality, artifact?.level)

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal type={props.piece} cId={teamStore.characters[props.index]?.id} aId={aId} />)
  }, [modalStore, props.index, aId])

  return (
    <div
      className="flex flex-col w-full font-bold text-white duration-200 rounded-lg bg-primary-dark h-[300px] hover:scale-[97%] cursor-pointer"
      onClick={onOpenModal}
    >
      <div className="flex items-center justify-center gap-1 px-5 py-2 rounded-t-lg bg-primary-light">
        <img src={`/icons/${_.snakeCase(pieceName)}.png`} className="w-5 h-5" />
        <p>{pieceName}</p>
      </div>
      {aId ? (
        <div className="px-4 py-3 space-y-3">
          <div className="flex gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <img
                src={`https://enka.network/ui/${artifact.data.icon}_${artifact.type}.png`}
                className="w-full h-full"
              />
              <div className="absolute flex items-center justify-center px-2 py-1 text-xs bg-opacity-75 rounded-full -bottom-0 -right-4 bg-primary-light">
                +{artifact?.level}
              </div>
            </div>
            <div className="flex flex-col items-center w-full gap-1">
              <RarityGauge rarity={artifact?.quality} textSize="text-sm" />
              <p className="text-xs text-center">{artifact?.data?.name}</p>
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
          {_.map(artifact?.subList, (item) => (
            <div className="flex items-center gap-2 text-xs" key={item.stat}>
              <div className="flex items-center gap-1.5 shrink-0">
                <img className="w-4 h-4" src={`/icons/${StatIcons[item.stat]}`} />
                {item.stat}
              </div>
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
