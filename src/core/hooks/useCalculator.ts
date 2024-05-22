import { useStore } from '@src/data/providers/app_store_provider'
import { findCharacter } from '../utils/finder'
import { useEffect, useMemo } from 'react'
import { calculateReaction, getTeamOutOfCombat } from '../utils/calculator'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import _ from 'lodash'
import {
  calculateArtifact,
  calculateTeamArtifact,
  getArtifactConditionals,
} from '@src/data/lib/stats/conditionals/artifacts/calculate_artifact'
import {
  WeaponAllyConditionals,
  WeaponConditionals,
  WeaponTeamConditionals,
} from '@src/data/lib/stats/conditionals/weapons/weapon_conditionals'
import Reactions from '@src/data/lib/stats/conditionals/reactions'
import { Element } from '@src/domain/genshin/constant'
import { getSetCount } from '../utils/data_format'
import Transformative from '@src/data/lib/stats/conditionals/transformative'

export const useCalculator = () => {
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
  const weaponConditionals = _.map(teamStore.characters, (item, index) =>
    _.map(
      _.filter(WeaponConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, title: '', content: '', index })
    )
  )
  const weaponTeamConditionals = _.map(teamStore.characters, (item, index) =>
    _.map(
      _.filter(WeaponTeamConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, title: '', content: '', index })
    )
  )
  const weaponAllyConditionals = _.map(teamStore.characters, (item, index) =>
    _.map(
      _.filter(WeaponAllyConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, title: '', content: '', index: selected, owner: index })
    )
  )
  const weaponAllySelectable = (i: number) => _.flatten(_.filter(weaponAllyConditionals, (_, i2) => i !== i2))
  const weaponEligible = (i: number) => [...weaponConditionals[i], ...weaponTeamConditionals[i]]
  const weaponSelectable = (i: number) => [...weaponEligible(i), ...weaponAllySelectable(i)]

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
            artifactConditionals[index]?.teamContent,
            ...weaponSelectable(index)
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
    // Always loop; artifact buffs are either self or team-wide so everything is in each character's own form
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
    const postWeapon = _.map(postArtifact, (base, index) => {
      let x = base
      // Apply self self buff then loop for team-wide buff that is in each character's own form
      _.forEach(calculatorStore.form, (form, i) => {
        _.forEach(
          _.filter(weaponEligible(i), (c) => _.includes(_.keys(form), c.id)),
          (c) => {
            x = c.scaling(x, form, teamStore.characters, teamStore.characters[i]?.equipments?.weapon?.refinement)
          }
        )
      })
      // Targeted buffs are in each team member form aside from the giver so no need to loop
      _.forEach(
        _.filter(weaponAllySelectable(index), (c) => _.includes(_.keys(calculatorStore.form[index]), c.id)),
        (c) => {
          x = c.scaling(
            x,
            calculatorStore.form[index],
            teamStore.characters,
            teamStore.characters[c.owner]?.equipments?.weapon?.refinement
          )
        }
      )
      return x
    })
    // No need to loop; each reaction buff only apply to the character
    const postReaction = _.map(postWeapon, (base, index) =>
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

  return {
    main,
    mainComputed,
    contents: { main: mainContent, team: teamContent, reaction: mainReaction, weapon: weaponSelectable },
    transformative,
  }
}
