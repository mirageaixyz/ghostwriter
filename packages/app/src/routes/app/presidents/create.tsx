import { AppInputs, AppOutputs } from "@ghostwriter/server";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { relativeTime } from "../../../lib/time/relative";
import { trpc } from "../../../lib/trpc";

type CurrentVideoProps = {
  processing: NonNullable<AppOutputs["content"]>;
  refresh: () => void;
  onClose: () => void;
};

const CurrentVideo: FC<CurrentVideoProps> = ({
  processing,
  refresh,
  onClose,
}) => {
  return (
    <div className="relative flex w-full my-4 p-4 md:p-6 gap-2 aspect-video h-[calc(100vw/16*9)] max-h-[31.5rem] bg-white rounded-2xl shadow">
      {/* Video */}
      {processing.video.status === "done" ? (
        <video
          controls
          className="flex-shrink-0 aspect-[9/16] h-full rounded-xl"
        >
          <source
            src={`http://localhost:4000${processing.video.uri}`}
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="flex-shrink-0 aspect-[9/16] h-full bg-gray-100 animate-pulse rounded-xl" />
      )}

      <div className="flex-1 flex flex-col p-2 gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 p-2 rounded-md data-[kind=ai]:bg-vista-400 data-[kind=custom]:bg-purple-400"
            data-kind={processing.kind}
          >
            <img
              src={`/icons/${processing.kind}.svg`}
              className="w-full h-full rounded-md invert"
            />
          </div>

          <span className="font-medium">video</span>
          <span className="hidden md:inline font-medium">⟩</span>
          <span className="hidden md:inline text-sm font-light">
            {processing.id}
          </span>
          <span className="font-medium">⟩</span>
          <span
            className="text-center text-xs px-2 py-0.5 rounded-2xl data-[status=pending]:bg-amber-200
          data-[status=failed]:bg-red-200 data-[status=done]:bg-blue-200 data-[status=stale]:bg-indigo-200"
            data-status={processing.video.status}
          >
            {processing.video.status}
          </span>

          <Menu as="div" className="ml-auto relative inline-block text-left">
            <div>
              <Menu.Button className="text-xs p-1 w-6 h-6 rounded-md hover:bg-black/5 transition-all">
                <img src="/icons/menu.svg" className="w-4 h-4" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item disabled>
                    {({ active }) => (
                      <button
                        className="group flex w-full text-xs items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-active={active}
                        disabled
                      >
                        Recreate
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item disabled={processing.video.status !== "done"}>
                    {({ active }) => (
                      <button
                        className="group flex w-full text-xs items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-vista-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-active={active}
                        disabled={processing.video.status !== "done"}
                        onClick={async () => {
                          if (processing.video.status !== "done") return;
                          const data = await fetch(
                            `http://localhost:4000${processing.video.uri}`
                          );
                          const blob = await data.blob();
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
                        Download
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="group flex w-full text-xs items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-blue-100"
                        data-active={active}
                        onClick={refresh}
                      >
                        Reload
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="group flex w-full text-xs items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-red-200"
                        data-active={active}
                        onClick={onClose}
                      >
                        Close
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Small info field */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs md:text-sm">Created by</span>
          <img
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=Kiki"
            className="w-4 h-4 rounded-full"
          />
          <span className="text-xs font-medium">Anonymous</span>
          <span className="hidden md:inline text-xs md:text-sm text-black/60">
            ·
          </span>
          <span className="hidden md:inline text-xs md:text-sm text-black/60">
            {relativeTime(new Date(processing.createdAt))}
          </span>
        </div>

        <span className="w-full h-px bg-black/10" />

        {/* Topic or content used */}
        {processing.video.status === "done" ||
        processing.video.status === "stale" ? (
          <div className="flex flex-col gap-2 text-sm max-h-full overflow-scroll">
            {processing.video.script.map(({ name, content }, i) => (
              <div
                key={`${name}-line-${i}`}
                className="flex items-center gap-1 text-xs"
              >
                <img
                  className="w-4 h-4 rounded-full"
                  src={`/presidents/${name}.png`}
                />
                <span className="ml-1 text-black/60">{content}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-sm h-full">
            <img
              className="w-20 h-20"
              src={`/graphics/${processing.video.status}.gif`}
            />
            <span className="font-semibold">
              {processing.video.status === "pending"
                ? "Cooking the video..."
                : processing.video.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Create: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = useMemo(() => searchParams.get("id"), [searchParams]);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<AppInputs["newContent"]>({
    kind: "ai",
    topic: "",
  });
  const utils = trpc.useUtils();

  const { data: processing, refetch } = trpc.content.useQuery(id ?? "", {
    enabled: !!id,
    staleTime: 1000,
    keepPreviousData: true,
  });

  const { mutate, isLoading } = trpc.newContent.useMutation({
    onSuccess: async ({ id }) => {
      await utils.contents.invalidate();
      setIsOpen(false);
      setOption({
        kind: "ai",
        topic: "",
      });
      setSearchParams({
        ...searchParams,
        id,
      });
    },
  });

  const hasVideo = useMemo(() => !!id, [id]);

  useEffect(() => {
    if (!hasVideo) return;
    const interval = setInterval(() => {
      refetch();
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  return (
    <>
      {!hasVideo ? (
        <div className="flex flex-col items-center justify-center w-full my-4 aspect-video border border-dashed rounded-2xl border-black/20">
          <span className="font-bold text-black/40 text-6xl mb-4">ԅ(≖‿≖ԅ)</span>
          <span className="my-3 font-semibold text-black/60">
            No video currently processing
          </span>
          <button
            className="text-sm px-2.5 py-1 rounded-md font-medium bg-vista-100  text-vista-900 hover:bg-vista-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setIsOpen(true)}
          >
            Create a new video
          </button>
        </div>
      ) : processing ? (
        <CurrentVideo
          processing={processing}
          refresh={() => {
            refetch();
          }}
          onClose={() => {
            searchParams.delete("id");
            setSearchParams({
              ...searchParams,
            });
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full my-4 aspect-video border border-dashed rounded-2xl border-black/20">
          <span className="font-bold text-black/40 text-6xl mb-4">ԅ(≖‿≖ԅ)</span>
          <span className="my-3 font-semibold text-black/60">
            Loading current video...
          </span>
        </div>
      )}

      {/* Create a new video dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[90%] md:max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full flex items-center gap-2">
                    {/* Pick type */}
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex items-center gap-1.5 rounded py-1 px-2 border border-black/15">
                          <span
                            className="w-2 h-2 rounded-full data-[kind=ai]:bg-vista-400 data-[kind=custom]:bg-purple-400"
                            data-kind={option.kind}
                          />
                          <span className="font-mono text-xs font-medium">
                            {option.kind}
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1 ">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className="group flex w-full items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-vista-50"
                                  data-active={active}
                                >
                                  <span className="w-2 h-2 rounded-full bg-vista-400" />
                                  <span className="font-mono text-xs font-medium">
                                    ai
                                  </span>
                                  <span className="ml-1 text-xs text-black/40">
                                    Generated by AI
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className="group flex w-full items-center rounded-md px-2 py-2 gap-1.5 data-active:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  data-active={active}
                                  disabled
                                >
                                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                                  <span className="font-mono text-xs font-medium">
                                    custom
                                  </span>
                                  <span className="ml-1 text-xs text-black/40">
                                    Provide a script
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <Dialog.Title
                      as="span"
                      className="text-sm inline-flex items-center gap-2"
                    >
                      <span>⟩</span>
                      <span className="font-medium">New video</span>
                    </Dialog.Title>
                  </div>

                  {/* Textarea for AI geneated video */}
                  {option.kind === "ai" && (
                    <textarea
                      placeholder="Write a topic or story..."
                      className="mt-3 w-full outline-none font-normal placeholder-black/50 min-h-[9rem]"
                      value={option.topic}
                      onChange={(e) => {
                        setOption({
                          ...option,
                          topic: e.target.value,
                        });
                      }}
                    ></textarea>
                  )}

                  <div className="flex w-full items-center justify-end mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent px-3 py-1.5 text-sm font-medium bg-vista-100  text-vista-900 hover:bg-vista-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-vista-500 focus-visible:ring-offset-2"
                      disabled={isLoading}
                      onClick={() => mutate(option)}
                    >
                      {isLoading ? "Cooking..." : "Let it cook!"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Create;
