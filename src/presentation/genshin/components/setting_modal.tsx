import { useStore } from '@src/data/providers/app_store_provider'
import { CheckboxInput } from '@src/presentation/components/inputs/checkbox'
import { ToggleSwitch } from '@src/presentation/components/inputs/toggle'
import { observer } from 'mobx-react-lite'

export const SettingModal = observer(() => {
  const { settingStore } = useStore()

  return (
    <div className="w-[25vw] bg-primary-dark rounded-lg p-3 space-y-2">
      <p className="text-lg font-bold text-white">Settings</p>
      <div className="p-3 space-y-1 rounded-lg bg-primary-darker">
        <div className="flex items-center justify-between gap-x-2">
          <p className="text-sm text-gray">Choose Your Traveler</p>
          <div className="flex items-center gap-2 text-xs text-desc">
            <p>Aether</p>
            <ToggleSwitch
              enabled={settingStore.settings.travelerGender === 'PlayerGirl'}
              onClick={(v) => settingStore.setSettingValue({ travelerGender: v ? 'PlayerGirl' : 'PlayerBoy' })}
            />
            <p>Lumine</p>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1 rounded-lg bg-primary-darker">
        <p className="text-white">Account Data</p>
        <div className="flex gap-x-2">
          <p className="text-sm text-gray">Automatically save my account data to the browser's local storage</p>
          <CheckboxInput
            checked={settingStore.settings.storeData}
            onClick={(v) => settingStore.setSettingValue({ storeData: v })}
          />
        </div>
        <p className="text-xs italic text-desc">✦ The saved data will only be available in this browser.</p>
        <p className="text-xs italic text-red">
          ✦ Turning this setting off will potentially remove all your data on the site.
        </p>
      </div>
    </div>
  )
})
