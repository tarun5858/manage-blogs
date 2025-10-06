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
    subtitle: "",
    subttileHead: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle1: "",
    subttileHead1: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle2: "",
    subttileHead2: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle3: "",
    subttileHead3: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle4: "",
    subttileHead4: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle5: "",
    subttileHead5: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
    subtitle6: "",
    subttileHead6: [
      { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
    ],
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
    nextSeries: ""
  };

  const [blog, setBlog] = useState(initialState);

  // Basic field change
  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Subtitle field changes
  const handleSubttileChange = (field, index, key, value) => {
    const updated = [...blog[field]];
    updated[index][key] = value;
    setBlog({ ...blog, [field]: updated });
  };

  // Handle name (array of strings)
  // const handleNameChange = (field, index, nIndex, value) => {
  //   const updated = [...blog[field]];
  //   updated[index].name[nIndex] = value;
  //   setBlog({ ...blog, [field]: updated });
  // };

  // const addName = (field, index) => {
  //   const updated = [...blog[field]];
  //   updated[index].name.push("");
  //   setBlog({ ...blog, [field]: updated });
  // };

  // // Handle benefits (array of strings)
  // const handleBenefitChange = (field, index, bIndex, value) => {
  //   const updated = [...blog[field]];
  //   updated[index].benefits[bIndex] = value;
  //   setBlog({ ...blog, [field]: updated });
  // };

  // const addBenefit = (field, index) => {
  //   const updated = [...blog[field]];
  //   updated[index].benefits.push("");
  //   setBlog({ ...blog, [field]: updated });
  // };

  // Add new section → only name & benefits
  const addSubttileSection = (field) => {
  setBlog((prev) => {
    const isFirst = prev[field].length === 0;  // ✅ correct
    return {
      ...prev,
      [field]: [
        ...prev[field],   // here prev is object, not iterable
        isFirst
          ? { beforeContent: "", name: [""], benefits: [""], afterContent: "" }
          : { name: [""], benefits: [""] }
      ]
    };
  });
};


  // Submit form
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
      alert("Blog added successfully!");
      setBlog(initialState);
    } else {
      const err = await res.json();
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <h2>Add New Blog Using Form</h2>

      {/* Basic Fields */}
      {[
        "title","description","date","heading","subheading","introduction",
        "subheading1","introduction1","points","blogTags",
        "imageKey","detailImageKey","paragraph1","outcome","lesson",
        "paragraph2","outcome1","lesson1","paragraph3","outcome2","lesson2",
        "conclusion","conclusion1","conclusion2",
        "finalword","finalword1","finalword2","finalword3","nextSeries"
      ].map((field) => (
        <div key={field}>
          <input
            style={{border:"1px solid black",padding:"1%",borderRadius:"8px",margin:"1%",width:"80%"}}
            name={field}
            placeholder={field}
            value={blog[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Subtitles + SubttileHead arrays */}
      {["subtitle","subtitle1","subtitle2","subtitle3","subtitle4","subtitle5","subtitle6"].map((subField, idx) => {
        const headField = `subttileHead${idx === 0 ? "" : idx}`;
        return (
          <div key={subField} style={{ marginBottom: "2rem" }}>
            <h3>{subField}</h3>
            <input
              style={{border:"1px solid black",padding:"1%",borderRadius:"8px",margin:"1%",width:"80%"}}
              name={subField}
              placeholder={subField}
              value={blog[subField]}
              onChange={handleChange}
            />

            <h4>{headField}</h4>
            {/* {blog[headField].map((item, i) => (
              <div key={i} style={{ marginLeft: "20px", marginBottom: "1rem" }}>
                
                {i === 0 && (
                  <textarea
                    style={{margin:"0.5%", width:"80%", minHeight:"60px"}}
                    placeholder="Content above benefits"
                    value={item.beforeContent || ""}
                    onChange={(e) => handleSubttileChange(headField, i, "beforeContent", e.target.value)}
                  />
                )}

                {item.name.map((n, ni) => (
                  <input
                    key={ni}
                    style={{margin:"0.5%", width:"70%"}}
                    placeholder={`Name ${ni+1}`}
                    value={n}
                    onChange={(e) => handleNameChange(headField, i, ni, e.target.value)}
                  />
                ))}
                <button type="button" onClick={() => addName(headField, i)}>+ Add Name</button>

                {item.benefits.map((b, bi) => (
                  <input
                    key={bi}
                    style={{margin:"0.5%", width:"70%"}}
                    placeholder={`Benefit ${bi+1}`}
                    value={b}
                    onChange={(e) => handleBenefitChange(headField, i, bi, e.target.value)}
                  />
                ))}
                <button type="button" onClick={() => addBenefit(headField, i)}>+ Add Benefit</button>

                {i === 0 && (
                  <textarea
                    style={{margin:"0.5%", width:"80%", minHeight:"60px"}}
                    placeholder="Content below benefits"
                    value={item.afterContent || ""}
                    onChange={(e) => handleSubttileChange(headField, i, "afterContent", e.target.value)}
                  />
                )}
              </div>
            ))} */}

            {/* Render Name + Benefit pairs */}
{blog[headField].map((section, sectionIndex) => (
  <div key={sectionIndex} style={{ marginLeft: "20px", marginBottom: "1rem" }}>
    
    {/* Before Content (only once per section) */}
    <textarea
      style={{margin:"0.5%", width:"80%", minHeight:"60px"}}
      placeholder="Content above benefits"
      value={section.beforeContent || ""}
      onChange={(e) =>
        handleSubttileChange(headField, sectionIndex, "beforeContent", e.target.value)
      }
    />

    {/* Name + Benefit Pairs */}
    {section.name.map((n, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem" }}>
        <input
          style={{margin:"0.5%", width:"70%", fontWeight:"bold"}}
          placeholder={`Name ${i+1}`}
          value={n}
          onChange={(e) => {
            const updated = [...blog[headField]];
            updated[sectionIndex].name[i] = e.target.value;
            setBlog({ ...blog, [headField]: updated });
          }}
        />
        <input
          style={{margin:"0.5%", width:"70%"}}
          placeholder={`Benefit ${i+1}`}
          value={section.benefits[i] || ""}
          onChange={(e) => {
            const updated = [...blog[headField]];
            updated[sectionIndex].benefits[i] = e.target.value;
            setBlog({ ...blog, [headField]: updated });
          }}
        />
      </div>
    ))}

    {/* Add new name+benefit pair */}
    <button
      type="button"
      onClick={() => {
        const updated = [...blog[headField]];
        updated[sectionIndex].name.push("");
        updated[sectionIndex].benefits.push("");
        setBlog({ ...blog, [headField]: updated });
      }}
    >
      + Add Name & Benefit
    </button>

    {/* After Content */}
    <textarea
      style={{margin:"0.5%", width:"80%", minHeight:"60px"}}
      placeholder="Content below benefits"
      value={section.afterContent || ""}
      onChange={(e) =>
        handleSubttileChange(headField, sectionIndex, "afterContent", e.target.value)
      }
    />
  </div>
))}


            <button type="button" onClick={() => addSubttileSection(headField)}>+ Add Section</button>
          </div>
        );
      })}

      {/* Save Blog CTA */}
      <button 
        type="submit"
        style={{border:"1px solid black",padding:"1%",borderRadius:"8px",margin:"2%"}}
      >
        Save Blog
      </button>
    </form>
  );
}

export default BlogForm;
