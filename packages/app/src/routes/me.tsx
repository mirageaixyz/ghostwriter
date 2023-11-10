import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { useMe } from "../lib/context/me";
import { baseUrl, trpc } from "../lib/trpc";
import LoginDialog from "./login-dialog";

const Me: FC = () => {
  const me = useMe();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const utils = trpc.useUtils();
  const { mutateAsync, isLoading: isMutating } = trpc.logout.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        utils.me.invalidate();
      }
    },
  });

  if (me.isUserLoading || isMutating) {
    return (
      <div className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white">
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-200 animate-spin fill-vista-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <LoginDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          {me.user ? (
            <img
              className="w-9 h-9 rounded-lg select-none"
              src={`https://github.com/${me.user.username}.png`}
            />
          ) : (
            <img
              className="w-9 h-9 rounded-lg hover:border-2 border-vista-400 transition-all select-none"
              src="https://api.dicebear.com/7.x/thumbs/svg?seed=Mittens"
            />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="flex items-center justify-center flex-col gap-2 mx-4
            min-w-[250px] bg-white rounded-lg p-2 z-40 shadow-md border border-black/10
            data-[side=top]:animate-slide-fade-up data-[side=right]:animate-slide-fade-right 
            data-[side=bottom]:animate-slide-fade-down data-[side=left]:animate-slide-fade-left"
            sideOffset={5}
          >
            <DropdownMenu.Label className="w-full px-3 py-2">
              <span
                className="text-black/60 text-sm font-medium data-[logged-in=true]:text-black"
                data-logged-in={!!me.user}
              >
                {me.user
                  ? `Hello, ${me.user.name ?? me.user.username}!`
                  : "You are not in the waiting list"}
              </span>
            </DropdownMenu.Label>
            <DropdownMenu.Separator className="w-full h-[1px] bg-black/10" />

            {me.user?.waitlist === "alpha" ? (
              <DropdownMenu.Item
                disabled
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none transition-all"
              >
                <img
                  className="w-5 h-5 rounded-full opacity-60"
                  src="/icons/waiting.svg"
                />
                <span className="text-sm opacity-60">Waitlist joined</span>
              </DropdownMenu.Item>
            ) : me.user ? (
              <DropdownMenu.Item
                disabled
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none transition-all"
              >
                <img
                  className="w-5 h-5 rounded-full opacity-60"
                  src="/icons/waiting.svg"
                />
                <span className="text-sm opacity-60">Waitlist requested</span>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                <img
                  className="w-5 h-5 rounded-full"
                  src="/icons/waiting.svg"
                />
                <span className="text-sm">Join the wailist</span>
              </DropdownMenu.Item>
            )}

            {me.user ? (
              <DropdownMenu.Item asChild>
                <button
                  className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                  onClick={async () => {
                    await toast.promise(mutateAsync(), {
                      loading: "Logging out...",
                      success: "Logged out!",
                      error: "Failed to logout",
                    });
                  }}
                >
                  <img className="w-5 h-5 rounded-full" src="/icons/bye.svg" />
                  <span className="text-sm">Logout</span>
                </button>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item asChild>
                <a
                  className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                  href={`${baseUrl}/oauth/github`}
                >
                  <img
                    className="w-5 h-5 rounded-full"
                    src="/icons/github.svg"
                  />
                  <span className="text-sm">Sign in with Github</span>
                </a>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Separator className="w-full h-[1px] bg-black/10" />
            <DropdownMenu.Item asChild>
              <a
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                href="https://dub.sh/OoNxCoi"
              >
                <img className="w-5 h-5 rounded-full" src="/icons/books.svg" />
                <span className="text-sm">FAQ</span>
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <a
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                href="https://dub.sh/OoNxCoi"
              >
                <img className="w-5 h-5 rounded-full" src="/icons/money.svg" />
                <span className="text-sm">Pricing</span>
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <a
                className="group rounded w-full flex items-center gap-2 py-2 px-3 select-none outline-none hover:bg-vista-50 active:bg-vista-50 transition-all cursor-pointer"
                href="https://mirageai.xyz"
              >
                <img
                  className="w-5 h-5 rounded-full"
                  src="/icons/mirageai.svg"
                />
                <span className="text-sm">Mirage AI</span>
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default Me;
