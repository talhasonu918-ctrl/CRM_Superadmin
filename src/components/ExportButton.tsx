import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Download, FileText, Table, ChevronDown } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useBranding } from '../contexts/BrandingContext';

interface ExportButtonProps {
  filename?: string;
  fileName?: string;
  headers: string[];
  data: any[][];
  title?: string;
  isDarkMode?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  filename,
  fileName,
  headers,
  data,
  title,
  isDarkMode = false,
}) => {
  const finalFilename = fileName || filename || 'export';
  const finalTitle = title || finalFilename.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const { config } = useBranding();
  const primaryColor = config.colors?.primary;

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Download size={18} />
            <span className="hidden sm:inline">Export Results</span>
            <span className="sm:hidden">Export</span>
            <ChevronDown size={14} className="ml-1 opacity-70" />
          </Menu.Button>
        </div>
     <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={`absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[100] ${
            isDarkMode ? 'bg-[#1e2836] border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => exportToPDF(finalFilename, headers, data, finalTitle, primaryColor)}
                    className={`${
                      active 
                        ? 'bg-primary/10 text-primary' 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors`}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => exportToExcel(finalFilename, headers, data)}
                    className={`${
                      active 
                        ? 'bg-primary/10 text-primary' 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors`}
                  >
                    <Table className="mr-2 h-4 w-4" />
                    Export as Excel
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

