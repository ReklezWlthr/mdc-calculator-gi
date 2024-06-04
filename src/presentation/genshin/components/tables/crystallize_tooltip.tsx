import { toPercentage } from '@src/core/utils/converter'
import { TransformativeT } from '@src/data/lib/stats/conditionals/transformative'
import { useStore } from '@src/data/providers/app_store_provider'
import { Element } from '@src/domain/constant'
import { BaseCrystallizeShield } from '@src/domain/scaling'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const CrystallizeTooltip = observer(
  ({ em, level, shieldStrength }: { em: number; level: number; shieldStrength: number }) => {
    const emBonus = 4.44 * (em / (em + 1400))
    const base = BaseCrystallizeShield[level - 1]
    const calc = base * (1 + emBonus)

    const formulaString = `<b class="text-red">${_.round(calc).toLocaleString()}</b> = <b>${_.round(
      base
    ).toLocaleString()}</b> <i class="text-[10px]">Base Shield</i>${
      emBonus ? ` \u{00d7} (1 + <b class="text-yellow">${toPercentage(emBonus)}</b>)` : ''
    }`

    return (
      <Tooltip
        title="Crystallize Shield"
        body={
          <div className="space-y-1">
            <p className="whitespace-nowrap" dangerouslySetInnerHTML={{ __html: formulaString }} />
            <p className="text-xs whitespace-nowrap">
              Off-Element Absorption:{' '}
              <span className="text-desc">{_.round(calc * (1 + shieldStrength)).toLocaleString()}</span>
            </p>
            <p className="text-xs whitespace-nowrap">
              On-Element Absorption:{' '}
              <span className="text-desc">{_.round(calc * (2.5 * (1 + shieldStrength))).toLocaleString()}</span>
            </p>
          </div>
        }
        style="w-fit"
      >
        <p className="font-bold text-center text-indigo-300">{_.round(calc)}</p>
      </Tooltip>
    )
  }
)
