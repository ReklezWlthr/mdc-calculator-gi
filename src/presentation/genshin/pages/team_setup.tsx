import { useState } from 'react'
import { CharacterBlock } from '../components/character_block'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { StatBlock } from '../components/stat_block'
import { WeaponBlock } from '../components/weapon_block'
import { ArtifactBlock } from '../components/artifact_block'

const CharacterSelect = ({ onClick, isSelected }: { onClick: () => void; isSelected: boolean }) => {
  return (
    <div
      className={classNames('w-full rounded-lg cursor-pointer bg-primary-dark duration-200', {
        'ring-2 ring-offset-2 ring-offset-transparent ring-primary-lighter': isSelected,
      })}
      onClick={onClick}
    >
      1
    </div>
  )
}

export const TeamSetup = observer(() => {
  const [selected, setSelected] = useState(0)
  const [team, setTeam] = useState(Array(4))

  return (
    <div className="flex w-5/6 gap-5 p-5 overflow-y-scroll">
      <div className="w-1/3">
        <p className="flex justify-center font-semibold text-white">Team Members</p>
        <div className="flex w-full gap-2 pt-1 pb-3">
          {_.map(team, (item, index) => (
            <CharacterSelect
              key={`char_select_${index}`}
              onClick={() => setSelected(index)}
              isSelected={index === selected}
            />
          ))}
        </div>
        <CharacterBlock index={selected} />
        <div className="h-5" />
        <StatBlock index={selected} />
      </div>
      <div className="w-1/5 space-y-5">
        <WeaponBlock index={selected} />
        <ArtifactBlock index={selected} piece={3} />
      </div>
      <div className="w-1/5 space-y-5">
        <ArtifactBlock index={selected} piece={1} />
        <ArtifactBlock index={selected} piece={4} />
      </div>
      <div className="w-1/5 space-y-5">
        <ArtifactBlock index={selected} piece={2} />
        <ArtifactBlock index={selected} piece={5} />
      </div>
    </div>
  )
})
