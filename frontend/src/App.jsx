import {Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ChatPage from './pages/ChatPage'
import TermsPage from './pages/TermsPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import {useAuthStore} from './store/useAuthStore.js'
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react'
import PageLoader from './components/PageLoader.jsx'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth) return <PageLoader />

  return (
  <div>
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - NEW STYLE: overlapping translucent circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full opacity-15 blur-xl pointer-events-none" />
      <div className="relative z-10"></div>
      <Routes>
        <Route path='/' element={authUser ? <ChatPage /> : <Navigate to='/login' replace />} />
        <Route path='/register' element={!authUser ? <RegisterPage /> : <Navigate to='/' replace />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' replace />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/privacy' element={<PrivacyPolicyPage />} />
      </Routes>
      <Toaster/>
    </div>
  </div>
  )
}

export default App
