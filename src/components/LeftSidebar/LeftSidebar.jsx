import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
    chatVisible,
    setChatVisible
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {}
  };

  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMesssageRef = doc(messageRef);

      await setDoc(newMesssageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMesssageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMesssageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      const uSnap = await getDoc(doc(db,"users",user.id));
      const uData = uSnap.data();
      setChat({
        messagesId: newMesssageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData
      })
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatsData: userChatsData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=>{

    const updateChatUserData = async () => {
        if(chatUser){
            const userRef = doc(db,"users",chatUser.userData.id);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setChatUser(prev => ({...prev,userData: userData}))
        }
    }
    updateChatUserData();
  },[chatData])

  return (
    <div className={`ls max-[900px]:w-full ${chatVisible ? "max-[900px]:hidden" : ""} bg-[#001030] text-white h-[75vh]`}>
      <div className="ls-top p-[20px] ">
        <div className="ls-nav flex justify-between items-center">
          <img className="max-w-[140px]" src={assets.logo} alt="" />
          <div className="menu group relative py-[10px] px-[0px]">
            <img
              className="max-h-[20px] opacity-[0.6] cursor-pointer"
              src={assets.menu_icon}
              alt=""
            />
            <div className="sub-menu hidden group-hover:block absolute top-[100%] right-0 w-[130px] p-[20px] rounded-[5px] bg-white text-black">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-[14px]"
              >
                Edit Profile
              </p>
              <hr className="border-none h-[1px] bg-[#a4a4a4] my-[8px] mx-[0px]" />
              <p className="cursor-pointer text-[14px]">Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search bg-[#002670] flex items-center gap-[10px] py-[10px] px-[12px] mt-2">
          <img className="w-[16px]" src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            className="bg-transparent border-none outline-none text-white text-[11px] placeholder:text-[#c8c8c8]"
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list flex flex-col h-[70%] overflow-y-scroll">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="add-user friends flex items-center gap-[10px] py-[10px] px-[20px] cursor-pointer text-[13px] hover:bg-[#077EFF] group"
          >
            <img
              className="w-[35px] aspect-square rounded-full"
              src={user.avatar}
              alt=""
            />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`friends flex items-center gap-[10px] py-[10px] px-[20px] cursor-pointer text-[13px] hover:bg-[#077EFF] group `}
            >
              <img
                className={`w-[35px] aspect-square rounded-full ${
                  item.messageSeen || item.messageId === messagesId
                    ? ""
                    : " border-[3px] border-solid border-[#07fff3] "
                } `}
                src={item.userData.avatar}
                alt=""
              />
              <div className="flex flex-col">
                <p>{item.userData.name}</p>
                <span
                  className={`text-[#9f9f9f] text-[11px] group-hover:text-white ${
                    item.messageSeen || item.messageId === messagesId
                      ? ""
                      : "text-[#07fff3]"
                  } `}
                >
                  {item.lastMessage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
