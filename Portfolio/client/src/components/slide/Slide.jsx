import React from 'react';
import Slider from 'infinite-react-carousel';
import './Slide.scss';

const Slide = ({ children, slidesToShow = 4, arrowsScroll = 1 }) => {
  return (
    <div className="slide">
      <div className="container">
        <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
          {children}
        </Slider>
      </div>
    </div>
  );
}

export default Slide;
