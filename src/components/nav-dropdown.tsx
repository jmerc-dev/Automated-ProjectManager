import { useState } from "react";

interface NavDropdownProps<T extends Record<string, (...args: any[]) => any>> {
  children: React.ReactNode;
  actions?: T;
}

export default function NavDropdown<
  T extends Record<string, (...args: any[]) => any>
>({ children, actions = {} as T }: NavDropdownProps<T>) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {children}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl overflow-hidden z-20">
          {(Object.entries(actions) as [keyof T, T[keyof T]][]).map(
            ([key, fn]) => (
              <button
                onClick={() => fn()}
                key={String(key)}
                className="block w-full text-left px-4 py-2 text-sm bg-white hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] focus:outline-none transition-colors text-gray-700 hover:text-[#0f6cbd] focus:text-[#0f6cbd]"
              >
                {String(key)}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
