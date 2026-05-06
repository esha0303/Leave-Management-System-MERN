import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Logout=()=>{
    const navigate=useNavigate();
useEffect(()=>{
   
    localStorage.removeItem("user");
    const Timer= setTimeout(()=>{
        navigate('/');
        return()=> clearTimeout(Timer);
        
    },1000)
},[navigate])
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Simple Tailwind Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
        <h2 className="text-xl font-semibold text-slate-700">Logging you out...</h2>
        <p className="text-slate-500">Clearing your session securely.</p>
      </div>
    </div>
        </>
    )
}

export default Logout;