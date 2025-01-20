import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateCampaign from './pages/Campaign/Create'
import UserProfile from './pages/UserProfile';
import ContributeCampaign from './pages/Campaign/Contribute';
import Withdraw from './pages/Campaign/Withdraw';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/signin',
        element: <SignIn />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/create-campaign',
        element: <CreateCampaign />
      },
      {
        path: '/user-profile',
        element: <UserProfile />
      },
      {
        path: '/contribute-campaign',
        element: <ContributeCampaign />
      },
      {
        path: '/withdraw-campaign',
        element: <Withdraw />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </Provider>
    </PersistGate>
  </StrictMode>,
)
