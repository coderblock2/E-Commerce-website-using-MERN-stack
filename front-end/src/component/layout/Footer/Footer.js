import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './footer.css'

function Footer() {
  return (
    <footer id='footer'>
           <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download our App for Android and IOS mobile phone</p>
            <img src={playStore} alt='Playstore' />
            <img src={appStore} alt='Playstore' />
           </div>

           <div className='midFooter'>
            <h1>ECOMMERCE.</h1>
            <p>High Quality is our First Priority</p>
            <p>CopyRights 2023 &copy; MeAnishKumar</p>
           </div>

           <div className='rightFooter'>
            <h4>Follow Us</h4>
             <a href='https://instagram.com'>Instagram</a>
             <a href='https://youtube.com'>YouTube</a>
             <a href='https://facebook.com'>Facebook</a>
           </div>
    </footer>
  )
}

export default Footer