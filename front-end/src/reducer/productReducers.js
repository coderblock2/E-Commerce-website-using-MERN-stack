import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL ,
    
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,

    CLEAR_ERRORS
    
} from '../constants/productConstants'


export const productReducer = (state = { product: []}, action) =>{
    switch( action.type ){
       case ALL_PRODUCT_REQUEST:
        return{
            loading: true, 
            product: []
        }

        case ALL_PRODUCT_SUCCESS:
            return{
                loading: false,
                product: action.payload.product, //// Yahan se products array ko access kiya ja raha hai.    // action.payload ek object hota hai jo Redux action ke andar data ko carry karta hai. Jab aap Redux action dispatch karte hain, aap usmein koi data bhi include kar sakte hain, aur woh data payload field ke andar chala jata hai.
                productsCount: action.payload.productsCount,
                resultPerPage : action.payload.resultPerPage,
                filteredProductsCount: action.payload.filteredProductsCount
            }

        case ALL_PRODUCT_FAIL:
            return{
                    loading: false,
                    product: action.payload
            }

        case CLEAR_ERRORS:
            return{
                ...state,
                error:null
            }   
        default:
            return state 
    }
};


export const productDetailsReducer = (state = { product: {}}, action) =>{
    switch( action.type ){
       case PRODUCT_DETAILS_REQUEST:
        return{
            loading: true, 
            ...state        // doubt --> yha ...state se kya hota hai ... isse kya hoga ?  --> Ans-> State Action ki hoti hai ... ohi wala state ki baat yha pe ho rhi hai ..
        }

        case  PRODUCT_DETAILS_SUCCESS:
            return{
                loading: false,
                product: action.payload, 
            }
j6
        case  PRODUCT_DETAILS_FAIL:
            return{
                    loading: false,
                    productDetails: action.payload
            }

        case CLEAR_ERRORS:
            return{
                ...state,
                error:null
            }   
        default:
            return state 
    }
};


export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {
      case NEW_REVIEW_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case NEW_REVIEW_SUCCESS:
        return {
          loading: false,
          success: action.payload,
        };
      case NEW_REVIEW_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case NEW_REVIEW_RESET:
        return {
          ...state,
          success: false,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  