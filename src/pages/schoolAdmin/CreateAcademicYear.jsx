import SchoolLayout from "../../components/erp/school/SchoolLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function CreateAcademicYear() {
  const navigate = useNavigate();

  // Unified form state matching the Django model fields
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  // UI states for API handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic change handler for text/date inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Specific handler for the active toggle
  const handleToggle = () => {
    setFormData({ ...formData, is_active: !formData.is_active });
  };

  /* save to backend */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Assuming you store your SimpleJWT access token in localStorage
      const token = localStorage.getItem("access_token") || localStorage.getItem("token"); 

      await axios.post(
        "http://127.0.0.1:8000/api/v1/school-admin/academic-years/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Successfully saved to Neon DB
      alert("Academic Year created successfully!");
      navigate("/school-admin/academic-years");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        "Failed to save academic year. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* go back */
  const goBack = () => {
    navigate("/school-admin/academic-years");
  };

  return (
    <SchoolLayout title="Academic Years">
      <div className="p-12 max-w-5xl mx-auto">
        {/* breadcrumb + go back */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              className="cursor-pointer hover:text-[#0058be]"
              onClick={() => navigate("/school-admin")}
            >
              Dashboard
            </span>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span
              className="cursor-pointer hover:text-[#0058be]"
              onClick={goBack}
            >
              Academic Years
            </span>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-[#0058be] font-semibold">Create Year</span>
          </div>

          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 text-[#0058be] font-semibold hover:bg-[#eff4ff] rounded-md"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Go Back
          </button>
        </div>

        {/* heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Create Academic Year</h1>
          <p className="text-gray-500">
            Define timeline for upcoming academic session.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* form */}
          <div className="col-span-8 bg-white rounded-lg p-8 shadow-sm">
            
            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* year */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Year Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="2024-2025"
                  className="w-full bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#0058be]"
                />
                <p className="text-xs text-gray-500 mt-1">format YYYY-YYYY</p>
              </div>

              {/* dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#eff4ff] px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#0058be]"
                  />
                </div>
              </div>

              {/* toggle */}
              <div className="flex justify-between items-center p-4 bg-[#eff4ff] rounded-md">
                <div>
                  <h4 className="font-semibold">Year Status</h4>
                  <p className="text-xs text-gray-500">Set active or inactive</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500">
                    Inactive
                  </span>

                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-12 h-6 rounded-full p-1 transition ${
                      formData.is_active ? "bg-[#0058be]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition ${
                        formData.is_active ? "ml-auto" : ""
                      }`}
                    />
                  </button>

                  <span className="text-xs font-semibold text-[#0058be]">
                    Active
                  </span>
                </div>
              </div>

              {/* actions */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={loading}
                  className="px-6 py-3 text-[#0058be] font-semibold hover:bg-[#eff4ff] rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-white font-bold rounded-md bg-gradient-to-r from-[#0058be] to-[#2170e4] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : (
                    "Save Academic Year"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* right panel */}
          <div className="col-span-4 space-y-6">
            <div className="bg-[#eff4ff] p-6 rounded-lg">
              <h3 className="font-bold mb-3 flex gap-2">
                <span className="material-symbols-outlined text-[#924700]">
                  lightbulb
                </span>
                Admin Insights
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Academic year helps track student & teacher records.
              </p>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-[#0058be] text-sm">
                    check_circle
                  </span>
                  Overlap checking automatic
                </div>

                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-[#0058be] text-sm">
                    check_circle
                  </span>
                  Report cards linked
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Quick Action</h3>
              <p className="text-xs text-gray-500 mb-4">
                Import previous configuration
              </p>

              <button className="w-full py-2 border rounded-md text-[#0058be] font-semibold hover:bg-[#eff4ff]">
                Review Past Configurations
              </button>
            </div>
          </div>
        </div>
      </div>
    </SchoolLayout>
  );
}