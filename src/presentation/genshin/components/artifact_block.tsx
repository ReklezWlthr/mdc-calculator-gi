import { useStore } from '@src/data/providers/app_store_provider'
import { ArtifactPiece } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface ArtifactBlockProps {
  index: number
  piece: number
}

export const ArtifactBlock = observer((props: ArtifactBlockProps) => {
  const pieceName = ArtifactPiece[props.piece]

  const { modalStore, teamStore } = useStore()
  const artifact = teamStore.characters[props.index]?.equipments?.artifacts?.[props.piece - 1]

  return (
    <div className="flex flex-col w-full font-bold text-white rounded-lg bg-primary-dark h-1/2">
      <div className="flex items-center justify-center gap-1 px-5 py-2 rounded-t-lg bg-primary-light">
        <img src={`/icons/${_.snakeCase(pieceName)}.png`} className="w-5 h-5" />
        <p>{pieceName}</p>
      </div>
      {artifact ? (
        <p>Have</p>
      ) : (
        <div className="flex items-center justify-center w-full h-full cursor-pointer">
          <p className='text-gray'>Click to Add</p>
        </div>
      )}
    </div>
  )
})
