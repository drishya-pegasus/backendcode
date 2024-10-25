import React from "react";
import Layout from "./../components/Layout/Layout";
import logo from '../assets/belloblack.jpeg';
import image1 from '../assets/spc1.png'; // Replace with your actual image path
import image3 from '../assets/about.jpg'; // Replace with your actual image path
import image2 from '../assets/yowza.png'; // Replace with your actual image path
//index css
const About = () => {
  return (
    <Layout title={"About Us Bello Nepal"}>
      <div className='offer'>
        <h4><strong>This Month we will be contributing 5% of our profits to charity, orphanage and old age homes.</strong></h4>
      </div>
      <div className="wholeaboutus">
        <div className="about-us-container">
          <div className="belolgoo">
            <img src={logo} width='300px' height='400px' alt="Bello Logo" />
          </div>
          <div className="about-us-content">
            <p className="fade-in delay-1s">
              We are a team of passionate individuals dedicated to providing the best products and services.
            </p>
            <p className="fade-in delay-2s">
              Our mission is to create value for our customers through innovation and excellence.
            </p>
          </div>
        </div>

        <div className="blackline"></div>

        <div className="additional-sections delay-2s">
          <div className="section">
            <div className="text-image">
              <div className="text">
                <h2>Our Mission</h2>
                <p>
                At Bello, our mission is to provide our customers with stylish, high-quality bags and apparel that blend functionality with fashion. We aim to offer a carefully curated selection of products, including laptop bags, sling bags, and versatile clothing, that empower our customers to express their unique style while staying organized and prepared for life's adventures. We are committed to delivering exceptional value through thoughtful design, sustainable practices, and unparalleled customer service, ensuring every shopping experience with us is as satisfying as the products we offer.                </p>
              </div>
              <div className="image">
                <img src={image1} alt="Our Mission" />
              </div>
            </div>
          </div>
          <div className="section">
            <div className="text-image reverse">
              <div className="text">
                <h2>Our Products</h2>
                <p>
                We offer a thoughtfully curated selection of products that combine style, functionality, and quality. Our laptop bags are designed to protect your devices while making a fashion statement, featuring durable materials and sleek designs. Our sling bags are perfect for those on the move, offering convenience and style in a compact form. Additionally, our apparel line includes versatile, comfortable clothing that complements our bags, making it easy to stay stylish and organized no matter where life takes you.                </p>
              </div>
              <div className="image">
                <img src={image2} alt="Our Products" />
              </div>
            </div>
          </div>
          <div className="section">
            <div className="text-image">
              <div className="text">
                <h2>Our Team</h2>
                <p>
                At Bello, our team is the heart of our brand. We are a group of passionate individuals dedicated to delivering exceptional products and services to our customers. From our talented designers who craft each bag and piece of apparel with care, to our customer service team who ensures that every shopping experience is seamless and satisfying, we work together to bring our vision to life. Our team is committed to innovation, quality, and sustainability, always striving to create products that not only meet but exceed the expectations of our customers. We believe in the power of collaboration and creativity, and we take pride in building a brand that reflects our shared values and commitment to excellence.                </p>
              </div>
              <div className="image">
                <img src={image3} alt="Our Team" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
