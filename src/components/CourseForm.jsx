export default function CourseForm({ values, onChange, onSubmit, onCancel, loading, submitLabel }) {
  const fields = [
    { id: "name", label: "Course name *", placeholder: "e.g. Introduction to Computer Science", full: true },
    { id: "code", label: "Course code *", placeholder: "e.g. CS101" },
    { id: "credits", label: "Credits", placeholder: "e.g. 3", type: "number" },
    { id: "department", label: "Department", placeholder: "e.g. Computer Science" },
    { id: "instructor", label: "Instructor", placeholder: "e.g. Dr. Jane Smith" },
  ];

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.id} className={f.full ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
            <input
              type={f.type || "text"}
              value={values[f.id] || ""}
              onChange={(e) => onChange(f.id, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
          <textarea
            value={values.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Brief course description..."
            rows={4}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl transition"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}