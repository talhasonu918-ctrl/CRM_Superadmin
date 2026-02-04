import { KitchenOrder } from '../app/modules/kitchen-order-display';

/**
 * Send order to Kitchen Display System
 * Call this function from POS when "Send To Kitchen" button is clicked
 */
export const sendToKitchen = (order: Partial<KitchenOrder>) => {
  const kitchenOrder: KitchenOrder = {
    id: order.id || `order-${Date.now()}`,
    orderNumber: order.orderNumber || `# ${Math.floor(Math.random() * 1000)}`,
    tableNumber: order.tableNumber || 'N/A',
    orderType: order.orderType || 'TakeAway',
    waiterName: order.waiterName || 'POS System',
    elapsedTime: '00:00',
    items: order.items || [],
    deals: order.deals,
    status: 'preparing',
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    timestamp: Date.now(),
  };

  // Save to localStorage
  if (typeof window !== 'undefined') {
    const existingOrders = localStorage.getItem('kitchenOrders');
    const orders: KitchenOrder[] = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(kitchenOrder);
    localStorage.setItem('kitchenOrders', JSON.stringify(orders));
  }

  // Dispatch custom event to notify Kitchen Display
  const event = new CustomEvent('sendToKitchen', {
    detail: kitchenOrder,
  });
  window.dispatchEvent(event);

  console.log('Order sent to kitchen:', kitchenOrder);
  return kitchenOrder;
};

/**
 * Example usage in POS system:
 * 
 * import { sendToKitchen } from '@/utils/kitchenDisplay';
 * 
 * const handleSendToKitchen = () => {
 *   sendToKitchen({
 *     orderNumber: '# 116',
 *     tableNumber: 'TKA-004',
 *     orderType: 'TakeAway',
 *     waiterName: 'Ahmed Ali',
 *     customerName: 'John Doe',
 *     customerPhone: '+92 300 1234567',
 *     items: [
 *       { id: '1', name: 'Beef Burger', quantity: 2, completed: false },
 *       { id: '2', name: 'Fries', quantity: 1, completed: false },
 *     ],
 *     deals: [
 *       { name: 'Combo Deal', items: ['1x Burger', '1x Fries', '1x Drink'] }
 *     ]
 *   });
 * };
 */
