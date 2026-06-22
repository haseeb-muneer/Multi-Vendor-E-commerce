import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from 'react-toastify'; // Added Bounce here
import 'react-toastify/dist/ReactToastify.css'; // Added the CSS import
import axios from "axios";
import { LoginPage, SignupPage, ActivationPage , HomePage , ProductPage , BestSellingPage , EventPage , FAQPage , ProductDetailsPage  , ProfilePage , ShopCreatePage , SellerActivationPage  , ShopLoginPage  , CheckoutPage , PaymentPage , OrderSuccessPage , TrackOrderPage , UserInboxPage  } from "./routes/Routes";
import { ShopHomePage  , ShopCreateProduct , ShopAllProduct , ShopCreateEvents , ShopAllEvents , ShopAllCoupouns , ShopAllOrders , ShopOrderDetails , OrderDetailsPage , ShopAllRefunds , ShopSettingPage , ShopWithdrawMoneyPage , ShopInboxPage } from "./routes/ShopRoutes";
import { ShopDashboardPage } from "./routes/ShopRoutes";
import { server } from "./server";
import { toast } from 'react-toastify';
import store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import {useSelector} from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import {getAllProducts, getAllProductShop} from  "./redux/actions/product";
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import { getAllEvents } from "./redux/actions/event";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
function App() {
  const [stripeApikey, setStripeApiKey] = useState("");
   async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
    console.log(stripeApikey);
  }
  axios.defaults.withCredentials = true;
 useEffect(() => {
  store.dispatch(loadUser());
  store.dispatch(loadSeller());
  store.dispatch(getAllProducts());
  store.dispatch(getAllEvents());
  getStripeApikey()
}, []);

  // console.log( "seller is", isSeller , seller);
  return (
   
       <BrowserRouter>
          
          {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductPage/>}/>
        <Route path="/product/:id" element={<ProductDetailsPage/>}/>
        <Route path="/best-selling" element={<BestSellingPage/>}/>
        <Route path="/events" element={<EventPage/>}/>
        <Route path="/faq" element={<FAQPage/>}/>
        <Route path="/profile" element={
          <ProtectedRoute >
            <ProfilePage/>
          </ProtectedRoute>
        }/>
        <Route path="/shop-create" element={<ShopCreatePage/>}/>
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/shop/:id" element={
          <SellerProtectedRoute >
            <ShopHomePage/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <SellerProtectedRoute >
            <ShopDashboardPage/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-create-product" element={
          <SellerProtectedRoute >
            <ShopCreateProduct/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-products" element={
          <SellerProtectedRoute >
            <ShopAllProduct/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-orders" element={
          <SellerProtectedRoute >
            <ShopAllOrders/>
          </SellerProtectedRoute>
        } />
        
        <Route path="/dashboard-create-event" element={
          <SellerProtectedRoute >
            <ShopCreateEvents/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-events" element={
          <SellerProtectedRoute >
            <ShopAllEvents/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-coupouns" element={
          <SellerProtectedRoute >
            <ShopAllCoupouns/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-refunds" element={
          <SellerProtectedRoute >
            <ShopAllRefunds/>
          </SellerProtectedRoute>
        } />
        <Route path="/setting" element={
          <SellerProtectedRoute >
            <ShopSettingPage/>
          </SellerProtectedRoute>
        } />
        <Route path="/dashboard-withdraw-money" element={
          <SellerProtectedRoute >
            <ShopWithdrawMoneyPage/>
          </SellerProtectedRoute>
        } />
          <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInboxPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route path="/order/:id" element={<ShopOrderDetails />} />
        
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </BrowserRouter>
  
  );
}

export default App;
