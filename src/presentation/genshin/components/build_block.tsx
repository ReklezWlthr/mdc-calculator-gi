import { IBuild } from '@src/domain/genshin/constant'
import { observer } from 'mobx-react-lite'

interface BuildBlockProps {
  build: IBuild
}

export const BuildBlock = observer(({ build }: BuildBlockProps) => {
  return (
    <div className="px-4 py-3 text-white rounded-lg bg-primary-dark">
      <p>{build.id}</p>
      <p className="text-sm text-gray">Equipped By: {build.char}</p>
    </div>
  )
})
