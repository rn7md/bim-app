import React, { useState, useEffect, useRef } from 'react';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  
  // We use this for the "Cloud" viewer
  const [selectedModelUrl, setSelectedModelUrl] = useState(null);

  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);

  // Ref for the hidden "Local File" input
  const localInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // --- 3D VIEWER LOGIC ---
  useEffect(() => {
    // We run this if a URL is selected OR if the container exists (for local files)
    if (viewerContainerRef.current) {
      const container = viewerContainerRef.current;
      
      // Cleanup old viewer if it exists
      if (viewerRef.current) {
        // We only dispose if we are re-creating it, but for now let's keep it simple
        // Actually, we need to be careful not to kill it if it's already running.
      } else {
         // Initialize Viewer ONLY ONCE
        const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
        viewerRef.current = viewer;

        viewer.grid.setGrid();
        viewer.axes.setAxes();

        // POINT TO LOCAL WASM (The step that worked)
        viewer.IFC.setWasmPath(window.location.origin + "/");
        
        // DISABLE WORKERS (To prevent crashes)
        viewer.IFC.loader.ifcManager.useWebWorkers(false);
      }
    }
  }, []); // Run once on mount

  // Watch for URL changes (Cloud Loading)
  useEffect(() => {
    const loadCloudModel = async () => {
      if (selectedModelUrl && viewerRef.current) {
        try {
          console.log("Attempting Cloud Load...");
          await viewerRef.current.IFC.loadIfcUrl(selectedModelUrl, true);
        } catch (error) {
          console.error(error);
          alert("Cloud Load Failed (likely Security/CORS blocked). Try the 'View Local File' button!");
        }
      }
    };
    loadCloudModel();
  }, [selectedModelUrl]);


  // --- HANDLER FOR LOCAL FILE (The Test) ---
  const handleLocalFileView = async (event) => {
    const file = event.target.files[0];
    if (file && viewerRef.current) {
      try {
        console.log("Loading Local File...");
        // Reset scene
        await viewerRef.current.dispose();
        // Re-init (simple way to clear)
        const viewer = new IfcViewerAPI({ 
            container: viewerContainerRef.current, 
            backgroundColor: new Color(0xffffff) 
        });
        viewerRef.current = viewer;
        viewer.grid.setGrid();
        viewer.axes.setAxes();
        viewer.IFC.setWasmPath(window.location.origin + "/");
        viewer.IFC.loader.ifcManager.useWebWorkers(false);

        // Load the local file directly
        await viewer.IFC.loadIfc(file, true);
        console.log("Local File Loaded!");
      } catch (err) {
        alert("Local Error: " + err.message);
      }
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  
  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setUploading(true);
    try {
      const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, "files"), {
        name: file.name, url: url, uploader: auth.currentUser?.email, createdAt: new Date().toISOString()
      });
      setFile(null); alert("Upload Successful!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>BIM Project Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
      </div>

      {/* TOP CONTROLS */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        
        {/* Upload Section */}
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <h3>1. Upload to Cloud</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".ifc" />
            <button onClick={handleUpload} disabled={uploading} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Local View Section */}
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', flex: 1, border: '1px solid #90caf9' }}>
          <h3>2. View Local File </h3>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>Use this to test if the viewer engine works.</p>
          <input 
            type="file" 
            accept=".ifc"
            onChange={handleLocalFileView}
          />
        </div>
      </div>

      {/* MAIN LAYOUT: LIST + VIEWER */}
      <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: 0 }}>
        
        {/* LEFT: File List */}
        <div style={{ width: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
          <h4>Cloud Files</h4>
          {files.map((f) => (
            <div key={f.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{f.name}</p>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => setSelectedModelUrl(f.url)}
                  style={{ flex: 1, padding: '5px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  3D View
                </button>
                <a href={f.url} target="_blank" rel="noreferrer" style={{ padding: '5px 10px', background: '#6c757d', color: 'white', borderRadius: '4px', fontSize: '12px', textDecoration: 'none' }}>Download</a>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: 3D Viewer */}
        <div style={{ flex: 1, position: 'relative', border: '2px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
          <div ref={viewerContainerRef} style={{ width: '100%', height: '100%' }} />
          
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '4px', fontSize: '12px', pointerEvents: 'none' }}>
             <strong>Status:</strong> {selectedModelUrl ? "Trying to load Cloud File..." : "Waiting for file..."}
             <br/>
             Controls: Left Click (Rotate), Right Click (Pan)
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;