import { toPercentage } from '@src/core/utils/converter'
import { getMainStat } from '@src/core/utils/data_format'
import { useStore } from '@src/data/providers/app_store_provider'
import { ArtifactSets, MainStat, MainStatValue, SubStat } from '@src/domain/genshin/artifact'
import { Stats } from '@src/domain/genshin/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import classNames from 'classnames'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

export const ArtifactModal = ({ type, cId, aId }: { type: number; cId?: string; aId?: string }) => {
  const { teamStore, artifactStore, modalStore } = useStore()

  const { watch, control, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      set: null,
      quality: 5,
      level: 20,
      main: _.head(MainStat[type]),
      type,
      subList: Array(4).fill({ stat: null, value: null }),
    },
  })
  const values = watch()
  const mainStat = getMainStat(values.main, values.quality, values.level)
  const maxLevel = 20 - (5 - values.quality) * 4

  const subList = useFieldArray({ control, name: 'subList' })

  useEffect(() => {
    if (aId) {
      const { data, subList, ...rest } = _.find(artifactStore.artifacts, ['id', aId])

      if (data.id) {
        reset({
          ...rest,
          subList: [...subList, ...Array(4 - subList.length).fill({ stat: null, value: null })],
          set: {
            name: data.name,
            value: data.id.toString(),
            img: `https://enka.network/ui/${data.icon}_4.png`,
          },
        })
      }
    }
  }, [aId])

  const TypeButton = ({ icon, buttonType }: { icon: string; buttonType: number }) => {
    return (
      <div
        className={classNames('w-10 h-10 p-2 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
          'bg-primary-lighter': values.type === buttonType,
        })}
        onClick={() => setValue('type', buttonType)}
      >
        <img src={icon} />
      </div>
    )
  }

  const onSubmit = handleSubmit(({ set, subList, ...rest }) => {
    const id = aId || crypto.randomUUID()
    const setData = _.find(ArtifactSets, ['id', _.parseInt(set?.value)])

    const trimmedSub = _.map(
      _.filter(subList, (item) => item.stat && item.value),
      (item) => ({ ...item, value: parseFloat(item.value) })
    )
    const data = { id, ...rest, data: setData, subList: trimmedSub }

    const oldType = _.find(artifactStore.artifacts, ['id', aId])?.type
    const pass = aId ? artifactStore.editArtifact(aId, data) : artifactStore.addArtifact(data)
    if (pass && cId) {
      teamStore.setArtifact(cId, rest.type, id)
      if (rest.type !== oldType && oldType) teamStore.setArtifact(cId, oldType, null)
    }
    modalStore.closeModal()
  })

  return (
    <div className="w-[300px] p-4 space-y-4 font-semibold text-white rounded-xl bg-primary-dark">
      <div className="flex justify-center gap-2">
        <TypeButton icon="/icons/flower_of_life.png" buttonType={4} />
        <TypeButton icon="/icons/plume_of_death.png" buttonType={2} />
        <TypeButton icon="/icons/sands_of_eon.png" buttonType={5} />
        <TypeButton icon="/icons/goblet_of_eonothem.png" buttonType={1} />
        <TypeButton icon="/icons/circlet_of_logos.png" buttonType={3} />
      </div>
      <div className="flex items-center gap-2">
        <div className="border rounded-full w-9 h-9 bg-primary-darker border-primary-light shrink-0">
          {values?.set?.img && <img src={values?.set?.img} className="scale-105" />}
        </div>
        <Controller
          name="set"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectTextInput
              value={field.value?.value}
              options={_.map(ArtifactSets, (artifact) => ({
                name: artifact.name,
                value: artifact.id.toString(),
                img: `https://enka.network/ui/${artifact.icon}_4.png`,
              }))}
              placeholder="Artifact Set"
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </div>
      <div className="flex items-center justify-center gap-3">
        <p className="text-sm">Level</p>
        <Controller
          name="level"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              value={field.value.toString()}
              options={_.map(Array(maxLevel + 1), (_, index) => ({
                name: '+' + index,
                value: index.toString(),
              }))}
              style="w-16"
              onChange={(value) => field.onChange(_.parseInt(value))}
            />
          )}
        />
        <p className="text-sm">Grade</p>
        <Controller
          name="quality"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectInput
              value={field.value.toString()}
              options={_.map(Array(4).fill(2), (item, index) => ({
                name: <RarityGauge rarity={item + index} />,
                value: (item + index).toString(),
              }))}
              style="w-[70px]"
              onChange={(value) => {
                const quality = _.parseInt(value)
                field.onChange(quality)
                if (values.level > 20 - (5 - quality) * 4) setValue('level', 20 - (5 - quality) * 4)
              }}
            />
          )}
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs">Main Stat</p>
        <div className="flex items-center justify-center gap-3">
          <Controller
            name="main"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectInput
                value={field.value}
                options={_.map(MainStat[values.type], (item) => ({
                  name: item,
                  value: item,
                }))}
                style="w-3/4"
                onChange={field.onChange}
                disabled={_.includes([4, 2], values.type)}
              />
            )}
          />
          <div className="w-1/4 px-3 py-1 text-sm border rounded-lg text-gray border-primary-light bg-primary-darker">
            {_.includes([Stats.HP, Stats.ATK, Stats.EM], values?.main)
              ? _.round(mainStat).toLocaleString()
              : toPercentage(mainStat)}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs">Sub Stats</p>
        <div className="space-y-2">
          {_.map(subList.fields, (field, index) => (
            <div className="flex items-center justify-center gap-3" key={index}>
              <SelectTextInput
                value={subList.fields[index]?.stat}
                options={_.map(SubStat, (item) => ({
                  name: item,
                  value: item,
                }))}
                style="w-3/4"
                onChange={(value) => subList.update(index, { ...subList.fields[index], stat: value?.name })}
                placeholder={`Sub Stat ${index + 1}`}
              />
              <TextInput
                type="number"
                value={subList.fields[index]?.value?.toString()}
                onChange={(value) => subList.update(index, { ...subList.fields[index], value })}
                disabled={!subList.fields[index]?.stat}
                style="!w-1/4"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <PrimaryButton title="Confirm" onClick={onSubmit} />
      </div>
    </div>
  )
}
