import { type FC } from "react";
import { relativeTime } from "../../../lib/time/relative";
import { trpc } from "../../../lib/trpc";
import Create from "./create";

const PresidentsPage: FC = () => {
  const { data: videos, isLoading: isVideosLoading } = trpc.contents.useQuery();

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-gradient-to-t from-vista-200/20">
      <div className="max-w-4xl w-full min-h-[100dvh] px-4 flex flex-col py-20">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-bold text-2xl md:text-3xl">
            Presidents Short-form
          </h2>
        </div>

        <Create />

        <div className="w-full flex items-center justify-between my-2">
          <h4 className="font-bold text-lg md:text-xl">Content history</h4>
        </div>
        {isVideosLoading && (
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full my-16 gap-8">
            <span className="font-bold text-6xl">ლ(◕෴◕ლ)</span>
            <span>Loading videos...</span>
          </div>
        )}
        {videos && videos.length == 0 && (
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full my-16 gap-8">
            <span className="font-bold text-6xl">( ╥﹏╥) ノシ</span>
            <span>You haven't made any video yet...</span>
          </div>
        )}
        {videos && videos.length > 0 && (
          <div className="relative flex flex-col w-full rounded-2xl shadow bg-white">
            <div className="relative flex flex-col w-full p-2">
              {videos
                .sort(
                  (lhs, rhs) =>
                    -(
                      new Date(lhs.createdAt).getTime() -
                      new Date(rhs.createdAt).getTime()
                    )
                )
                .map(({ id, createdAt, video, kind }) => (
                  <div
                    key={id}
                    className="relative w-full flex items-center p-3 gap-2 group rounded-lg hover:bg-vista-50"
                  >
                    <div
                      className="w-8 h-8 p-2 rounded-md data-[kind=ai]:bg-vista-400 data-[kind=custom]:bg-purple-400"
                      data-kind={kind}
                    >
                      <img
                        src={`/icons/${kind}.svg`}
                        className="w-full h-full rounded-md invert"
                      />
                    </div>
                    {kind === "ai" ? (
                      <span className="text-sm w-[16ch] md:w-[24ch] truncate text-vista-600">
                        AI generated script
                      </span>
                    ) : (
                      <span className="text-sm w-[16ch] md:w-[24ch] truncate text-purple-600">
                        Custom script
                      </span>
                    )}

                    <span
                      className="text-center text-xs px-2 py-0.5 rounded-2xl data-[status=pending]:bg-amber-200
                  data-[status=failed]:bg-red-200 data-[status=done]:bg-blue-200 data-[status=stale]:bg-indigo-200"
                      data-status={video.status}
                    >
                      {video.status}
                    </span>

                    <span className="text-xs text-black/60 ml-auto">
                      {relativeTime(new Date(createdAt))}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresidentsPage;
