import React from 'react'

const Login = () => {
  const [currState, setCurrState]= React.useState("Sign Up");

  const onSubmitHandler= (e)=>{
    e.preventDefault();
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currState === 'Login' ? '' : <input className="w-full px-3 py-2 border border-gray-800" type="text" placeholder='Name' required/>}
      <input className="w-full px-3 py-2 border border-gray-800" type="email" placeholder="Email" required/>
      <input className="w-full px-3 py-2 border border-gray-800" type="password" placeholder='Password' required/>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {
          currState === 'Login' ?
          <p onClick={()=> setCurrState('Signup')} className="cursor-pointer">Create an account</p>
          :
          <p onClick={()=> setCurrState('Login')} className="cursor-pointer">Login Here</p>
        }
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">{currState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login