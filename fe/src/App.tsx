
import './App.css'
import { Route, Routes } from 'react-router';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Home from './pages/home';
import ProtectedRoute from './lib/SafeRoute';
import { useCurrentUser } from './hooks/useCurrentUser';

function App() {
  const {isLoading} = useCurrentUser();

  if(isLoading) {
    return <div className=' w-full h-screen flex justify-center items-center'>Loading...</div>;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      {/* <Route element={<SafeRoute />}>
            </Route> */}


      {/* Safe Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<h1>Profile</h1>} />
      </Route>
    </Routes>
  )
}

export default App
