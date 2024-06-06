import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { GhostButton } from '@src/presentation/components/ghost.button'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'

export const CompareModal = observer(({ cId }: { cId: string }) => {
  const [name, setName] = useState('')

  const char = findCharacter(cId)

  const { modalStore, teamStore, setupStore, calculatorStore } = useStore()
  const setup = setupStore.findSetup(cId)

  const onSave = useCallback(() => {
    const id = crypto.randomUUID()

    if (name) {
      const pass = setupStore.saveSetup({
        id,
        name,
        team: teamStore.characters,
        mod: calculatorStore.form,
        custom: calculatorStore.custom,
      })
      if (pass) modalStore.closeModal()
    }
  }, [name])

  return (
    <div className="px-5 py-3 space-y-3 text-white rounded-lg bg-primary-dark w-[350px]">
      <div className="space-y-1">
        <p className="font-semibold">Comparing <b>{char.name}</b></p>
        <p>{setup.length}</p>
      </div>
      <div className="flex justify-end gap-2">
        <GhostButton title="Cancel" onClick={() => modalStore.closeModal()} />
        <PrimaryButton title="Confirm" onClick={onSave} />
      </div>
    </div>
  )
})
