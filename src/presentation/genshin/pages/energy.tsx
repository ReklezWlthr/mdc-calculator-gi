import { toPercentage } from '@src/core/utils/converter'
import { ElementColor } from '@src/core/utils/damageStringConstruct'
import { findCharacter } from '@src/core/utils/finder'
import { ParticleCount } from '@src/data/db/particles'
import { useStore } from '@src/data/providers/app_store_provider'
import { Element } from '@src/domain/constant'
import { BulletPoint } from '@src/presentation/components/collapsible'
import { CheckboxInput } from '@src/presentation/components/inputs/checkbox'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { EnergySettings } from '../components/energy/energy_settings'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { InteractionModal } from '../components/modals/interaction_modal'
import { useFixedEnergy } from '@src/core/hooks/useFixedEnergy'
import { FixedEnergyModal } from '../components/energy/fixed_energy_modal'
import { ExtraSkillProc } from '@src/data/stores/energy_store'

export const EnergyRequirement = observer(() => {
  const { teamStore, settingStore, energyStore, modalStore } = useStore()

  const { meta, setMetaData } = energyStore
  const totalRotation = _.sumBy(meta, (item) => item.fieldTime)

  const onOpenICDModal = useCallback(() => modalStore.openModal(<InteractionModal />), [])
  const onOpenEnergyModal = useCallback(() => modalStore.openModal(<FixedEnergyModal />), [])

  useFixedEnergy()

  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full gap-5 p-5 text-white max-w-[1200px] mx-auto text-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-2xl font-bold">ER Requirement</p>
          <div className="flex gap-2">
            <PrimaryButton title="Fixed Energy Gain" onClick={onOpenEnergyModal} />
            <PrimaryButton title="ICDs & Interactions" onClick={onOpenICDModal} />
          </div>
        </div>
        <div className="flex w-full font-semibold">
          <div className="w-[17%] shrink-0" />
          <div className="grid grid-cols-12 w-[53%] shrink-0 gap-3 bg-primary-border rounded-tl-lg py-1">
            <div className="flex items-center justify-center col-span-5 gap-2">
              <p>Skill Uses</p>
              <Tooltip
                title="Skill Uses"
                body={
                  <div className="space-y-1 font-normal">
                    <p>The number of times the character uses their Skill in each of their rotation.</p>
                    <p>
                      Some Talents that generate Particle(s) over time have <b>Particle ICD</b>. The value given should
                      only account for hits that generate Particle. Please refer to the{' '}
                      <b className="text-desc">ICDs & Interactions</b> section or use the given preset(s). You can put
                      in decimals if the Skill does not last its full uptime or misses some hits.
                    </p>
                    <p>
                      Although the calculator allows you to customize your rotation to an extend, please be wary of each
                      character's CD, especially ones with high Skill CD like Fischl, Noelle, or Xingqiu. Total rotation
                      length should realistically be higher than the characters' CD if you are planning to use one every
                      rotation.
                    </p>
                  </div>
                }
                position="bottom"
                style="w-[500px]"
              >
                <i className="fa-regular fa-question-circle" />
              </Tooltip>
            </div>
            <div className="flex items-center justify-center col-span-7 gap-2">
              <p>Particle Funneling</p>
              <Tooltip
                title="Particle Funneling"
                body={
                  <div className="space-y-1 font-normal">
                    <p>
                      You can choose to funnel Particles from Skill casts here. There are 2 possible types of funnel:
                    </p>
                    <p>
                      - <b>Normal Skills</b> allow you to choose how much Particles will be funneled to the target.{' '}
                      <b>Self</b> means the character will catch their own Particles, and <b>Don't Know</b> considers
                      them as Off-Field Particles for everyone.
                    </p>
                    <p>
                      - <b>Turrets</b> distribute Particles based on field time by default, but you can manually assign
                      Particles percentage to each characters here. Each slot represents a character in the setup in
                      respective order.
                    </p>
                  </div>
                }
                position="bottom"
                style="w-[450px]"
              >
                <i className="fa-regular fa-question-circle" />
              </Tooltip>
            </div>
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
                    <p className="font-semibold py-0.5 text-center w-full text-sm px-1">{charData?.name}</p>
                    <div className="flex flex-col justify-between px-2 py-1 text-xs font-semibold h-11 text-gray bg-primary-dark">
                      <p>A{item.ascension}</p>
                      <p>C{item.cons}</p>
                    </div>
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
                  {_.map(ParticleCount(item.cId, item.cons), (component, cIndex) => {
                    // const data = meta[index]?.skill?.[cIndex]
                    // const uptime =
                    //   (data?.duration * (data?.proc + (_.includes(ExtraSkillProc, item?.cId) && data?.proc ? 1 : 0))) /
                    //   totalRotation

                    return (
                      <div className="grid w-full grid-cols-12 py-1 bg-primary-dark gap-x-3">
                        <div className="flex items-center col-span-5 gap-x-1">
                          <p className="flex items-center justify-center w-full text-xs font-semibold">
                            {component?.name}
                            {/* <span className="ml-1 font-normal text-gray">
                              {!!uptime ? `- ${toPercentage(_.min([uptime, 1]))} Uptime` : ''}
                            </span> */}
                          </p>
                          <TextInput
                            small
                            onChange={(v) => setMetaData(index, `skill[${cIndex}].proc`, parseFloat(v))}
                            value={meta[index]?.skill?.[cIndex]?.proc?.toString()}
                            style="w-[60px] shrink-0"
                            type="number"
                            min={0}
                          />
                        </div>
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
                                onChange={(v) => setMetaData(index, `skill[${cIndex}].percentage`, parseFloat(v))}
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
                            <CheckboxInput
                              onClick={(v) => setMetaData(index, `skill[${cIndex}].override`, v)}
                              checked={meta[index]?.skill?.[cIndex]?.override}
                            />
                            <div className="flex items-center gap-1 text-gray">
                              <p className="flex items-center justify-center mr-1 text-xs font-semibold text-white shrink-0">
                                Ratio Override
                              </p>
                              {_.map(meta[index]?.skill?.[cIndex]?.ratio, (r, ri) => (
                                <>
                                  {!!ri && <span>/</span>}
                                  <TextInput
                                    small
                                    onChange={(v) => setMetaData(index, `skill[${cIndex}].ratio[${ri}]`, parseFloat(v))}
                                    value={r?.toString()}
                                    disabled={!meta[index]?.skill?.[cIndex]?.override}
                                    min={0}
                                    type="number"
                                  />
                                </>
                              ))}
                              <p>%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
                      onChange={(v) => setMetaData(index, `add`, parseFloat(v))}
                      value={meta?.[index]?.add?.toString()}
                      type="number"
                      style="h-fit"
                    />
                  </div>
                </div>
                <div className="w-[10%] bg-primary-darker text-xs rounded-r-lg flex flex-col">
                  <p className="flex items-center justify-center py-1 rounded-tr-lg bg-primary-dark">Energy Gain</p>
                  <Tooltip
                    title="Energy Gain per Burst"
                    body={
                      <div className="space-y-1 text-xs">
                        {_.map(teamStore.characters, (c, i) => (
                          <div className="flex items-center justify-between">
                            <b className="mr-2 shrink-0">Energy from {findCharacter(c?.cId)?.name}</b>
                            <div className="w-full border-t-2 border-primary" />
                            <span className="ml-2 text-desc shrink-0">
                              {_.round(energyStore.getEnergyFrom(i, index), 1).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between">
                          <b className="mr-2 shrink-0">HP Drops</b>
                          <div className="w-full border-t-2 border-primary" />
                          <span className="ml-2 text-desc shrink-0">
                            {_.round(energyStore.getAdditionalPersonal(index)?.additional, 1).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <b className="mr-2 shrink-0">Additional Sources</b>
                          <div className="w-full border-t-2 border-primary" />
                          <span className="ml-2 text-desc shrink-0">
                            {_.round(energyStore.getAdditionalPersonal(index)?.electro, 1).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    }
                    style="w-[250px]"
                  >
                    <div className="flex items-center justify-center py-1 text-xs font-bold">
                      {_.round(
                        energyStore.getTotalEnergy(index) + energyStore.getFixedEnergy(index),
                        2
                      ).toLocaleString()}
                    </div>
                  </Tooltip>
                  <p className="flex items-center justify-center py-1 bg-primary-dark">ER Required</p>
                  <div className="flex items-center justify-center w-full text-lg font-bold text-purple">
                    {toPercentage(
                      _.max([
                        (charData?.stat?.energy - energyStore.getFixedEnergy(index)) /
                          energyStore.getTotalEnergy(index),
                        1,
                      ]),
                      1,
                      true
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <EnergySettings />
      </div>
    </div>
  )
})