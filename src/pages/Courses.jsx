const fetchCourses = async () => {
  setLoading(true);
  try {
    const res = await api.get("/api/courses");
    console.log("courses response:", res.data); // check shape in browser console
    let data = [];
    if (Array.isArray(res.data)) {
      data = res.data;
    } else if (Array.isArray(res.data?.courses)) {
      data = res.data.courses;
    } else if (Array.isArray(res.data?.data)) {
      data = res.data.data;
    } else if (Array.isArray(res.data?.result)) {
      data = res.data.result;
    }
    setCourses(data);
    const depts = [...new Set(data.map((c) => c.department).filter(Boolean))].sort();
    setDepartments(depts);
  } catch (err) {
    console.error("fetch courses error:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed to load courses.");
  } finally {
    setLoading(false);
  }
};