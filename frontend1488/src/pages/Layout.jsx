import { Outlet } from 'react-router-dom'
import Navbar from '../components/NavBar'
import './Layout.css'

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>&copy; 2025 Маркетплейс. Все права защищены.</footer>
    </>
  )
}

export default Layout