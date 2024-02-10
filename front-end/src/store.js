import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { newReviewReducer, productDetailsReducer, productReducer } from './reducer/productReducers';
import { forgotPasswordReducer, profileReducer, userReducer } from './reducer/userReducer';
import { cartReducer } from './reducer/cartReducer';
import { newOrderReducer, myOrdersReducer } from './reducer/orderReducers';

const rootReducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  newReview: newReviewReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Specify which reducer states to persist (in this case, only 'cart')
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  },
};

const middleWare = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleWare))
);

const persistor = persistStore(store);

export { store, persistor };
