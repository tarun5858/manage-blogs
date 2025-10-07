import { useState } from "react";

function BlogForm() {
  const initialState = {
    title: "",
    description: "",
    date: "",
    heading: "",
    subheading: "",
    subheading1: "",
    introduction: "",
    introduction1: "",
    points: "",
    blogTags: "",
    imageKey: "",
    detailImageKey: "",
    paragraph1: "",
    outcome: "",
    lesson: "",
    paragraph2: "",
    outcome1: "",
    lesson1: "",
    paragraph3: "",
    outcome2: "",
    lesson2: "",
    conclusion: "",
    conclusion1: "",
    conclusion2: "",
    finalword: "",
    finalword1: "",
    finalword2: "",
    finalword3: "",
    nextSeries: "",

    // ✅ All subtitles + arrays
    subtitle: "",
    subttileHead: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle1: "",
    subttileHead1: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle2: "",
    subttileHead2: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle3: "",
    subttileHead3: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle4: "",
    subttileHead4: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle5: "",
    subttileHead5: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
    subtitle6: "",
    subttileHead6: [{ beforeContent: "", name: [""], benefits: [""], afterContent: "" }],
  };

  const [blog, setBlog] = useState(initialState);

  // ✅ Basic field update
  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // ✅ Add new Name-Benefit pair
  const addNameBenefitPair = (headKey, sectionIndex) => {
    const updated = [...blog[headKey]];
    updated[sectionIndex].name.push("");
    updated[sectionIndex].benefits.push("");
    setBlog({ ...blog, [headKey]: updated });
  };

  // ✅ Add new entire section
  const addSubttileSection = (headKey) => {
    const updated = [...blog[headKey]];
    updated.push({ beforeContent: "", name: [""], benefits: [""], afterContent: "" });
    setBlog({ ...blog, [headKey]: updated });
  };

// Add a benefit to a specific section and name index
const addBenefitToName = (headKey, sectionIndex, nameIndex) => {
  const updated = [...blog[headKey]]; // copy the specific subtitle head array
  if (!updated[sectionIndex].benefits) updated[sectionIndex].benefits = [];
  
  // Make sure we have a benefits array corresponding to the nameIndex
  updated[sectionIndex].benefits.push(""); // adds an empty benefit input
  setBlog({ ...blog, [headKey]: updated });
};


  // ✅ Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...blog,
      blogTags: blog.blogTags.split(",").map((t) => t.trim()).filter(Boolean),
      points: blog.points.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch("http://localhost:4000/api/blogs/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ Blog added successfully!");
      setBlog(initialState);
    } else {
      const err = await res.json();
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <h2>Add New Blog</h2>

      {/* ✅ Basic input fields */}
      {[
        "title","description","date","heading","subheading","introduction",
        "subheading1","introduction1","points","blogTags","imageKey","detailImageKey",
        "paragraph1","outcome","lesson","paragraph2","outcome1","lesson1",
        "paragraph3","outcome2","lesson2","conclusion","conclusion1","conclusion2",
        "finalword","finalword1","finalword2","finalword3","nextSeries"
      ].map((field) => (
        <div key={field}>
          <input
            style={{
              border: "1px solid black",
              padding: "1%",
              borderRadius: "8px",
              margin: "1%",
              width: "80%",
            }}
            name={field}
            placeholder={field}
            value={blog[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* ✅ Subtitle + SubttileHead Sections */}
      {["subtitle","subtitle1","subtitle2","subtitle3","subtitle4","subtitle5","subtitle6"].map((subField, idx) => {
        const headField = `subttileHead${idx === 0 ? "" : idx}`;
        const subtitleArray = blog[headField] || [];

        return (
          <div key={subField} style={{ marginBottom: "2rem" }}>
            <h3>{subField}</h3>
            <input
              style={{
                border: "1px solid black",
                padding: "1%",
                borderRadius: "8px",
                margin: "1%",
                width: "80%",
              }}
              name={subField}
              placeholder={subField}
              value={blog[subField]}
              onChange={handleChange}
            />

            <h4>{headField}</h4>

            {subtitleArray.map((section, sectionIndex) => (
              <div key={sectionIndex} style={{ marginLeft: "20px", marginBottom: "1rem" }}>
                {/* Before Content */}
                <textarea
                  style={{ margin: "0.5%", width: "80%", minHeight: "60px" }}
                  placeholder="Content above benefits"
                  value={section.beforeContent}
                  onChange={(e) => {
                    const updated = [...subtitleArray];
                    updated[sectionIndex].beforeContent = e.target.value;
                    setBlog({ ...blog, [headField]: updated });
                  }}
                />

                {/* Name–Benefit Pairs */}
                {section.name.map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                    <input
                      style={{ width: "40%" }}
                      placeholder="Name"
                      value={n}
                      onChange={(e) => {
                        const updated = [...subtitleArray];
                        updated[sectionIndex].name[i] = e.target.value;
                        setBlog({ ...blog, [headField]: updated });
                      }}
                    />
                    <input
                      style={{ width: "40%" }}
                      placeholder="Benefit"
                      value={section.benefits[i] || ""}
                      onChange={(e) => {
                        const updated = [...subtitleArray];
                        updated[sectionIndex].benefits[i] = e.target.value;
                        setBlog({ ...blog, [headField]: updated });
                      }}
                    />
                  </div>
                ))}

                {/* Add New Pair */}
                <button
                  type="button"
                  onClick={() => addNameBenefitPair(headField, sectionIndex)}
                >
                  + Add Name-Benefit
                </button>

                {/* After Content */}
                <textarea
                  style={{ margin: "0.5%", width: "80%", minHeight: "60px" }}
                  placeholder="Content below benefits"
                  value={section.afterContent}
                  onChange={(e) => {
                    const updated = [...subtitleArray];
                    updated[sectionIndex].afterContent = e.target.value;
                    setBlog({ ...blog, [headField]: updated });
                  }}
                />
              </div>
            ))}

            {/* Add new section */}
            <button
              type="button"
              onClick={() => addSubttileSection(headField)}
            >
              + Add New Section
            </button>
            
          </div>
        );
      })}

      {/* ✅ Save Blog */}
      <button
        type="submit"
        style={{
          border: "1px solid black",
          padding: "1%",
          borderRadius: "8px",
          margin: "2%",
        }}
      >
        Save Blog
      </button>
    </form>
  );
}

export default BlogForm;
