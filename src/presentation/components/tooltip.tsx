import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import React, { Fragment, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

export type TooltipPositionT = 'top' | 'bottom' | 'left' | 'right'

export const Tooltip = observer(
  ({
    children,
    title,
    body,
    position = 'right',
    style,
    containerStyle,
  }: {
    children: React.ReactElement
    title: string
    body: React.ReactNode
    position?: TooltipPositionT
    style?: string
    containerStyle?: string
  }) => {
    const [hovered, setHovered] = useState(false)
    const [ref, setRef] = useState<HTMLElement>(null)

    const EDGE_MARGIN = 4
    const MAIN_MARGIN = 16

    useEffect(() => {
      if (ref && hovered) {
        const main = ref.previousSibling as HTMLDivElement

        // Get calculated tooltip coordinates and size
        const tooltip_rect = ref?.getBoundingClientRect()
        const text_rect = main?.getBoundingClientRect()
        let width = tooltip_rect.width * (100 / 95)
        let height = tooltip_rect.height * (100 / 95)

        if (height >= window.innerHeight * 0.75) {
          ref.style.width = width * 1.5 + 'px'
          width = width * 1.5
          height = height * 0.8
        }

        // Define tooltip's position
        let posX =
          position === 'right' ? text_rect?.width + MAIN_MARGIN : position === 'left' ? -width - MAIN_MARGIN : 0
        let posY =
          position === 'top' ? -height - MAIN_MARGIN : position === 'bottom' ? text_rect?.height + MAIN_MARGIN : 0
        // Position tooltip
        ref.style.top = posY + 'px'
        ref.style.left = posX + 'px'

        // Corrections if out of window
        // Check right
        if (tooltip_rect?.x + text_rect?.width + width + MAIN_MARGIN > window.innerWidth) posX = -width - MAIN_MARGIN
        // Check left
        if (tooltip_rect?.x < 0) posX = text_rect?.width + MAIN_MARGIN
        // Check top
        if (tooltip_rect.y < 0) posY = position === 'top' ? text_rect.height + EDGE_MARGIN : 0
        // Check bottom
        const bottomOverflow = tooltip_rect?.y + height - (window.innerHeight + EDGE_MARGIN)
        if (tooltip_rect?.y + height > window.innerHeight + EDGE_MARGIN)
          posY = position === 'bottom' ? -height - EDGE_MARGIN : -bottomOverflow

        // Apply corrected position
        ref.style.top = posY + 'px'
        ref.style.left = posX + 'px'
      }
    }, [position, hovered, ref])

    return (
      <div className={classNames('relative text-sm text-gray', containerStyle)}>
        {React.cloneElement(children, {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          className: classNames(children.props?.className, 'cursor-help'),
        })}
        <Transition
          show={hovered}
          as="div"
          ref={setRef}
          enter="ease-out duration-300 transition-transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className={classNames(
            'z-[2000] absolute px-3 py-2 rounded-lg bg-primary-dark shadow-md border border-primary space-y-1 text-[13px]',
            hovered ? 'visible' : 'invisible',
            style
          )}
        >
          <p className="text-sm font-bold text-white">{title}</p>
          <div className="h-0 border-t border-primary-lighter" />
          {body}
        </Transition>
      </div>
    )
  }
)
