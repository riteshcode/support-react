import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../src/redux/slice/counterSlice'
import loginReducer from '../src/redux/slice/loginSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer
  }
})