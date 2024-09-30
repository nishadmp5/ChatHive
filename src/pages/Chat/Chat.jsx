import React, { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import { AppContext } from '../../context/AppContext'

const Chat = () => {

  const {chatData,userData} = useContext(AppContext);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if(chatData && userData){
      setLoading(false)
    }
  },[chatData,userData])

  return (
    <div className='chat  min-h-[100vh] bg-gradient-to-t from-[#940c70] to-[#383699] grid place-items-center'>
      {
        loading
        ? <p className='loading max-[900px]:text-[30px] text-[50px] text-white'>Loading...</p>
        :  <div style={{gridTemplateColumns: "1fr 2fr 1fr"}} className="chat-container max-[900px]:flex w-screen h-screen overflow-hidden  bg-[aliceblue] grid ">
           <LeftSidebar/>
            <ChatBox/>
           <RightSidebar/>
          </div>
      }
       
    </div>
  )
}

export default Chat