import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

export const BulletPoint = observer(({ children }: { children: React.ReactNode }) => {
  return (
    <p className="pl-3">
      <span className="mr-2 text-blue">✦</span>
      {children}
    </p>
  )
})

export const Collapsible = observer(
  ({ label, children }: { label: string; children: React.ReactNode | React.ReactNode[] }) => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-3 space-y-1 text-sm transition-all duration-200 rounded-lg bg-primary-darker text-gray">
        <p className="text-base font-bold text-white cursor-pointer" onClick={() => setOpen(!open)}>
          {label}
        </p>
        <div
          className={classNames(
            'space-y-1 transition-all duration-200 overflow-hidden',
            open ? 'max-h-screen' : 'max-h-0'
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
