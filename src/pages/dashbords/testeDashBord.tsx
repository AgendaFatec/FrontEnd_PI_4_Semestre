import { useEffect, useRef, useState } from "react";
import starXD from "../../jhonPastaApagarDps/starXD.m4a"


export const StarAnimation = () => {
  const [animate, setAnimate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        audioRef.current.pause();
      }
      window.removeEventListener("click", enableAudio);
    };

    window.addEventListener("click", enableAudio);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("animate:", animate);
      
      setAnimate(false);
      setTimeout(() => {
        setAnimate(true);

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }, 100);
    }, 25000);

    // inicia já na primeira vez
    setAnimate(true);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600">
      
      {/* 🌌 Estrelas de fundo */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-80"
            style={{
              width: "2px",
              height: "2px",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 🌍 Terra */}
      <div className="absolute bottom-0 w-full h-32 bg-green-700 rounded-t-[50%]" />

      <div
        className={`fixed w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_red] ${
          animate ? "animate-fall" : ""
        }`}
        style={{ top: 0, left: 0 }}
      />

      <audio ref={audioRef}>
        <source src={starXD} type="audio/mp4" />
        {/* <source src="/music.mp3" type="audio/mpeg" /> */}
      </audio>
    </div>
  );
};