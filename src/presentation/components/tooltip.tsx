import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import React, { Fragment, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

type TooltipPositionT = 'top' | 'bottom' | 'left' | 'right'

export const Tooltip = observer(
  ({
    children,
    title,
    body,
    position = 'right',
    style,
  }: {
    children: React.ReactElement
    title: string
    body: React.ReactNode
    position?: TooltipPositionT
    style?: string
  }) => {
    const [hovered, setHovered] = useState(false)
    const [ref, setRef] = useState<HTMLElement>(null)

    const EDGE_MARGIN = 4
    const MAIN_MARGIN = 12

    useEffect(() => {
      if (ref && hovered) {
        const main = ref.previousSibling as HTMLDivElement

        // Get calculated tooltip coordinates and size
        const tooltip_rect = ref?.getBoundingClientRect()
        const text_rect = main?.getBoundingClientRect()

        // Define tooltip's position
        let posX =
          position === 'right'
            ? text_rect?.width + MAIN_MARGIN
            : position === 'left'
            ? -tooltip_rect?.width - MAIN_MARGIN
            : 0
        let posY =
          position === 'top'
            ? -tooltip_rect?.height - MAIN_MARGIN
            : position === 'bottom'
            ? text_rect?.height + MAIN_MARGIN
            : 0
        // Position tooltip
        ref.style.top = posY + 'px'
        ref.style.left = posX + 'px'

        // Corrections if out of window

        // Check right
        if (tooltip_rect.x + tooltip_rect.width > window.innerWidth) posX = -tooltip_rect.width - 8

        // Check top
        if (tooltip_rect.y < 0) posY = position === 'top' ? text_rect.height + EDGE_MARGIN : 0

        // Check bottom
        const bottomOverflow = tooltip_rect.y + tooltip_rect.height - window.innerHeight
        if (tooltip_rect.y + tooltip_rect.height > window.innerHeight + EDGE_MARGIN)
          posY = position === 'bottom' ? -tooltip_rect.height - EDGE_MARGIN : -bottomOverflow - EDGE_MARGIN

        // Apply corrected position
        ref.style.top = posY + 'px'
        ref.style.left = posX + 'px'
      }
    }, [position, hovered, ref])

    return (
      <div className="relative text-sm text-gray">
        {React.cloneElement(children, {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        })}
        <Transition
          show={hovered}
          as="div"
          ref={setRef}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className={classNames(
            'z-50 absolute px-3 py-2 rounded-lg bg-primary-dark shadow-md border border-primary space-y-1',
            hovered ? 'visible' : 'invisible',
            style
          )}
        >
          <p className="text-sm font-bold text-white">{title}</p>
          <div className='h-0 border-t border-primary-lighter' />
          {body}
        </Transition>
      </div>
    )
  }
)
