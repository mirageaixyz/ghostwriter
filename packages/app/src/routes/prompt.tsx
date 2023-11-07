import { useRef, useState } from "react";

const Prompt = () => {
  const [text, setText] = useState("");
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="flex items-center justify-center gap-1 py-2 px-3 mb-[10%] rounded-full bg-white shadow-lg">
      <img className="w-6 h-6" src="/ai.svg" />
      <span className="w-px h-6 bg-black/10 mx-2" />
      <textarea
        ref={ref}
        maxLength={1000}
        className="flex-[1_0_50%] min-w-[300px] disabled:opacity-80 bg-transparent border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent [scroll-padding-block:0.75rem] min-h-[20px] text-sm"
        placeholder="Joe Biden eats some ice cream..."
        value={text}
        onChange={(e) => {
          if (ref.current) {
            ref.current.style.height = "";
            const curr = ref.current.scrollHeight ?? 0;
            setHeight(curr);
          }
          setText(e.target.value);
        }}
        spellCheck={false}
        rows={1}
        style={{
          height: height,
        }}
      />
      <span className="w-px h-6 bg-black/10 mx-2" />
      <button className="py-1 px-2 rounded-full bg-vista-200 text-base">
        🍿
      </button>
    </div>
  );
};

export default Prompt;
