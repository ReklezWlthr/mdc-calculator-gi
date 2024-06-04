import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { IBuild } from '@src/domain/constant'
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

  const onOpenConfirmModal = useCallback(() => {
    modalStore.openModal(
      <CommonModal
        icon="fa-solid fa-question-circle text-yellow"
        title="Delete Build"
        desc="Are you sure you want to delete this build? Deleting build will NOT delete designated artifacts."
        onConfirm={() => buildStore.deleteBuild(build.id)}
      />
    )
  }, [build.id])

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
            onOpenConfirmModal()
          }}
        />
      </div>
    </div>
  )
})
