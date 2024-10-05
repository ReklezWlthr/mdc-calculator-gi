import { useStore } from '@src/data/providers/app_store_provider'
import { findCharacter } from '../utils/finder'
import { useEffect, useMemo, useState } from 'react'
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
import { Element, ITeamChar, Stats } from '@src/domain/constant'
import { getSetCount } from '../utils/data_format'
import Transformative from '@src/data/lib/stats/conditionals/transformative'
import { ResonanceConditionals } from '@src/data/lib/stats/conditionals/resonance'
import { Resonance } from '@src/data/db/characters'
import { isFlat } from '@src/presentation/genshin/components/custom_modal'
import { StatsObject, StatsObjectKeysT } from '@src/data/lib/stats/baseConstant'
import { ArtifactSets } from '@src/data/db/artifacts'

interface CalculatorOptions {
  enabled?: boolean
  teamOverride?: ITeamChar[]
  formOverride?: Record<string, any>[]
  customOverride?: {
    name: StatsObjectKeysT
    value: number
    debuff: boolean
    toggled: boolean
  }[][]
  doNotSaveStats?: boolean
  indexOverride?: number
  talentOverride?: ITeamChar
  weaknessOverride?: Element[]
  initFormFunction?: (f: Record<string, any>[]) => void
}

export const useCalculator = ({
  enabled = true,
  teamOverride,
  formOverride,
  customOverride,
  indexOverride,
  talentOverride,
  weaknessOverride,
  doNotSaveStats,
  initFormFunction,
}: CalculatorOptions) => {
  const { teamStore, artifactStore, calculatorStore } = useStore()
  const { selected, computedStats } = calculatorStore

  const forms = formOverride || calculatorStore.form
  const team = teamOverride || teamStore.characters
  const custom = customOverride || calculatorStore.custom

  const char = team[selected]
  const charData = findCharacter(char.cId)

  const [finalStats, setFinalStats] = useState<StatsObject[]>(null)

  const mainComputed = computedStats?.[selected]

  const baseStats = useMemo(
    () => getTeamOutOfCombat(team, artifactStore.artifacts),
    [team, artifactStore.artifacts]
  )

  // Conditional objects include talent descriptions, conditional contents and a calculator
  const conditionals = useMemo(
    () =>
      _.map(team, (item) =>
        _.find(ConditionalsObject, ['id', item.cId])?.conditionals(
          item.cons,
          item.ascension,
          {
            ...item.talents,
            normal: item.talents.normal + (_.includes(_.map(team, 'cId'), '10000033') ? 1 : 0),
          },
          team
        )
      ),
    [team]
  )
  const main = conditionals[selected]

  const artifactConditionals = useMemo(
    () =>
      _.map(team, (item) => {
        const artifacts = _.map(item.equipments.artifacts, (a) => _.find(artifactStore.artifacts, (b) => b.id === a))
        return getArtifactConditionals(artifacts)
      }),
    [team, artifactStore.artifacts]
  )
  const weaponConditionals = _.map(team, (item, index) =>
    _.map(
      _.filter(WeaponConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, title: '', content: '', index })
    )
  )
  const weaponTeamConditionals = _.map(team, (item, index) =>
    _.map(
      _.filter(WeaponTeamConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, title: '', content: '', index })
    )
  )
  const weaponAllyConditionals = _.map(team, (item, index) =>
    _.map(
      _.filter(WeaponAllyConditionals, (weapon) => _.includes(weapon.id, item?.equipments?.weapon?.wId)),
      (cond) => ({ ...cond, id: `${cond.id}_${index}`, title: '', content: '', index: selected, owner: index })
    )
  )
  const weaponAllySelectable = (i: number) => _.flatten(_.filter(weaponAllyConditionals, (_, i2) => i !== i2))
  const weaponEligible = (i: number) => [...weaponConditionals[i], ..._.flatten(weaponTeamConditionals)]
  const weaponSelectable = (i: number) => [...weaponEligible(i), ...weaponAllySelectable(i)]

  const allyContents = (i: number, inverse?: boolean) =>
    _.flatten(
      _.filter(
        _.map(conditionals, (item) => _.map(item?.allyContent, (content) => ({ ...content }))),
        (_, index) => (inverse ? index === i : index !== i)
      )
    )

  const resonanceConditionals = _.map(ResonanceConditionals(team), (item) => {
    const res = _.find(Resonance, ['element', Element[item.id.split('_')[0].toUpperCase()]])
    return {
      ...item,
      content: res?.desc,
      title: res?.name,
    }
  })

  useEffect(() => {
    calculatorStore.initForm(
      _.map(conditionals, (item, index) =>
        _.reduce(
          _.concat(
            item?.content,
            item?.teammateContent,
            allyContents(index),
            Reactions(
              team[index].level,
              findCharacter(team[index].cId)?.element,
              Element.PYRO,
              computedStats[index]
            ),
            artifactConditionals[index]?.content,
            artifactConditionals[index]?.teamContent,
            ...weaponSelectable(index),
            resonanceConditionals
          ),
          (acc, curr) => {
            if (curr?.show) acc[curr.id] = curr.default
            return acc
          },
          {}
        )
      )
    )
  }, [team])

  // =================
  //
  // Main Calculator
  //
  // =================

  // Calculate normal stats first, then ones from allies, then ones from artifacts
  // Those above does not rely on character's own stat (except EoSF) so they are placed first
  // Some weapon buffs scale off character's stat so we have to calculate ones above first
  // Reactions are placed last because they only provide damage buff, not stat buffs, and heavily relies on stats
  useEffect(() => {
    if (!_.some(forms)) return
    if (!enabled) return
    const preCompute = _.map(
      conditionals,
      (base, index) => base?.preCompute(baseStats[index], forms[index]) || baseStats[index]
    ) // Compute all self conditionals, return stats of each char
    const preComputeShared = _.map(preCompute, (base, index) => {
      // Compute all shared conditionals, call function for every char except the owner
      let x = base
      _.forEach(conditionals, (item, i) => {
        // Loop characters, exclude index of the current parent iteration
        if (i !== index)
          x =
            item?.preComputeShared(
              preCompute[i],
              x,
              {
                ...forms[i],
                weapon: findCharacter(team[index]?.cId)?.weapon,
                element: findCharacter(team[index]?.cId)?.element,
              },
              forms[index]
            ) || x
      })
      return x
    })
    const postResonance = _.map(preComputeShared, (base, index) => {
      _.forEach(_.filter(resonanceConditionals, 'show'), (item) => {
        base = item.scaling(base, forms[index], 0, null)
      })
      return base
    })
    const postCustom = _.map(postResonance, (base, index) => {
      let x = base
      _.forEach(custom[index], (v) => {
        x[v.name as any] += v.value / (isFlat(v.name) ? 1 : 100)
      })
      return x
    })
    const emblem = [false, false, false, false]
    // Always loop; artifact buffs are either self or team-wide so everything is in each character's own form
    const postArtifact = _.map(postCustom, (base, index) => {
      let x = base
      const artifactData = _.map(team[index].equipments.artifacts, (item) =>
        _.find(artifactStore.artifacts, ['id', item])
      )
      const setBonus = getSetCount(artifactData)
      if (setBonus['2276480763'] >= 4) emblem[index] = true
      _.forEach(forms, (form, i) => {
        x = i === index ? calculateArtifact(x, form, team, index) : calculateTeamArtifact(x, form)
      })
      return x
    })
    const postWeapon = _.map(postArtifact, (base, index) => {
      let x = base
      // Apply self self buff then loop for team-wide buff that is in each character's own form
      _.forEach(forms, (form, i) => {
        _.forEach(
          _.filter(i === index ? weaponConditionals[i] : weaponTeamConditionals[i], (c) =>
            _.includes(_.keys(form), c.id)
          ),
          (c) => {
            x = c.scaling(x, form, team[i]?.equipments?.weapon?.refinement, {
              team: team,
              element: findCharacter(team[i]?.cId)?.element,
              own: postArtifact[i],
              totalEnergy: _.sumBy(postArtifact, (pa) => pa.MAX_ENERGY),
              index: i,
            })
          }
        )
      })
      // Targeted buffs are in each team member form aside from the giver so no need to loop
      _.forEach(
        _.filter(weaponAllySelectable(index), (c) => _.includes(_.keys(forms[index]), c.id)),
        (c) => {
          x = c.scaling(x, forms[index], team[c.owner]?.equipments?.weapon?.refinement, {
            team: team,
            element: findCharacter(team[c.owner]?.cId)?.element,
            own: postArtifact[c.owner],
            totalEnergy: _.sumBy(postArtifact, (pa) => pa.MAX_ENERGY),
            index,
            owner: c.owner,
          })
        }
      )
      return x
    })
    const postCompute = _.map(
      conditionals,
      (base, index) =>
        base?.postCompute(postWeapon[index], forms[index], postWeapon, forms) ||
        postWeapon[index]
    )
    const postArtifactCallback = _.map(postCompute, (base, index) => {
      let x = base
      const set = getSetCount(
        _.map(team[index]?.equipments?.artifacts, (item) =>
          _.find(artifactStore.artifacts, (a) => a.id === item)
        )
      )
      _.forEach(set, (value, key) => {
        if (value >= 2) {
          const half = _.find(ArtifactSets, ['id', key])?.half
          if (half) x = half(x)
        }
        if (value >= 4) {
          const add = _.find(ArtifactSets, ['id', key])?.add
          if (add) x = add(x, x?.WEAPON, team)
        }
      })
      return x
    })
    // No need to loop; each reaction buff only apply to the character
    const postReaction = _.map(postArtifactCallback, (base, index) =>
      calculateReaction(base, forms[index], team[index]?.level)
    )
    // Cleanup callbacks for buffs that should be applied last
    const final = _.map(postReaction, (base, index) => {
      let x = base
      _.forEach(base.CALLBACK, (cb) => {
        x = cb(x, postReaction)
      })
      // EoSF Buff is placed here because some effects increase ER
      if (emblem[index])
        x.BURST_DMG.push({
          value: _.min([x?.getValue(Stats.ER) * 0.25, 0.75]),
          name: '4-Piece',
          source: 'Emblem of Severed Fate',
        })
      return x
    })
    if (!doNotSaveStats) {
      calculatorStore.setValue('computedStats', final)
    }
    console.log(final)
    setFinalStats(final)
  }, [baseStats, forms, custom, team])

  // =================
  //
  // Mapped Contents
  //
  // =================

  // Mapped reaction contents
  const reactions = _.flatMap(
    _.map(team, (item, index) =>
      Reactions(item.level, findCharacter(item.cId)?.element, forms[index]?.swirl, computedStats[index])
    ),
    (item, index) => _.map(item, (inner) => ({ ...inner, index }))
  )
  // Mapped conditional contents that the selected character can toggle (Self + all team buffs from allies)
  // Soon might have to implement single target buff
  const mapped = _.flatMap(
    _.map(conditionals, (item, index) =>
      index === selected
        ? _.concat(item?.content, artifactConditionals[index]?.content, resonanceConditionals)
        : _.concat(item?.teammateContent, artifactConditionals[index]?.teamContent)
    ),
    (item, index) => _.map(item, (inner) => ({ ...inner, index }))
  )
  const allyMapped = _.map(allyContents(selected), (item) => ({ ...item, index: selected }))
  // Index is embedded into each conditional for the block to call back to
  // Because each of the form with represent ALL the buffs that each character has (including team buffs); not the value that we can change in their page
  // This helps separate buffs trigger of each character and prevent buff stacking
  // Update: This is with the exception of single target buffs that will be put in allies' form instead of the giver so that the buff will not activate all at once
  const mainContent = _.filter(mapped, ['index', selected])
  const teamContent = [..._.filter(mapped, (item, index) => selected !== item.index), ...allyMapped]
  const mainReaction = _.filter(reactions, ['index', selected])

  // Content of transformative reaction dmg
  const nilou = _.some(forms, (item) => item?.bountiful_core)
  const transformative = _.filter(
    Transformative(
      char.level,
      charData?.element,
      computedStats[selected],
      forms[selected]?.swirl,
      nilou
    ),
    'show'
  )

  return {
    main,
    mainComputed,
    finalStats,
    contents: { main: mainContent, team: teamContent, reaction: mainReaction, weapon: weaponSelectable },
    transformative,
  }
}
