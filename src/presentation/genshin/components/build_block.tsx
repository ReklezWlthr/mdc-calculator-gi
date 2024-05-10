import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { IBuild } from '@src/domain/genshin/constant'
import { CommonModal } from '@src/presentation/components/common_modal'
import { GhostButton } from '@src/presentation/components/ghost.button'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

interface BuildBlockProps {
  build: IBuild
  onClick: () => void
}

export const BuildBlock = observer(({ build, onClick }: BuildBlockProps) => {
  const { buildStore, modalStore } = useStore()

  const char = findCharacter(build.cId)

  const onOpenConfirmModal = useCallback((onConfirm: () => void) => {
    modalStore.openModal(
      <CommonModal title="Delete Build" desc="Are you sure you want to delete this build?" onConfirm={onConfirm} />
    )
  }, [])

  return (
    <div
      className="flex items-center justify-between w-full px-4 py-3 text-white duration-200 rounded-lg cursor-pointer bg-primary-dark active:scale-95"
      onClick={onClick}
    >
      <div className="w-1/2">
        <div className="flex items-center gap-2">
          {build.isDefault && <i className="text-xs fa-solid fa-star text-yellow" title="Default Build" />}
          <p className="w-full truncate">{build.name}</p>
        </div>
        <p className="text-xs text-gray">Equipped By: {char?.name}</p>
      </div>
      <div className="flex gap-x-2">
        <PrimaryButton
          title="Set Default"
          onClick={(event) => {
            event.stopPropagation()
            buildStore.setDefault(build.id)
          }}
          disabled={build.isDefault}
        />
        <GhostButton
          icon="fa-regular fa-trash-alt"
          onClick={(event) => {
            event.stopPropagation()
            onOpenConfirmModal(() => buildStore.deleteBuild(build.id))
          }}
        />
      </div>
    </div>
  )
})
