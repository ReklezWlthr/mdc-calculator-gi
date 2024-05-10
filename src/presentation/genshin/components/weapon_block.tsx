import { findBaseLevel, findMaxLevel, getWeaponBase, getWeaponBonus } from '@src/core/utils/data_format'
import { useStore } from '@src/data/providers/app_store_provider'
import {
  AscensionOptions,
  DefaultWeaponImage,
  DefaultWeaponName,
  RefinementOptions,
  StatIcons,
  Stats,
  WeaponType,
} from '@src/domain/genshin/constant'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { WeaponModal } from './weapon_modal'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { DefaultWeapon } from '@src/data/stores/team_store'
import { findCharacter, findWeapon } from '@src/core/utils/finder'
import { toPercentage } from '@src/core/utils/converter'
import { Tooltip } from '@src/presentation/components/tooltip'

const WeaponTooltip = ({ wId, refinement }: { wId: string; refinement: number }) => {
  const data = findWeapon(wId)
  const properties = data?.desc?.properties
  const formattedString = _.reduce(
    Array.from(data?.desc?.detail?.matchAll(/{{\d+}}\%?/g) || []),
    (acc, curr) => {
      const index = curr?.[0]?.match(/\d+/)?.[0]
      const isPercentage = !!curr?.[0]?.match(/\%$/)
      return _.replace(
        acc,
        curr[0],
        `<span class="text-desc">${properties?.[index]?.base + properties?.[index]?.growth * (refinement - 1)}${
          isPercentage ? '%' : ''
        }</span>`
      )
    },
    data?.desc?.detail
  )

  return (
    <div className="flex items-center w-full gap-x-2">
      <p className="text-sm">Passive</p>
      <Tooltip
        title={data?.desc?.name}
        body={
          <div
            className="font-normal"
            dangerouslySetInnerHTML={{
              __html: formattedString,
            }}
          />
        }
        position="bottom"
        style="w-[450px]"
      >
        <i className="text-lg fa-regular fa-question-circle" />
      </Tooltip>
    </div>
  )
}

interface StatBlockProps {
  index?: number
  wId: string
  level: number
  ascension: number
  refinement: number
}

export const WeaponBlock = observer(({ index = -1, wId, level = 1, ascension = 0, refinement = 1 }: StatBlockProps) => {
  const { modalStore, teamStore } = useStore()

  const weaponData = findWeapon(wId)
  const weaponType = findCharacter(teamStore.characters[index]?.cId)?.weapon
  const rarity = weaponData?.rarity

  const weaponBaseAtk = getWeaponBase(weaponData?.tier, level, ascension, weaponData?.rarity)
  const weaponSecondary = getWeaponBonus(weaponData?.baseStat, level)

  const canEdit = index >= 0

  const levels = useMemo(
    () =>
      _.map(
        Array(findMaxLevel(ascension) - findBaseLevel(ascension) + 1 || 1).fill(findBaseLevel(ascension)),
        (item, index) => ({
          name: _.toString(item + index),
          value: _.toString(item + index),
        })
      ),
    [ascension]
  )

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<WeaponModal index={index} />)
  }, [modalStore, index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark h-[300px]">
      <div className="flex justify-center px-5 py-2 rounded-t-lg bg-primary-lighter">Weapon</div>
      <div className="flex flex-col p-3 gap-y-3">
        <div className="flex items-center gap-2">
          <PillInput
            onClick={onOpenModal}
            onClear={() => teamStore.setWeapon(index, { wId: null, refinement: 1 })}
            value={weaponData?.name}
            disabled={!canEdit || !teamStore.characters[index]?.cId}
            placeholder={DefaultWeaponName[weaponType]}
          />
          <SelectInput
            onChange={(value) =>
              teamStore.setWeapon(index, {
                refinement: parseInt(value) || 1,
              })
            }
            options={RefinementOptions}
            value={refinement?.toString()}
            style="w-fit"
            disabled={!canEdit || !weaponData || weaponData?.id === '2057'}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between w-1/2 gap-1">
            <img
              src={`https://enka.network/ui/${weaponData?.icon || DefaultWeaponImage[weaponType || WeaponType.SWORD]}${
                ascension >= 2 ? '_Awaken' : ''
              }.png`}
              className="pt-1 border rounded-lg bg-primary-darker border-primary-border"
            />
            <RarityGauge rarity={rarity} />
          </div>
          <div className="w-1/2 space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Level</p>
              <div className="flex items-center w-full gap-2">
                <SelectInput
                  onChange={(value) => teamStore.setWeapon(index, { level: parseInt(value) || 0 })}
                  options={levels}
                  value={level?.toString()}
                  disabled={!canEdit}
                />
                <SelectInput
                  onChange={(value) =>
                    teamStore.setWeapon(index, {
                      ascension: parseInt(value) || 0,
                      level: findBaseLevel(parseInt(value) || 0),
                    })
                  }
                  options={AscensionOptions}
                  value={ascension?.toString()}
                  style="w-fit"
                  disabled={!canEdit}
                />
              </div>
            </div>
            {weaponData && <WeaponTooltip wId={wId} refinement={refinement} />}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <img className="w-4 h-4" src={`/icons/${StatIcons[Stats.ATK]}`} />
              <p>Base ATK</p>
            </div>
            <hr className="w-full border border-primary-border" />
            <p className="font-normal text-gray">{_.round(weaponBaseAtk)}</p>
          </div>
          {weaponData && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <img className="w-4 h-4" src={`/icons/${StatIcons[weaponData?.ascStat]}`} />
                {weaponData?.ascStat || 'N/A'}
              </div>
              <hr className="w-full border border-primary-border" />
              <p className="font-normal text-gray">
                {weaponData?.ascStat === Stats.EM
                  ? _.round(weaponSecondary).toLocaleString()
                  : toPercentage(weaponSecondary || 0)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
