import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

function Dashboard() {
  const navigate = useNavigate();
  
  // 1. References for the HTML elements
  const fileInputRef = useRef(null);
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);

  // 2. State to track the uploaded file
  const [file, setFile] = useState(null);

  const handleLogout = () => {
    navigate('/'); 
  };

  // Triggers the hidden file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handles the file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Resets the view
  const handleRemoveFile = () => {
    setFile(null);
    if (viewerRef.current) {
        // We set the ref to null to allow re-initialization next time
        viewerRef.current = null;
    }
  };

  // 3. The 3D Engine Effect
  useEffect(() => {
    // Only run if a file is selected and the HTML container exists
    if (file && viewerContainerRef.current) {
      
      // Prevent multiple viewers from spawning if one already exists
      if (!viewerRef.current) {
        const container = viewerContainerRef.current;
        const viewer = new IfcViewerAPI({ 
          container, 
          backgroundColor: new Color(0xffffff) // White background
        });

        // IMPORTANT: Tell the viewer where the WASM files are in your public folder
        viewer.IFC.setWasmPath('./'); 

        // Add standard 3D scene helpers
        viewer.grid.setGrid();
        viewer.axes.setAxes();

        viewerRef.current = viewer;
      }

      // Load the actual IFC file
      // We use a small timeout to let the UI finish rendering the div first
      const loadModel = async () => {
        try {
            await viewerRef.current.IFC.loadIfc(file, true);
        } catch (error) {
            console.error("Error loading IFC file:", error);
            alert("Could not load this file. Check the console for details.");
        }
      };

      loadModel();
    }

    // Cleanup function when the component unmounts or file changes
    return () => {
        if (!file && viewerRef.current) {
            viewerRef.current = null;
        }
    }
  }, [file]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>BIM Project Viewer</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="projects-section">
          <h2>Your Projects</h2>
          
          {/* Hidden Input Field */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".ifc"
            style={{ display: 'none' }}
          />

          {/* Conditional Rendering */}
          {!file ? (
            /* STATE 1: No File Selected */
            <div className="empty-state">
              <p>No 3D models uploaded yet.</p>
              <button className="upload-btn" onClick={handleUploadClick}>
                Upload IFC File
              </button>
            </div>
          ) : (
            /* STATE 2: File Selected (Show Viewer) */
            <div className="viewer-wrapper" style={{ width: '100%', height: '75vh', position: 'relative', marginTop: '1rem', border: '1px solid #ddd' }}>
              
              {/* The 3D Canvas Container */}
              <div 
                ref={viewerContainerRef} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  position: 'absolute', 
                  top: 0, 
                  left: 0,
                  backgroundColor: '#fff',
                  overflow: 'hidden'
                }} 
              />
              
              {/* Floating Info & Close Button */}
              <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    padding: '15px', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <strong style={{ display: 'block', marginBottom: '10px' }}>
                    Viewing: {file.name}
                  </strong>
                  <button 
                    onClick={handleRemoveFile}
                    style={{ 
                        background: '#e74c3c', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        width: '100%'
                    }}
                  >
                    Close Model
                  </button>
                </div>
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;