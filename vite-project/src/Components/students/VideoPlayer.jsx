import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/videos/${videoId}`)
      .then((res) => setVideo(res.data));
  }, [videoId]);

  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );
    return match ? match[1] : "";
  };

  if (!video) return null;

  return (
    <div className="max-w-5xl mx-auto pt-28 px-4">
      <h1 className="text-2xl font-bold mb-4">
        {video.title}
      </h1>

      <iframe
        className="w-full h-[450px] rounded"
        src={`https://www.youtube.com/embed/${getYouTubeId(
          video.youtube_url
        )}`}
        allowFullScreen
      />

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/quiz/${videoId}`)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
}
