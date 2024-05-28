import React from 'react'
import classNames from 'classnames'

type CheckboxInputProps = {
  label?: string
  onClick: (v: boolean) => void
  disabled?: boolean
  checked: boolean
}

export const CheckboxInput = ({ label, onClick, disabled, checked }: CheckboxInputProps) => {
  //---------------------
  // RENDER
  //---------------------
  return (
    <label htmlFor={label} onClick={() => !disabled && onClick(!checked)}>
      <div
        className={classNames('w-4 h-4 rounded-[4px]', {
          'bg-white': !disabled && !checked,
          'bg-primary': disabled && !checked,
          'bg-primary-lighter': checked && !disabled,
          'bg-primary-light': checked && disabled,
          'cursor-not-allowed text-primary': disabled,
          'cursor-pointer text-white': !disabled,
          'border border-dark-4': !checked,
        })}
      >
        <i className="fa-solid w-4 h-4 text-[10px] flex justify-center items-center fa-check" />
      </div>
    </label>
  )
}
