import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AIGeneratorService from "@services/AIGeneratorService";
import { useNavigate } from "react-router-dom";
import styles from "@styles";

const DesignGenerator = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [artStyle, setArtStyle] = useState("street-art");
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadingAsArtwork, setUploadingAsArtwork] = useState(false);

  // Art styles for murals and visual art - mapped to match backend archetypes or custom prompts
  const artStyles = [
    {
      value: 'street-art',
      label: '🎨 Street Art',
      description: 'Bold urban street art with vibrant colors and graffiti elements',
      icon: '🏙️',
      prompt: 'street art mural, vibrant graffiti style, bold colors, urban art, spray paint effect, wall art'
    },
    {
      value: 'abstract',
      label: '🌀 Abstract',
      description: 'Contemporary abstract art with geometric shapes and flowing forms',
      icon: '🎭',
      prompt: 'abstract mural art, geometric shapes, flowing forms, contemporary style, colorful, modern art'
    },
    {
      value: 'realistic',
      label: '📷 Photorealistic',
      description: 'Highly detailed photorealistic mural art',
      icon: '🖼️',
      prompt: 'photorealistic mural, highly detailed, realistic painting, wall art, fine details, professional quality'
    },
    {
      value: 'pop-art',
      label: '💥 Pop Art',
      description: 'Vibrant pop art style with bold colors and comic book aesthetics',
      icon: '🎪',
      prompt: 'pop art mural, bold colors, comic book style, vibrant, retro pop art aesthetic, graphic design'
    },
    {
      value: 'surreal',
      label: '🌙 Surrealism',
      description: 'Dreamlike surrealist art with imaginative elements',
      icon: '✨',
      prompt: 'surrealist mural art, dreamlike, imaginative, fantasy elements, surreal composition, artistic'
    },
    {
      value: 'geometric',
      label: '🔷 Geometric',
      description: 'Clean geometric patterns and shapes in modern style',
      icon: '📐',
      prompt: 'geometric mural, clean patterns, modern design, architectural, symmetrical, minimalist style'
    },
    {
      value: 'nature',
      label: '🌿 Nature/Botanical',
      description: 'Beautiful natural elements, flora and fauna',
      icon: '🌺',
      prompt: 'nature mural, botanical art, flora and fauna, natural elements, organic, garden wall art'
    },
    {
      value: 'portrait',
      label: '👤 Portrait',
      description: 'Artistic portrait style for faces and figures',
      icon: '🎨',
      prompt: 'portrait mural art, artistic face, figure painting, expressive, wall portrait, contemporary style'
    }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const validation = AIGeneratorService.validateImageFile(selectedFile);
      if (!validation.valid) {
        toast.error(validation.error);
        e.target.value = '';
        return;
      }
    }
    
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);
    setResultImage(null);

    try {
      let result;
      const selectedStyleObj = artStyles.find(s => s.value === artStyle);
      
      // Determine the prompt to use
      let promptToUse;
      if (useCustomPrompt && customPrompt.trim()) {
        promptToUse = customPrompt.trim();
      } else {
        // Use the style's predefined prompt
        promptToUse = selectedStyleObj?.prompt || artStyle;
      }
      
      if (!file) {
        // Generate without reference image - always use custom prompt endpoint
        result = await AIGeneratorService.generateCustomPrompt(promptToUse);
      } else {
        // Generate with reference image - always use custom saga endpoint
        result = await AIGeneratorService.forgeCustomSaga(promptToUse, file);
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

  const handleDownload = async () => {
    if (!resultImage) return;
    const filename = `mural-art-${artStyle}-${Date.now()}.jpg`;
    const success = await AIGeneratorService.downloadImage(resultImage, filename);
    if (success) {
      toast.success('Image downloaded successfully!');
    } else {
      toast.error('Failed to download image');
    }
  };

  const handleUploadAsArtwork = async () => {
    if (!resultImage) {
      toast.error('No generated image to upload');
      return;
    }

    setUploadingAsArtwork(true);
    try {
      let title, description, archetypeValue, promptValue;

      if (useCustomPrompt && customPrompt.trim()) {
        title = `AI Generated Custom Mural`;
        description = `This mural was generated using AI with a custom prompt. Created using MuralFinder's AI Generator.`;
        archetypeValue = 'custom';
        promptValue = customPrompt.trim();
      } else {
        const selectedStyleObj = artStyles.find(s => s.value === artStyle);
        title = `AI Generated ${selectedStyleObj?.label || artStyle} Mural`;
        description = `This mural was generated using AI with the ${selectedStyleObj?.label || artStyle} style. Created using MuralFinder's AI Generator.`;
        archetypeValue = artStyle;
        promptValue = selectedStyleObj?.prompt || null;
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

  const selectedStyle = artStyles.find(style => style.value === artStyle);

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🎨</span>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Mural Art Generator
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Transform your ideas into stunning mural artwork. Choose a style, upload a sketch, or describe your vision.
          </p>
          <p className="text-sm text-purple-300 mt-2 font-semibold">
            Powered by AI • Multiple Art Styles • Professional Quality
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Art Styles */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Art Styles
              </h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {artStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setArtStyle(style.value)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      artStyle === style.value
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{style.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{style.label}</div>
                        <div className="text-xs text-white/70">{style.description}</div>
                      </div>
                      {artStyle === style.value && (
                        <span className="text-xl">✨</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Create Your Mural
              </h2>

              {/* Upload Section */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3 text-white">
                  📸 Upload Reference/Sketch (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-white border-2 border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5 p-4 hover:border-white/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-pink-500 file:to-purple-500 file:text-white hover:file:opacity-80"
                  />
                </div>
                {file && previewUrl && (
                  <div className="mt-4 relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 rounded-xl object-cover border-2 border-white/30"
                    />
                    <div className="mt-2 text-sm text-green-300 font-medium">✓ {file.name}</div>
                  </div>
                )}
                <p className="text-white/60 text-xs mt-2">
                  Upload a sketch, photo, or reference image to guide the AI
                </p>
              </div>

              {/* Prompt Toggle */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3 text-white">
                  ✨ Describe Your Vision
                </label>
                
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUseCustomPrompt(false)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      !useCustomPrompt 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    Use Style Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCustomPrompt(true)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      useCustomPrompt 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    Custom Prompt
                  </button>
                </div>

                {!useCustomPrompt && selectedStyle && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl mb-2">{selectedStyle.icon}</div>
                    <div className="text-white font-semibold mb-1">{selectedStyle.label}</div>
                    <div className="text-white/70 text-sm">{selectedStyle.description}</div>
                  </div>
                )}

                {useCustomPrompt && (
                  <div>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe your mural in detail... e.g., 'A vibrant street art mural featuring a phoenix rising from flames, with bold colors, graffiti style, urban background, highly detailed'"
                      className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none"
                      rows={5}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-white/60 text-xs">
                        Be detailed! Include colors, style, mood, and composition
                      </p>
                      <span className="text-white/40 text-xs">
                        {customPrompt.length}/500
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || (useCustomPrompt && !customPrompt.trim())}
                className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Art...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    Generate Mural Art
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {loading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-white mb-3">
                    <span className="font-medium">{progressMessage}</span>
                    <span className="font-bold text-pink-300">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-400/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Upload a sketch for more controlled results</li>
                <li>• Be specific with colors and composition</li>
                <li>• Combine styles in custom prompts for unique art</li>
                <li>• Reference real locations for authentic murals</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Result */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl sticky top-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                Your Artwork
              </h2>

              {resultImage ? (
                <div className="space-y-4">
                  <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
                    <img
                      src={resultImage}
                      alt="Generated Art"
                      className="w-full rounded-xl shadow-2xl border-2 border-white/30 hover:border-pink-400/50 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-4">
                      <p className="text-white font-semibold">Click to view full size</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => window.open(resultImage, "_blank")}
                      className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 text-sm"
                    >
                      <span>🔍</span>
                      View
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 text-sm"
                    >
                      <span>💾</span>
                      Save
                    </button>
                    <button
                      onClick={handleUploadAsArtwork}
                      disabled={uploadingAsArtwork}
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
                    >
                      <span>📤</span>
                      {uploadingAsArtwork ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setResultImage(null);
                      setShowModal(false);
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                    className="w-full px-4 py-2 text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    Create Another
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Your Art Will Appear Here
                  </h3>
                  <p className="text-white/60 text-sm max-w-xs">
                    Select a style, add your details, and click generate to create your mural artwork
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-white/40 text-xs">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <span>Ready to create</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && resultImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                🎨 Your Masterpiece
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white text-3xl font-bold transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="text-center">
              <img
                src={resultImage}
                alt="Generated Art"
                className="rounded-xl shadow-2xl max-w-full max-h-[70vh] object-contain mx-auto border-2 border-white/30"
              />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <button
                  onClick={() => window.open(resultImage, "_blank")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>🔍</span>
                  View Full Size
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  Download
                </button>
                <button
                  onClick={handleUploadAsArtwork}
                  disabled={uploadingAsArtwork}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  {uploadingAsArtwork ? 'Uploading...' : 'Upload to Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.7);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DesignGenerator;