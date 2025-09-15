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
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10">
          {(Object.entries(actions) as [keyof T, T[keyof T]][]).map(
            ([key, fn]) => (
              <button
                onClick={() => fn()}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
