import { action, observable } from 'mobx'

// 다른 곳에서 자주 사용될 것 같은 User는 interface로 따로 뽑아주었다.
export interface User {
  nickname: string
  password: string
}

interface UserStore {
  isLoggingIn: boolean
  data: User | null
  logIn: (data: User) => void
  logOut: () => void
}

// observable은 state가 바뀌면 컴포넌트를 re-rendering 시켜준다.
// 단 컴포넌트가 useObserver()로 감싸져 있어야 한다.
const userStore = observable<UserStore>({
  // MobX에서 state를 변경하는 함수들은 action으로 감싸주는 것이 좋다.
  // action으로 감싸주면 비동기 처리와 함께 수행될 때 state가 변경되지 않는 경우도 막아준다.
  isLoggingIn: false,
  data: null,

  // mobX에서 arrow function을 쓰면 this를 사용하지 못한다.때문에 userStore.으로 객체에 접근해야 한다. function(){}을 쓰면 this를 사용할 수 있다.
  logIn: action((data: User) => {
    userStore.isLoggingIn = true
    // action을 만들어주지 않으면 setTimeout과 같은 비동기 작업을 할 때 제대로 작동하지 않는다.
    setTimeout(
      action(() => {
        userStore.data = data
        userStore.isLoggingIn = false

        postStore.addPost('hello')
      }),
      2000,
    )
  }),
  logOut: action(() => {
    userStore.data = null
  }),
})

interface PostStore {
  data: string[]
  addPost: (data: string) => void
}

const postStore = observable<PostStore>({
  data: [],
  // action 함수가 없으면 typing error가 발생하지 않지만 action함수로 감싸 고차 함수로 만들면 typing이 제대로 되지 않는 상황이 발생한다.
  // MobX 뿐 아니라 react API들도 마찬가지인데 그럴 때는 파라미터에 직접 타이핑을 해주면 된다.
  addPost: action((data: string) => {
    postStore.data.push(data)
  }),
})

export { userStore, postStore }
