import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import CourseForm from "../components/CourseForm";

export default function AddCourse() {
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name || !values.code) {
      toast.error("Course name and code are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/courses", {
        name: values.name,
        code: values.code,
        credits: parseInt(values.credits) || undefined,
        department: values.department || undefined,
        instructor: values.instructor || undefined,
        description: values.description || undefined,
      });
      toast.success("Course created successfully!");
      navigate("/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/courses")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to courses
      </button>

      <div>
        <h1 className="text-xl font-semibold text-gray-900">Add new course</h1>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a course</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <CourseForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/courses")}
          loading={loading}
          submitLabel="Create course"
        />
      </div>
    </div>
  );
}