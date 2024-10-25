import React, { useRef } from 'react';
import Slider from 'react-slick';
import a from '../assets/1.jpeg';
import b from '../assets/2.jpeg';
import c from '../assets/3.jpeg';
import d from '../assets/4.jpeg';
import e from '../assets/5.jpeg';
import f from '../assets/6.jpeg';
import g from '../assets/7.png';
import h from '../assets/8.jpeg';

const ImageSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    verticalSwiping: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,  // Adjusted to 1 to ensure smooth scrolling
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      
      {
        breakpoint: 945,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="image-slider-container">
      <Slider ref={sliderRef} {...settings}>
        <div className="slide">
          <img src={a} alt="Photo 1" />
        </div>
        <div className="slide">
          <img src={b} alt="Photo 2" />
        </div>
        <div className="slide">
          <img src={c} alt="Photo 3" />
        </div>
        <div className="slide">
          <img src={d} alt="Photo 4" />
        </div>
        <div className="slide">
          <img src={e} alt="Photo 5" />
        </div>
        <div className="slide">
          <img src={f} alt="Photo 6" />
        </div>
        <div className="slide">
          <img src={g} alt="Photo 7" />
        </div>
        <div className="slide">
          <img src={h} alt="Photo 8" />
        </div>
      </Slider>
      
     
    </div>
  );
};

export default ImageSlider;
