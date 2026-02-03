import React, { useState } from 'react';
import { TabItem } from '../../../components/Tabs';
import Tabs from '../../../components/Tabs';
import { POSView } from './components/POSView';
import { TablesView } from './components/TablesView';
import { TakeAwayView } from './components/TakeAwayView';
import { OrderQueueView } from './components/OrderQueueView';
import { ShoppingCart, Users, Package, ListOrdered } from 'lucide-react';

interface POSModuleProps {
  isDarkMode?: boolean;
}

export const POSModule: React.FC<POSModuleProps> = ({ isDarkMode = false }) => {
  const tabs: TabItem[] = [
    {
      id: 'pos',
      name: 'POS',
      icon: <ShoppingCart size={18} />,
      content: <POSView isDarkMode={isDarkMode} />
    },
    {
      id: 'tables',
      name: 'Tables',
      icon: <Users size={18} />,
      content: <TablesView isDarkMode={isDarkMode} />
    },
    {
      id: 'takeaway',
      name: 'TakeAway Orders',
      icon: <Package size={18} />,
      content: <TakeAwayView isDarkMode={isDarkMode} />
    },
    {
      id: 'queue',
      name: 'Current Orders',
      icon: <ListOrdered size={18} />,
      content: <OrderQueueView isDarkMode={isDarkMode} />
    }
  ];

  return (
    <div className={`pt-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Tabs 
      className=''
        items={tabs} 
        defaultActiveTab="pos" 
        variant="underline" 
        size="md"
      />
    </div>
  );
};

// Export individual components for flexibility
export { POSView } from './components/POSView';
export { TablesView } from './components/TablesView';
export { TakeAwayView } from './components/TakeAwayView';
export { OrderQueueView } from './components/OrderQueueView';
export * from './types';
