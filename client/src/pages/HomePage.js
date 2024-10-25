import React from 'react';
import Layout from '../components/Layout/Layout.js'
import porsche from '../assets/pp.mp4'
import bellovid from '../assets/bellovid.mov'
import './Homepage.css'
import { FaInstagram } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";

import pc from '../assets/realdesk.jpeg'
import bag from '../assets/classicmint.png'
import des from '../assets/olddesk.jpeg'
import mob from '../assets/oldmob.jpeg'

import sling from '../assets/slinggg.png'
import apparels from '../assets/app.png'
import tech from '../assets/pack.png'
import nfp from '../assets/newpro.png'
import {Link} from 'react-router-dom';
import ww from '../assets/womwom.jpg'
import backpack from '../assets/bbb.jpg'
import women from '../assets/ww.jpg';
import men from '../assets/mmm.jpg';
import owl from '../assets/owlcard.jpg';
import last from '../assets/last.png'
import ig from '../assets/ig.png';
import mm from '../assets/menmen.jpg'
import yt from '../assets/y.png';
import tt from '../assets/tt.png';
import hn from '../assets/hn.png'
import { NavLink } from 'react-router-dom';
import biii from '../assets/bb.png'
import ImageSlider from '../components/Slider.js';


const BackgroundVideo = () => {
  return (
    <Layout>
      

      <div className='homepage'>

      
<div class="homtop">
  
</div>
    
      <div className='offer'>
        <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
      </div>
      {/* video 
       */}



      <div className='vid-main'>
        <video src={bellovid} autoPlay loop muted></video>
        <div className='content'>
          <h1>Fashion is Freedom</h1>
        </div>
      </div>
{/* 
       shop by categories */}
      <div className='shop-by-cat'>
        <div className='sbc-content'>
        </div>
        <div className='category-cards'>
          <div className="catcard">
        
          <div className="detailscategory1">
            <div className='dtcontent1'>
                  <h4 className='white'>Backpacks</h4>
                  <Link to='/backpacks'><button className='bor-btn2'>Shop Now</button></Link>
            </div>
          </div>
          </div>
          <div className="catcard">
        
          <div className="detailscategory2">
          <div className='dtcontent'>
                  <h4>Apparels</h4>
                  <Link to='/apparals'><button className='bor-btn1'>Shop Now</button></Link>
            </div>
          </div>
          </div>
          <div className="catcard">
        
          <div className="detailscategory3">
          <div className='dtcontent'>
                
                  <h4>TechPack</h4>
                  <Link to='/techpack'><button className='bor-btn1'>Shop Now</button></Link>
            </div>
          </div>
          </div>
        </div>
      </div>
{/* 
       bello new product */}
    


{/* <ImageSlider/> */}

    {/* owl card and shipping */}
   <ImageSlider/>
   <div className='slii'>
      slide for more
      </div>


      <div class="donate-container">
  <a href='https://docs.google.com/forms/d/1U37rWT7B9bWYu-lYuebG1W2J5I35NetLFb6yomxMbNw/edit?usp=sharing_eil_se_dm&ts=66dad82a' target='0'><button class="donate-btn">Donate</button></a>
</div>


    <div className='homlast'>
      <div className='hl-content'>
        <h1>Come Visit Us</h1>
        <h4>Showroom</h4>
        <p>Jwalakhel, Lalitpur</p>
        <p><a href='https://www.google.com/maps/place/Bello+Nepal/@27.6720378,85.3130606,17z/data=!3m1!4b1!4m6!3m5!1s0x39eb192e79c9f781:0xa6e7f6d733d62463!8m2!3d27.6720378!4d85.3156355!16s%2Fg%2F11l2m6msw8?entry=ttu'>Get Directions</a></p>
        <h4>Store Opening Hours</h4>
        <p>We are open everyday 10:00 AM — 6:30 PM</p>
        <p>9702651054</p>
        <p>bellofornepal@gmail.com</p>

        <div className='socials'>
          <a href='https://www.instagram.com/bello_nepal/' target='1' className='ig'><FaInstagram size={24}/>
          </a>
          <a href='https://www.youtube.com/@BelloNepal' target='1' className='yt'><BsYoutube size={26}/>
          </a>
          <a href='https://www.tiktok.com/@bello_nepal' target='1' className='tt'><FaTiktok size={20}/>
          </a>
        </div>
      </div>
      <div className='hl-img'>
        <img src={last}/>
      </div>
    </div>
    </div>
    </Layout>
  );
};

export default BackgroundVideo;

