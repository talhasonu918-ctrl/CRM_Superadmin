import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  theme: any;
}

export const FormSelect = ({
  value,
  onChange,
  options,
  placeholder,
  theme,
}: FormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox
      value={value}
      onChange={(val) => {
        onChange(val);
        setIsOpen(false);
      }}
    >
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 h-10 border rounded-lg text-left focus:outline-none transition
              ${theme.input.background}
              ${theme.border.input}
              ${theme.text.primary}
              flex items-center justify-between
            `}
          >
            <span>
              {selected ? selected.label : placeholder}
            </span>
            <IoIosArrowDown
              className={`h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              } opacity-60`}
            />
          </Listbox.Button>

          <Listbox.Options
            className={`absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border shadow-lg
              ${theme.input.background}
              ${theme.border.input}
            `}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                as={Fragment}
              >
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      active ? "bg-orange-500 text-white" : theme.text.primary
                    } ${theme.input.background}`}
                  >
                    <div className="flex justify-between items-center">
                      {option.label}
                      {selected && <CheckIcon className="h-4 w-4" />}
                    </div>
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  );
};