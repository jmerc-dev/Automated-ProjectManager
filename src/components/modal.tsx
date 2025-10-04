import { createPortal } from "react-dom";
import type { Dispatch, SetStateAction } from "react";

interface ModalChildren {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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
      {/* Blur effect and overlay */}
      <div className="fixed z-40 top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.7)] backdrop-blur-lg pointer-events-auto transition-all duration-300 shadow-2xl"></div>
      {/* Modal content */}
      <div className="fixed z-50 bg-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 min-w-[340px] max-w-lg w-full p-6 border-2 border-[#0f6cbd] border-opacity-20 rounded-2xl shadow-2xl flex flex-col gap-4 animate-modal-pop">
        <div className="mb-2 text-2xl font-bold text-[#0f6cbd] tracking-tight drop-shadow">
          {title}
        </div>

        <div className="mb-2 animate-fade-in-slow">{children}</div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[#0f6cbd] bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f6cbd] focus:ring-opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className="bg-[#0f6cbd] hover:bg-[#155a8a] text-white font-semibold py-2 px-6 rounded-lg shadow transition border border-[#0f6cbd]"
          >
            Confirm
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")!
  );
}
