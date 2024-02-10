import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";




const ProductCard = ({ products12 }) => {

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: products12.ratings,
    isHalf: true
  };

  return (
    <Link className="productCard" to={`/product/${products12._id}`}>
      <img src={products12.images[0].url} alt={products12.name} />
      <p>{products12.name}</p>
      <div>
        <ReactStars {...options} /> <span> ({products12.NoOfReviews} Reviews)</span>
      </div>
      <span>{`₹${products12.price}`}</span>
    </Link>
  );
};

export default ProductCard ;
