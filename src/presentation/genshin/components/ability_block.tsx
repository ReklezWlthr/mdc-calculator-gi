import { observer } from 'mobx-react-lite'
import { TalentIcon } from './tables/scaling_wrapper'
import _ from 'lodash'
import { ITeamChar } from '@src/domain/constant'
import { ITalent } from '@src/domain/conditional'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findCharacter } from '@src/core/utils/finder'

export interface AbilityBlockProps {
  char: ITeamChar
  talents: ITalent
  upgrade: { normal: boolean; skill: boolean; burst: boolean }
  onChange: (key: 'normal' | 'skill' | 'burst', value: number) => void
  disabled?: boolean
}

export const AbilityBlock = observer(({ char, onChange, upgrade, talents, disabled }: AbilityBlockProps) => {
  const maxTalentLevel = _.max([1, (char.ascension - 1) * 2])
  const talentLevels = _.map(Array(maxTalentLevel), (_, index) => ({
    name: (index + 1).toString(),
    value: (index + 1).toString(),
  })).reverse()

  const charData = findCharacter(char.cId)

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <TalentIcon
        talent={talents?.normal}
        element={charData?.element}
        size="w-9 h-9"
        upgraded={upgrade?.normal}
        showUpgrade
      />
      <SelectInput
        value={char?.talents?.normal?.toString()}
        onChange={(value) => onChange('normal', parseInt(value))}
        options={talentLevels}
        style="w-14"
      />
      <TalentIcon
        talent={talents?.skill}
        element={charData?.element}
        size="w-9 h-9"
        upgraded={upgrade?.skill}
        showUpgrade
      />
      <SelectInput
        value={char?.talents?.skill?.toString()}
        onChange={(value) => onChange('skill', parseInt(value))}
        options={talentLevels}
        style="w-14"
      />
      <TalentIcon
        talent={talents?.burst}
        element={charData?.element}
        size="w-9 h-9"
        upgraded={upgrade?.burst}
        showUpgrade
      />
      <SelectInput
        value={char?.talents?.burst?.toString()}
        onChange={(value) => onChange('burst', parseInt(value))}
        options={talentLevels}
        style="w-14"
      />
    </div>
  )
})
