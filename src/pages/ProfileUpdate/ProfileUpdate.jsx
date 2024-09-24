import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {

    const navigate = useNavigate();

    const [image,setImage] = useState(false);
    const [name,setName] =useState("");
    const [bio,setBio] = useState("");
    const [uid,setUid] = useState("");
    const [prevImage,setPrevImage] = useState("");
    const {setUserData} = useContext(AppContext);

    const profileUpdate = async (event)=>{
        event.preventDefault();
        try {
            if(!prevImage && !image){
                toast.error("Upload profile picture")
            }
            const docRef = doc(db,'users',uid);
            if(image){
                const imgUrl = await upload(image);
                setPrevImage(imgUrl);
                await updateDoc(docRef,{
                    avatar:imgUrl,
                    bio: bio,
                    name: name
                })
            }else{
                await updateDoc(docRef,{
                    bio: bio,
                    name: name
                })
            }
            const snap = await getDoc(docRef);
            setUserData(snap.data());
            navigate('/chat');
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        onAuthStateChanged(auth,async (user)=>{
            if(user){
                setUid(user.uid)
                const docRef = doc(db,"users",user.uid);
                const docSnap =await getDoc(docRef);
                if(docSnap.data().name){
                    setName(docSnap.data().name);
                }
                if(docSnap.data().bio){
                    setBio(docSnap.data().bio);
                }
                if(docSnap.data().avatar){
                    setPrevImage(docSnap.data().avatar)
                }
            }else{
                navigate('/');
            }
        })
    },[])

  return (
    <div className='profile min-h-screen max-h-screen bg-[url(background.png)] bg-no-repeat flex items-center justify-center'>
        <div className="profile-container bg-white flex max-md:flex-col-reverse items-center justify-between w-full max-w-[700px] rounded-[10px]">
            <form onSubmit={profileUpdate} className='flex flex-col gap-[20px] p-[40px]'>
                <h3 className='font-medium'>Profile Details</h3>
                <label className='flex items-center gap-[10px] text-[gray] cursor-pointer' htmlFor="avatar">
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                    <img className='w-[50px] aspect-square rounded-[50%]' src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
                    {prevImage ? "Update profile picture" : "Upload profile image"}
                </label>
                <input onChange={(e) => setName(e.target.value)} value={name} className='p-[10px] min-w-[300px] border border-solid border-[#c9c9c9] outline-[#077eff]' type="text" placeholder='Your name' required/>
                <textarea onChange={(e) => setBio(e.target.value)} value={bio} className='p-[10px] min-w-[300px] border border-solid border-[#c9c9c9] outline-[#077eff]' placeholder='Write profile bio' required></textarea>
                <button className='border-none text-white bg-[#077eff] p-[8px] text-[16px] cursor-pointer' type='submit'>Save</button>
            </form>
            <img className='profile-pic max-w-[160px] aspect-square my-[20px] mx-auto rounded-[50%]' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
        </div>
    </div>
  )
}

export default ProfileUpdate