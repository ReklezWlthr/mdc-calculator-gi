import { GenshinPage } from '@src/domain/genshin/constant'

const Pill = ({ name, onClick }: { name: string; onClick: () => void }) => {
  return (
    <div
      className="px-4 py-3 text-sm font-normal duration-200 rounded-lg cursor-pointer text-gray hover:bg-primary-dark"
      onClick={onClick}
    >
      {name}
    </div>
  )
}

export const Sidebar = ({ onChange }: { onChange: (page: GenshinPage) => void }) => {
  return (
    <div className="w-1/6 p-2 bg-primary-darker">
      <p className="p-3 font-bold text-white">Calculator</p>
      <Pill name="Team Setup" onClick={() => onChange(GenshinPage.TEAM)} />
      <Pill name="Damage Calculator" onClick={() => onChange(GenshinPage.DMG)} />
      <Pill name="ER Requirement" onClick={() => onChange(GenshinPage.ER)} />
      <Pill name="Import" onClick={() => onChange(GenshinPage.IMPORT)} />
      <p className="p-3 font-bold text-white">Account</p>
      <Pill name="My Characters" onClick={() => null} />
      <Pill name="Artifact Inventory" onClick={() => null} />
    </div>
  )
}
