import { useEffect, useState } from 'react';
import './App.css';
import Headers from './component/layout/Header/Header.js';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import React from 'react';
import webFont from "webfontloader";
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/loginSignup.js';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useDispatch, useSelector } from 'react-redux';
import store from './store.js';
import { loadUser } from './action/userAction.js';
import Profile from "./component/User/Profile.js";
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from 'axios';
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from "./component/Order/MyOrders.js";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("http://localhost:4000/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect( ()=>{
        webFont.load({
          google:{
           families: ["Roboto", "Droid Sans", "Chilanka"],
          },
        });
        // store.dispatch(loadUser())

        getStripeApiKey();
  }, [])
  return (
   <Router>
          < Headers />
          {isAuthenticated && <UserOptions user={user} />}
          {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}
          <Switch>
         
        <Route exact path='/' component={Home} />
        <Route exact path='/product/:id' component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/:keyword" component={Products} />

        <Route exact path="/login" component={LoginSignUp} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />  
        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />  
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />

        <Route exact path="/orders" component={MyOrders} />

        <Route exact path="/search" component={Search} />
      </Switch>
          < Footer />
   </Router>  
  ); 
  }
export default App;


// protectedroute isliye bnaye hai kyunki ye sb tbhi access kr paayenge jb tk hmm logged in rahenge ...
