import { useNavigate } from "react-router-dom";
const ProtectedRoutes=({children, allowedRoles})=>{
    const navigate=useNavigate()
//here children indicates default route <leavedashboar >and admin dashboard
    const user= JSON.parse(localStorage.getItem("user"));

    if(!user){
       return navigate('/');
    }
    if(allowedRoles && !allowedRoles.includes(user.role)){
      if(user.role==='admin'){
         return navigate('/admin');
      }
       return navigate('/dashboard');
    }
    //children tk pahucne k liye condition false hona bahut jruri h

    return children;
}
export default ProtectedRoutes;