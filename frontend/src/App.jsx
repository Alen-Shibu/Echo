import {Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ChatPage from './pages/ChatPage'
import {authStore} from './store/authStore.js'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
