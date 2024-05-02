import _ from 'lodash'
import classnames from 'classnames'

export interface TextInputProps {
  value?: string
  placeholder?: string
  iconLeading?: string
  iconTailing?: string
  disabled?: boolean
  required?: boolean
  onChange: (value: string) => void
}

export const TextInput = (props: TextInputProps) => {
  //---------------------
  //  RENDER
  //---------------------
  return (
    <div
      className={classnames(
        'rounded-lg w-full flex items-center transition-colors duration-200 relative overflow-hidden hover:border-primary-lighter border-primary-light border bg-primary-darker font-normal'
      )}
    >
      {props.iconLeading && (
        <i
          className={classnames(
            `w-4 h-4 absolute left-3 text-TextInput-colorTextDefault`,
            props?.iconLeading
          )}
        />
      )}
      <input
        value={props?.value}
        disabled={props.disabled}
        onChange={(e) => {
          !props?.disabled && props.onChange(e.target?.value)
        }}
        placeholder={props.placeholder}
        data-cy={props['data-cy']}
        className={classnames(
          'w-full rounded-lg outline-none px-2 py-1 placeholder:text-primary-light text-gray transition-colors duration-200 bg-transparent text-sm',
          {
            'pl-10': props.iconLeading,
            'pr-10': props.iconTailing,
            'cursor-not-allowed': props.disabled,
            'border-TextInput-colorBorderDefault text-TextInput-colorTextDisable bg-TextInput-colorBgDisable cursor-not-allowed':
              props.disabled,
          }
        )}
      />
      {props.iconTailing && (
        <i
          className={classnames(
            `w-[16px] h-[16px] absolute right-[12px] text-TextInput-colorTextDefault `,
            props?.iconTailing
          )}
        />
      )}
    </div>
  )
}
