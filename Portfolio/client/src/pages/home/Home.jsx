import React from 'react'
import "./Home.scss"
import Featured from '../../components/featured/Featured'
import Portfolio from '../../pages/portfolio/Portfolio'

const Home = () => {
  return (
    <div className='home'>
      <Featured/>
      <Portfolio/>
       </div>
  )
}

export default Home
