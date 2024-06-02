import { useStore } from '@src/data/providers/app_store_provider'
import { GenshinPage } from '@src/domain/genshin/constant'
import classNames from 'classnames'
import { useCallback } from 'react'
import { SettingModal } from './setting_modal'
import { HelpModal } from './help_modal'

export const Sidebar = ({
  currentPage,
  onChange,
}: {
  currentPage: GenshinPage
  onChange: (page: GenshinPage) => void
}) => {
  const { modalStore } = useStore()

  const Pill = ({ name, page }: { name: string; page: GenshinPage }) => {
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

  const onOpenSettingModal = useCallback(() => modalStore.openModal(<SettingModal />), [])
  const onOpenHelpModal = useCallback(() => modalStore.openModal(<HelpModal />), [])

  return (
    <div className="flex flex-col justify-between w-1/6 p-2 bg-primary-darker">
      <div className="space-y-2">
        <p className="p-2 font-bold text-white">Calculator</p>
        <Pill name="Team Setup" page={GenshinPage.TEAM} />
        <Pill name="Damage Calculator" page={GenshinPage.DMG} />
        {/* <Pill name="ER Requirement" page={GenshinPage.ER} /> */}
        <Pill name="Import / Export" page={GenshinPage.IMPORT} />
        <p className="p-2 font-bold text-white">Account</p>
        <Pill name="My Characters" page={GenshinPage.CHAR} />
        <Pill name="My Builds" page={GenshinPage.BUILD} />
        <Pill name="Artifact Inventory" page={GenshinPage.INVENTORY} />
      </div>
      <div className="flex justify-between px-3">
        <i className="text-2xl cursor-pointer fa-regular fa-question-circle text-gray" onClick={onOpenHelpModal} />
        <i className="text-2xl cursor-pointer fa-solid fa-cog text-gray" onClick={onOpenSettingModal} />
      </div>
    </div>
  )
}
