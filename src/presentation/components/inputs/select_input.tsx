import { Listbox, Transition } from '@headlessui/react'
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

type SelectInputProps = {
  disabled?: boolean
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  options: {
    name: string
    img?: string
    value: string
  }[]
  style?: string
  icon?: string
}

export const SelectInput = ({ disabled, value, placeholder, onChange, options, style, icon }: SelectInputProps) => {
  //---------------------
  // HANDLER
  //---------------------
  const valueFinder = (v?: string) => _.find(options, { value: v })

  //---------------------
  // RENDER
  //---------------------
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div
        className={classNames('relative font-normal', style, {
          'w-full': !style,
        })}
      >
        <Listbox.Button
          className={({ open }) =>
            classNames(
              'relative flex shadow-light-01 justify-between items-center px-2 py-1 border rounded-lg text-sm transition-all duration-300 w-full',
              { 'cursor-not-allowed bg-primary-bg border-primary text-primary-light': disabled },
              { 'cursor-pointer hover:border-primary-lighter bg-primary-darker border-primary-light': !disabled },
              { 'text-gray': value },
              { 'text-primary-light': !value }
            )
          }
        >
          {({ open }) => (
            <div className="flex items-center">
              {value && valueFinder(value)?.img && (
                <img src={valueFinder(value)?.img} className="object-cover w-6 h-6 mr-3 rounded-full" />
              )}
              <div>{value && <i className={icon} />}</div>
              <div className="text-sm truncate">{value ? valueFinder(value)?.name : placeholder}</div>
            </div>
          )}
        </Listbox.Button>
        <Transition
          enter="transition duration-150 ease-out origin-top"
          enterFrom="transform scale-y-0 opacity-0"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-150 ease-out origin-top"
          leaveFrom="transform scale-y-100 opacity-100"
          leaveTo="transform scale-y-0 opacity-0"
          className="relative z-[1000]"
        >
          <Listbox.Options className="absolute z-50 w-full mt-1 overflow-auto text-sm text-white rounded-md bg-primary-darker max-h-60 dropdownScrollbar">
            {_.map(options, (item, i) => (
              <Listbox.Option
                key={`${item.value}_${i}`}
                className={({ active, selected }) =>
                  classNames('relative z-50 cursor-pointer select-none px-2 py-1 flex items-center', {
                    'bg-primary': active || selected,
                    flex: item.img,
                  })
                }
                value={item.value}
              >
                {item.img && <img src={item.img} className="object-cover w-6 h-6 mr-3 rounded-full" />}
                <span className="block truncate">{item.name}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
