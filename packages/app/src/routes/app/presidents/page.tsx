import { useMemo, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { trpc } from "../../../lib/trpc";

const Create: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [topic, setTopic] = useState("");
  const id = useMemo(() => searchParams.get("id"), [searchParams]);

  const { data } = trpc.getContent.useQuery(id ?? "", {
    enabled: !!id,
    initialData: undefined,
  });
  const { mutate, isLoading } = trpc.createContent.useMutation({
    onSuccess: (data) => {
      setSearchParams({ id: data.id });
    },
  });

  const isGenerating = useMemo(
    () => isLoading || (data && data.video.status == "pending"),
    [isLoading, data]
  );

  return (
    <div className="flex flex-col h-full w-full justify-center items-center space-y-3">
      <h1 className="font-bold text-white">Create Video</h1>
      <textarea
        className="w-96 h-96 p-3 text-white bg-transparent rounded-md outline-none select-none border border-vista-100/30 resize-none"
        placeholder="Enter a prompt..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      ></textarea>
      <button
        className="text-white"
        onClick={() => {
          if (!topic && isGenerating) return;
          mutate({
            kind: "ai",
            topic,
          });
        }}
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default Create;
