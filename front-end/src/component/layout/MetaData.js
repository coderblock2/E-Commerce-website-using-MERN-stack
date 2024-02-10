import React from 'react'
import Helmet from 'react-helmet'

function MetaData( { title} ) {
  return (        // isse ye hoga ki hmm jis bhi page pe ye wala component import krenge,, uska title ohi rahega jo bhi hmm isme pas krenge ... 
    <Helmet>         
        <title> {title} </title>   
    </Helmet>
  )
}
 //helmet ek middleware hai jo security ko enhance karne ke liye use hota hai web applications mein, particularly Express.js apps ke liye.
 // Yahan kuch important points hain jo helmet ka use justify karte hain:
export default MetaData