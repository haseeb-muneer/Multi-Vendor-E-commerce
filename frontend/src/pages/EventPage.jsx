import React from 'react'
import Header from '../components/Layout/Header'
import EventCard from '../components/Route/Event/EventCard'
import Footer from '../components/Layout/Footer'
import { useSelector } from 'react-redux'
import Loader from '../components/Layout/Loader'

function EventPage() {
  const {allEvents , isLoading}=useSelector((state)=>state.events);
  return (
   <>
   {
    isLoading ? (
      <Loader/>
    ):(
       <div>
        <Header activeHeading={4}/>
        <EventCard active={true} data={allEvents && allEvents[0]}/>
       
        <Footer/>
    </div>
    )
   }</>
  )
}

export default EventPage