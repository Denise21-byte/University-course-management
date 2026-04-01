import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import CourseTable from "../components/CourseTable";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/courses");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.courses || res.data.data || [];
      setCourses(data);
      const depts = [...new Set(data.map((c) => c.department).filter(Boolean))].sort();
      setDepartments(depts);
    } catch {
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      courses.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const code = (c.code || "").toLowerCase();
        const dept = c.department || "";
        return (name.includes(q) || code.includes(q)) && (!deptFilter || dept === deptFilter);
      })
    );
    setPage(1);
  }, [search, deptFilter, courses]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/courses/${deleteId}`);
      toast.success("Course deleted.");
      setDeleteId(null);
      fetchCourses();
    } catch {
      toast.error("Failed to delete course.");
    }
  };

  const stats = [
    { label: "Total courses", value: courses.length },
    { label: "Active", value: courses.filter((c) => c.isActive !== false).length },
    { label: "Departments", value: new Set(courses.map((c) => c.department).filter(Boolean)).size || "—" },
    { label: "Total credits", value: courses.reduce((s, c) => s + (parseInt(c.credits) || 0), 0) || "—" },
  ];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Course Catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} courses in catalog</p>
        </div>
        <button
          onClick={() => navigate("/courses/add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          <option value="">All departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <CourseTable
        courses={paginated}
        loading={loading}
        onView={(id) => navigate(`/courses/${id}`)}
        onEdit={(id) => navigate(`/courses/${id}/edit`)}
        onDelete={(id, name) => { setDeleteId(id); setDeleteName(name); }}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                  page === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
              →
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete course?"
        body={`Are you sure you want to delete "${deleteName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}