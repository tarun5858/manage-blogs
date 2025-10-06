import { useState } from "react";

function CSVUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      alert(data.message || "Upload successful!");
    } catch (err) {
      alert("Upload failed: " + err.message);
      console.log("Upload Failed" , err.message);
      
    }
  };

  return (
    <div className="text-center"><br />
      <h2>Upload Blogs via CSV</h2><br />
      <input       
      type="file" accept=".csv" onChange={handleFileChange} /><br /><br />
      <button
        style={{border:"1px solid black",padding:"5%",borderRadius:"8px",margin:"1%"}}
      onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default CSVUpload;
