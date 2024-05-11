import { useCallback, useMemo } from 'react'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { ArtifactBlock } from '../components/artifact_block'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { ArtifactModal } from '../components/artifact_modal'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { ArtifactSets } from '@src/data/db/genshin/artifacts'
import { Stats } from '@src/domain/genshin/constant'
import { TagSelectInput } from '@src/presentation/components/inputs/tag_select_input'
import { isSubsetOf } from '@src/core/utils/finder'

export const ArtifactInventory = observer(() => {
  const { params, setParams } = useParams({
    types: [],
    set: null,
    main: [],
    subs: [],
  })

  const { artifactStore, modalStore } = useStore()

  const TypeButton = ({ field, icon, value }: { field: string; icon: string; value: string | number }) => {
    const checked = _.includes(params[field], value)

    return (
      <div
        className={classNames('w-10 h-10 p-2 duration-200 rounded-full cursor-pointer hover:bg-primary-light', {
          'bg-primary-light': _.includes(params[field], value),
        })}
        onClick={() => setParams({ [field]: checked ? _.without(params[field], value) : [...params[field], value] })}
      >
        <img src={icon} />
      </div>
    )
  }

  const filteredArtifacts = useMemo(() => {
    let result = artifactStore.artifacts
    if (params.set) result = _.filter(result, (artifact) => artifact.setId === params.set)
    if (params.types.length) result = _.filter(result, (artifact) => _.includes(params.types, artifact.type))
    if (params.main.length) result = _.filter(result, (artifact) => _.includes(params.main, artifact.main))
    if (params.subs.length)
      result = _.filter(result, (artifact) => isSubsetOf(params.subs, _.map(artifact.subList, 'stat')))
    return result
  }, [params.set, params.types, params.subs, params.main])

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal type={4} />)
  }, [modalStore])

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 overflow-y-auto">
      <div className="flex items-center justify-between w-full">
        <p className="text-2xl font-bold text-white w-fit">Artifact Inventory</p>
        <div className="flex gap-5">
          <div className="flex justify-center gap-2">
            <TypeButton field="types" icon="/icons/flower_of_life.png" value={4} />
            <TypeButton field="types" icon="/icons/plume_of_death.png" value={2} />
            <TypeButton field="types" icon="/icons/sands_of_eon.png" value={5} />
            <TypeButton field="types" icon="/icons/goblet_of_eonothem.png" value={1} />
            <TypeButton field="types" icon="/icons/circlet_of_logos.png" value={3} />
          </div>
          <SelectTextInput
            value={params.set}
            options={_.map(ArtifactSets, (artifact) => ({
              name: artifact.name,
              value: artifact.id.toString(),
              img: `https://enka.network/ui/${artifact.icon}_4.png`,
            }))}
            placeholder="Artifact Set"
            onChange={(value) => setParams({ set: value?.value })}
            style="w-[300px]"
          />
          <PrimaryButton title="Add New Artifact" onClick={onOpenModal} />
        </div>
      </div>
      <div className="w-full space-y-1">
        <div className="flex items-center w-full gap-2">
          <p className="text-white">Main Stats:</p>
          <TypeButton field="main" icon="/icons/stat_p_atk.png" value={Stats.P_ATK} />
          <TypeButton field="main" icon="/icons/stat_p_hp.png" value={Stats.P_HP} />
          <TypeButton field="main" icon="/icons/stat_p_def.png" value={Stats.P_DEF} />
          <TypeButton field="main" icon="/icons/stat_em.png" value={Stats.EM} />
          <TypeButton field="main" icon="/icons/stat_er.png" value={Stats.ER} />
          <TypeButton field="main" icon="/icons/stat_crit_rate.png" value={Stats.CRIT_RATE} />
          <TypeButton field="main" icon="/icons/stat_crit_dmg.png" value={Stats.CRIT_DMG} />
          <TypeButton field="main" icon="/icons/stat_heal.png" value={Stats.HEAL} />
          <TypeButton field="main" icon="/icons/stat_physical.png" value={Stats.PHYSICAL_DMG} />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/anemo.png"
            value={Stats.ANEMO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/pyro.png"
            value={Stats.PYRO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/hydro.png"
            value={Stats.HYDRO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/cryo.png"
            value={Stats.CRYO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/electro.png"
            value={Stats.ELECTRO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/geo.png"
            value={Stats.GEO_DMG}
          />
          <TypeButton
            field="main"
            icon="https://cdn.wanderer.moe/genshin-impact/elements/dendro.png"
            value={Stats.DENDRO_DMG}
          />
        </div>
        <div className="flex items-center w-full gap-2">
          <p className="text-white">Sub Stats:</p>
          {/* <TypeButton field="subs" icon="/icons/stat_atk.png" value={Stats.ATK} />
          <TypeButton field="subs" icon="/icons/stat_hp.png" value={Stats.HP} />
          <TypeButton field="subs" icon="/icons/stat_def.png" value={Stats.DEF} />
          <TypeButton field="subs" icon="/icons/stat_p_atk.png" value={Stats.P_ATK} />
          <TypeButton field="subs" icon="/icons/stat_p_hp.png" value={Stats.P_HP} />
          <TypeButton field="subs" icon="/icons/stat_p_def.png" value={Stats.P_DEF} />
          <TypeButton field="subs" icon="/icons/stat_em.png" value={Stats.EM} />
          <TypeButton field="subs" icon="/icons/stat_er.png" value={Stats.ER} />
          <TypeButton field="subs" icon="/icons/stat_crit_rate.png" value={Stats.CRIT_RATE} />
          <TypeButton field="subs" icon="/icons/stat_crit_dmg.png" value={Stats.CRIT_DMG} /> */}
          <TagSelectInput
            values={params.subs}
            options={[
              { name: Stats.ATK, value: Stats.ATK, img: '/icons/stat_atk.png' },
              { name: Stats.HP, value: Stats.HP, img: '/icons/stat_hp.png' },
              { name: Stats.DEF, value: Stats.DEF, img: '/icons/stat_def.png' },
              { name: Stats.P_ATK, value: Stats.P_ATK, img: '/icons/stat_p_atk.png' },
              { name: Stats.P_HP, value: Stats.P_HP, img: '/icons/stat_p_hp.png' },
              { name: Stats.P_DEF, value: Stats.P_DEF, img: '/icons/stat_p_def.png' },
              { name: Stats.EM, value: Stats.EM, img: '/icons/stat_em.png' },
              { name: Stats.ER, value: Stats.ER, img: '/icons/stat_er.png' },
              { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE, img: '/icons/stat_crit_rate.png' },
              { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG, img: '/icons/stat_crit_dmg.png' },
            ]}
            onChange={(subs) => setParams({ subs })}
            placeholder="Sub Stats"
            renderAsText
            maxSelection={4}
            style="w-[200px]"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-5 gap-4">
        {_.map(filteredArtifacts, (artifact) => (
          <ArtifactBlock key={artifact.id} piece={artifact?.type} aId={artifact?.id} showWearer />
        ))}
      </div>
    </div>
  )
})
