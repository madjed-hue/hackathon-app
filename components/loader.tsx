import Image from "next/image";
import TypewriterComponent from "typewriter-effect";

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 animate-scale relative">
        <Image alt="Logo" src="/logo.png" fill />
      </div>
      <div className="text-sm text-muted-foreground flex gap-x-1">
        <p>MindMelt is thinking</p>
        <TypewriterComponent
          options={{
            strings: ["...", "...", "..."],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </div>
  );
};
