import { useStore } from '@src/data/providers/app_store_provider'
import { ArtifactPiece } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { ArtifactModal } from './artifact_modal'

interface ArtifactBlockProps {
  index: number
  piece: number
}

export const ArtifactBlock = observer((props: ArtifactBlockProps) => {
  const pieceName = ArtifactPiece[props.piece]

  const { modalStore, teamStore } = useStore()
  const artifact = teamStore.characters[props.index]?.equipments?.artifacts?.[props.piece - 1]

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal />)
  }, [modalStore, props.index])

  return (
    <div className="flex flex-col w-full font-bold text-white duration-200 rounded-lg bg-primary-dark h-1/2 hover:scale-[97%]">
      <div className="flex items-center justify-center gap-1 px-5 py-2 rounded-t-lg bg-primary-light">
        <img src={`/icons/${_.snakeCase(pieceName)}.png`} className="w-5 h-5" />
        <p>{pieceName}</p>
      </div>
      {artifact ? (
        <p>Have</p>
      ) : (
        <div className="flex items-center justify-center w-full h-full cursor-pointer" onClick={onOpenModal}>
          <p className='text-gray'>Click to Add</p>
        </div>
      )}
    </div>
  )
})
