import React, { Fragment, useEffect } from "react";
// import { CgMouse } from "react-icons/all";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import {clearErrors, getProduct} from "../../action/productAction.js"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../layout/Loader/Loader.js";
import {useAlert} from 'react-alert'

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.product);     // state me jo products pdi hai unhe ab apne page pe dikhane ke liye we will use UseSelector...


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);


    return(
    <Fragment>
    {loading ? (
      < Loader />
      ) : (
      <Fragment>                  
            < MetaData title="ECOMMERCE" />       
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1> 

            <a href="#container">
              <button>
                Scroll 
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>
       
          {/* <Product product={product} />
          <Product product={product} />                // ab mujhe dynamic bnani hai isse jo ki data nackend se fetch krke laayenge ...
          <Product product={product} />              // to isse htta kr hmm map function ka use krnege ....
          <Product product={product} /> */}
            
           <div className="container" id="container">
            {product && product.map((single_product) => (
                <Product key={single_product._id} products12={single_product} />
              ))} 
          </div> 
          </Fragment>

    )
    }
    </Fragment>
    )}

    export default Home