import Navbar from './components/Navbar'
import './App.css'
import Hero from './components/Hero';
import 'animate.css';
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main>
        {location.pathname === '/' && <Hero />}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
