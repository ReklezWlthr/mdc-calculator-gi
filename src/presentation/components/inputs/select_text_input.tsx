import { Combobox, Transition } from '@headlessui/react'
import classNames from 'classnames'
import _ from 'lodash'
import { Fragment, useCallback, useMemo } from 'react'

type OptionType = { name: string; img?: string; value: string }

type SelectTextInputProps = {
  searchWord: string
  value: string
  onChange: (name: string, value: string) => void
  onType: (value: string) => void
  options: OptionType[]
  disabled?: boolean
  placeholder?: string
  style?: string
}

export const SelectTextInput = (props: SelectTextInputProps) => {
  const valueFinder = useCallback((value: string) => _.find(props.options, ['value', value]), [props.options])

  const filteredOptions = useMemo(() => {
    const regex = new RegExp(props.searchWord, 'i')
    return _.filter(props.options, (option) => !!option.name.match(regex))
  }, [props.options, props.searchWord])

  return (
    <Combobox
      value={props.value || ''}
      onChange={(value) => props.onChange(valueFinder(value)?.name, value)}
      disabled={props.disabled}
      as="div"
      className={classNames(
        'rounded-lg relative transition-colors px-2 py-0.5 duration-200 hover:border-primary-lighter border-primary-light border bg-primary-darker font-normal',
        props.style || 'w-full'
      )}
    >
      <Combobox.Button as={Fragment}>
        <Combobox.Input
          className={classNames(
            'w-full outline-none placeholder:text-primary-light text-gray transition-colors duration-200 bg-transparent text-sm truncate',
            {
              'cursor-not-allowed': props.disabled,
              'border-TextInput-colorBorderDefault text-TextInput-colorTextDisable bg-TextInput-colorBgDisable cursor-not-allowed':
                props.disabled,
            }
          )}
          displayValue={(item: OptionType) => item.name}
          placeholder={props.placeholder}
          onChange={(event) => props.onType(event.target.value)}
        />
      </Combobox.Button>
      <Transition
        enter="transition duration-150 ease-out origin-top"
        enterFrom="transform scale-y-0 opacity-0"
        enterTo="transform scale-y-100 opacity-100"
        leave="transition duration-150 ease-out origin-top"
        leaveFrom="transform scale-y-100 opacity-100"
        leaveTo="transform scale-y-0 opacity-0"
        className="relative z-[1000]"
      >
        <Combobox.Options className="absolute z-50 w-full mt-2 overflow-auto text-sm text-white rounded-md bg-primary-darker max-h-60 dropdownScrollbar">
          {_.map(filteredOptions, (item, i) => (
            <Combobox.Option
              key={`${item.value}_${i}`}
              className={({ active, selected }) =>
                classNames('relative z-50 cursor-pointer select-none px-2 py-1 flex items-center', {
                  'bg-primary': active || selected,
                  flex: item.img,
                })
              }
              value={item}
            >
              {item.img && <img src={item.img} className="object-cover w-6 h-6 mr-2" />}
              <span className="block truncate">{item.name}</span>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}
