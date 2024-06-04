import { useStore } from '@src/data/providers/app_store_provider'
import { IContent } from '@src/domain/conditional'
import { CustomConditionalMap, Element } from '@src/domain/constant'
import { CheckboxInput } from '@src/presentation/components/inputs/checkbox'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { CustomModal } from './custom_modal'

interface CustomConditionalBlockProps {
  index: number
}

export const CustomConditionalBlock = observer(({ index }: CustomConditionalBlockProps) => {
  const [open, setOpen] = useState(true)

  const { calculatorStore, modalStore } = useStore()
  const custom = calculatorStore.custom[index]

  const onOpenCustomModal = useCallback(() => modalStore.openModal(<CustomModal index={index} />), [])

  return (
    <div className="w-full rounded-lg bg-primary-darker h-fit">
      <p
        className={classNames(
          'px-2 py-1 text-lg font-bold text-center duration-300 cursor-pointer bg-primary-light',
          open ? 'rounded-t-lg' : 'rounded-lg'
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        Custom Conditionals
        <i
          className={classNames('ml-2 text-base align-top fa-solid fa-caret-down duration-300', open && '-rotate-180')}
        />
      </p>
      <div
        className={classNames(
          'space-y-1 duration-300 ease-out px-4',
          open ? 'h-fit overflow-visible py-3' : 'h-0 overflow-hidden'
        )}
      >
        <div className="space-y-3">
          {!_.isEmpty(custom) &&
            _.map(custom, (mod, i) => (
              <div className="grid items-center grid-cols-12 text-xs gap-x-1">
                <div className="col-span-6">
                  <p className="w-full text-xs text-center text-white truncate">
                    {CustomConditionalMap[mod.name] || mod.name}
                  </p>
                </div>
                <div className={classNames('col-span-2 text-center', mod.debuff ? 'text-red' : 'text-blue')}>
                  {mod.debuff ? 'Debuff' : 'Buff'}
                </div>
                <TextInput
                  type="number"
                  value={mod.value?.toString()}
                  onChange={(value) => calculatorStore.setCustomValue(index, i, mod.name, parseFloat(value) ?? '')}
                  style="col-span-2"
                  small
                />
                <i
                  className="flex items-center justify-center w-6 h-6 cursor-pointer fa-solid fa-trash"
                  onClick={() => calculatorStore.removeCustomValue(index, i)}
                />
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <i
            className="flex items-center justify-center w-6 h-6 text-sm duration-200 rounded-full cursor-pointer fa-solid fa-plus hover:bg-primary"
            onClick={onOpenCustomModal}
          />
        </div>
      </div>
    </div>
  )
})
