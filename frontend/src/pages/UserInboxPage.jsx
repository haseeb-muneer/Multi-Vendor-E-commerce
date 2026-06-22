import React from 'react'
import Header from '../components/Layout/Header'
import UserInbox from "../components/Inbox/Inbox";
function UserInboxPage() {
  return (
    <div className='w-full'>
        <Header/>
        <UserInbox/>
    </div>
  )
}

export default UserInboxPage