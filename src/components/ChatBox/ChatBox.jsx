import React, { useContext,useState,useEffect } from 'react'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';

const ChatBox = () => {

    const {userData,messagesId,chatUser,messages,setMessages,chatVisible,setChatVisible,profileVisible,setProfileVisible} = useContext(AppContext);

    const [input,setInput] = useState("");

    const sendMessage = async () => {
        try {
            if(input && messagesId){
                await updateDoc(doc(db,'messages',messagesId),{
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId,userData.id];

                userIDs.forEach(async (id)=>{
                    const userChatsRef = doc(db,'chats',id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if(userChatsSnapshot.exists()){
                        const userChatsData = userChatsSnapshot.data();
                        const chatIndex = userChatsData.chatsData.findIndex((c)=> c.messageId === messagesId);
                        userChatsData.chatsData[chatIndex].lastMessage = input.slice(0,30);
                        userChatsData.chatsData[chatIndex].updatedAt = Date.now();
                        if(userChatsData.chatsData[chatIndex].rId === userData.id){
                            userChatsData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef,{
                            chatsData: userChatsData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
        setInput("");
    }

    const sendImage = async (e) =>{
        try {
            const fileUrl = await upload(e.target.files[0]);
            if(fileUrl && messagesId){
                await updateDoc(doc(db,'messages',messagesId),{
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId,userData.id];

                userIDs.forEach(async (id)=>{
                    const userChatsRef = doc(db,'chats',id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if(userChatsSnapshot.exists()){
                        const userChatsData = userChatsSnapshot.data();
                        console.log(userChatsData.chatsData);
                        const chatIndex = userChatsData.chatsData.findIndex((c)=> c.messageId === messagesId);
                        console.log(chatIndex);
                        userChatsData.chatsData[chatIndex].lastMessage = "image";
                        userChatsData.chatsData[chatIndex].updatedAt = Date.now();
                        if(userChatsData.chatsData[chatIndex].rId === userData.id){
                            userChatsData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef,{
                            chatsData: userChatsData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if(hour >= 13){
            return hour - 12 + ":" + minute + "PM";
        }else if(hour === 0){
            return 12 + ":" + minute + "AM";
        }
        else{
            return hour + ":" + minute + "AM";
        }
    }

     useEffect(()=>{
        if(messagesId){
            const unSub = onSnapshot(doc(db,'messages',messagesId),(res)=>{
                setMessages(res.data().messages.reverse())
            })
            return ()=>{
                unSub();
            }
        }
     },[messagesId])

  return chatUser ? (
    <div className={`chat-box ${chatVisible && !profileVisible ? "" : profileVisible || !chatVisible ? "max-[900px]:hidden" : "" } h-screen max-[900px]:w-full max-[900px]:justify-center relative bg-[#f1f5ff]`}>
        <div className="chat-user py-[10px] px-[15px] flex items-center gap-[10px] border-b-[1px] border-solid border-b-[#c6c6c6]">
            <img onClick={()=>{setProfileVisible(true); setChatVisible(false)}} className='w-[38px] aspect-square rounded-full' src={chatUser.userData.avatar} alt="" />
            <p className='flex font-medium flex-1 text-[20px] text-[#393939] items-center gap-[5px]'>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ?  <img className='w-[15px]' src={assets.green_dot} alt="" /> : null }</p>
            <img className='help max-[900px]:hidden w-[25px] rounded-full' src={assets.help_icon} alt="" />
            <img onClick={()=>setChatVisible(false)} className='arrow hidden max-lg:block w-[25px]' src={assets.arrow_icon} alt="" />
        </div>

        <div className="chat-msg h-[calc(100%-70px)] pb-[50px] overflow-y-scroll flex flex-col-reverse">
            {messages.map((msg,index)=>(
                <div key={index} className={msg.sId === userData.id ? "s-msg flex items-end justify-end gap-[5px] py-[0px] px-[15px]" : "r-msg flex-row-reverse justify-end flex items-end  gap-[5px] py-[0px] px-[15px]"}>

                    {msg["image"]
                    ? <img className='msg-img max-w-[230px] mb-[30px] rounded-[10px]' src={msg.image}/>
                    : <p className='msg text-white bg-[#610f87] p-[8px] max-w-[200px] text-[11px] font-light rounded-t-lg rounded-es-lg  mb-[30px]'>{msg.text}</p>
                    }
                
                <div className='text-center text-[9px]'>
                    <img className='w-[27px] aspect-square rounded-full' src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                    <p>{convertTimestamp(msg.createdAt)}</p>
                </div>
            </div>
            ))}
        </div>

        <div className="chat-input flex items-center gap-[12px] py-[10px] px-[15px] bg-white absolute bottom-0 right-0 left-0">
            <input onChange={(e)=>setInput(e.target.value)} value={input} className='flex-1 border-none outline-none' type="text" placeholder='Send a message' />
            <input onChange={sendImage} className='flex-1 border-none outline-none' type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label className='flex' htmlFor="image">
                <img className='w-[22px]' src={assets.gallery_icon} alt="" />
            </label>
            <img onClick={sendMessage} className='w-[30px] cursor-pointer' src={assets.send_button} alt="" />
        </div>
    </div>
  )
  : <div className={`chat-welcome ${chatVisible ? "" : "max-[900px]:hidden"} w-full flex flex-col items-center justify-center gap-[5px]`}>
    <img className='w-[60px]' src={assets.logo_icon} alt="" />
    <p className='text-[20px] font-[500] text-[#383838]'>Start chat with ChatHive</p>
  </div>
}

export default ChatBox