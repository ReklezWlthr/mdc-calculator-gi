import { useStore } from '@src/data/providers/app_store_provider'
import { GenshinPage } from '@src/domain/constant'
import classNames from 'classnames'
import { useCallback } from 'react'
import { SettingModal } from './setting_modal'
import { HelpModal } from './help_modal'
import { IntroModal } from './intro_modal'

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
  const onOpenIntroModal = useCallback(() => modalStore.openModal(<IntroModal />), [])

  return (
    <div className="flex flex-col justify-between w-1/6 p-2 bg-primary-darker shrink-0">
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
      <div className="flex items-end justify-between px-3">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 cursor-pointer text-gray" onClick={onOpenIntroModal}>
            <i className="text-xl fa-solid fa-circle-info" />
            <p>About</p>
          </div>
          <div className="flex items-center gap-3 cursor-pointer text-gray" onClick={onOpenHelpModal}>
            <i className="text-xl fa-solid fa-question-circle" />
            <p>Guides</p>
          </div>
          <div className="flex items-center gap-3 cursor-pointer text-gray" onClick={onOpenSettingModal}>
            <i className="text-xl fa-solid fa-cog" />
            <p>Settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
