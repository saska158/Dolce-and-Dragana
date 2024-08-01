import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Homepage from './pages/Homepage'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import ShoppingBagLayout from './components/ShoppingBagLayout'
import ShoppingBag from './pages/ShoppingBag'
import BillingAddress from './pages/BillingAddress'
import Payment from './pages/Payment'
import OrderCompleted from './pages/OrderCompleted'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PasswordRecover from './pages/PasswordRecover'
import UserProfile from './pages/UserProfile'
import UserFavorites from './pages/UserFavorites'
import EmailVerification from './pages/EmailVerification'
import AuthRequired from './components/AuthRequired'
import { ShoppingBagContextProvider } from './contexts/shoppingBagContext'
import { AuthProvider } from './contexts/authContext'

function App() {
  

  return (
    <AuthProvider>
      <ShoppingBagContextProvider>
       <BrowserRouter>
        <Routes>
         <Route path='/' element={<Layout />}>
           <Route index element={<Homepage />} />
           <Route path=':category' element={<Items />} />
           <Route path=':category/:id' element={<ItemDetail />}/>
           <Route path='shopping-bag' element={<ShoppingBagLayout />}>
            <Route index element={<ShoppingBag />} />
            <Route path='billing-address' element={<BillingAddress />} />
            <Route path='payment' element={<Payment />} />
            <Route element={<AuthRequired />}>
             <Route path='user-favorites' element={<UserFavorites />} />
            </Route>
           </Route>
           <Route path="log-in" element={<Login />} />
           <Route path="sign-up" element={<Signup />} />
           <Route path='email-verification' element={<EmailVerification />} />
           <Route path='/password-recover' element={<PasswordRecover />} />
           <Route element={<AuthRequired />}>
             <Route path='/user' element={<UserProfile />} />
           </Route>
           <Route path='order-completed' element={<OrderCompleted />} />
         </Route>
        </Routes>
       </BrowserRouter>
      </ShoppingBagContextProvider>
    </AuthProvider>
  )  
}

export default App;
