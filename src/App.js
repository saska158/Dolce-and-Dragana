import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import Homepage from './Homepage'
import Items from './Items'
import ItemDetail from './ItemDetail'
import ShoppingBagLayout from './ShoppingBagLayout'
import ShoppingBag from './ShoppingBag'
import BillingAddress from './BillingAddress'
import Payment from './Payment'
import OrderCompleted from './OrderCompleted'
import Login from './Login'
import Signup from './Signup'
import PasswordRecover from './PasswordRecover'
import UserProfile from './UserProfile'
import UserFavorites from './UserFavorites'
import EmailVerification from './EmailVerification'
import AuthRequired from './AuthRequired'
import { ShoppingBagContextProvider } from './shoppingBagContext'
import { AuthProvider } from './authContext'

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
