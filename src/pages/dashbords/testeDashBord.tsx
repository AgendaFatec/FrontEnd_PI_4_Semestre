import { useEffect, useRef, useState } from "react";
import starXD from "../../jhonPastaApagarDps/starXD.m4a";

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
    return () => window.removeEventListener("click", enableAudio);
  }, []);

  // Efeito para controlar o ciclo da animação e da música (25 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      // Remove a classe para resetar a animação
      setAnimate(false);
      
      // Dá um pequeno atraso para o DOM registrar a remoção antes de adicionar de novo
      setTimeout(() => {
        setAnimate(true);

        // Reinicia a música
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => console.log("Aguardando interação do usuário para tocar o áudio."));
        }
      }, 100);
    }, 25000); // 25 segundos

    // Inicia já na primeira renderização
    setAnimate(true);

    // Tenta tocar o áudio na primeira vez (pode falhar se o usuário não clicou na tela ainda)
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

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

      {/* ⭐ A Estrela Vermelha que cai e engole a tela */}
      <div
        className={`fixed w-4 h-4 bg-red-500 rounded-full shadow-[0_0_40px_10px_red] z-50 ${
          animate ? "animate-fall" : ""
        }`}
        style={{ top: 0, left: 0 }}
      />

      {/* 🎵 Áudio */}
      <audio ref={audioRef}>
        <source src={starXD} type="audio/mp4" />
        Seu navegador não suporta a tag de áudio.
      </audio>
    </div>
  );
};