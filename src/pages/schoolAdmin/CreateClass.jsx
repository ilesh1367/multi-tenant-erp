import SchoolLayout from "../../components/erp/school/SchoolLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateClass() {
  const navigate = useNavigate();

  // State matching our Django ClassRoom model
  const [formData, setFormData] = useState({
    academic_year: "",
    name: "",
    section: "",
  });

  // UI and Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch live Academic Years for the dropdown on component mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/school-admin/academic-years/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAcademicYears(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to fetch academic years", err);
      }
    };
    fetchYears();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/v1/school-admin/classes/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Class created successfully!");
      navigate("/school-admin");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to save class. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolLayout title="Create Class">
      <div className="px-8 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE FORM */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              
              {/* heading */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold">Class Details</h3>
                <p className="text-[#6b7280] mt-1">
                  Establish a new academic division for the current term.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Academic Year Dropdown (Live Data) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Academic Year
                  </label>
                  <div className="relative">
                    <select
                      name="academic_year"
                      value={formData.academic_year}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#eff4ff] rounded-md px-4 py-3.5 outline-none appearance-none focus:ring-2 focus:ring-[#0058be]/20"
                    >
                      <option value="" disabled>
                        Select academic year
                      </option>
                      {academicYears.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.name} {year.is_active ? "(Active)" : ""}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* class name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Class Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Grade 10"
                    className="w-full bg-[#eff4ff] rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#0058be]/20"
                  />
                </div>

                {/* section */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Section (Optional)
                  </label>
                  <input
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g., Section A"
                    className="w-full bg-[#eff4ff] rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#0058be]/20"
                  />
                </div>

                {/* buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/school-admin")}
                    disabled={loading}
                    className="px-6 py-3 rounded-md text-gray-600 hover:bg-[#eff4ff] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-[#0058be] text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">
                          progress_activity
                        </span>
                        Saving...
                      </>
                    ) : (
                      "Save Class"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* tips */}
            <div className="bg-[#dce9ff] rounded-lg p-6 relative overflow-hidden">
              <h4 className="font-bold text-[#0058be] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">lightbulb</span>
                Quick Tips
              </h4>
              <ul className="space-y-4 text-xs text-[#374151]">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full mt-2"></span>
                  <p>Ensure class naming follows school convention.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full mt-2"></span>
                  <p>Classes must be assigned to an active Academic Year.</p>
                </li>
              </ul>
            </div>

            {/* insight */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between mb-6">
                <h4 className="font-bold">Capacity Tracking</h4>
                <span className="bg-[#924700] text-white text-[10px] px-2 py-1 rounded-full">
                  AI Insight
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0058be]">
                      meeting_room
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="h-1.5 bg-[#e5eeff] rounded-full">
                      <div className="h-full bg-[#0058be] w-3/4"></div>
                    </div>
                    <p className="text-[11px] mt-1 text-[#6b7280]">
                      Room Utilization 75%
                    </p>
                  </div>
                </div>

                <p className="text-[11px] italic border-l-2 border-[#924700] pl-3 text-[#6b7280]">
                  New classes expand your infrastructure planning metrics.
                </p>
              </div>
            </div>

            {/* image placeholder */}
            <div className="rounded-lg overflow-hidden h-48 shadow-lg relative bg-gray-200">
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 text-white text-xs z-10">
                Create environments where every student can excel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SchoolLayout>
  );
}