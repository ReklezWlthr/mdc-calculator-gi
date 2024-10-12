import { toPercentage } from '@src/core/utils/converter'
import { ElementColor } from '@src/core/utils/damageStringConstruct'
import { findCharacter } from '@src/core/utils/finder'
import { ParticleCount } from '@src/data/db/energy'
import { useStore } from '@src/data/providers/app_store_provider'
import { CheckboxInput } from '@src/presentation/components/inputs/checkbox'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const EnergyRequirement = observer(() => {
  const { teamStore, settingStore, energyStore } = useStore()

  const { meta, setMetaData } = energyStore

  // const totalEnergy = _.useMemo(() => {}, [])

  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full gap-5 p-5 text-white max-w-[1200px] mx-auto text-sm">
        <p className="mb-5 text-2xl font-bold">ER Requirement</p>
        <div className="flex w-full font-semibold">
          <div className="w-[17%] shrink-0" />
          <div className="grid grid-cols-12 w-[53%] shrink-0 gap-3 bg-primary-border rounded-tl-lg py-1">
            <p className="col-span-5 text-center">Skill Uses</p>
            <p className="col-span-7 text-center">Particle Funneling</p>
          </div>
          <div className="w-[20%] text-center bg-primary-border rounded-tr-lg py-1">Additional Energy</div>
        </div>
        <div className="grid w-full grid-flow-row grid-rows-4 gap-y-3">
          {_.map(teamStore.characters, (item, index) => {
            const charData = findCharacter(item.cId)
            const codeName =
              charData?.codeName === 'Player' ? settingStore.settings.travelerGender : charData?.codeName || ''
            return (
              <div className="flex w-full rounded-lg ring-2 ring-primary">
                <div className="w-[17%] shrink-0 rounded-l-lg overflow-hidden">
                  <div className="flex items-center w-full border-b-2 bg-primary border-primary-border">
                    <div className="relative w-16 overflow-hidden h-11 shrink-0">
                      <div className="absolute top-0 left-0 z-10 w-full h-full from-8% to-40% bg-gradient-to-l from-primary to-transparent" />
                      <img
                        src={`https://homdgcat.wiki/homdgcat-res/Avatar/UI_AvatarIcon_${codeName}.png`}
                        className="object-cover h-full aspect-square scale-[300%] mt-1"
                      />
                    </div>
                    <p className="font-semibold py-0.5 text-center w-full text-base">{charData?.name}</p>
                  </div>
                  <div className="grid grid-cols-3 shrink-0 bg-primary-dark">
                    <p className="col-span-2 py-1 font-semibold text-center">Particle Element</p>
                    <p
                      className={classNames(
                        'py-1 text-center bg-primary-darker font-semibold',
                        ElementColor[charData.element]
                      )}
                    >
                      {charData.element}
                    </p>
                    <p className="col-span-2 py-1 font-semibold text-center">Burst Cost</p>
                    <p className="py-1 text-center bg-primary-darker text-desc">{charData.stat?.energy}</p>
                  </div>
                </div>
                <div className="w-[53%] bg-primary-darker border-x-2 border-primary-border">
                  {_.map(ParticleCount(item.cId, item.cons), (component, cIndex) => (
                    <div className="grid w-full grid-cols-12 py-1 bg-primary-dark gap-x-3">
                      <p className="flex items-center justify-center col-span-3 text-xs font-semibold">
                        {component?.name}
                      </p>
                      <TextInput
                        small
                        onChange={(v) => setMetaData(index, `skill[${cIndex}].proc`, parseInt(v))}
                        value={meta[index]?.skill?.[cIndex]?.proc?.toString()}
                        style="col-span-2"
                        type="number"
                        min={0}
                      />
                      {component.value ? (
                        <>
                          <div className="flex items-center col-span-4 gap-3 pl-4 border-l-2 border-dashed border-primary">
                            <p className="flex items-center justify-center text-xs font-semibold shrink-0">Feed to</p>
                            <SelectInput
                              options={[
                                { name: 'Self', value: charData.id },
                                ..._.map(
                                  _.filter(teamStore.characters, (item) => item.cId !== charData.id),
                                  (item) => ({ name: findCharacter(item.cId)?.name, value: item.cId })
                                ),
                                { name: `Don't Know`, value: 'Team' },
                              ]}
                              onChange={(v) => setMetaData(index, `skill[${cIndex}].feed`, v)}
                              value={meta[index]?.skill?.[cIndex]?.feed}
                              small
                            />
                          </div>
                          <div className="flex items-center col-span-2 gap-1 pr-3">
                            <TextInput
                              small
                              onChange={(v) => setMetaData(index, `skill[${cIndex}].percentage`, parseInt(v))}
                              value={meta[index]?.skill?.[cIndex]?.percentage?.toString()}
                              type="number"
                              max={100}
                              min={0}
                            />
                            <p className="text-gray">%</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center col-span-7 px-3 text-xs border-l-2 border-dashed border-primary gap-x-2">
                          <CheckboxInput onClick={(v) => {}} checked />
                          <div className="flex items-center gap-1 text-gray">
                            <p className="flex items-center justify-center mr-1 text-xs font-semibold text-white shrink-0">
                              Ratio Override
                            </p>
                            <TextInput small onChange={(v) => {}} value={'0'} />
                            /
                            <TextInput small onChange={(v) => {}} value={'0'} />
                            /
                            <TextInput small onChange={(v) => {}} value={'0'} />
                            /
                            <TextInput small onChange={(v) => {}} value={'0'} />
                            <p>%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-[20%] bg-primary-darker grid grid-cols-3 text-xs pr-3 gap-x-2 border-r-2 border-primary-border">
                  <p className="flex items-center justify-center col-span-2 py-1 bg-primary-dark">Favonius Procs</p>
                  <div className="flex items-center justify-center">
                    <TextInput
                      small
                      onChange={(v) => setMetaData(index, `favProc`, parseInt(v))}
                      value={meta?.[index]?.favProc?.toString()}
                      style="h-fit"
                      type="number"
                      min={0}
                    />
                  </div>
                  <p className="flex items-center justify-center col-span-2 py-1 bg-primary-dark">Feed Favonius to</p>
                  <div className="flex items-center justify-center">
                    <SelectInput
                      options={[
                        { name: 'Self', value: charData.id },
                        ..._.map(
                          _.filter(teamStore.characters, (item) => item.cId !== charData.id),
                          (item) => ({ name: findCharacter(item.cId)?.name, value: item.cId })
                        ),
                        { name: `Don't Know`, value: 'Team' },
                      ]}
                      onChange={(v) => setMetaData(index, `feedFav`, v)}
                      value={meta?.[index]?.feedFav}
                      small
                    />
                  </div>
                  <p className="flex items-center justify-center col-span-2 py-1 bg-primary-dark">
                    Non-Particle Energy
                  </p>
                  <div className="flex items-center justify-center">
                    <TextInput
                      small
                      onChange={(v) => setMetaData(index, `add`, parseInt(v))}
                      value={meta?.[index]?.add?.toString()}
                      type="number"
                      style="h-fit"
                    />
                  </div>
                </div>
                <div className="w-[10%] bg-primary-darker text-xs rounded-r-lg flex flex-col">
                  <p className="flex items-center justify-center py-1 rounded-tr-lg bg-primary-dark">Total Energy</p>
                  <div className="flex items-center justify-center py-1 font-bold">
                    {_.round(energyStore.getTotalEnergy(index), 2).toLocaleString()}
                  </div>
                  <p className="flex items-center justify-center py-1 bg-primary-dark">ER Required</p>
                  <div className="flex items-center justify-center w-full text-lg font-bold text-purple">
                    {toPercentage(
                      _.max([
                        (charData?.stat?.energy - energyStore.getFixedEnergy(index)) /
                          energyStore.getTotalEnergy(index),
                        1,
                      ])
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-12 gap-4 mt-5">
          <div className="col-span-3">
            <div className="py-2 text-base font-bold text-center rounded-t-lg bg-primary-light">Rotation Settings</div>
            <div className="overflow-hidden rounded-b-lg">
              {_.map(teamStore.characters, (item, index) => (
                <div className="grid grid-cols-6 divide-y-2 divide-primary-border">
                  <p className="flex items-center justify-center col-span-2 px-2 font-semibold bg-primary">
                    {findCharacter(item.cId)?.name}
                  </p>
                  <div className="grid grid-cols-6 col-span-4 gap-1.5 px-2 py-1.5 text-xs bg-primary-dark">
                    <p className="col-span-4 py-1 text-center">Time on Field (s)</p>
                    <TextInput
                      onChange={(v) => setMetaData(index, `fieldTime`, parseInt(v))}
                      value={meta?.[index]?.fieldTime?.toString()}
                      small
                      style="col-span-2"
                      type="number"
                      min={0}
                    />
                    <p className="col-span-4 py-1 text-center">Rotation per Burst</p>
                    <TextInput
                      onChange={(v) => setMetaData(index, `rpb`, parseInt(v))}
                      value={meta?.[index]?.rpb?.toString()}
                      small
                      style="col-span-2"
                      type="number"
                      min={0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
