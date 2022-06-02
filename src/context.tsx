import React, { ReactElement, ReactNode } from 'react'
import { createContext } from 'react'
import { userStore, postStore } from './store'

export const storeContext = createContext({
  userStore,
  postStore,
})

// props children을 typing 해주지 않으면 error 발생한다.
interface IStoreProvider {
  children: ReactElement
  // 더 넓은 범위로 잡으려면 ReactNode로 typing 해줘도 된다.
  // children: ReactNode
}

export const StoreProvider: React.FC<IStoreProvider> = ({ children }) => {
  return <storeContext.Provider value={{ userStore, postStore }}>{children}</storeContext.Provider>
}

export default StoreProvider
