export default function CourseTable({ courses, loading, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22" className="text-gray-400">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No courses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Course", "Code", "Department", "Credits", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((c) => {
              const id = c._id || c.id;
              const name = c.name || "Untitled";
              const code = c.code || "—";
              const dept = c.department || null;
              const credits = c.credits ?? "—";
              const isActive = c.isActive !== false;

              return (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{name}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {code}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {dept
                      ? <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{dept}</span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-5 py-4 text-gray-600">{credits}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onView(id)}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(id)}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(id, name)}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {courses.map((c) => {
          const id = c._id || c.id;
          const name = c.name || "Untitled";
          const code = c.code || "—";
          const dept = c.department || null;
          const credits = c.credits ?? "—";
          const isActive = c.isActive !== false;

          return (
            <div key={id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{name}</p>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">
                    {code}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                  isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {dept && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{dept}</span>}
                <span>{credits} credits</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onView(id)}
                  className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(id, name)}
                  className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}