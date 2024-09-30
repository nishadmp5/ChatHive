import React, { useState } from 'react'
import assets from '../../assets/assets'
import { signup, login, resetPass } from '../../config/firebase';
import { toast } from 'react-toastify';

const Login = () => {

    const [currState,setCurrentState] = useState("Sign up");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [isChecked,setIsChecked] = useState(false);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(!isChecked){
            toast.error("Please agree our terms and conditions");
            return;
        }
        if(currState === "Sign up"){
            signup(username,email,password);
        }else{
            login(email,password);
        }
    }

  return (
    <div className="login relative min-h-[100vh] max-h-screen bg-[url('/background-rep.jpg')] bg-no-repeat bg-cover flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-[25px] md:gap-0">
        <div className='absolute inset-0 bg-gradient-to-br from-[#4d1369] to-[#940c70] opacity-80 z-0'> </div>
        <div  className='z-10 flex flex-col items-center justify-center gap-1'>
         <img className='logo z-10' style={{width: "max(18vw, 180px)"}} src={assets.logo_big} alt="" />
         <h1 className='text-white text-6xl max-md:text-3xl'>ChatHive</h1>
        </div>
        <form onSubmit={onSubmitHandler} className='login-form z-20 bg-white py-[20px] px-[30px] flex flex-col gap-[20px] rounded-[10px]' action="">
            <h2 className='font-medium'>{currState}</h2>
            {currState === "Sign up" ? <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder='username' required className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#940c70]" /> : null}
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email address' required  className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#940c70]" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='password' required className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#940c70]" />
            <button className='p-[10px] bg-[#940c70] text-white text-[16px] border-none rounded-[4px] cursor-pointer' type='submit'>{currState === "Sign up" ? "Create account" : "Login now"}</button>
            <div className='login-term flex gap-[5px] text-[12px] text-[#808080]'>
                <input type="checkbox" checked={isChecked} onChange={(e)=>setIsChecked(e.target.checked)}/>
                <p>Agree to the terms of use & privacy policy</p>
            </div>
            <div className='login-forgot flex flex-col gap-[5px] '>
                {currState === "Sign up" 
                ? <p className='login-toggle text-[13px] text-[#5c5c5c]'>Already have an account <span onClick={() => setCurrentState("Login")} className='text-[#077EFF] cursor-pointer'>Login now</span></p> 
                : <p className='login-toggle text-[13px] text-[#5c5c5c]'>Create an account <span onClick={() => setCurrentState("Sign up")} className='text-[#077EFF] cursor-pointer'>click here</span></p>}
                {currState === "Login" ? <p className='login-toggle text-[13px] text-[#5c5c5c]'>Forgot Password? <span onClick={() => resetPass(email)} className='text-[#077EFF] cursor-pointer'>reset here</span></p> : null }
            </div>
        </form>
    </div>
  )
}

export default Login