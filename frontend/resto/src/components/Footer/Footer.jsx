import './Footer.css'
import {assets} from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className="footer-content-left">
                <img src={assets.logo} alt='Logo' className='logo'/> 
                <p>Welcome to FoodPlanet, where every meal is a journey across the globe. Our chefs are passionate about crafting dishes that celebrate the diversity and richness of international cuisine. From fresh, locally sourced ingredients to innovative cooking techniques, we strive to deliver an unforgettable dining experience with every visit.</p>
                <div className="footer-social-icons">
                    <img src ={assets.facebook_icon} alt="Facebook"/>
                    <img src ={assets.twitter_icon }alt="Twitter"/>
                    <img src ={assets.linkedin_icon} alt="LinkedIn"/>
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+21658405469</li>
                    <li>contact@FoodPlanet.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright">&copy; 2024 Food Planet. All rights reserved.</p>
    </div>
  )
}

export default Footer
