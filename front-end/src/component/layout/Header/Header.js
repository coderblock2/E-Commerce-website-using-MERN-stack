import React from 'react'
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import {MdSearch } from "react-icons/md";
import {MdAccountCircle } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";


const options = {
    burgerColorHover: "#eb4034",
    logo,
    logoWidth: "20vmax",
    navColor1: "white",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    profileIconUrl: "/login",
    // profileIconColor: "rgba(35, 35, 35,0.8)",
    // searchIconColor: "rgba(35, 35, 35,0.8)",
    // cartIconColor: "rgba(35, 35, 35,0.8)",
    profileIconColorHover: "#eb4034",
    searchIconColorHover: "#eb4034",
    cartIconColorHover: "#eb4034",
    cartIconMargin: "1vmax",
    searchIcon:true,
    searchIconColor: "rgba(35, 35, 35,0.8)",
    SearchIconElement:MdSearch,
    profileIcon:true,
    profileIconColor: "rgba(35, 35, 35,0.8)",
    ProfileIconElement: MdAccountCircle, 
    cartIcon:true,
    cartIconColor: "rgba(35, 35, 35,0.8)",
    CartIconElement:MdAddShoppingCart,
    
  };

const Header = () => {
  return (
    <div > 
       < ReactNavbar {...options}/> 
    </div>  // ittna krne se hmara Navbar alreay bnn kr ready ho jaayega... but ye hmme error dega kyunki isse hmme "Router" me close krna hota hai ..
                               // isliye App.js me Header ko Router me import kiye honge ..  isko use krne ke a\liye apne hisab se parameter pd skte hai hmm log and usme change kr skte hai ...
    ) ;                     

}

export default Header