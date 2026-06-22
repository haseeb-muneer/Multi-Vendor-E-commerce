import React from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Event from "../components/Route/Event/Event";
import Sponsored from "../components/Route/Sponsored/Sponsored";
import Footer from '../components/Layout/Footer';
function HomePage() {
  return (
    <div >
     <Header activeHeading={1}/>
     <Hero/>
     <Categories/>
     <BestDeals/>
     <Event/>
     <FeaturedProduct/>
     <Sponsored/>
     <Footer/>
    </div>
  )
}

export default HomePage