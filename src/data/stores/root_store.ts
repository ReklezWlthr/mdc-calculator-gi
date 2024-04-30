import { Modal, ModalStoreType } from './modal_store'
// import { User, UserType } from './user_store'

interface RootStoreType {
  modalStore: ModalStoreType
  // userStore: UserType
}

export class RootStore {
  modalStore: ModalStoreType
  // userStore: UserType

  constructor() {
    this.modalStore = new Modal()
    // this.userStore = new User()
  }

  hydrate(data: RootStoreType) {
    if (!data) return
    this.modalStore.hydrate(data.modalStore)
    // this.userStore.hydrate(data.userStore)
  }
}
