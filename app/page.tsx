import Image from "next/image";
import AboutSection from "../components/AboutSection";

export default function HomePage() {
  return (
    <div className="w-full min-h-[100vh] flex flex-col items-stretch">
      {/* Vidéo en bloc sous la navbar */}
      <div className="w-full flex justify-center items-center bg-black">
        <video
          className="w-full object-contain"
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Section WE CREATE CHARACTER */}
      <AboutSection />
    </div>
  );
}