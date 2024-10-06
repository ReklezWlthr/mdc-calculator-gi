import { Popover, Transition } from '@headlessui/react'
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import { Badge } from './badge'
import { CheckboxInput } from './checkbox'

type TagSelectInputProps = {
  label?: string
  disabled?: boolean
  values?: string[]
  placeholder?: string
  onChange: (value: string[]) => void
  options: {
    name: string
    value: string
    img?: string
  }[]
  style?: string
  classLabel?: string
  renderAsText?: boolean
  maxSelection?: number
}

export const TagSelectInput = ({
  disabled,
  values = [],
  placeholder,
  onChange,
  options,
  style,
  label,
  classLabel = '',
  renderAsText = false,
  maxSelection,
}: TagSelectInputProps) => {
  //---------------------
  // HANDLER
  //---------------------
  const isSelected = (v: string) => _.includes(values, v)

  const tagRender = () => {
    if (renderAsText) {
      return _.join(values, ', ')
    } else {
      return _.map(values, (item) => (
        <Badge
          key={item}
          text={_.find(options, { value: item })?.name || ''}
          bgColor="bg-light-2"
          textColor="text-dark-0"
          width="w-fit"
          iconRight="fa-regular fa-times text-dark-3"
          actionIconRight={() => onToggleSelection(_.find(options, { value: item })?.value || '')}
        />
      ))
    }
  }

  const onToggleSelection = (v: string) => {
    isSelected(v) ? onChange(_.without(values, v)) : onChange([...values, v])
  }

  //---------------------
  // RENDER
  //---------------------
  return (
    <Popover>
      <div
        className={classNames('relative', style, {
          'w-full': !style,
          'pointer-events-none': disabled,
        })}
      >
        {label && <p className={classNames('mb-1', { 'bodyM text-dark-0': !classLabel }, classLabel)}>{label}</p>}
        <Popover.Button
          className={classNames(
            'relative flex shadow-light-01 justify-between items-center px-2 py-1 border rounded-lg text-sm transition-all duration-300 w-full min-h-[30px]',
            { 'cursor-not-allowed bg-primary-bg border-primary text-primary-light': disabled },
            { 'cursor-pointer hover:border-primary-lighter bg-primary-darker border-primary-light': !disabled },
            { 'text-gray': _.size(values) },
            { 'text-primary-light': !_.size(values) }
          )}
        >
          <div className="flex flex-wrap gap-x-2 gap-y-1">{_.size(values) ? tagRender() : placeholder}</div>
        </Popover.Button>
        <Transition
          enter="transition duration-150 ease-out origin-top"
          enterFrom="transform scale-y-0 opacity-0"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-150 ease-out origin-top"
          leaveFrom="transform scale-y-100 opacity-100"
          leaveTo="transform scale-y-0 opacity-0"
          className="relative z-[1000]"
        >
          <Popover.Panel className="absolute z-50 w-full mt-1 overflow-auto text-sm text-white rounded-md bg-primary-darker max-h-60 dropdownScrollbar">
            {_.map(options, (item) => (
              <div
                key={item.value}
                className="flex items-center gap-x-2 relative z-50 cursor-pointer select-none py-[9px] px-4 "
                onClick={() => {
                  if (!maxSelection || _.size(values) < maxSelection || isSelected(item.value))
                    onToggleSelection(item.value)
                }}
              >
                <CheckboxInput checked={isSelected(item.value)} onClick={() => {}} />
                {item.img && <img src={item.img} className="object-cover w-5 h-5" />}
                <span className="block truncate">{item.name}</span>
              </div>
            ))}
          </Popover.Panel>
        </Transition>
      </div>
    </Popover>
  )
}
