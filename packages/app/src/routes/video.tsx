import { useEffect, useRef, type FC } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import toast from "react-hot-toast";
import { baseUrl, trpc, trpcStream } from "../lib/trpc";

type VideoProps = {
  id: string;
  reset: () => void;
};

const Video: FC<VideoProps> = ({ id, reset }) => {
  const { data: initialData, isError } = trpc.status.useQuery(id, {
    staleTime: 1000,
    keepPreviousData: true,
  });
  const { data } = trpcStream.status.useStream(id, {
    initialValue: initialData ?? {
      id,
      createdAt: new Date().toISOString(),
      video: { status: "writing" },
      userId: "",
    },
    enabled: !!initialData && !isError,
  });
  const state = data?.video?.status ?? "writing";
  const uri = data?.video?.status === "done" ? data.video.uri : undefined;
  const ref = useRef<HTMLVideoElement | null>(null);
  const hasNotified = useRef(false);

  useEffect(() => {
    if (initialData === null || isError) {
      toast.error("Video not found");
      reset();
    }
  }, [initialData, isError]);

  useEffect(() => {
    if (hasNotified.current) return;
    toast("Production started, it may take a few minutes..", {
      icon: "🎬",
      className: "text-sm !max-w-[unset]",
    });
    hasNotified.current = true;
  }, []);

  if (state === "error") {
    return (
      <div className="relative flex flex-col items-center justify-center mb-20">
        <img
          key={`graphics-${state}`}
          className="w-24 aspect-square rounded-lg object-cover opacity-75 animate-slide-from-bottom"
          src={`/graphics/complex.svg`}
        />

        <span className="font-bold font-cal text-black/75 mt-3 mb-2">
          {"Something went wrong"}
        </span>
        <div className="flex items-center justify-center gap-2 w-full min-h-[1.25rem]">
          <span className="text-xs  text-black ">
            {data?.video?.status === "error"
              ? data.video.reason
              : "Unknown error"}
          </span>
        </div>
      </div>
    );
  }

  if (state !== "done") {
    return (
      <div className="relative flex flex-col items-center justify-center mb-20">
        <img
          key={`graphics-${state}`}
          className="w-24 aspect-square rounded-lg object-cover opacity-75 animate-slide-from-bottom"
          src={`/graphics/${state}.svg`}
        />

        <span className="font-bold font-cal text-black/75 mt-3 mb-2">
          {state === "writing"
            ? "Generating script"
            : state === "acting"
            ? "Recording lines"
            : "Editing video"}
        </span>

        <div className="flex items-center justify-center gap-2 w-full min-h-[1.25rem]">
          <span
            className="w-3 h-3 bg-purple-500 rounded-full data-[state=todo]:bg-slate-300 transition-all duration-500
          data-[state=current]:w-5 data-[state=current]:h-5 data-[state=current]:border-[0.25rem] data-[state=current]:border-purple-200"
            data-state={state === "writing" ? "current" : "done"}
          />
          <span
            className="w-3 h-3 bg-blue-500 rounded-full data-[state=todo]:bg-slate-300 transition-all duration-500
          data-[state=current]:w-5 data-[state=current]:h-5 data-[state=current]:border-[0.25rem] data-[state=current]:border-blue-200"
            data-state={
              state === "writing"
                ? "todo"
                : state === "acting"
                ? "current"
                : "done"
            }
          />
          <span
            className="w-3 h-3 bg-vista-500 rounded-full data-[state=todo]:bg-slate-300 transition-all duration-500
            data-[state=current]:w-5 data-[state=current]:h-5 data-[state=current]:border-[0.25rem] data-[state=current]:border-vista-200"
            data-state={state === "editing" ? "current" : "todo"}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfettiExplosion />
      <div className="relative flex flex-col items-center justify-center mb-24 animate-slide-from-bottom">
        <div className="relative flex flex-col items-center justify-center flex-shrink-0 p-3 rounded-3xl bg-white shadow-lg">
          <video
            ref={ref}
            className="flex-shrink-0 aspect-[9/16] w-[280px] md:w-[300px] rounded-xl"
          >
            <source src={`${baseUrl}${uri}`} type="video/mp4" />
          </video>

          <div className="w-full flex items-center justify-center gap-2 mt-2 px-4">
            <button
              className="bg-red-500 rounded-full w-8 h-8 inline-flex items-center justify-center text-center"
              onClick={reset}
            >
              <img className="w-5 h-5" src="/icons/trash.svg" />
            </button>
            <button
              className="bg-slate-200 rounded-full px-6 text-xs flex-1 font-bold h-8 inline-flex items-center justify-center text-center"
              onClick={() => {
                if (!ref.current) return;
                if (!ref.current.paused) {
                  ref.current.pause();
                } else {
                  ref.current.play();
                }
              }}
            >
              <img className="h-6" src="/icons/play.svg" />
              <span className="mx-1 text-black/50">/</span>
              <img className="h-6" src="/icons/pause.svg" />
            </button>
            <button
              className="bg-blue-500 rounded-full w-8 h-8 inline-flex items-center justify-center text-center"
              onClick={async () => {
                if (!data || data.video.status !== "done") return;
                const vid = await fetch(`${baseUrl}${data.video.uri}`);
                const blob = await vid.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "video.mp4";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                a.remove();
              }}
            >
              <img className="w-5 h-5" src="/icons/download.svg" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
