import React, { useState } from 'react'
import assets from '../../assets/assets'
import { signup, login, resetPass } from '../../config/firebase';

const Login = () => {

    const [currState,setCurrentState] = useState("Sign up");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(currState === "Sign up"){
            signup(username,email,password);
        }else{
            login(email,password);
        }
    }

  return (
    <div className="login min-h-[100vh] bg-[url('background.png')] bg-no-repeat bg-cover flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-[30px] md:gap-0">
        <img className='logo ' style={{width: "max(20vw, 200px)"}} src={assets.logo_big} alt="" />
        <form onSubmit={onSubmitHandler} className='login-form bg-white py-[20px] px-[30px] flex flex-col gap-[20px] rounded-[10px]' action="">
            <h2 className='font-medium'>{currState}</h2>
            {currState === "Sign up" ? <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder='username' required className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#077EFF]" /> : null}
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email address' required  className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#077EFF]" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='password' required className="form-input py-[8px] px-[10px] border border-solid border-[#c9c9c9] outline-[#077EFF]" />
            <button className='p-[10px] bg-[#077EFF] text-white text-[16px] border-none rounded-[4px] cursor-pointer' type='submit'>{currState === "Sign up" ? "Create account" : "Login now"}</button>
            <div className='login-term flex gap-[5px] text-[12px] text-[#808080]'>
                <input type="checkbox" />
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