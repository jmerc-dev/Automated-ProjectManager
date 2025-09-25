import { createPortal } from "react-dom";
import type { Dispatch, SetStateAction } from "react";

interface ModalChildren {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean | undefined>>;
  onConfirm: () => void;
}

export default function Modal({
  open,
  children,
  title,
  setIsOpen,
  onClose,
  onConfirm,
}: ModalChildren) {
  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed z-1000 top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.7)]"></div>
      <div className="fixed z-1000 bg-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 min-w-2xl p-2 border border-transparent rounded-xl">
        <div className="m-1 text-2xl text-cyan-800">{title}</div>

        {children}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              //setIsOpen(false);
            }}
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 border border-cyan-700 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")!
  );
}
