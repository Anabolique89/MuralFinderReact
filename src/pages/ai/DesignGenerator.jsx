import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AIGeneratorService from "@services/AIGeneratorService";
import { useNavigate } from "react-router-dom";
import styles from "@styles";

const DesignGenerator = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [archetype, setArchetype] = useState("viking");
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadingAsArtwork, setUploadingAsArtwork] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file if provided
    if (selectedFile) {
      const validation = AIGeneratorService.validateImageFile(selectedFile);
      if (!validation.valid) {
        toast.error(validation.error);
        e.target.value = ''; // Clear the input
        return;
      }
    }
    
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
    setLoading(true);
    setProgress(0);
    setResultImage(null);

    try {
      let result;
      if (!file) {
        // Generate archetype image without reference
        if (useCustomPrompt && customPrompt.trim()) {
          result = await AIGeneratorService.generateCustomPrompt(customPrompt.trim());
        } else {
          result = await AIGeneratorService.generateArchetype(archetype);
        }
      } else {
        // Generate with reference image
        if (useCustomPrompt && customPrompt.trim()) {
          result = await AIGeneratorService.forgeCustomSaga(customPrompt.trim(), file);
        } else {
          result = await AIGeneratorService.forgeSaga(archetype, file);
        }
      }

      if (result.success && result.data.success && result.data.data.prediction_id) {
        const predictionId = result.data.data.prediction_id;
        console.log('Prediction started:', predictionId);
        
        // Start polling for progress
        await pollForProgress(predictionId);
      } else {
        console.error("Service error:", result);
        toast.error(`Error: ${result.error || "Failed to start generation"}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const pollForProgress = async (predictionId) => {
    const maxAttempts = 60; // 3 minutes with 3-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const statusResult = await AIGeneratorService.checkPredictionStatus(predictionId);
        
        if (statusResult.success && statusResult.data.success) {
          const statusData = statusResult.data.data;
          const progress = statusData.progress;
          const message = statusData.message;
          const status = statusData.status;

          console.log('Status update:', { status, progress, message });
          
          setProgress(progress);
          setProgressMessage(message);

          if (status === 'succeeded' && statusData.output) {
            console.log('Generation completed:', statusData.output);
            setResultImage(statusData.output);
            setShowModal(true);
            toast.success(`✅ Generated using Minimax Image-01`);
            return; // Stop polling
          }

          if (status === 'failed') {
            console.error('Generation failed:', statusData.error);
            toast.error(`Generation failed: ${statusData.error}`);
            return; // Stop polling
          }

          // Continue polling if still processing
          if (attempts < maxAttempts && (status === 'starting' || status === 'processing')) {
            attempts++;
            setTimeout(poll, 3000); // Poll every 3 seconds
          } else {
            toast.error('Generation timed out. Please try again.');
          }
        } else {
          console.error('Status check failed:', statusResult);
          toast.error('Failed to check generation status');
        }
      } catch (error) {
        console.error('Polling error:', error);
        toast.error('Error checking generation progress');
      }
    };

    // Start polling
    poll();
  };

  const [archetypes, setArchetypes] = useState([]);

  useEffect(() => {
    const loadArchetypes = async () => {
      const archetypesData = await AIGeneratorService.getAvailableArchetypes();
      setArchetypes(archetypesData);
    };
    loadArchetypes();
  }, []);

  const handleUploadAsArtwork = async () => {
    if (!resultImage) {
      toast.error('No generated image to upload');
      return;
    }

    setUploadingAsArtwork(true);
    try {
      let title, description, archetypeValue, promptValue;

      if (useCustomPrompt && customPrompt.trim()) {
        title = `AI Generated Custom Artwork`;
        description = `This artwork was generated using AI with a custom prompt. Created using MuralFinder's AI Generator.`;
        archetypeValue = 'custom';
        promptValue = customPrompt.trim();
      } else {
        title = `AI Generated ${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Artwork`;
        description = `This artwork was generated using AI with the ${archetype} archetype. Created using MuralFinder's AI Generator.`;
        archetypeValue = archetype;
        promptValue = null;
      }

      const result = await AIGeneratorService.uploadAsArtwork(resultImage, archetypeValue, title, description, promptValue);
      
      if (result.success) {
        toast.success('AI artwork uploaded successfully!');
        navigate(`/artworks/${result.data.artwork.id}`);
      } else {
        toast.error(result.error || 'Failed to upload artwork');
      }
    } catch (error) {
      console.error('Error uploading as artwork:', error);
      toast.error('Failed to upload artwork');
    } finally {
      setUploadingAsArtwork(false);
    }
  };

  return (
    <div className="bg-indigo-600 min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className={`${styles.paddingX} pt-20`}>
        <div className={`${styles.boxWidth} relative z-10 mx-auto`}>
          {/* Full Width Title and Description */}
          <div className="text-center mb-8 animate-slide-in-up">
            <h1 className={`${styles.heading2} mb-4`}>
              <span className="text-gradient font-blowBrush hover:animate-pulse transition-all duration-300 cursor-default">
                ⚔️ Forge Your Saga
              </span>
            </h1>
            <p className={`${styles.paragraph} max-w-2xl mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300`}>
              Transform into a legendary warrior! Upload your photo for personalized results, or generate without a reference image.
            </p>
            <p className="text-gradient text-sm mt-2 font-semibold">
              Powered by Minimax Image-01 with character reference support
            </p>
          </div>

          {/* Form and Image Placeholder Container */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Side - Form */}
            <div className="flex-1">

          <div className="bg-black-gradient/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 animate-slide-in-up animation-delay-200 hover-lift">
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-gradient">
              📸 Upload Your Photo (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-white border-2 border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5 p-4 hover:border-white/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-gradient file:text-white hover:file:opacity-80"
              />
            </div>
            {file && (
              <div className="mt-4 flex items-center gap-4">
                <p className="text-gradient text-sm font-medium">✓ {file.name} selected</p>
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover border-2 border-white/30"
                  />
                )}
              </div>
            )}
            <p className="text-white/60 text-xs mt-2">
              {file ? "Your face will be used as reference for the character" : "No photo? No problem! Generate epic archetypes without reference"}
            </p>
          </div>

          {/* Prompt Selection Toggle */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-gradient">
              👑 Choose Your Legend
            </label>
            
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setUseCustomPrompt(false)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  !useCustomPrompt 
                    ? 'bg-blue-gradient text-white shadow-lg' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                🎭 Preset Archetypes
              </button>
              <button
                type="button"
                onClick={() => setUseCustomPrompt(true)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  useCustomPrompt 
                    ? 'bg-blue-gradient text-white shadow-lg' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                ✨ Custom Prompt
              </button>
            </div>

            {/* Archetype Selector */}
            {!useCustomPrompt && (
              <div className="mb-4">
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg hover:border-white/50 transition-colors"
                >
                  {archetypes.map((arch) => (
                    <option key={arch.value} value={arch.value} className="bg-gray-800 text-white">
                      {arch.label}
                    </option>
                  ))}
                </select>
                <p className="text-white/60 text-sm mt-2">
                  {archetypes.find(arch => arch.value === archetype)?.description}
                </p>
              </div>
            )}

            {/* Custom Prompt Input */}
            {useCustomPrompt && (
              <div className="mb-4">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your character in detail... e.g., 'A cyberpunk samurai with neon armor, glowing katana, standing in a futuristic Tokyo street at night, highly detailed, cinematic lighting'"
                  className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg hover:border-white/50 transition-colors resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-white/60 text-sm">
                    Be descriptive! Include style, setting, lighting, and details for best results.
                  </p>
                  <span className="text-white/40 text-xs">
                    {customPrompt.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Forge Button */}
          <button
            onClick={handleForge}
            disabled={loading || (useCustomPrompt && !customPrompt.trim())}
            className="w-full px-8 py-4 bg-blue-gradient text-white rounded-xl font-bold text-lg hover:opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover-lift"
          >
            {loading ? "🔥 Forging Your Legend..." : "⚔️ Forge My Saga"}
          </button>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-white mb-3">
                <span className="font-medium">{progressMessage || "🔨 Smithing in the fires of creation..."}</span>
                <span className="text-gradient font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-gradient h-4 rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          )}


            {/* Model Info */}
            <div className="mt-8 text-center text-xs text-white/40 border-t border-white/10 pt-4">
              <p>Powered by Minimax Image-01 • Character Reference Support • High-Quality Generation</p>
            </div>
          </div>
        </div>

        {/* Right Side - Generated Image & Info */}
        <div className="flex-1">
          {/* Generated Image */}
          {resultImage ? (
            <div className="mb-6 animate-slide-in-up">
              <h2 className={`${styles.heading2} mb-4 text-center`}>
                <span className="text-gradient font-blowBrush hover:animate-pulse transition-all duration-300 cursor-default">
                  🎉 Your Forged Legend!
                </span>
              </h2>

              <div className="relative group hover-lift bg-white/5 p-4 rounded-2xl border border-white/20">
                <img
                  src={resultImage}
                  alt="Forged Saga"
                  className="rounded-xl shadow-2xl w-full border-4 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:shadow-blue-500/25 cursor-pointer"
                  onClick={() => setShowModal(true)}
                  onError={(e) => {
                    console.error('Image failed to load:', resultImage);
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEZhaWxlZCB0byBMb2FkPC90ZXh0Pjwvc3ZnPg==';
                  }}
                  onLoad={() => console.log('Image loaded successfully')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Image Info */}
                <div className="mt-3 text-center">
                  <p className="text-gradient font-semibold text-sm mb-1">
                    ✨ {useCustomPrompt && customPrompt.trim() 
                      ? 'Custom Character Generated!' 
                      : `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Character Generated!`
                    }
                  </p>
                  <p className="text-white/60 text-xs">
                    Click to view full size
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => window.open(resultImage, "_blank")}
                  className="px-3 py-2 bg-blue-gradient text-white rounded-lg font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 hover-lift text-xs"
                >
                  🔍 View
                </button>
                <button
                  onClick={async () => {
                    const filename = `forged-saga-${archetype}-${Date.now()}.jpg`;
                    const success = await AIGeneratorService.downloadImage(resultImage, filename);
                    if (success) {
                      toast.success('Image downloaded successfully!');
                    } else {
                      toast.error('Failed to download image');
                    }
                  }}
                  className="px-3 py-2 bg-black-gradient text-white rounded-lg font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 hover-lift text-xs"
                >
                  💾 Download
                </button>
                <button
                  onClick={handleUploadAsArtwork}
                  disabled={uploadingAsArtwork}
                  className="px-3 py-2 bg-blue-gradient2 text-white rounded-lg font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover-lift text-xs"
                >
                  {uploadingAsArtwork ? '📤...' : '🎨 Upload'}
                </button>
              </div>

              <div className="mt-3 text-center">
                <button
                  onClick={() => {
                    setResultImage(null);
                    setShowModal(false);
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-3 py-1 text-white/60 hover:text-gradient transition-colors text-xs font-medium hover-lift"
                >
                  🔄 Forge Another
                </button>
              </div>
            </div>
          ) : (
            /* Placeholder when no image is generated */
            <div className="bg-black-gradient/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 animate-slide-in-up hover-lift h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className={`${styles.heading2} mb-4`}>
                  <span className="text-gradient">Generated Image Will Show Here</span>
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  Fill out the form on the left and click &quot;Forge My Saga&quot; to generate your AI artwork
                </p>
                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                  <div className="w-2 h-2 bg-blue-gradient rounded-full animate-pulse"></div>
                  <span>Ready to create your legend</span>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>

      {/* How It Works - Full Width Below */}
      <div className={`${styles.paddingX} mt-12 pb-20`}>
        <div className={`${styles.boxWidth} mx-auto`}>
        <div className="bg-black-gradient/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 animate-slide-in-up animation-delay-600 hover-lift">
          <h3 className={`${styles.heading2} mb-6 text-center`}>
            <span className="text-gradient">🎨 How It Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-gradient rounded-full p-3 text-white font-bold text-lg min-w-[48px] h-12 flex items-center justify-center">1</div>
              <div>
                <h4 className="text-white font-semibold mb-2 text-lg">Choose Your Archetype</h4>
                <p className="text-white/70">Select from Viking Warrior, Medieval King/Queen, or Norse God/Goddess to define your character&apos;s theme and style</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-gradient rounded-full p-3 text-white font-bold text-lg min-w-[48px] h-12 flex items-center justify-center">2</div>
              <div>
                <h4 className="text-white font-semibold mb-2 text-lg">Upload Photo (Optional)</h4>
                <p className="text-white/70">Add your photo for personalized character reference. The AI will use your facial features to create a unique character</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-gradient rounded-full p-3 text-white font-bold text-lg min-w-[48px] h-12 flex items-center justify-center">3</div>
              <div>
                <h4 className="text-white font-semibold mb-2 text-lg">Generate & Download</h4>
                <p className="text-white/70">AI creates your legendary character. Download in full resolution or upload directly as artwork to your gallery</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-gradient font-semibold mb-3 text-lg">✨ Features</h4>
              <ul className="text-white/70 space-y-2">
                <li>• High-quality AI image generation</li>
                <li>• Character reference support</li>
                <li>• Multiple archetype themes</li>
                <li>• Direct artwork upload</li>
                <li>• Download in full resolution</li>
              </ul>
            </div>

            <div className="p-6 bg-blue-gradient/20 rounded-xl border border-blue-400/30">
              <h4 className="text-gradient font-semibold mb-3 text-lg">🔥 Pro Tip</h4>
              <p className="text-white/80">
                Upload a clear photo of yourself for the best personalized results! The AI will use your facial features as reference for the character, creating a unique blend of your appearance with the chosen archetype.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Modal for displaying result */}
      {showModal && resultImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black-gradient rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${styles.heading2} text-gradient`}>🎉 Your Legend is Forged!</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white text-2xl font-bold transition-colors hover-lift"
              >
                ×
              </button>
            </div>

            <div className="text-center">
              <img
                src={resultImage}
                alt="Forged Saga"
                className="rounded-xl shadow-2xl max-w-full max-h-[60vh] object-contain mx-auto border-2 border-white/30"
                onError={(e) => {
                  console.error('Image failed to load:', resultImage);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEZhaWxlZCB0byBMb2FkPC90ZXh0Pjwvc3ZnPg==';
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <button
                  onClick={() => window.open(resultImage, "_blank")}
                  className="px-6 py-3 bg-blue-gradient text-white rounded-xl font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 hover-lift"
                >
                  🔍 View Full Size
                </button>
                <button
                  onClick={async () => {
                    const filename = `forged-saga-${archetype}-${Date.now()}.jpg`;
                    const success = await AIGeneratorService.downloadImage(resultImage, filename);
                    if (success) {
                      toast.success('Image downloaded successfully!');
                    } else {
                      toast.error('Failed to download image');
                    }
                  }}
                  className="px-6 py-3 bg-black-gradient text-white rounded-xl font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 hover-lift"
                >
                  💾 Download
                </button>
                <button
                  onClick={handleUploadAsArtwork}
                  disabled={uploadingAsArtwork}
                  className="px-6 py-3 bg-blue-gradient2 text-white rounded-xl font-semibold hover:opacity-80 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                  {uploadingAsArtwork ? '📤 Uploading...' : '🎨 Upload as Artwork'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DesignGenerator;
