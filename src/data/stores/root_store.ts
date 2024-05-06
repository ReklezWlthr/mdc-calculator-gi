import { Build, BuildStoreType } from './build_store'
import { InventoryStoreType, Inventory } from './inventory_store'
import { Modal, ModalStoreType } from './modal_store'
import { Team, TeamStoreType } from './team_store'
// import { User, UserType } from './user_store'

interface RootStoreType {
  modalStore: ModalStoreType
  teamStore: TeamStoreType
  artifactStore: InventoryStoreType
  buildStore: BuildStoreType
  // userStore: UserType
}

export class RootStore {
  modalStore: ModalStoreType
  teamStore: TeamStoreType
  artifactStore: InventoryStoreType
  buildStore: BuildStoreType
  // userStore: UserType

  constructor() {
    this.modalStore = new Modal()
    this.teamStore = new Team()
    this.artifactStore = new Inventory()
    this.buildStore = new Build()
    // this.userStore = new User()
  }

  hydrate(data: RootStoreType) {
    if (!data) return
    this.modalStore.hydrate(data.modalStore)
    this.teamStore.hydrate(data.teamStore)
    this.artifactStore.hydrate(data.artifactStore)
    this.buildStore.hydrate(data.buildStore)
    // this.userStore.hydrate(data.userStore)
  }
}
