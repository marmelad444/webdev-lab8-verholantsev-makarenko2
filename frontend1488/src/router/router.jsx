import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Logout from '../pages/Logout'
import ItemsList from '../pages/items-list'
import ItemDetail from '../pages/item-detail'
import CreateItem from '../pages/create-item'
import Bids from '../pages/Bids'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <ItemsList /> },
      { path: 'items/:id', element: <ItemDetail /> },
      { path: 'create-item', element: <CreateItem /> },
      { path: 'my-bids', element: <Bids /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
])