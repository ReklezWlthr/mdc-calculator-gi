import { findCharacter } from '@src/core/utils/finder'
import { AutoEnergy } from '@src/data/db/energy'
import { useStore } from '@src/data/providers/app_store_provider'
import { BulletPoint } from '@src/presentation/components/collapsible'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const FixedEnergyModal = observer(() => {
  const { energyStore, teamStore } = useStore()

  return (
    <div className="w-[30vw] bg-primary-dark rounded-lg py-3 px-4 space-y-2 text-white">
      <p className="text-lg font-bold col-span-full">Fixed Energy Gain List</p>
      <div className="grid grid-cols-2 gap-4">
        {_.map(_.groupBy(energyStore.fixedEnergy, 'receiver'), (item, key) => (
          <div>
            <p className="font-bold text-sm">{findCharacter(key)?.name}</p>
            {_.map(item, (sub) => (
              <BulletPoint color="text-violet-300">
                <span className="text-gray text-xs">
                  <span className="font-bold">
                    {sub.name}
                    <i className="fa-solid fa-arrow-right mx-1.5" />
                  </span>
                  <span className="text-desc">{_.round(sub.value, 1).toLocaleString()}</span>
                </span>
              </BulletPoint>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
})
