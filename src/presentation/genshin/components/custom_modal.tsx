import { useStore } from '@src/data/providers/app_store_provider'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { StatsObjectKeys } from '../../../data/lib/stats/baseConstant'
import { Element, Stats } from '@src/domain/constant'
import _ from 'lodash'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { PrimaryButton } from '@src/presentation/components/primary.button'

export const CustomModal = observer(({ index }: { index: number }) => {
  const { calculatorStore, modalStore } = useStore()

  const [selectedTab, setSelectedTab] = useState('stats')
  const [selectedElement, setSelectedElement] = useState(Element.PYRO)
  const [selectedTalent, setSelectedTalent] = useState('BASIC')

  const [key, setKey] = useState(StatsObjectKeys[Stats.ALL_DMG])
  const [value, setValue] = useState(0)

  const options = {
    stats: [
      { name: Stats.ALL_DMG, value: Stats.ALL_DMG },
      { name: Stats.HP, value: Stats.HP },
      { name: Stats.P_HP, value: Stats.P_HP },
      { name: Stats.ATK, value: Stats.ATK },
      { name: Stats.P_ATK, value: Stats.P_ATK },
      { name: Stats.DEF, value: Stats.DEF },
      { name: Stats.P_DEF, value: Stats.P_DEF },
      { name: Stats.EM, value: Stats.EM },
      { name: Stats.ER, value: Stats.ER },
      { name: Stats.HEAL, value: Stats.HEAL },
      { name: Stats.I_HEALING, value: Stats.I_HEALING },
      { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE },
      { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG },
      { name: Stats.SHIELD, value: Stats.SHIELD },
    ],
    element: [
      { name: 'Percentage Bonus', value: 'percentage' },
      { name: 'Flat Bonus', value: 'flat' },
    ],
    talent: [
      { name: 'Percentage Bonus', value: '_DMG' },
      { name: 'Flat Bonus', value: '_F_DMG' },
      { name: 'CRIT Rate', value: '_CR' },
      { name: 'CRIT DMG', value: '_CD' },
    ],
    reaction: [
      { name: 'Swirl', value: StatsObjectKeys.SWIRL_DMG },
      { name: 'Melt', value: StatsObjectKeys.MELT_DMG },
      { name: 'Vaporize', value: StatsObjectKeys.VAPE_DMG },
      { name: 'Overloaded', value: StatsObjectKeys.OVERLOAD_DMG },
      { name: 'Superconduct', value: StatsObjectKeys.SUPERCONDUCT_DMG },
      { name: 'Electro-Charged', value: StatsObjectKeys.TASER_DMG },
      { name: 'Shattered', value: StatsObjectKeys.SHATTER_DMG },
      { name: 'Bloom', value: StatsObjectKeys.BLOOM_DMG },
      { name: 'Hyperbloom', value: StatsObjectKeys.HYPERBLOOM_DMG },
      { name: 'Burgeon', value: StatsObjectKeys.BURGEON_DMG },
      { name: 'Burning', value: StatsObjectKeys.BURNING_DMG },
      { name: 'Spread', value: StatsObjectKeys.SPREAD_DMG },
      { name: 'Aggravate', value: StatsObjectKeys.AGGRAVATE_DMG },
    ],
  }

  const elements = _.map(Element, (item) => ({ name: item, value: item }))
  const talent = [
    { name: 'Normal Attack', value: 'BASIC' },
    { name: 'Charged Attack', value: 'CHARGE' },
    { name: 'Plunging Attack', value: 'PLUNGE' },
    { name: 'Elemental Skill', value: 'SKILL' },
    { name: 'Elemental Burst', value: 'BURST' },
  ]

  const Tab = ({ title, value, defaultKey }: { title: string; value: string; defaultKey: any }) => (
    <div
      className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200 text-sm', {
        'bg-primary': selectedTab === value,
      })}
      onClick={() => {
        setSelectedTab(value)
        setKey(defaultKey)
      }}
    >
      {title}
    </div>
  )

  const onAddMod = () => {
    if (selectedTab === 'stats') {
      calculatorStore.setCustomValue(index, -1, StatsObjectKeys[key], value)
    }
    if (selectedTab === 'element') {
      if (key === 'percentage')
        calculatorStore.setCustomValue(index, -1, StatsObjectKeys[`${selectedElement} DMG%`] as any, value)
      if (key === 'flat')
        calculatorStore.setCustomValue(
          index,
          -1,
          StatsObjectKeys[`${selectedElement.toUpperCase()}_F_DMG`] as any,
          value
        )
    }
    modalStore.closeModal()
  }

  return (
    <div className="p-3 space-y-4 rounded-lg bg-primary-dark">
      <p className="text-lg font-bold text-white">Add Custom Modifier</p>
      <div className="flex justify-center gap-x-3">
        <Tab title="Stats" value="stats" defaultKey={StatsObjectKeys[Stats.ALL_DMG]} />
        <Tab title="Element" value="element" defaultKey={options.element[0].value} />
        <Tab title="Talent" value="talent" defaultKey={options.talent[0].value} />
        <Tab title="Reaction" value="reaction" defaultKey={StatsObjectKeys.SWIRL_DMG} />
        <Tab title="Debuffs" value="debuff" defaultKey={''} />
      </div>
      <div className="grid grid-cols-3 gap-x-3">
        {selectedTab === 'stats' && (
          <SelectInput
            value={key}
            onChange={(v) => setKey(v)}
            options={options.stats}
            style="col-span-2 !w-1/2 mx-auto"
          />
        )}
        {selectedTab === 'element' && (
          <>
            <SelectInput value={selectedElement} onChange={(v) => setSelectedElement(v as any)} options={elements} />
            <SelectInput value={key} onChange={(v) => setKey(v)} options={options.element} />
          </>
        )}
        {selectedTab === 'talent' && (
          <>
            <SelectInput value={selectedTalent} onChange={(v) => setSelectedTalent(v as any)} options={talent} />
            <SelectInput value={key} onChange={(v) => setKey(v)} options={options.talent} />
          </>
        )}
        {selectedTab === 'reaction' && (
          <SelectInput
            value={key}
            onChange={(v) => setKey(v)}
            options={options.reaction}
            style="col-span-2 !w-1/2 mx-auto"
          />
        )}
        <TextInput
          type="number"
          value={value?.toString()}
          onChange={(v) => setValue(parseFloat(v))}
          style="col-start-3 !w-1/2 mx-auto"
        />
      </div>
      <div className="flex justify-end">
        <PrimaryButton title="Add Modifier" onClick={onAddMod} />
      </div>
    </div>
  )
})
