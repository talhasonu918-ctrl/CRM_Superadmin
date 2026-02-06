import React, { useState, useEffect, useRef } from 'react';
import { TabItem } from '../../../components/Tabs';
import Tabs from '../../../components/Tabs';
import { POSView } from './form/POSView';
import { TablesView } from './form/TablesView';
import { TakeAwayView } from './form/TakeAwayView';
import { OrderQueueView } from './form/OrderQueueView';
import { OnlineOrdersView } from './form/OnlineOrdersView';
import { RiderManagementView } from './form/RiderManagementView';
import { ShoppingCart, Users, Package, ListOrdered, Bell, Bike } from 'lucide-react';
import { FullScreenToggle } from '../../../components/FullScreenToggle';

interface POSModuleProps {
  isDarkMode?: boolean;
}

export const POSModule: React.FC<POSModuleProps> = ({ isDarkMode = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('pos');
  const [targetRiderId, setTargetRiderId] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    { id: 1, title: 'New Online Order #102', time: '2m ago' },
    { id: 2, title: 'New Online Order #103', time: '10m ago' },
    { id: 3, title: 'Payment failed for order #99', time: '1h ago' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // storage updates if needed
  };

  const handleViewRiderDetail = (riderId: string) => {
    setTargetRiderId(riderId);
    setActiveTab('riders');
  };

  const handleConsumeInitialRiderId = () => {
    setTargetRiderId(null);
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!notifRef.current) return;
      const target = e.target as Node;
      if (showNotifications && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showNotifications]);

  const tabs: TabItem[] = [

    {
      id: 'pos',
      name: 'POS',
      icon: <ShoppingCart size={18} />,
      content: <POSView isDarkMode={isDarkMode} onViewRiderDetail={handleViewRiderDetail} />
    },
    {
      id: 'tables',
      name: 'Tables',
      icon: <Users size={18} />,
      content: <TablesView isDarkMode={isDarkMode} />
    },
    {
      id: 'queue',
      name: 'Current Orders',
      icon: <ListOrdered size={18} />,
      content: <OrderQueueView isDarkMode={isDarkMode} />
    },
    {
      id: 'takeaway',
      name: 'TakeAway Orders',
      icon: <Package size={18} />,
      content: <TakeAwayView isDarkMode={isDarkMode} />
    },

    {
      id: 'online',
      name: 'Online Orders',
      icon: <Package size={18} />,
      content: <OnlineOrdersView isDarkMode={isDarkMode} />
    },
    {
      id: 'riders',
      name: 'Rider Management',
      icon: <Bike size={18} />,
      content: <RiderManagementView isDarkMode={isDarkMode} initialRiderId={targetRiderId} onConsumeInitialRiderId={handleConsumeInitialRiderId} />
    },
  ];

  return (
    <div id="pos-module-container" className="bg-background text-textPrimary h-full w-full overflow-auto scrollbar-hidden">
      <Tabs
        className="h-full"
        items={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="underline"
        size="md"
        fullHeight={true}
        headerRight={
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg hover:bg-surface/10 text-textSecondary transition-all duration-200`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className={`absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background`}>{notifications.length}</span>
            </button>
            <FullScreenToggle isDarkMode={isDarkMode} className="ml-1" targetId="pos-module-container" />

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-surface border border-border z-10">
                <div className="p-3">
                  <div className="text-sm font-semibold mb-2 text-textPrimary">Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-2 py-2 border-b last:border-0 border-border">
                      <div className="mt-0.5 text-primary"><Bell size={16} /></div>
                      <div className="flex-1">
                        <div className="text-textPrimary text-sm">{n.title}</div>
                        <div className="text-textSecondary/60 text-xs">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

// Export individual components for flexibility
export { POSView } from './form/POSView';
export { TablesView } from './form/TablesView';
export { TakeAwayView } from './form/TakeAwayView';
export { OrderQueueView } from './form/OrderQueueView';
export * from './types';
