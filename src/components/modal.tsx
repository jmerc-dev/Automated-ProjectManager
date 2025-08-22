import { createPortal } from "react-dom";

interface ModalChildren {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ open, children, onClose }: ModalChildren) {
  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed z-1000 top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.7)]"></div>
      <div className="fixed z-1000 bg-amber-300 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </>,
    document.getElementById("portal")!
  );
}
