import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    api.get(`/api/courses/${id}`)
      .then((res) => setCourse(res.data.course || res.data.data || res.data))
      .catch(() => toast.error("Failed to load course."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/courses/${id}`);
      toast.success("Course deleted.");
      navigate("/courses");
    } catch {
      toast.error("Failed to delete course.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  const fields = [
    { label: "Course name", value: course.name },
    { label: "Code", value: course.code },
    { label: "Department", value: course.department },
    { label: "Credits", value: course.credits },
    { label: "Instructor", value: course.instructor },
    { label: "Status", value: course.isActive !== false ? "Active" : "Inactive" },
    { label: "Description", value: course.description, full: true },
    { label: "Created", value: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : null },
  ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/courses")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to courses
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{course.name}</h1>
          <span className="inline-block mt-1 font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {course.code}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Detail fields */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.label} className={f.full ? "sm:col-span-2" : ""}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-sm text-gray-900">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete course?"
        body={`Are you sure you want to delete "${course.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}