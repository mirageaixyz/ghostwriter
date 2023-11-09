import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FC } from "react";
import { baseUrl } from "../lib/trpc";

type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LoginDialog: FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/60 fixed inset-0 z-40 data-[state=open]:animate-fade-in" />
        <AlertDialog.Content
          className="data-[state=open]:animate-slide-from-bottom 
          fixed max-h-[85vh] w-[90vw] max-w-[400px] z-50
          rounded-[6px] bg-white p-[25px] shadow focus:outline-none
          flex flex-col items-center justify-center gap-6 px-10"
        >
          <img className="w-20 h-20" src="/graphics/mindblown.svg" />
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="font-semibold text-xl md:text-2xl">
              Join the waitlist
            </h1>
            <span className="text-center [text-wrap:balance] text-sm text-black/75">
              Sign in with any of the following providers to join the waitlist.
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2.5 w-full">
            <a
              className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-slate-200 text-base text-center hover:bg-slate-300 cursor-pointer"
              href={`${baseUrl}/oauth/github`}
            >
              <img className="w-6 h-6 inline mr-2" src="/icons/github.svg" />
              Sign in with GitHub
            </a>
            <AlertDialog.Cancel asChild>
              <button className="w-full py-2 px-4 rounded-md bg-vista-500 hover:bg-vista-600 text-base text-white cursor-pointer">
                Close
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default LoginDialog;
