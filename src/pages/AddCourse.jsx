const handleSubmit = async (e) => {
  e.preventDefault();
  if (!values.name || !values.code) {
    toast.error("Course name and code are required.");
    return;
  }
  setLoading(true);
  try {
    const payload = {
      name: values.name,
      code: values.code,
      ...(values.credits && { credits: parseInt(values.credits) }),
      ...(values.department && { department: values.department }),
      ...(values.instructor && { instructor: values.instructor }),
      ...(values.description && { description: values.description }),
    };
    console.log("sending payload:", payload); // check in browser console
    const res = await api.post("/api/courses", payload);
    console.log("create response:", res.data);
    toast.success("Course created successfully!");
    navigate("/courses");
  } catch (err) {
    console.error("create course error:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed to create course.");
  } finally {
    setLoading(false);
  }
};