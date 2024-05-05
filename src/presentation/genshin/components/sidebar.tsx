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
          'px-4 py-3 text-sm font-normal duration-200 rounded-lg cursor-pointer text-gray hover:bg-primary-dark',
          {
            'bg-primary-dark': page === currentPage,
          }
        )}
        onClick={() => onChange(page)}
      >
        {name}
      </div>
    )
  }

  return (
    <div className="w-1/6 p-2 bg-primary-darker">
      <p className="p-3 font-bold text-white">Calculator</p>
      <Pill name="Team Setup" page={GenshinPage.TEAM} />
      <Pill name="Damage Calculator" page={GenshinPage.DMG} />
      <Pill name="ER Requirement" page={GenshinPage.ER} />
      <Pill name="Import" page={GenshinPage.IMPORT} />
      <p className="p-3 font-bold text-white">Account</p>
      <Pill name="My Characters" page={GenshinPage.MY_CHAR} />
      <Pill name="Artifact Inventory" page={GenshinPage.INVENTORY} />
    </div>
  )
}
