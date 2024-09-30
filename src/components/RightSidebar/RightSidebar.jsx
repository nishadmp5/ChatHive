import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSidebar = () => {

  const {chatUser,messages,chatVisible,setChatVisible,profileVisible,setProfileVisible} = useContext(AppContext);
  const [msgImages,setMsgImages] = useState([]);

  useEffect(()=>{
    let tempVar = [];
    messages.map((msg)=>{
      if(msg.image){
        tempVar.push(msg.image)
      }
    })
    setMsgImages(tempVar);
  },[messages])

  return chatUser ? (
    <div className={`rs ${profileVisible ? "" : "max-[900px]:hidden" } text-white bg-[#001030] relative h-full overflow-y-scroll`}>
     <img onClick={()=>{setChatVisible(true);setProfileVisible(false)}} className='arrow hidden max-lg:block w-[25px] ml-3 mt-2' src={assets.arrow_icon} alt="" />
        <div className="rs-profile pt-[60px] max-[900px]:pt-3 text-center max-w-[70%] m-auto">
            <img className='w-[110px] aspect-square rounded-full mx-auto' src={chatUser.userData.avatar} alt="" />
            <h3 className='text-[18px] font-[400] flex items-center justify-center gap-[5px] mx-[0] my-[5px]'>{chatUser.userData.name}{Date.now() - chatUser.userData.lastSeen <= 70000 ?  <img className='w-[15px]' src={assets.green_dot} alt="" /> : null }</h3>
            <p className='text-[10px] opacity-[80%] font-[300]'>{chatUser.userData.bio}</p>
        </div>
        <hr className='border-[#ffffff50] my-[15px] mx-[0px]'/>
        <div className="rs-media py-[0px] px-[20px] text-[13px] ">
            <p>Media</p>
            <div style={{gridTemplateColumns:"1fr 1fr 1fr"}} className='max-h-[180px] overflow-y-scroll grid gap-[5px] mt-[8px]'>
              {msgImages.map((url,index)=>(
                <img onClick={()=> window.open(url)} key={index} src={url} alt="" />
              ))}
            </div>
        </div>
        <button onClick={()=>logout()} className='absolute bottom-[20px] right-[50%] translate-x-2/4 bg-[#610f87] text-white border-none text-[12px] font-[300] py-[10px] px-[65px] rounded-[20px] cursor-pointer'>Logout</button>
    </div>
  )
  : (
    <div className='rs  max-[900px]:hidden text-white bg-[#001030] relative h-full overflow-y-scroll'>
      <button onClick={()=>logout()} className='absolute bottom-[20px] right-[50%] translate-x-2/4 bg-[#610f87] text-white border-none text-[12px] font-[300] py-[10px] px-[65px] rounded-[20px] cursor-pointer'>Logout</button>
    </div>
  )
}

export default RightSidebar