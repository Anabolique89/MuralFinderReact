import React, { useState } from "react";

const DesignGenerator = () => {
  const [file, setFile] = useState(null);
  const [archetype, setArchetype] = useState("viking");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview URL for the uploaded image
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleForge = async () => {
    if (!file) {
      // If no file, generate archetype image without reference
      setLoading(true);
      setProgress(0);
      setResultImage(null);

      try {
        const interval = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? prev : prev + 10));
        }, 800);

        const response = await fetch("http://localhost:4000/api/generate-archetype", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ archetype }),
        });

        const data = await response.json();
        clearInterval(interval);
        setProgress(100);

        if (response.ok && data.success && data.output) {
          console.log('Received image URL:', data.output);
          setResultImage(data.output);
          setShowModal(true);
          console.log(`✅ Generated using ${data.service}`);
        } else {
          console.error("Server error:", data);
          alert(`Error: ${data.error || "Failed to generate image"}`);
        }
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error. Check if server is running on port 4000.");
      } finally {
        setLoading(false);
        setProgress(0);
      }
      return;
    }

    // If file is uploaded, use it as reference
    setLoading(true);
    setProgress(0);
    setResultImage(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("archetype", archetype);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 800);

      const response = await fetch("http://localhost:4000/api/forge-saga", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (response.ok && data.success && data.output) {
        console.log('Received image URL:', data.output);
        setResultImage(data.output);
        setShowModal(true);
        console.log(`✅ Generated using ${data.service}`);
      } else {
        console.error("Server error:", data);
        alert(`Error: ${data.error || "Failed to generate image"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Check if server is running on port 4000.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const archetypeDescriptions = {
    viking: "Transform into a fierce Nordic warrior with authentic armor and weapons",
    royal: "Become a majestic medieval ruler with crown and royal regalia", 
    norse: "Ascend as a powerful deity from Norse mythology with divine powers",
    
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          ⚔️ Forge Your Saga
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Transform into a legendary warrior! Upload your photo for personalized results, or generate without a reference image.
        </p>
        <p className="text-amber-400 text-sm mt-2">
          Powered by Minimax Image-01 with character reference support
        </p>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700">
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-amber-300">
            📸 Upload Your Photo (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-700/50 p-4 hover:border-amber-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            />
          </div>
          {file && (
            <div className="mt-4 flex items-center gap-4">
              <p className="text-green-400 text-sm font-medium">✓ {file.name} selected</p>
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-lg object-cover border-2 border-amber-500"
                />
              )}
            </div>
          )}
          <p className="text-gray-400 text-xs mt-2">
            {file ? "Your face will be used as reference for the character" : "No photo? No problem! Generate epic archetypes without reference"}
          </p>
        </div>

        {/* Archetype Selector */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-amber-300">
            👑 Choose Your Legend
          </label>
          <select
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-700 border-2 border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
          >
            <option value="viking">⚔️ Viking Warrior</option>
            <option value="royal">👑 Medieval King/Queen</option>
            <option value="norse">⚡ Norse God/Goddess</option>
          </select>
          <p className="text-gray-400 text-sm mt-2">
            {archetypeDescriptions[archetype]}
          </p>
        </div>

        {/* Forge Button */}
        <button
          onClick={handleForge}
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
        >
          {loading ? "🔥 Forging Your Legend..." : "⚔️ Forge My Saga"}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-3">
              <span className="font-medium">🔨 Smithing in the fires of creation...</span>
              <span className="text-amber-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Result Image */}
        {resultImage && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              🎉 Your Forged Legend Awaits!
            </h2>
            
            <div className="relative group">
              <img
                src={resultImage}
                alt="Forged Saga"
                className="rounded-2xl shadow-2xl w-full border-4 border-amber-500/50 hover:border-amber-400 transition-all duration-300 group-hover:shadow-amber-500/25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.open(resultImage, "_blank")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                🔍 View Full Size
              </button>
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = resultImage;
                  a.download = `forged-saga-${archetype}-${Date.now()}.jpg`;
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                💾 Download
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setResultImage(null);
                  setShowModal(false);
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                🔄 Forge Another Legend
              </button>
            </div>
          </div>
        )}

        {/* Model Info */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
          <p>Powered by Minimax Image-01 • Character Reference Support • High-Quality Generation</p>
        </div>
      </div>

      {/* Modal for displaying result */}
      {showModal && resultImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-amber-400">🎉 Your Legend is Forged!</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="text-center">
              <img
                src={resultImage}
                alt="Forged Saga"
                className="rounded-xl shadow-2xl max-w-full max-h-[60vh] object-contain mx-auto border-2 border-amber-500/50"
                onError={(e) => {
                  console.error('Image failed to load:', resultImage);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEZhaWxlZCB0byBMb2FkPC90ZXh0Pjwvc3ZnPg==';
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.open(resultImage, "_blank")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  🔍 View Full Size
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(resultImage);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `forged-saga-${archetype}-${Date.now()}.jpg`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Download failed:', error);
                      // Fallback to direct link
                      const a = document.createElement("a");
                      a.href = resultImage;
                      a.download = `forged-saga-${archetype}-${Date.now()}.jpg`;
                      a.click();
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  💾 Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignGenerator;