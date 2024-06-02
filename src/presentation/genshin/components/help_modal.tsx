import { observer } from 'mobx-react-lite'

export const HelpModal = observer(() => {
  return (
    <div className="w-[50vw] bg-primary-dark rounded-lg p-3 space-y-2">
      <p className="text-lg font-bold text-white">Quick Guide</p>
      <div className="p-3 space-y-1 text-sm rounded-lg bg-primary-darker text-gray">
        <p className="text-base font-bold text-white">Team Setup</p>
        <p>This page contains 3 main sections:</p>
        <p>
          1. <b className="text-desc">Character</b>: allows you to select your character for the slot, as well as
          specifying their level, ascension, constellations, and talent levels.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> To change your character, click the box below{' '}
          <span className="text-desc">Name</span>. This will bring up a modal for character selection. Inputs for
          character's level, ascension and constellations are right below, and will be disabled until a character is
          chosen.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> Once a character is chosen, you may additionally change their talent
          levels. Please note that this level does not include additional level gained through constellations.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> Character's stats are also displayed below. These values does not take
          any conditional effects into account. To view the character's final stats after conditionals, please head to
          the <b className="text-red">Damage Calculator</b> page.
        </p>
        <p className="pt-1">
          2. <b className="text-desc">Weapon</b>: allows you to select your character's weapon.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> You can hover the{' '}
          <i className="fa-regular fa-question-circle indent-0" /> icon for the weapon's passive at the chosen
          refinement.
        </p>
        <p className="pt-1">
          3. <b className="text-desc">Artifacts</b>: allows you to customize your character's artifacts.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> Adding a new artifact will create it in your{' '}
          <b className="text-red">Artifact Inventory</b> while equipping an artifact will instead allow you to choose
          any existing ones from there.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> Once equipped, hover over the artifact card for options to edit, swap,
          unequip or delete the artifact.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> The set bonus for equipped artifacts and the team's elemental resonance
          can be found at the bottom. Hover their name to display the effects.
        </p>
        <p className="pl-3">
          <span className="text-blue">✦</span> You may save a set of artifacts as build using the button on the bottom
          right of the page. You can also fast-equip a saved build from there as well.
        </p>
      </div>
    </div>
  )
})
