import React, { Fragment, useCallback } from 'react'
import './App.css'
import { useLocalStore, useObserver } from 'mobx-react'
import { action } from 'mobx'
import { postStore, userStore } from './store'

interface LocalStore {
  name: string
  password: string
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const App = () => {
  // useLocalStore는 해당 컴포넌트 내부에서만 쓰이는 observer이다.
  const state = useLocalStore<LocalStore>(() => ({
    name: '',
    password: '',
    // TypeScript에서는 this도 typing 해줘야 한다.
    onChangeName: action(function (this: LocalStore, e: React.ChangeEvent<HTMLInputElement>) {
      // arrow function에서는 this를 사용할 수 없다.
      this.name = e.target.value
    }),
    onChangePassword: action(function (this: LocalStore, e: React.ChangeEvent<HTMLInputElement>) {
      this.password = e.target.value
    }),
  }))

  // 로그인 시 입력 될 값을 함수에서 직접 던짐
  // const onLogIn = useCallback(() => {
  //   userStore.logIn({
  //     nickname: 'skylar',
  //     password: '1234',
  //   })
  // }, [])

  // 로그인 시 input value로 입력된 값을 던짐
  const onLogIn = useCallback(() => {
    userStore.logIn({
      nickname: state.name,
      password: state.password,
    })
  }, [state.name, state.password])

  const onLogout = useCallback(() => {
    userStore.logOut()
  }, [])

  return useObserver(() => (
    <Fragment>
      {userStore.isLoggingIn ? (
        <div>로그인 중</div>
      ) : userStore.data ? (
        <div>{userStore.data.nickname}</div>
      ) : (
        '로그인이 필요합니다.'
      )}
      {!userStore.data ? <button onClick={onLogIn}>로그인</button> : <button onClick={onLogout}>로그아웃</button>}
      <div>
        <input type="text" value={state.name} onChange={state.onChangeName} />
        <input type="text" value={state.password} onChange={state.onChangePassword} />
      </div>
    </Fragment>
  ))
}

export default App
