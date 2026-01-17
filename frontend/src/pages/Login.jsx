import axios from 'axios'
import React from 'react'
import {ShopContext} from '../context/ShopContext'
import { toast } from 'react-toastify';

const Login = () => {
  const [currState, setCurrState]= React.useState("Sign Up");
  const { token, setToken, navigate, backendUrl } = React.useContext(ShopContext);

  const [name, setName]= React.useState("");
  const [email, setEmail]= React.useState("");
  const [password, setPassword]= React.useState("");

  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    try{
      if(currState === "Sign Up"){
        // Sign Up logic here

        const response= await axios.post(backendUrl + '/api/user/register', {name, email, password});

        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else{
          toast.error(response.data.message);
        }
      } else {
        // Login logic here

        const response= await axios.post(backendUrl + '/api/user/login', {email, password});

        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else{
          toast.error(response.data.message);
        }
      }
    }catch(error){
      console.log("login status",error.message);
      toast.error("An error occurred. Please try again.");
    }
  }

  React.useEffect(()=>{
    if(token){
      navigate('/');
    }
  },[token])
  
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currState === 'Login' ? '' : <input onChange={(e)=> setName(e.target.value)} value={name} className="w-full px-3 py-2 border border-gray-800" type="text" placeholder='Name' required/>}
      <input onChange={(e)=> setEmail(e.target.value)} value={email} className="w-full px-3 py-2 border border-gray-800" type="email" placeholder="Email" required/>
      <input onChange={(e)=> setPassword(e.target.value)} value={password} className="w-full px-3 py-2 border border-gray-800" type="password" placeholder='Password' required/>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {
          currState === 'Login' ?
          <p onClick={()=> setCurrState('Sign Up')} className="cursor-pointer">Create an account</p>
          :
          <p onClick={()=> setCurrState('Login')} className="cursor-pointer">Login Here</p>
        }
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">{currState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login