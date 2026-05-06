import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
  const navigate=useNavigate()
  // 1. Dummy Data for UI Testing
  const [requests, setRequests] = useState([
    { _id: "101", employeeName: "Rahul Verma", type: "Casual Leave", startDate: "2026-04-10", endDate: "2026-04-12", reason: "Family Function", status: "Pending", employeeId: "EMP001" },
    { _id: "102", employeeName: "Priya Sharma", type: "Sick Leave", startDate: "2026-04-05", endDate: "2026-04-06", reason: "High Fever", status: "Approved", employeeId: "EMP002" },
    { _id: "103", employeeName: "Vikram Singh", type: "Paid Leave", startDate: "2026-04-15", endDate: "2026-04-20", reason: "Vacation", status: "Pending", employeeId: "EMP003" },
  ]);

  // Stats calculation based on dummy data
  const stats = {
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  const handleStatusUpdate = (id, newStatus) => {
    // UI-only update for now
    const updated = requests.map(req => 
      req._id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updated);
    alert(`Local State Updated: ${newStatus}`);
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-50">
      
      {/* --- 1. Sidebar --- */}
      <div className="hidden w-64 p-6 text-white shadow-xl bg-slate-900 lg:block">
        <div className="flex items-center mb-10 space-x-3">
          <div className="flex items-center justify-center w-8 h-8 font-bold bg-indigo-500 rounded-lg">A</div>
          <h2 className="text-xl font-bold tracking-tight">Admin<span className="text-indigo-400">Hub</span></h2>
        </div>
        
        <nav className="space-y-2">
          <div className="flex items-center p-3 space-x-3 text-indigo-400 border bg-indigo-600/20 rounded-xl border-indigo-500/30">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="font-medium">Leave Requests</span>
          </div>
          <div className="flex items-center p-3 space-x-3 transition-all cursor-not-allowed text-slate-400 hover:bg-slate-800 rounded-xl">
            <span>Employee List</span>
          </div>
        </nav>

        <div className="absolute bottom-10 left-6">
           <button className="flex items-center space-x-2 transition-colors text-slate-400 hover:text-red-400">
              <span onClick={()=>navigate('/logout')}>Logout</span>
           </button>
        </div>
      </div>

      {/* --- 2. Main Content Area --- */}
      <div className="flex-1 p-6 overflow-y-auto md:p-10">
        
        <header className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">Approval Center</h1>
            <p className="mt-1 text-slate-500">Review and manage company-wide leave applications.</p>
          </div>
          <div className="flex items-center px-4 py-2 space-x-3 bg-white border shadow-sm rounded-2xl border-slate-200">
             <div className="flex items-center justify-center w-10 h-10 font-bold text-indigo-600 bg-indigo-100 rounded-full">S</div>
             <div>
                <p className="text-xs font-bold uppercase text-slate-400">Logged in as</p>
                <p className="text-sm font-bold text-slate-700">Sid (Admin)</p>
             </div>
          </div>
        </header>

        {/* --- 3. Analytics Cards --- */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <StatCard label="Pending Review" value={stats.pending} accentColor="border-amber-400" textColor="text-amber-600" bg="bg-amber-50" />
          <StatCard label="Total Approved" value={stats.approved} accentColor="border-emerald-400" textColor="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Total Rejected" value={stats.rejected} accentColor="border-red-400" textColor="text-red-600" bg="bg-red-50" />
        </div>

        {/* --- 4. The Request Table --- */}
        <div className="overflow-hidden bg-white border shadow-xl rounded-3xl shadow-slate-200/60 border-slate-200">
          <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
             <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
             <span className="px-3 py-1 text-xs font-bold tracking-wider text-indigo-600 uppercase rounded-full bg-indigo-50">Live Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.1em] font-black border-b border-slate-100">
                  <th className="px-8 py-5">Employee</th>
                  <th className="px-8 py-5">Leave Details</th>
                  <th className="px-8 py-5">Duration</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((item) => (
                  <tr key={item._id} className="transition-all duration-200 group hover:bg-slate-50/80">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center font-bold transition-colors w-9 h-9 bg-slate-200 rounded-xl text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          {item.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{item.employeeName}</p>
                          <p className="text-[11px] text-slate-400 font-medium italic">{item.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-600">{item.type}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">"{item.reason}"</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-slate-600">{new Date(item.startDate).toLocaleDateString('en-GB')}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">to {new Date(item.endDate).toLocaleDateString('en-GB')}</p>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-8 py-6 text-center">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleStatusUpdate(item._id, 'Approved')}
                            className="px-4 py-2 text-xs font-bold text-white transition-all shadow-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-emerald-100 active:scale-95"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item._id, 'Rejected')}
                            className="px-4 py-2 text-xs font-bold text-red-500 transition-all bg-white border-2 border-red-100 hover:bg-red-50 rounded-xl active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-black uppercase text-slate-300 tracking-widest">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable UI Components (Internal) ---

const StatCard = ({ label, value, bg, accentColor, textColor }) => (
  
  <div className={`${bg} ${accentColor} border-l-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
    <p className="text-xs font-black tracking-widest uppercase text-slate-400">{label}</p>
    <p className={`text-4xl font-black mt-2 ${textColor}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 ring-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    Rejected: "bg-red-100 text-red-700 ring-red-200"
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;