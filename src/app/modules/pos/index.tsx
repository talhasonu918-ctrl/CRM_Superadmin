import React, { useState, useEffect, useRef } from 'react';
import { TabItem } from '../../../components/Tabs';
import Tabs from '../../../components/Tabs';
import { POSView } from './form/POSView';
import { TablesView } from './form/TablesView';
import { TakeAwayView } from './form/TakeAwayView';
import { OrderQueueView } from './form/OrderQueueView';
import { OnlineOrdersView } from './form/OnlineOrdersView';
import { ShoppingCart, Users, Package, ListOrdered, Bell } from 'lucide-react';
import { getThemeColors } from '../../../theme/colors';

interface POSModuleProps {
  isDarkMode?: boolean;
}

export const POSModule: React.FC<POSModuleProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    { id: 1, title: 'New Online Order #102', time: '2m ago' },
    { id: 2, title: 'New Online Order #103', time: '10m ago' },
    { id: 3, title: 'Payment failed for order #99', time: '1h ago' },
  ];

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
    },
    {
      id: 'online',
      name: 'Online Orders',
      icon: <Package size={18} />,
      content: <OnlineOrdersView isDarkMode={isDarkMode} />
    },
  ];

  return (
    <div className={` ${theme.neutral.background} ${theme.text.primary}`}>
      <Tabs
        className=""
        items={tabs}
        defaultActiveTab="pos"
        variant="underline"
        size="md"
        headerRight={
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded ${theme.neutral.hoverLight} ${theme.text.secondary}`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className={`absolute -top-1 -right-1 ${theme.primary.main} text-white text-xs rounded-full px-1`}>{notifications.length}</span>
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg ${theme.neutral.card} border ${theme.border.secondary} z-10`}>
                <div className="p-3">
                  <div className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-2 py-2 border-b last:border-0 ${theme.border.secondary}`}>
                      <div className={`mt-0.5 ${theme.status.info.main}`}><Bell size={16} /></div>
                      <div className="flex-1">
                        <div className={`${theme.text.primary} text-sm`}>{n.title}</div>
                        <div className={`${theme.text.tertiary} text-xs`}>{n.time}</div>
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
