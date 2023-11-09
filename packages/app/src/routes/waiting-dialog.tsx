import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FC } from "react";

type WaitingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const WaitingDialog: FC<WaitingDialogProps> = ({ open, onOpenChange }) => {
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
          <img className="w-20 h-20" src="/graphics/chilling.svg" />
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="font-semibold text-xl md:text-2xl">
              Waitlist requested
            </h1>
            <span className="text-center [text-wrap:balance] text-sm text-black/75">
              You are now in the waitlist. We will notify you when you can join
              the party and start making some content.
            </span>
          </div>
          <AlertDialog.Cancel asChild>
            <button className="w-full py-2 px-4 rounded-md bg-vista-500 hover:bg-vista-600 text-base text-white cursor-pointer">
              Close
            </button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default WaitingDialog;
