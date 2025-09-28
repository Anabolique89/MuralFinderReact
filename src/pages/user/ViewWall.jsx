import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSpinner,
  faTrash,
  faUser,
  faMapMarkerAlt,
  faCheckCircle,
  faComment,
  faHeart,
  faShare,
  faMap,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';
import WallService from "../../services/WallService";
import MapForWall from "./MapForWall";
import { Footer, BackToTopButton } from "../../components";
import NotificationToast from "../../components/ui/NotificationToast";
import styles from "../../style";

const ViewWall = () => {
  const { wallId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux hooks
  const { isAuthenticated, user } = useAuth();

  // Local state
  const [wall, setWall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false); // Not needed until backend adds endpoints
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showMap, setShowMap] = useState(true); // Toggle between map and image

  useEffect(() => {
    fetchWallFromDatabase();
    fetchComments();
  }, [wallId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWallFromDatabase = async () => {
    try {
      const response = await WallService.getWallById(wallId);
      if (response.success) {
        setWall(response.data);
      } else {
        console.error("Error fetching wall:", response.message);
      }
    } catch (error) {
      console.error("Error fetching wall:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await WallService.getCommentsForWall(wallId);
      console.log("Comments response:", response); // Debug log

      // Handle different response structures
      let commentsData = [];
      if (response.success && response.data) {
        // Backend returns {success: true, data: {...}}
        commentsData = response.data.data || response.data || [];
      } else if (response.data) {
        // Direct data response
        commentsData = response.data || [];
      } else if (Array.isArray(response)) {
        // Direct array response
        commentsData = response;
      }

      console.log("Setting comments:", commentsData); // Debug log
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() && !editCommentText.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please login to comment on walls',
        duration: 3000
      }));
      return;
    }

    try {
      setCommenting(true);
      if (editCommentId) {
        // If in edit mode, update the comment
        await WallService.updateComment(wallId, editCommentId, {
          comment: editCommentText,
        });
        setEditCommentId(null);
        setEditCommentText("");
        dispatch(addNotification({
          type: 'success',
          message: 'Comment updated successfully!',
          duration: 2000
        }));
      } else {
        console.log("Submitting comment:", comment); // Debug log
        const result = await WallService.commentOnWall(wallId, { comment });
        console.log("Comment submission result:", result); // Debug log

        setComment("");
        console.log("Dispatching success notification"); // Debug log
        dispatch(addNotification({
          type: 'success',
          message: 'Comment added successfully!',
          duration: 2000
        }));
      }
      setShowCommentBox(false);
      console.log("Refreshing comments..."); // Debug log
      await fetchComments(); // Refresh the comments after submitting
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.response?.status === 401) {
        dispatch(addNotification({
          type: 'warning',
          message: 'Please login to comment on walls',
          duration: 3000
        }));
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to submit comment. Please try again.',
          duration: 3000
        }));
      }
    } finally {
      setCommenting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentText(comment.content);
    setShowCommentBox(true);
  };

  const handleDelete = async (wallId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await WallService.deleteComment(wallId, commentId);
      dispatch(addNotification({
        type: 'success',
        message: 'Comment deleted successfully!',
        duration: 2000
      }));
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete comment. Please try again.',
        duration: 3000
      }));
    }
  };

  const handleLike = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please login to like walls',
        duration: 3000
      }));
      return;
    }

    try {
      setLiking(true);
      console.log("Attempting to like wall:", wallId); // Debug log
      const result = await WallService.likeWall(wallId);
      console.log("Like result:", result); // Debug log

      await fetchWallFromDatabase();
      dispatch(addNotification({
        type: "success",
        message: result.message || "Wall liked successfully!",
        duration: 2000,
      }));
    } catch (error) {
      console.error("Error liking wall:", error);
      console.error("Error response:", error.response?.data); // Debug log

      let errorMessage = "Failed to like wall. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Please login to like walls";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch(addNotification({
        type: "error",
        message: errorMessage,
        duration: 3000,
      }));
    } finally {
      setLiking(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-white mb-4" />
          <p className="text-white text-lg font-raleway">Loading wall details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!wall) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4 font-raleway">
            Wall Not Found
          </h2>
          <p className="text-dimWhite mb-6 font-raleway">
            The wall you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => navigate("/walls")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-raleway font-semibold"
          >
            Browse All Walls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-600">
      {/* Hero Section with Wall Info */}
      <div className={`${styles.paddingX} bg-indigo-600 py-12 pt-24`}>
        <div className={`${styles.boxWidth} mx-auto`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-start space-x-4 mb-6 lg:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white font-raleway mb-2">
                  {wall.name || wall.location_text}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-lg text-dimWhite font-raleway">
                    📍 {wall.city || "Unknown City"}
                  </span>
                  {wall.is_verified && (
                    <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                      <span className="text-sm text-green-400 font-raleway font-semibold">Verified</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleLike}
                    disabled={liking}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-raleway font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faHeart} className={liking ? "animate-pulse" : ""} />
                    <span>Like</span>
                    {wall.likes_count > 0 && (
                      <span className="bg-white/30 px-2 py-1 rounded-full text-xs">
                        {wall.likes_count}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCommentBox(!showCommentBox)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-raleway font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>Comment</span>
                    {comments.length > 0 && (
                      <span className="bg-white/30 px-2 py-1 rounded-full text-xs">
                        {comments.length}
                      </span>
                    )}
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-raleway font-semibold transition-all duration-300 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faShare} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle buttons for map/image */}
            <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
              <button
                onClick={() => setShowMap(true)}
                className={`px-6 py-3 rounded-lg font-raleway font-semibold transition-all duration-300 ${
                  showMap
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faMap} className="mr-2" />
                Map View
              </button>
              <button
                onClick={() => setShowMap(false)}
                className={`px-6 py-3 rounded-lg font-raleway font-semibold transition-all duration-300 ${
                  !showMap
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Photo View
              </button>
            </div>
          </div>

          {wall.description && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-lg text-white font-raleway leading-relaxed">
                {wall.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className={`bg-indigo-600 ${styles.paddingX} py-12`}>
        <div className={`${styles.boxWidth} mx-auto`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Map or Image (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="bg-white/20 backdrop-blur-sm p-4">
                  <h3 className="text-white font-raleway font-bold text-lg flex items-center">
                    <FontAwesomeIcon
                      icon={showMap ? faMap : faImage}
                      className="mr-3"
                    />
                    {showMap ? 'Interactive Map' : 'Wall Photo'}
                  </h3>
                </div>

                {showMap ? (
                  <div className="h-96 lg:h-[600px] relative">
                    <MapForWall
                      lat={wall.latitude}
                      long={wall.longitude}
                      title={wall.location_text}
                      image={wall.image_path}
                      isVerified={wall.is_verified}
                      mapWidth="100%"
                    />
                  </div>
                ) : (
                  <div className="h-96 lg:h-[600px] relative">
                    {wall.image_path ? (
                      <img
                        src={wall.image_path}
                        alt={wall.name || wall.location_text}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
                        <div className="text-center">
                          <FontAwesomeIcon icon={faImage} className="text-8xl mb-6 opacity-30" />
                          <p className="font-raleway text-xl">No image available</p>
                          <p className="font-raleway text-sm mt-2 opacity-70">This wall hasn&apos;t been photographed yet</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Wall Information (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Wall Information Card */}
                <div className="rounded-2xl shadow-2xl p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="bg-white/20 backdrop-blur-sm -m-6 mb-6 p-4 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white font-raleway flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                      Wall Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        Location
                      </span>
                      <p className="mt-1 text-white font-raleway">
                        {wall.location_text}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        City
                      </span>
                      <p className="mt-1 text-white font-raleway">
                        {wall.city || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        Wall Type
                      </span>
                      <p className="mt-1 capitalize text-white font-raleway">
                        {wall.wall_type || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        Surface Type
                      </span>
                      <p className="mt-1 capitalize text-white font-raleway">
                        {wall.surface_type || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        Legal Status
                      </span>
                      <p className={`mt-1 font-medium font-raleway ${
                          wall.is_legal ? "text-green-400" : "text-red-400"
                        }`}>
                        {wall.is_legal
                          ? "✅ Legal for street art"
                          : "❌ Permission required"}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-dimWhite font-raleway">
                        Coordinates
                      </span>
                      <p className="mt-1 text-sm font-mono text-white">
                        {Number(wall.latitude).toFixed(6)},{" "}
                        {Number(wall.longitude).toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Section - Full Width */}
                <div className="mt-8 rounded-xl shadow-lg p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center text-white font-raleway">
                      <FontAwesomeIcon icon={faComment} className="mr-3 text-white" />
                      Comments ({comments.length})
                    </h2>
                    <button
                      onClick={() => setShowCommentBox(!showCommentBox)}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-raleway font-semibold"
                    >
                      <FontAwesomeIcon icon={faComment} className="mr-2" />
                      {showCommentBox ? "Cancel" : "Add Comment"}
                    </button>
                  </div>

                  {/* Add Comment Form */}
                  {showCommentBox && (
                    <div className="mb-6 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                      {!isAuthenticated ? (
                        <div className="text-center py-4">
                          <p className="text-white font-raleway mb-4">Please login to comment on walls</p>
                          <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-raleway font-semibold"
                          >
                            Login
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-medium mb-3 text-white font-raleway">
                            {editCommentId ? "Edit Comment" : "Add Comment"}
                          </h3>
                      <textarea
                        value={editCommentId ? editCommentText : comment}
                        onChange={(e) =>
                          editCommentId
                            ? setEditCommentText(e.target.value)
                            : setComment(e.target.value)
                        }
                        placeholder="Share your thoughts about this wall..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none bg-white/10 border-white/20 text-white placeholder-dimWhite font-raleway"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-3 mt-3">
                        <button
                          onClick={() => {
                            setShowCommentBox(false);
                            setEditCommentId(null);
                            setEditCommentText("");
                            setComment("");
                          }}
                          className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-raleway font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCommentSubmit}
                          disabled={commenting || (!comment.trim() && !editCommentText.trim())}
                          className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-raleway font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {commenting && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
                          {editCommentId ? "Update Comment" : "Post Comment"}
                        </button>
                      </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="flex items-center justify-center py-8">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-indigo-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex space-x-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                          >
                            <div className="flex-shrink-0">
                              {comment.user &&
                              comment.user.profile?.profile_image_url ? (
                                <img
                                  src={`https://api.muralfinder.net/${comment.user?.profile?.profile_image_url}`}
                                  alt={comment.user.username}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                  <FontAwesomeIcon icon={faUser} className="text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-white font-raleway">
                                  {comment.user
                                    ? comment.user.username
                                    : "Anonymous"}
                                </h4>
                                {comment.user &&
                                  user &&
                                  comment?.user?.id === user.id && (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEdit(comment)}
                                        className="text-dimWhite hover:text-white transition-colors p-1"
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete(
                                            comment.wall_id,
                                            comment.id
                                          )
                                        }
                                        disabled={false}
                                        className="text-dimWhite hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </div>
                                  )}
                              </div>
                              <p className="mt-1 text-dimWhite font-raleway">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-dimWhite">
                          <FontAwesomeIcon icon={faComment} className="text-4xl mb-3 opacity-50" />
                          <p className="font-raleway">
                            No comments yet. Be the first to share your
                            thoughts!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
        <Footer />
      </div>
      <BackToTopButton />
      <NotificationToast />
    </div>
  );
};

export default ViewWall;
