import { type FC } from "react";
import { trpc } from "../../../lib/trpc";
import Create from "./create";

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) {
    return years === 1 ? "a year ago" : `${years} years ago`;
  }
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) {
    return months === 1 ? "a month ago" : `${months} months ago`;
  }
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  if (weeks > 0) {
    return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  }
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) {
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
  }
  const seconds = Math.floor(diff / 1000);
  if (seconds > 0) {
    return seconds === 1 ? "a second ago" : `${seconds} seconds ago`;
  }
  return "just now";
}

const PresidentsPage: FC = () => {
  const { data, isLoading } = trpc.contents.useQuery();
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-gradient-to-t from-vista-200/20">
      <div className="max-w-4xl w-full min-h-[100dvh] flex flex-col py-20">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-bold text-2xl md:text-3xl">Videos</h2>
          <Create />
        </div>

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full my-8 gap-8">
            <span className="font-bold text-6xl">ლ(◕෴◕ლ)</span>
            <span>Loading videos...</span>
          </div>
        )}
        {data && data.length == 0 && (
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full my-8 gap-8">
            <span className="font-bold text-6xl">(╯⩿.⪀）╯</span>
            <span>You don't have any videos yet</span>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 w-full my-8 gap-5 [column-gap:1.25rem]">
            {data.map(({ id, createdAt, video }) => (
              <div
                key={id}
                className="w-full flex flex-col rounded-xl bg-white p-4 shadow h-[10rem]"
              >
                <div className="w-full flex items-center pb-2 gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded">
                    <span
                      className="w-2 h-2 rounded-full data-[kind=ai]:bg-vista-400 data-[kind=custom]:bg-purple-400"
                      data-kind={"ai"}
                    />
                    <span className="font-mono text-xs font-medium">ai</span>
                  </div>
                  <span className="text-xs inline-flex items-center gap-2">
                    <span>/</span>
                    {video.status === "done" ? (
                      <a
                        href={`http://localhost:4000/out/${id}.mp4`}
                        download
                        className="font-medium font-mono underline text-vista-700"
                      >
                        {id}
                      </a>
                    ) : (
                      <span className="font-medium font-mono">{id}</span>
                    )}
                  </span>
                  <span className="ml-auto text-xs text-black/50">
                    {relativeTime(new Date(createdAt))}
                  </span>
                </div>
                <p className="flex-1 w-full h-full overflow-scroll text-sm text-black/60">
                  Some topic here given by the user
                </p>
                <div className="w-full flex items-center gap-1.5 flex-shrink-0">
                  {video.status === "pending" ? (
                    <>
                      <img
                        className="w-4 h-4 rounded-full"
                        src="/icons/writing.svg"
                      />
                      <span className="text-xs font-semibold text-amber-600/75">
                        {Math.random() < 0.5
                          ? "Writing scripts..."
                          : Math.random() < 0.5
                          ? "Generating scenes..."
                          : Math.random() < 0.5
                          ? "Editing video..."
                          : "Fixing in post..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        className="w-4 h-4 rounded-full"
                        src="/icons/prize.svg"
                      />
                      <span className="text-xs font-semibold text-vista-600/75">
                        Finished
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresidentsPage;
