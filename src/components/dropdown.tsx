import { useState } from "react";

export default function DropdownMenu() {
  const [open, setOpen] = useState<true | false>(false);

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 text-white rounded-lg fill-gray-500 hover:[&>svg]:fill-gray-800 [&>svg]:fill-gray-5  00 transition"
        >
          <svg
            width="10px"
            height="15px"
            viewBox="0 0 16 16"
            className="fill-current fill-gray-500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" />
            <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" />
            <path d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" />
          </svg>
        </button>
        {open && (
          <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* make this dynamic */}
            <a className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-t-lg">
              Open
            </a>
          </div>
        )}
      </div>
    </>
  );
}
