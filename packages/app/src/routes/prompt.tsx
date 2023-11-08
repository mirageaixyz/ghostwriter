import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState, type FC } from "react";
import { trpc } from "../lib/trpc";

const HEADLINES = ["video", "tiktok", "post", "tweet", "short"] as const;

type Headline = {
  word: string;
  index: number;
  direction: "delete" | "type" | number;
};

type PromptProps = {
  id?: string;
  setId: (id: string) => void;
};

const Prompt: FC<PromptProps> = ({ id, setId }) => {
  const utils = trpc.useUtils();

  const { mutate, isLoading } = trpc.newContent.useMutation({
    onSuccess: async ({ id }) => {
      await utils.status.invalidate();
      setId(id);
    },
  });

  const [headline, setHeadline] = useState<Headline>({
    word: HEADLINES[0],
    index: 0,
    direction: 100,
  });
  const [text, setText] = useState("");

  const hasContent = !!id;

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadline((prev) => {
        if (typeof prev.direction === "number") {
          return {
            ...prev,
            direction: prev.direction <= 0 ? "delete" : prev.direction - 1,
          };
        }
        if (prev.direction === "delete" && prev.word.length <= 0) {
          const next = (prev.index + 1) % HEADLINES.length;
          return {
            direction: "type",
            index: next,
            word: "",
          };
        }
        if (prev.direction === "type" && prev.word === HEADLINES[prev.index]) {
          return {
            ...prev,
            direction: 100,
          };
        }
        if (prev.direction === "delete") {
          return {
            ...prev,
            word: prev.word.substring(0, prev.word.length - 1),
          };
        }
        return {
          ...prev,
          word: HEADLINES[prev.index].substring(0, prev.word.length + 1),
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [setHeadline]);

  return (
    <>
      <div
        className="absolute text-vista-500/10 flex flex-col items-center font-bold font-cal mb-[8rem] select-none text-7xl md:text-[12rem] leading-none max-w-[80vw] text-center [text-wrap:balance] gap-3
        data-[hascontent=true]:hidden"
        data-hascontent={hasContent}
      >
        <span>Generative</span>
        <span className="min-h-[4.5rem] md:min-h-[12rem]">{headline.word}</span>
      </div>
      <div
        className="fixed md:bottom-[50dvh] z-40 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white shadow-lg
        bottom-8 md:data-[hascontent=true]:bottom-10 data-[hascontent=true]:scale-95 transition-all duration-500"
        data-hascontent={hasContent}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <img
              className="w-8 h-8 rounded-full"
              src="/graphics/presidents.svg"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white rounded-lg p-1 z-40 shadow-md border border-black/10
              data-[side=top]:animate-slide-fade-up data-[side=right]:animate-slide-fade-right 
              data-[side=bottom]:animate-slide-fade-down data-[side=left]:animate-slide-fade-left"
              sideOffset={5}
            >
              <DropdownMenu.Item className="group rounded flex items-center gap-2 py-1 px-2 select-none outline-none hover:bg-vista-400 active:bg-vista-400 transition-all">
                <img
                  className="w-5 h-5 rounded-full border border-white"
                  src="/graphics/presidents.svg"
                />
                <span className="text-sm group-hover:text-white">
                  TikTok Presidents
                </span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="w-px h-6 bg-black/10 mx-1.5" />
        <textarea
          maxLength={1000}
          className="flex-[1_0_50%] min-w-[60vw] md:min-w-[350px] disabled:opacity-80 bg-transparent border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent [scroll-padding-block:0.75rem] min-h-[20px] text-sm"
          placeholder="Joe Biden eats some ice cream..."
          value={text}
          onChange={(e) => {
            e.target.style.height = "";
            const curr = e.target.scrollHeight ?? 0;
            e.target.style.height = `${curr}px`;
            setText(e.target.value);
          }}
          spellCheck={false}
          rows={1}
        />
        <span className="w-px h-6 bg-black/10 mx-1.5" />
        <button
          className="p-2 rounded-full bg-vista-500 text-base"
          disabled={isLoading}
          onClick={() => mutate({ kind: "ai", topic: text })}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 68 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="fill-white"
              d="M28.6583 7.92915C29.5964 5.81875 32.4887 5.71321 33.622 7.61259L33.7858 7.92915L36.6802 14.4414C39.2107 20.1348 43.4174 24.9109 48.7268 28.1395L49.6219 28.6632L54.763 31.5548C56.564 32.568 56.664 35.073 55.0632 36.2517L54.763 36.4454L49.6219 39.3373C44.1916 42.3918 39.8324 47.0291 37.1174 52.6187L36.6802 53.559L33.7858 60.0712C32.8479 62.1816 29.9556 62.2871 28.8221 60.3878L28.6583 60.0712L25.764 53.559C23.2336 47.8656 19.0268 43.0894 13.7173 39.861L12.8222 39.3373L7.68107 36.4454C5.88022 35.4325 5.78015 32.9275 7.38093 31.7486L7.68107 31.5548L12.8222 28.6632C18.2526 25.6085 22.6119 20.9713 25.3269 15.3817L25.764 14.4414L28.6583 7.92915ZM54.0569 6.55862C55.4416 9.67473 57.7785 12.3062 60.763 13.985C61.208 14.2353 61.208 14.8761 60.763 15.1265C57.7785 16.8052 55.4416 19.4367 54.0569 22.5528C53.821 23.0835 53.0677 23.0835 52.8319 22.5528C51.4472 19.4367 49.1102 16.8052 46.1258 15.1265C45.6808 14.8761 45.6808 14.2353 46.1258 13.985C49.1102 12.3062 51.4472 9.67473 52.8319 6.55862C53.0677 6.02798 53.821 6.02798 54.0569 6.55862Z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Prompt;
