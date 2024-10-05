import { toPercentage } from '@src/core/utils/converter'
import { StatsArray, StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { useStore } from '@src/data/providers/app_store_provider'
import { Stats, WeaponType } from '@src/domain/constant'
import { BulletPoint, Collapsible } from '@src/presentation/components/collapsible'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface NormalBlockProps {
  stat: string
  array: StatsArray[]
  stats: StatsObject
  flat?: boolean
}

interface ExtraBlockProps {
  stats: string
  totalValue: string
  cBase: number
  lBase?: number
  pArray: StatsArray[]
  fArray: StatsArray[]
  round?: number
}

export const AttributeBlock = ({ stat, array, stats, flat }: NormalBlockProps) => {
  const format = (v: number) => (flat ? _.round(v).toLocaleString() : toPercentage(v))
  return (
    <div className="space-y-1">
      <p className="font-bold text-white">
        {stat} <span className="text-red">{format(_.sumBy(array, (item) => item.value))}</span>
      </p>
      <div className="space-y-1 text-xs">
        {_.map(
          array,
          (item) =>
            !!item.value && (
              <BulletPoint key={item.source + item.name}>
                {item.source} / {item.name} <span className="text-desc">{format(item.value)}</span>
                {!!item.base && !!item.multiplier && (
                  <>
                    {' '}
                    = {_.isNumber(item.base) ? _.round(item.base).toLocaleString() : item.base} {`\u{00d7}`}{' '}
                    <span className="text-blue">{format(item.multiplier)}</span>
                    {item.flat && (
                      <>
                        {' '}
                        +{' '}
                        <span className="text-heal">
                          {_.isNumber(item.flat) ? _.round(item.flat).toLocaleString() : item.flat}
                        </span>
                      </>
                    )}
                  </>
                )}
              </BulletPoint>
            )
        )}
      </div>
    </div>
  )
}

export const StatsModal = observer(
  ({ stats, weapon, compare }: { stats: StatsObject; weapon: WeaponType; compare?: boolean }) => {
    const { calculatorStore } = useStore()

    const ExtraBlock = ({ stats, totalValue, cBase, lBase = 0, pArray, fArray, round = 0 }: ExtraBlockProps) => (
      <div className="space-y-1">
        <p className="font-bold text-white">
          {stats} <span className="text-red">{totalValue}</span>
        </p>
        <div className="space-y-1 text-xs">
          <BulletPoint>
            Character Base {stats} <span className="text-desc">{_.round(cBase, round).toLocaleString()}</span>
          </BulletPoint>
          {!!lBase && (
            <BulletPoint>
              Weapon Base {stats} <span className="text-desc">{_.round(lBase, round).toLocaleString()}</span>
            </BulletPoint>
          )}
          {_.map(pArray, (item) => {
            const c = _.round((cBase + lBase) * item.value, round).toLocaleString()
            return (
              !!item.value && (
                <BulletPoint key={item.source + item.name}>
                  {item.source} / {item.name} <span className="text-desc">{c}</span> ={' '}
                  {_.round(cBase + lBase, round).toLocaleString()} {`\u{00d7}`}{' '}
                  <span className="text-blue">{toPercentage(item.value)}</span>
                </BulletPoint>
              )
            )
          })}
          {_.map(
            fArray,
            (item) =>
              !!item.value && (
                <BulletPoint key={item.source + item.name}>
                  {item.source} / {item.name}{' '}
                  <span className="text-desc">{_.round(item.value, round).toLocaleString()}</span>
                  {!!item.base && !!item.multiplier && (
                    <>
                      {' '}
                      = {_.isNumber(item.base) ? _.round(item.base).toLocaleString() : item.base} {`\u{00d7}`}{' '}
                      <span className="text-blue">{toPercentage(item.multiplier)}</span>
                      {item.flat && (
                        <>
                          {' '}
                          +{' '}
                          <span className="text-heal">
                            {_.isNumber(item.flat) ? _.round(item.flat).toLocaleString() : item.flat}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </BulletPoint>
              )
          )}
        </div>
      </div>
    )

    // const defMult =
    //   1 - stats.getDef() / (stats.getDef() + 200 + 10 * +(compare ? setupStore.level : calculatorStore.level))

    const mergeBuffs = (arr: StatsArray[]) =>
      _.reduce(
        arr,
        (acc, curr) => {
          const exist = _.find(acc, (item) => item.name === curr.name && item.source === curr.source)
          if (exist) {
            exist.value += curr.value
            exist.base = curr.base
            exist.multiplier = (exist.multiplier || 0) + curr.multiplier || 0
          } else {
            acc.push(curr)
          }
          return _.cloneDeep(acc)
        },
        []
      )

    return (
      <div className="w-[65vw] bg-primary-dark rounded-lg p-3 space-y-2">
        <p className="text-lg font-bold text-white">Stats Breakdown</p>
        <Collapsible label="Common Attributes">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <ExtraBlock
                stats="HP"
                cBase={stats.BASE_HP}
                lBase={0}
                totalValue={_.round(stats.getHP()).toLocaleString()}
                pArray={stats[Stats.P_HP]}
                fArray={stats[Stats.HP]}
              />
              <ExtraBlock
                stats="ATK"
                cBase={stats.BASE_ATK_C}
                lBase={stats.BASE_ATK_L}
                totalValue={_.round(stats.getAtk()).toLocaleString()}
                pArray={stats[Stats.P_ATK]}
                fArray={stats[Stats.ATK]}
              />
              <ExtraBlock
                stats="DEF"
                cBase={stats.BASE_DEF}
                lBase={0}
                totalValue={_.round(stats.getDef()).toLocaleString()}
                pArray={stats[Stats.P_DEF]}
                fArray={stats[Stats.DEF]}
              />
            </div>
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="Elemental Mastery" array={stats[Stats.EM]} flat />
              <AttributeBlock stats={stats} stat="CRIT Rate" array={stats[Stats.CRIT_RATE]} />
              <AttributeBlock stats={stats} stat="CRIT DMG" array={stats[Stats.CRIT_DMG]} />
              <AttributeBlock stats={stats} stat="Healing Bonus" array={stats[Stats.HEAL]} />
              <AttributeBlock stats={stats} stat="Incoming Healing" array={stats[Stats.I_HEALING]} />
              <AttributeBlock stats={stats} stat="Energy Recharge" array={stats[Stats.ER]} />
            </div>
          </div>
        </Collapsible>
        <Collapsible label="DMG Bonuses">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="All-Type DMG Bonus" array={stats[Stats.ALL_DMG]} />
              <AttributeBlock stats={stats} stat="Physical DMG Bonus" array={stats[Stats.PHYSICAL_DMG]} />
              <AttributeBlock stats={stats} stat="Pyro DMG Bonus" array={stats[Stats.PYRO_DMG]} />
              <AttributeBlock stats={stats} stat="Hydro DMG Bonus" array={stats[Stats.HYDRO_DMG]} />
              <AttributeBlock stats={stats} stat="Cryo DMG Bonus" array={stats[Stats.CRYO_DMG]} />
              <AttributeBlock stats={stats} stat="Electro DMG Bonus" array={stats[Stats.ELECTRO_DMG]} />
              <AttributeBlock stats={stats} stat="Anemo DMG Bonus" array={stats[Stats.ANEMO_DMG]} />
              <AttributeBlock stats={stats} stat="Geo DMG Bonus" array={stats[Stats.GEO_DMG]} />
              <AttributeBlock stats={stats} stat="Dendro DMG Bonus" array={stats[Stats.DENDRO_DMG]} />
            </div>
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="Normal Attack Bonus" array={stats.BASIC_DMG} />
              <AttributeBlock stats={stats} stat="Charged Attack Bonus" array={stats.CHARGE_DMG} />
              <AttributeBlock stats={stats} stat="Plunging Attack Bonus" array={stats.PLUNGE_DMG} />
              <AttributeBlock stats={stats} stat="Elemental Skill DMG Bonus" array={stats.SKILL_DMG} />
              <AttributeBlock stats={stats} stat="Elemental Burst DMG Bonus" array={stats.BURST_DMG} />
            </div>
          </div>
        </Collapsible>
        <Collapsible label="RES PEN">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="All-Type RES PEN" array={stats.ALL_TYPE_RES_PEN} />
              <AttributeBlock stats={stats} stat="Physical RES PEN" array={stats.PHYSICAL_RES_PEN} />
              <AttributeBlock stats={stats} stat="Pyro RES PEN" array={stats.PYRO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Hydro RES PEN" array={stats.HYDRO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Cryo RES PEN" array={stats.CRYO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Electro RES PEN" array={stats.ELECTRO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Anemo RES PEN" array={stats.ANEMO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Geo RES PEN" array={stats.GEO_RES_PEN} />
              <AttributeBlock stats={stats} stat="Dendro RES PEN" array={stats.DENDRO_RES_PEN} />
            </div>
          </div>
        </Collapsible>
        <Collapsible label="Advanced CRIT">
          <div className="grid grid-cols-3 gap-10">
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="Normal Attack CRIT Rate" array={stats.BASIC_CR} />
              <AttributeBlock stats={stats} stat="Charged Attack CRIT Rate" array={stats.CHARGE_CR} />
              <AttributeBlock stats={stats} stat="Plunging Attack CRIT Rate" array={stats.PLUNGE_CR} />
              <AttributeBlock stats={stats} stat="Elemental Skill CRIT Rate" array={stats.SKILL_CR} />
              <AttributeBlock stats={stats} stat="Elemental Burst CRIT Rate" array={stats.BURST_CR} />
              <AttributeBlock stats={stats} stat="Dendro Core CRIT Rate" array={stats.CORE_CR} />
            </div>
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="Normal Attack CRIT DMG" array={stats.BASIC_CD} />
              <AttributeBlock stats={stats} stat="Charged Attack CRIT DMG" array={stats.CHARGE_CD} />
              <AttributeBlock stats={stats} stat="Plunging Attack CRIT DMG" array={stats.PLUNGE_CD} />
              <AttributeBlock stats={stats} stat="Elemental Skill CRIT DMG" array={stats.SKILL_CD} />
              <AttributeBlock stats={stats} stat="Elemental Burst CRIT DMG" array={stats.BURST_CD} />
              <AttributeBlock stats={stats} stat="Dendro Core CRIT DMG" array={stats.CORE_CD} />
            </div>
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="Physical CRIT DMG" array={stats.PHYSICAL_CD} />
              <AttributeBlock stats={stats} stat="Pyro CRIT DMG" array={stats.PYRO_CD} />
              <AttributeBlock stats={stats} stat="Hydro CRIT DMG" array={stats.HYDRO_CD} />
              <AttributeBlock stats={stats} stat="Cryo CRIT DMG" array={stats.CRYO_CD} />
              <AttributeBlock stats={stats} stat="Electro CRIT DMG" array={stats.ELECTRO_CD} />
              <AttributeBlock stats={stats} stat="Anemo CRIT DMG" array={stats.ANEMO_CD} />
              <AttributeBlock stats={stats} stat="Geo CRIT DMG" array={stats.GEO_CD} />
              <AttributeBlock stats={stats} stat="Dendro CRIT DMG" array={stats.DENDRO_CD} />
            </div>
          </div>
        </Collapsible>
        <Collapsible label="Advanced Attributes">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <AttributeBlock stats={stats} stat="CD Reduction" array={stats[StatsObjectKeys.CD_RED]} />
              <AttributeBlock stats={stats} stat="ATK SPD" array={stats[StatsObjectKeys.ATK_SPD]} />
              <AttributeBlock stats={stats} stat="Charge ATK SPD" array={stats[StatsObjectKeys.CHARGE_ATK_SPD]} />
              <AttributeBlock stats={stats} stat="DMG Reduction" array={stats.DMG_REDUCTION} />
              {/* <div className="space-y-1">
                <p className="font-bold text-white">
                  eHP{' '}
                  <span className="text-red">
                    {_.round(
                      stats.getHP() / defMult / (1 - stats.getValue(StatsObjectKeys.DMG_REDUCTION))
                    ).toLocaleString()}
                  </span>
                  <Tooltip
                    title="eHP: Effective HP"
                    body="Represents the amount of raw damage a unit can sustain without considering their DEF and DMG Reduction. Useful when comparing a unit's tankiness."
                    style="w-[350px] font-normal"
                    containerStyle="inline-block ml-2"
                  >
                    <i className="fa-regular fa-question-circle" />
                  </Tooltip>
                </p>
                <BulletPoint>
                  <span className="text-xs">
                    DEF Multiplier <span className="text-desc">{toPercentage(defMult)}</span>
                  </span>
                </BulletPoint>
                <BulletPoint>
                  <span className="text-xs">
                    DMG Reduction Multiplier{' '}
                    <span className="text-desc">{toPercentage(1 - stats.getValue(StatsObjectKeys.DMG_REDUCTION))}</span>
                  </span>
                </BulletPoint>
              </div> */}
            </div>
          </div>
        </Collapsible>
      </div>
    )
  }
)
