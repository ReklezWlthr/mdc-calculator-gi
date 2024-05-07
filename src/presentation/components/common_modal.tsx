import { observer } from 'mobx-react-lite'
import { GhostButton } from './ghost.button'
import { PrimaryButton } from './primary.button'
import { useStore } from '@src/data/providers/app_store_provider'

interface CommonModalProps {
  title: string
  desc: string
  onCancel?: () => void
  onConfirm: () => void
}

export const CommonModal = observer(({ title, desc, onCancel, onConfirm }: CommonModalProps) => {
  const { modalStore } = useStore()

  return (
    <div className="w-[400px] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <p className='text-lg'>{title}</p>
      <p className='text-sm font-normal'>{desc}</p>
      <div className="flex justify-end gap-x-2">
        <GhostButton
          title="Cancel"
          onClick={() => {
            onCancel?.()
            modalStore.closeModal()
          }}
        />
        <PrimaryButton
          title="Confirm"
          onClick={() => {
            onConfirm()
            modalStore.closeModal()
          }}
        />
      </div>
    </div>
  )
})
