import _ from 'lodash'
import classNames from 'classnames'

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
      className={classNames(
        'rounded-lg w-full flex items-center transition-colors px-2 py-1 duration-200 relative overflow-hidden hover:border-primary-lighter border-primary-light border bg-primary-darker font-normal'
      )}
    >
      {props.iconLeading && <img src={props.iconLeading} className="object-cover w-6 h-6 mr-2 rounded-full" />}
      <input
        value={props?.value}
        disabled={props.disabled}
        onChange={(e) => {
          !props?.disabled && props.onChange(e.target?.value)
        }}
        placeholder={props.placeholder}
        data-cy={props['data-cy']}
        className={classNames(
          'w-full outline-none placeholder:text-primary-light text-gray transition-colors duration-200 bg-transparent text-sm',
          {
            'cursor-not-allowed': props.disabled,
            'border-TextInput-colorBorderDefault text-TextInput-colorTextDisable bg-TextInput-colorBgDisable cursor-not-allowed':
              props.disabled,
          }
        )}
      />
      {props.iconTailing && (
        <i
          className={classNames(
            `w-[16px] h-[16px] absolute right-[12px] text-TextInput-colorTextDefault `,
            props?.iconTailing
          )}
        />
      )}
    </div>
  )
}
