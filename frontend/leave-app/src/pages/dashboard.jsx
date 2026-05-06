     //this is for employees
    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    const LeaveDashboard = () => {
      const navigate=useNavigate();
      // Mock Data - We will fetch this from MongoDB later
      const userData = JSON.parse(localStorage.getItem("user")) || {}; // Default empty object handle karo
      
      const [stats, setStat] = useState({ total: 10, used: 0, available: 0 });
      const [history, setHistory] = useState([]);
      const [loading, setLoading]=useState(true);
      const [totalDays, setDays]=useState(0);
      const [profile, setProfile]=useState(userData?.profileImage || "");
      const calDays=(sdate, edate)=>{
        
        const startDate=new Date(sdate);
        const endDate=new Date(edate);
        const diffTime=endDate-startDate;
        const diffDays=Math.ceil(diffTime/(1000*60*60*24))+1;
        return diffDays>0?diffDays:0;
      }
      const handleDays=(e)=>{
        const {name, value}=e.target;
        const updateData={...formData, [name]:value}
        setFormData(updateData);

        if(name==="startDate" || name==="endDate"){
          const showValue=calDays(updateData.startDate, updateData.endDate);
          // ...AUR result ko state mein save kar do
          setDays(showValue);
        }
      }
      
      const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        type: 'Casual Leave',
        reason: ''
        
      });
      const employeeId=userData._id;
      const employeeName=userData.name;
  useEffect(()=>{
    //THIS IS LOADING THE HISTORY SECTION
    const fetchDetails=async()=>{
      try{
        const token=localStorage.getItem("token");
        const showDetails= await axios.get(`http://localhost:5000/api/leaves/my-leaves/${employeeId}`,{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        })
        console.log(token);
        console.log(showDetails);
        const maping=showDetails.data.map((items)=>({
          _id:items._id,
          date:new Date(items.startDate).toLocaleDateString(),
          type:items.type,
          status:items.status,
          days:calDays(items.startDate, items.endDate)
        }))
        setHistory(maping);
        console.log(maping);
        setLoading(false);
      }catch(error){
        console.error("API Error:", error.response ? error.response.data : error.message);
        setLoading(false);
      }
    }
    fetchDetails();
    }, [employeeId])

    
    const handleImageUpload=async  (file)=>{
      if(!file)return
      const data = new FormData();
  data.append("profileImg", file);
      try{
        setLoading(true)
        const response=await axios.post(`http://localhost:5000/api/user/upload-file/${employeeId}`,
          data,
          {headers:{"Content-Type":"multipart/form-data"}}
        )
        if(response.data.success){
          const newImageUrl = response.data.url; // Backend se jo URL aaya
          setProfile(newImageUrl);
          const updatedUser = { ...userData, profileImage:newImageUrl};
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("UI updated with:", newImageUrl);
            alert("✅ Profile picture updated!")
        }
      }
      catch(error){
        console.error("Upload error:", error);
        alert("❌ Upload failed!");
    } finally {
        setLoading(false);
      }
      

    }
//LOGIC FOR UPDATING THE TOTAL LEAVES, PENDING AND APPROVED LEAVES
useEffect(()=>{

    const fetchStat=async()=>{
        try{
            const showStat= await axios.get(`http://localhost:5000/api/leaves/stats/${employeeId}`, );
            console.log(showStat.data)
            console.log(employeeId);
            setStat({
              
              total:showStat.data.totalQuota,
              used:showStat.data.used,
              available:showStat.data.available
            })
        } 
        catch(error){
          setStat({error:error.message})
        }
    } 
    if(employeeId){
  fetchStat()
 } 
},[ history, employeeId])

      const handleApply = async (e) => {
        e.preventDefault();
        // Logic: Calculate days between dates and add to history (UI only for now)
      const newData = {
        employeeId: employeeId, 
        employeeName: employeeName,            
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        reason: formData.reason
      };

      try {
        const response = await axios.post("http://localhost:5000/api/leaves/apply", newData);
        
        if (response.status === 201) {
          // SUCCESS: Update the Table UI with the REAL data from MongoDB
          const newRequest = {
            
            _id: response.data.data._id, // The ID MongoDB created
            date: formData.startDate,
            type: formData.type.split(' ')[0],
            status: 'Pending',
            
            days:totalDays
          };

          setHistory([newRequest, ...history]);
          alert("✅ Success! Data saved in MongoDB.");

          // Reset form properly
          setFormData({ startDate: "", endDate: "", type: "Casual Leave", reason: "" });
          setDays();
        }
      } catch (error) {
        console.error("Connection Error:", error);
        // If you get this alert, check if your Backend terminal shows an error!
        alert("❌ Error: " + (error.response?.data?.data || "Check your Backend connection"));
      }
    };
        
      return (
        <div className="min-h-screen p-4 bg-slate-50 md:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* --- Header --- */}
            <div className="flex items-center justify-between mb-10">
              <div>
             <div className="flex items-center gap-4 mb-10">
    <div className="relative group">
        <img 
        key={profile}
            src={profile || `https://ui-avatars.com/api/?name=${employeeName}&background=random`}
            alt="Profile" 
            className="object-cover w-16 h-16 border-2 border-indigo-600 rounded-full shadow-md"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-[10px] font-bold">
            Edit
            <input 
                type="file" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e.target.files[0])} 
            />
        </label>
    </div>
    <div>
        <h1 className="text-2xl font-bold text-slate-800">My Leave Dashboard</h1>
        <p className="text-slate-500">Welcome back, {employeeName}!</p>
    </div>
</div>
                <h1 className="text-2xl font-bold text-slate-800">My Leave Dashboard</h1>
                <p className="text-slate-500">Welcome back! Here is your balance.</p>
              </div>
              <button onClick={()=>navigate('/Logout')} className="text-sm font-medium text-red-600 hover:underline">Logout</button>
            </div>

            {/* --- 1. Stats Grid --- */}
            <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
              <StatBox label="Available Balance" value={stats.available} color="text-indigo-600" bg="bg-indigo-50" />
              <StatBox label="Leaves Used" value={stats.used} color="text-emerald-600" bg="bg-emerald-50" />
              <StatBox label="Total Yearly Quota" value={stats.total} color="text-slate-600" bg="bg-slate-100" />
            </div>


            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              
              
              {/* --- 2. Leave Form --- */}
              <div className="p-6 bg-white border shadow-sm lg:col-span-1 rounded-2xl border-slate-200">
                <h2 className="mb-5 text-lg font-semibold text-slate-800">Apply for Leave</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400">Start Date</label>
                    <input type="date" required className="w-full p-2 mt-1 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.startDate} onChange={handleDays} name='startDate' />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400">End Date</label>
                    <input type="date" required className="w-full p-2 mt-1 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleDays} value={formData.endDate} name='endDate'/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400">Leave Type</label>
                    <select className="w-full p-2 mt-1 border rounded-lg bg-slate-50"
                      onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Paid Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400">Reason</label>
                    <textarea className="w-full p-2 mt-1 border rounded-lg bg-slate-50" rows="3" placeholder="Brief details..." value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 font-semibold text-white transition-all bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 shadow-indigo-100">
                    Submit Request
                  </button>
                </form>
              </div>

              {/* --- 3. History Table --- */}
              <div className="p-6 bg-white border shadow-sm lg:col-span-2 rounded-2xl border-slate-200">
                <h2 className="mb-5 text-lg font-semibold text-slate-800">Recent Applications</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase border-b text-slate-400">
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold">Type</th>
                        <th className="pb-3 font-bold">Days</th>
                        <th className="pb-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600">
                      {history.map((item) => (
                        <tr key={item._id} className="border-b last:border-0">
                          <td className="py-4 font-medium">{item.date}</td>
                          <td className="py-4">{item.type}</td>
                          <td className="py-4">{item.days}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    };

    // Internal Component for Stats
    const StatBox = ({ label, value, color, bg }) => (
      <div className={`${bg} p-6 rounded-2xl border border-white shadow-sm`}>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`text-4xl font-black mt-1 ${color}`}>{value}</p>
      </div>
    );

    export default LeaveDashboard;