import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'

export const CompareModal = observer(({ cId }: { cId: string }) => {
  const char = findCharacter(cId)

  const { modalStore, teamStore, setupStore, calculatorStore, settingStore } = useStore()
  const setup = setupStore.findSetup(cId)

  return (
    <div className="px-5 py-3 space-y-3 text-white rounded-lg bg-primary-dark w-[350px]">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="font-semibold">Choose a Setup to Compare</p>
          <p className="text-xs text-gray">
            Comparing <b>{char.name}</b>
          </p>
        </div>
        <div className="space-y-3">
          {_.map(setup, (item) => (
            <div className="flex items-center justify-between px-3 py-2 text-sm rounded-lg bg-primary-darker">
              <div>
                <p>{item.name}</p>
                <div className="flex mt-5 gap-x-4">
                  {_.map(item.team, (char) => {
                    const x = findCharacter(char.cId)?.codeName
                    const y = x === 'Player' ? settingStore.settings.travelerGender : x

                    return (
                      <div className="relative duration-200 rounded-full w-9 h-9 bg-primary shrink-0 ring-primary-light ring-2">
                        <img
                          src={`https://enka.network/ui/UI_AvatarIcon_Side_${y}.png`}
                          className="absolute scale-150 bottom-2.5"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              <PrimaryButton
                onClick={() => {
                  setupStore.addCompare(item)
                  modalStore.closeModal()
                }}
                icon="fa-solid fa-plus"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
