import React from 'react';
import Slide from '../../components/slide/Slide';
import { cards } from '../../data';
import CatCard from '../../components/catCard/CatCard';
import './Portfolio.scss';

const Portfolio = () => {
  return (
    <div className="portfolio">
      <h1>Top Skils</h1>
      <div className="content">
        <Slide arrowsScroll={3} slidesToShow={4}>
          {cards.map(card => (
            <CatCard key={card.id} item={card} />
          ))}
        </Slide>
      </div>
    </div>
  );
}

export default Portfolio;
