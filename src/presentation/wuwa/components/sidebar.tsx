import { useStore } from '@src/data/providers/app_store_provider'
import { GenshinPage } from '@src/domain/genshin/constant'
import { WuWaPage } from '@src/domain/wuwa/constant'
import classNames from 'classnames'
import { useCallback } from 'react'

export const Sidebar = ({ currentPage, onChange }: { currentPage: WuWaPage; onChange: (page: WuWaPage) => void }) => {
  const { modalStore } = useStore()

  const Pill = ({ name, page }: { name: string; page: WuWaPage }) => {
    return (
      <div
        className={classNames(
          'px-4 py-2 text-sm font-normal duration-200 rounded-lg cursor-pointer text-gray',
          page === currentPage ? 'bg-primary' : 'hover:bg-primary-dark'
        )}
        onClick={() => onChange(page)}
      >
        {name}
      </div>
    )
  }

  const onOpenSettingModal = useCallback(() => modalStore.openModal(<></>), [])

  return (
    <div className="flex flex-col justify-between w-1/6 p-2 bg-primary-darker">
      <div className="space-y-2">
        <p className="p-2 font-bold text-white">Calculator</p>
        <Pill name="Team Setup" page={WuWaPage.TEAM} />
        <Pill name="Damage Calculator" page={WuWaPage.DMG} />
        <Pill name="Import" page={WuWaPage.IMPORT} />
        <p className="p-2 font-bold text-white">Account</p>
        <Pill name="My Characters" page={WuWaPage.CHAR} />
        <Pill name="My Builds" page={WuWaPage.BUILD} />
        <Pill name="Echo Inventory" page={WuWaPage.INVENTORY} />
      </div>
      <div className="flex justify-end px-3">
        <i className="text-2xl cursor-pointer fa-solid fa-cog text-gray" onClick={onOpenSettingModal} />
      </div>
    </div>
  )
}
