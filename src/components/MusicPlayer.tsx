import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const START_TIME = 60; // 1:00
const END_TIME = 180; // 3:00

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: "2PRW1Ymjnaw",
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: START_TIME,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startEndWatcher();
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              stopEndWatcher();
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              stopEndWatcher();
              setIsPlaying(false);
            }
          },
        },
      });
    };

    return () => stopEndWatcher();
  }, []);

  const startEndWatcher = () => {
    stopEndWatcher();

    intervalRef.current = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const currentTime = player.getCurrentTime();
      if (currentTime >= END_TIME) {
        player.pauseVideo();
        setIsPlaying(false);
        stopEndWatcher();
      }
    }, 500);
  };

  const stopEndWatcher = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.seekTo(START_TIME, true); // selalu mulai dari reff
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      {/* Hidden YouTube Player */}
      <div id="yt-player" style={{ display: "none" }} />

      <button
        onClick={togglePlay}
        className="music-play-btn"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          I Surrender (Reff)
        </span>
        <span className="text-xs text-muted-foreground">Saybia</span>
      </div>

      {/* Sound Wave Animation */}
      <div className={`sound-wave ${isPlaying ? "playing" : ""}`}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </div>
  );
};

export default MusicPlayer;
