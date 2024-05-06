import { MouseEventHandler, useState } from 'react'
import classNames from 'classnames'

export interface PrimaryButtonPropsType {
  onClick: MouseEventHandler<HTMLButtonElement>
  title?: string
  disabled?: boolean
  icon?: string | React.ReactNode
}

export const PrimaryButton = ({ onClick, title, disabled, icon }: PrimaryButtonPropsType) => {
  //---------------------
  // CONST
  //---------------------
  const colorClasses = classNames(
    {
      'bg-primary-lighter hover:bg-primary-light active:scale-95 text-white cursor-pointer duration-200': !disabled,
    },
    {
      'bg-primary-dark text-primary-border cursor-not-allowed': disabled,
    }
  )

  //---------------------
  // RENDER
  //---------------------
  return (
    <button
      className={classNames('py-2 px-3 rounded-lg', colorClasses)}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
    >
      {icon && <>{typeof icon === 'string' ? <i className={icon} /> : <>{icon}</>}</>}
      {title && <p className="text-sm font-bold">{title}</p>}
    </button>
  )
}
