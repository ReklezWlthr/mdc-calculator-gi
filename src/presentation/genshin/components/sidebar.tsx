import { GenshinPage } from '@src/domain/genshin/constant'
import classNames from 'classnames'

export const Sidebar = ({
  currentPage,
  onChange,
}: {
  currentPage: GenshinPage
  onChange: (page: GenshinPage) => void
}) => {
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

  return (
    <div className="w-1/6 p-2 space-y-2 bg-primary-darker">
      <p className="p-2 font-bold text-white">Calculator</p>
      <Pill name="Team Setup" page={GenshinPage.TEAM} />
      <Pill name="Damage Calculator" page={GenshinPage.DMG} />
      <Pill name="ER Requirement" page={GenshinPage.ER} />
      <Pill name="Import" page={GenshinPage.IMPORT} />
      <p className="p-2 font-bold text-white">Account</p>
      <Pill name="My Builds" page={GenshinPage.MY_CHAR} />
      <Pill name="Artifact Inventory" page={GenshinPage.INVENTORY} />
    </div>
  )
}
