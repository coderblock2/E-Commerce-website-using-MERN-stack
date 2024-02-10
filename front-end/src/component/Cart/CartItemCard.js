import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {removeItemsFromCart} from "../../action/cartAction"



const CartItemCard = ({ item }) => {
    const dispatch = useDispatch();
    const deleteprod = () => {
        dispatch(removeItemsFromCart(item.product));
    }
  return (
    <div className="CartItemCard">
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={deleteprod}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
