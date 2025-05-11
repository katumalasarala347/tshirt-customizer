import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import TShirt3D from "./TShirt3D";

const defaultImage = "/default.png";
const themes = ["light", "dark", "custom"];

function App() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { height: 180, weight: 80, build: "athletic", text: "" }
  });

  const height = watch("height");
  const weight = watch("weight");

  const [imageURL, setImageURL] = useState(defaultImage);
  const [themeIndex, setThemeIndex] = useState(0);

  const handleImageUpload = (file) => {
    if (file && file.type === "image/png") {
      const url = URL.createObjectURL(file);
      setImageURL(url);
    } else {
      alert("Only PNG images are allowed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/png": [] },
    onDrop: (acceptedFiles) => handleImageUpload(acceptedFiles[0])
  });

  const onSubmit = (data) => {
    alert(`Submitted:\nHeight: ${data.height}cm\nWeight: ${data.weight}kg\nBuild: ${data.build}\nText: ${data.text}`);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key.toLowerCase() === "q") {
        setThemeIndex((prev) => (prev + 1) % themes.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.documentElement.className = themes[themeIndex];
  }, [themeIndex]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Customize Your T-Shirt</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ width: "50%" }}>
          <label>
            Height: {height} cm
            <input type="range" min="150" max="210" {...register("height")} style={{ width: "100%" }} />
          </label>
          <br />
          <label>
            Weight: {weight} kg
            <input type="range" min="40" max="150" {...register("weight")} style={{ width: "100%" }} />
          </label>
          <br />
          <label>
            Build:
            <select {...register("build")} style={{ width: "100%" }}>
              <option value="lean">Lean</option>
              <option value="reg">Regular</option>
              <option value="athletic">Athletic</option>
              <option value="big">Big</option>
            </select>
          </label>
          <br />
          <label>
            Text (max 3 lines):
            <textarea rows={3} maxLength={150} {...register("text")} style={{ width: "100%" }} />
          </label>
          <br />
          <label>
            Upload PNG Image:
            <input type="file" accept="image/png" onChange={(e) => handleImageUpload(e.target.files[0])} />
          </label>
          {imageURL !== defaultImage && (
            <div style={{ margin: "10px 0" }}>
              <p>Uploaded Image Preview:</p>
              <img src={imageURL} alt="Uploaded" style={{ maxHeight: "100px" }} />
            </div>
          )}
          <div {...getRootProps()} style={{ border: "1px dashed gray", padding: "10px", margin: "10px 0" }}>
            <input {...getInputProps()} />
            Drag & Drop PNG Here
          </div>
          <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
            Submit
          </button>
        </div>

        <div style={{ width: "50%", height: "600px", background: "#e5e5e5" }}>
          <h2 style={{ padding: "10px", fontSize: "18px" }}>Preview:</h2>
          <Canvas camera={{ position: [0, 0.4, 2.2], fov: 35 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} intensity={1.2} />
            <OrbitControls enableZoom={true} enablePan={false} minDistance={1.5} maxDistance={2.5} target={[0, 0.35, 0]} />
            <TShirt3D image={imageURL} />
          </Canvas>
        </div>
      </form>
    </div>
  );
}

export default App;
