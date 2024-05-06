import { useStore } from '@src/data/providers/app_store_provider'
import { IBuild } from '@src/domain/genshin/constant'
import { GhostButton } from '@src/presentation/components/ghost.button'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'

interface BuildBlockProps {
  build: IBuild
}

export const BuildBlock = observer(({ build }: BuildBlockProps) => {
  const { buildStore } = useStore()

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 text-white rounded-lg bg-primary-dark">
      <div className="w-1/2">
        <div className="flex items-center gap-2">
          {build.isDefault && (
            <i className="text-xs fa-solid fa-check-circle text-genshin-dendro" title="Default Build" />
          )}
          <p className="w-full truncate">{build.name}</p>
        </div>
        <p className="text-xs text-gray">Equipped By: {build.char}</p>
      </div>
      <div className="flex gap-x-2">
        <PrimaryButton title="Set Default" onClick={() => buildStore.setDefault(build.id)} disabled={build.isDefault} />
        <GhostButton icon="fa-regular fa-trash-alt" onClick={() => buildStore.deleteBuild(build.id)} />
      </div>
    </div>
  )
})
