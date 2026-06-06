import SchoolLayout from "../../components/erp/school/SchoolLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddStudent() {
  const navigate = useNavigate();

  // State mapped to backend payload requirements + UI extras
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    blood: "",
    phone: "",
    email: "",
    address: "",
    class_room_id: "",
    roll_number: "",
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch actual Class Rooms to populate the dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/v1/school-admin/classes/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/v1/school-admin/students/register/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Student record saved successfully!");
      navigate("/school-admin/students");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to register student. Please verify all required fields."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolLayout title="Students">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* breadcrumb & header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Add New Student</h1>
            <p className="text-[#6b7280] mt-1 max-w-2xl">
              Register a new student to the academic system. Ensure all mandatory
              information is accurate for seamless records management.
            </p>
          </div>

          <button
            onClick={() => navigate("/school-admin/students")}
            className="flex items-center gap-2 px-4 py-2 bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0058be] font-semibold rounded-md transition"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Go Back
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    First Name
                  </label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Julian"
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-[#0058be]/10 transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Last Name
                  </label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Alexander"
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-[#0058be]/10 transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="student@academy.edu"
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-[#0058be]/10 transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Mobile Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6b7280] tracking-wider uppercase">
                    Residential Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, City, Zip Code"
                    rows="3"
                    className="bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-[#0058be]/10 transition"
                  />
                </div>
              </div>

              {/* FOOTER aligned with left */}
              <div className="flex justify-end gap-4 pt-16">
                <button
                  type="button"
                  onClick={() => navigate("/school-admin/students")}
                  disabled={loading}
                  className="px-8 py-3 text-[#6b7280] font-semibold hover:bg-[#eff4ff] rounded-md transition disabled:opacity-50"
                >
                  Cancel & Discard
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-md shadow-lg shadow-[#0058be]/20 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      Save Student Record
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              
              {/* Photo */}
              <div className="bg-white p-8 rounded-xl border border-[#e5eeff] shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-[#e5eeff] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYL2GdSdXkQF_QboAdnw1o3X0V4wiJr8LixmKIflH_kYptP3tutulTJLYiURi0vZw0lILetHS7GSH2aJiccAMub8Fxp8mPVnOZRc6Qdyum6vjihDfbb0IPPiLmnUJJCvlGRi6lWCTsHqANZh04Fc3KUvBRKkBb2tMljnL4a97MV8A5kzWvHcUn-mf-ZAj-TsmRqKKjQXk_QS2Q446UB5y8CnwB3BUwOMUbVJV7ZpsF7XenF_tYywih-ByZVbGArIlenpdiCMEwaw"
                    alt="Student placeholder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="mt-4 font-semibold">Student Photograph</h4>
                <p className="text-xs text-[#6b7280]">PNG, JPG up to 5MB</p>
              </div>

              {/* Academic */}
              <div className="bg-white p-6 rounded-xl border border-[#e5eeff] shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold mb-4">Academic Record</h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] font-semibold text-[#6b7280] uppercase">Admission No. (Auto)</label>
                     <input
                      value="ADM-2024-0812"
                      disabled
                      className="bg-[#eff4ff] px-3 py-2 rounded-md text-sm text-gray-500 cursor-not-allowed"
                     />
                  </div>

                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] font-semibold text-[#6b7280] uppercase">Class Assignment</label>
                     <select
                      name="class_room_id"
                      value={form.class_room_id}
                      onChange={handleChange}
                      required
                      className="bg-[#eff4ff] px-3 py-2 rounded-md text-sm outline-none"
                     >
                      <option value="" disabled>Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} {cls.section ? `(${cls.section})` : ""}
                        </option>
                      ))}
                     </select>
                  </div>

                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] font-semibold text-[#6b7280] uppercase">Roll Number</label>
                     <input
                      name="roll_number"
                      value={form.roll_number}
                      onChange={handleChange}
                      required
                      placeholder="e.g. GS-0324003"
                      className="bg-[#eff4ff] px-3 py-2 rounded-md text-sm outline-none"
                     />
                  </div>
                </div>
              </div>

              {/* Parent Connection (UI Placeholder) */}
              <div className="bg-white p-6 rounded-xl border border-[#e5eeff] shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold mb-4">Parental Connection</h3>

                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">
                    search
                  </span>
                  <input
                    placeholder="Search by name or ID..."
                    className="w-full bg-[#eff4ff] pl-10 pr-4 py-2 rounded-md outline-none text-sm"
                  />
                </div>

                <div className="bg-[#eff4ff] p-3 rounded-lg flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center font-semibold text-[#6b38d4]">
                      RM
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Robert Miller</p>
                      <p className="text-[10px] text-[#6b7280]">Guardian ID: G-9021</p>
                    </div>
                  </div>
                  <button type="button">
                    <span className="material-symbols-outlined text-red-500 hover:text-red-700 transition">
                      close
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SchoolLayout>
  );
}