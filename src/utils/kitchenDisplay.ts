import { KitchenOrder } from '../app/modules/kitchen-order-display';
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
    customerAddress: order.customerAddress,
    timestamp: Date.now(),
    subtotal: order.subtotal,
    tax: order.tax,
    discount: order.discount,
    grandTotal: order.grandTotal,
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

