import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import CourseForm from "../components/CourseForm";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/api/courses/${id}`)
      .then((res) => {
        const c = res.data.course || res.data.data || res.data;
        setValues({
          name: c.name || "",
          code: c.code || "",
          credits: c.credits ?? "",
          department: c.department || "",
          instructor: c.instructor || "",
          description: c.description || "",
        });
      })
      .catch(() => toast.error("Failed to load course."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name || !values.code) {
      toast.error("Course name and code are required.");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/courses/${id}`, {
        name: values.name,
        code: values.code,
        credits: parseInt(values.credits) || undefined,
        department: values.department || undefined,
        instructor: values.instructor || undefined,
        description: values.description || undefined,
      });
      toast.success("Course updated successfully!");
      navigate("/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

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
        <h1 className="text-xl font-semibold text-gray-900">Edit course</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update the course details below</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <CourseForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/courses")}
          loading={loading}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}