import { findCharacter } from '@src/core/utils/finder'
import { StatsObject } from '@src/data/lib/stats/baseConstant'
import { useStore } from '@src/data/providers/app_store_provider'
import { Element, TravelerIconName, WeaponIcon } from '@src/domain/genshin/constant'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo } from 'react'
import { ElementColor, ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import { ConsCircle } from '../components/cons_circle'
import { ConditionalBlock } from '../components/conditional_block'
import { calculateReaction, getTeamOutOfCombat } from '@src/core/utils/calculator'
import Reactions from '@src/data/lib/stats/conditionals/reactions'
import Transformative from '@src/data/lib/stats/conditionals/transformative'
import classNames from 'classnames'
import { Tooltip } from '@src/presentation/components/tooltip'
import { AscensionIcons } from '../components/ascension_icons'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { EnemyModal } from '../components/enemy_modal'
import { ReactionTooltip } from '../components/tables/reaction_tooltip'
import { getSetCount } from '@src/core/utils/data_format'
import {
  calculateArtifact,
  calculateTeamArtifact,
  getArtifactConditionals,
} from '@src/data/lib/stats/conditionals/artifacts/calculate_artifact'

export const Calculator = observer(({}: {}) => {
  const { teamStore, artifactStore, modalStore, calculatorStore } = useStore()
  const { selected, computedStats } = calculatorStore

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const mainComputed = computedStats?.[selected]

  const baseStats = useMemo(
    () => getTeamOutOfCombat(teamStore.characters, artifactStore.artifacts),
    [teamStore.characters, artifactStore.artifacts]
  )

  const conditionals = useMemo(
    () =>
      _.map(teamStore.characters, (item) =>
        _.find(ConditionalsObject, ['id', item.cId])?.conditionals(
          item.cons,
          item.ascension,
          {
            ...item.talents,
            normal: item.talents.normal + (_.includes(_.map(teamStore.characters, 'cId'), '10000033') ? 1 : 0),
          },
          teamStore.characters
        )
      ),
    [teamStore.characters]
  )
  const main = conditionals[selected]

  const artifactConditionals = useMemo(
    () =>
      _.map(teamStore.characters, (item) => {
        const artifacts = _.map(item.equipments.artifacts, (a) => _.find(artifactStore.artifacts, (b) => b.id === a))
        return getArtifactConditionals(artifacts)
      }),
    [teamStore.characters, artifactStore.artifacts]
  )

  const onOpenEnemyModal = useCallback(() => modalStore.openModal(<EnemyModal />), [])

  useEffect(() => {
    calculatorStore.initForm(
      _.map(conditionals, (item, index) =>
        _.reduce(
          _.concat(
            item?.content,
            item?.teammateContent,
            Reactions(
              teamStore.characters[index].level,
              findCharacter(teamStore.characters[index].cId).element,
              Element.PYRO,
              computedStats[index]
            ),
            artifactConditionals[index]?.content,
            artifactConditionals[index]?.teamContent
          ),
          (acc, curr) => {
            if (curr?.show) acc[curr.id] = curr.default
            return acc
          },
          {}
        )
      )
    )
  }, [teamStore.characters])

  // Main Calculator
  useEffect(() => {
    const preCompute = _.map(
      conditionals,
      (base, index) => base?.preCompute(baseStats[index], calculatorStore.form[index]) || baseStats[index]
    ) // Compute all self conditionals, return stats of each char
    const preComputeShared = _.map(preCompute, (base, index) => {
      // Compute all shared conditionals, call function for every char except the owner
      let x = base
      _.forEach(conditionals, (item, i) => {
        // Loop characters, exclude index of the current parent iteration
        if (i !== index)
          x =
            item?.preComputeShared(preCompute[i], x, {
              ...calculatorStore.form[i],
              weapon: findCharacter(teamStore.characters[index]?.cId)?.weapon,
              element: findCharacter(teamStore.characters[index]?.cId)?.element,
            }) || x
      })
      return x
    })
    const postCompute = _.map(
      conditionals,
      (base, index) =>
        base?.postCompute(preComputeShared[index], calculatorStore.form[index]) || preComputeShared[index]
    )
    const postArtifact = _.map(postCompute, (base, index) => {
      let x = base
      const artifactData = _.map(teamStore.characters[index].equipments.artifacts, (item) =>
        _.find(artifactStore.artifacts, ['id', item])
      )
      const setBonus = getSetCount(artifactData)
      _.forEach(calculatorStore.form, (form, i) => {
        x =
          i === index
            ? calculateArtifact(x, form, teamStore.characters, index, setBonus['2276480763'] >= 4)
            : calculateTeamArtifact(x, form)
      })
      return x
    })
    const postReaction = _.map(postArtifact, (base, index) =>
      calculateReaction(base, calculatorStore.form[index], teamStore.characters[index]?.level)
    )
    calculatorStore.setValue('computedStats', postReaction)
  }, [baseStats, calculatorStore.form, teamStore.characters])

  const reactions = _.flatMap(
    _.map(teamStore.characters, (item, index) =>
      Reactions(item.level, findCharacter(item.cId)?.element, calculatorStore.form[index]?.swirl, computedStats[index])
    ),
    (item, index) => _.map(item, (inner) => ({ ...inner, index }))
  )
  const mapped = _.flatMap(
    _.map(conditionals, (item, index) =>
      index === selected
        ? _.concat(item?.content, artifactConditionals[index]?.content)
        : _.concat(item?.teammateContent, artifactConditionals[index]?.teamContent)
    ),
    (item, index) => _.map(item, (inner) => ({ ...inner, index }))
  )
  // Index is embedded into each conditional for the block to call back to
  // Because each of the form with represent ALL the value for each character (including team buffs); not the value that we can change in their page
  // This helps separate buffs trigger of each character and prevent buff stacking
  const mainContent = _.filter(mapped, ['index', selected])
  const teamContent = _.filter(mapped, (item, index) => selected !== item.index)
  const mainReaction = _.filter(reactions, ['index', selected])

  const nilou = _.some(calculatorStore.form, (item) => item?.bountiful_core)
  const transformative = _.filter(
    Transformative(
      char.level,
      charData?.element,
      computedStats[selected],
      calculatorStore.form[selected]?.swirl,
      nilou
    ),
    'show'
  )

  const codeName = _.includes(['PlayerBoy', 'PlayerGirl'], charData?.codeName)
    ? TravelerIconName[charData.element]
    : charData?.codeName

  return (
    <div className="grid w-full grid-cols-3 gap-5 p-5 overflow-y-auto text-white">
      <div className="col-span-2">
        <div className="flex items-center">
          <div className="flex justify-center w-full gap-4 pt-1 pb-3">
            {_.map(teamStore?.characters, (item, index) => (
              <CharacterSelect
                key={`char_select_${index}`}
                onClick={() => teamStore.characters[index]?.cId && calculatorStore.setValue('selected', index)}
                isSelected={index === selected}
                codeName={findCharacter(item.cId)?.codeName}
              />
            ))}
          </div>
          <PrimaryButton onClick={onOpenEnemyModal} title="Enemy Setting" style="whitespace-nowrap" />
        </div>
        <div className="flex flex-col mb-5 text-sm rounded-lg bg-primary-darker h-fit">
          <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">Damage Calculation</p>
          <div className="flex justify-end w-full mb-1.5 bg-primary-dark">
            <div className="grid w-4/5 grid-cols-8 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark">
              <p className="col-span-2">Property</p>
              <p className="col-span-1">Element</p>
              <p className="col-span-1">Base</p>
              <p className="col-span-1">CRIT</p>
              <p className="col-span-1">Average</p>
              <p className="col-span-2">DMG Component</p>
            </div>
          </div>
          <ScalingWrapper
            talent={main?.talents?.normal}
            icon={`https://enka.network/ui${WeaponIcon[charData.weapon]}`}
            element={charData.element}
            level={char.talents?.normal}
            upgraded={main?.upgrade?.normal}
            childeBuff={_.includes(_.map(teamStore.characters, 'cId'), '10000033')}
          >
            <div className="space-y-0.5">
              {_.map(mainComputed?.BASIC_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} />
              ))}
            </div>
            <div className="py-2 space-y-0.5">
              {_.map(mainComputed?.CHARGE_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} />
              ))}
            </div>
            <div className="space-y-0.5">
              {_.map(mainComputed?.PLUNGE_SCALING, (item) => (
                <ScalingSubRows key={item.name} scaling={item} />
              ))}
            </div>
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.skill}
            icon={`https://enka.network/ui/Skill_${codeName === 'PlayerGrass' ? 'E' : 'S'}_${codeName}${
              codeName === 'Qin' ? '_02' : '_01'
            }${codeName === 'Diluc' ? '_01' : ''}.png`}
            element={charData.element}
            level={char.talents?.skill}
            upgraded={main?.upgrade?.skill}
          >
            {_.map(mainComputed?.SKILL_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} />
            ))}
          </ScalingWrapper>
          <div className="w-full my-2 border-t-2 border-primary-border" />
          <ScalingWrapper
            talent={main?.talents?.burst}
            icon={`https://enka.network/ui/Skill_${codeName === 'PlayerGrass' ? 'S' : 'E'}_${codeName}${
              _.includes(['Ayaka', 'Ambor'], codeName) ? '' : '_01'
            }.png`}
            element={charData.element}
            level={char.talents?.burst}
            upgraded={main?.upgrade?.burst}
          >
            {_.map(mainComputed?.BURST_SCALING, (item) => (
              <ScalingSubRows key={item.name} scaling={item} />
            ))}
          </ScalingWrapper>
        </div>
        <div className="flex flex-col w-2/3 text-sm rounded-lg bg-primary-darker h-fit">
          <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
            Transformative Reactions
          </p>
          <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark items-center">
            <p className="col-span-3">Reaction</p>
            <p className="col-span-2">Element</p>
            <p className="col-span-2">Base</p>
            <div className="flex items-center justify-center col-span-2 gap-2 text-start">
              <p>Amplified</p>
              <Tooltip
                title="Amplified Reaction"
                body={
                  <div className="space-y-1 font-normal text-start">
                    <p>
                      For Swirl Reactions, this represents the <b className="text-genshin-anemo">Swirl DMG</b> amplified
                      by either Vaporize, Melt or Aggravate Reaction.
                    </p>
                    <p>
                      For Bloom-related Reactions, this represents the{' '}
                      <b className="text-genshin-dendro">Dendro Core</b>
                      's Crit DMG caused by Nahida's C2.
                    </p>
                    <p>Burning Reactions can be affected by both.</p>
                  </div>
                }
                style="w-[400px]"
              >
                <i className="text-sm fa-regular fa-question-circle" />
              </Tooltip>
            </div>
          </div>
          <div className="py-1 rounded-b-lg bg-primary-darker">
            {_.map(transformative, (item) => {
              const base = item.base * item.mult * (1 + item.emBonus + item.dmg)
              return (
                <div className="grid w-full grid-cols-9 gap-2 py-0.5 pr-2 text-sm text-center" key={item.name}>
                  <p className="col-span-3 font-bold">{item.name}</p>
                  <p className={classNames('col-span-2', ElementColor[item.element])}>{item.element}</p>
                  <div className="col-span-2 text-start">
                    <ReactionTooltip {...item} />
                  </div>
                  <p
                    className={classNames('col-span-2', { 'font-bold text-desc': item.amp > 1 || item.add || item.cd })}
                  >
                    {item.amp > 1 || item.add || item.cd ? _.round((base + item.add) * (1 + item.cd) * item.amp) : '-'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-3">
        <ConditionalBlock
          title="Elemental Reactions"
          contents={_.filter(mainReaction, 'show')}
          tooltipStyle="w-[20vw]"
        />
        <ConditionalBlock title="Self Conditionals" contents={_.filter(mainContent, 'show')} />
        <ConditionalBlock title="Team Conditionals" contents={_.filter(teamContent, 'show')} />
        <StatBlock index={selected} stat={computedStats[selected]} />
        <div className="w-[252px]">
          <AscensionIcons
            talents={main?.talents}
            codeName={codeName}
            element={charData.element}
            stats={computedStats[selected]}
            ascension={char.ascension}
          />
        </div>
        <ConsCircle
          talents={main?.talents}
          codeName={charData.codeName}
          element={charData.element}
          name={charData.constellation}
          cons={char.cons}
          stats={computedStats[selected]}
        />
      </div>
    </div>
  )
})
