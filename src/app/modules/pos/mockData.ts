// Mock Data for POS Module

import { Product, Table, TakeawayOrder } from './types';

export const mockProducts: Product[] = [
  // Deals
  { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: '/products/pizza-deal.png', available: true },
  { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '/products/pizza-deal-2.png', available: true },
  { id: 'deal-3', name: 'STUDENT DEAL', price: 850.00, category: 'Deals', image: '/products/burger-deal.png', available: true },
  { id: 'deal-4', name: 'HNY DEAL', price: 1800.00, category: 'Deals', image: '/products/wings-deal.png', available: true },
  { id: 'deal-5', name: 'MIX PLATTER', price: 1400.00, category: 'Deals', image: '/products/mix-platter.png', available: true },
  
  // Pizzas
  { id: 'pizza-1', name: 'CHICKEN TIKKA', price: 0.00, category: 'Pizza', image: '/products/chicken-tikka.png', available: true },
  { id: 'pizza-2', name: 'CHICKEN EURO', price: 0.00, category: 'Pizza', image: '/products/chicken-euro.png', available: true },
  { id: 'pizza-3', name: 'ITALIAN PIZZA', price: 0.00, category: 'Pizza', image: '/products/italian-pizza.png', available: true },
  { id: 'pizza-4', name: 'CHEESE LOVER', price: 0.00, category: 'Pizza', image: '/products/cheese-lover.png', available: true },
  { id: 'pizza-5', name: 'HNY SPECIAL PIZZA', price: 0.00, category: 'Pizza', image: '/products/hny-special.png', available: true },
  { id: 'pizza-6', name: 'CHICKEN SUPREME', price: 0.00, category: 'Pizza', image: '/products/chicken-supreme.png', available: true },
  { id: 'pizza-7', name: 'YUM CROWN PIZZA', price: 0.00, category: 'Pizza', image: '/products/yum-crown.png', available: true },
  { id: 'pizza-8', name: 'BEHARI PIZZA', price: 0.00, category: 'Pizza', image: '/products/behari-pizza.png', available: true },
  { id: 'pizza-9', name: 'CHICKEN & CHEESE STUFFER', price: 0.00, category: 'Pizza', image: '/products/cheese-stuffer.png', available: true },
  
  // Burgers
  { id: 'burger-1', name: 'KABAB STUFFER', price: 460.00, category: 'Burger', image: '/products/kabab-stuffer.png', available: true },
  { id: 'burger-2', name: 'CRUNCH CRAZE ZINGER', price: 370.00, category: 'Burger', image: '/products/crunch-craze.png', available: true },
  { id: 'burger-3', name: 'SPICY PATTY BURGER', price: 370.00, category: 'Burger', image: '/products/spicy-patty.png', available: true },
  { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '/products/chicken-patty.png', available: true },
  { id: 'burger-5', name: 'FILLET BURGER', price: 410.00, category: 'Burger', image: '/products/fillet-burger.png', available: true },
  
  // Wings
  { id: 'wings-1', name: 'PERI PERI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '/products/peri-peri.png', available: true },
  { id: 'wings-2', name: 'HOT WINGS (10PCS)', price: 580.00, category: 'Wings', image: '/products/hot-wings.png', available: true },
  { id: 'wings-3', name: 'BBQ WINGS (10PCS)', price: 580.00, category: 'Wings', image: '/products/bbq-wings.png', available: true },
  { id: 'wings-4', name: 'SWEET CHILLI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '/products/sweet-chilli.png', available: true },
  
  // Fries & Nuggets
  { id: 'fries-1', name: 'FUN NUGGETS (10PCS)', price: 580.00, category: 'Fries & Nuggets', image: '/products/nuggets.png', available: true },
  { id: 'fries-2', name: 'PLAIN FRIES', price: 0.00, category: 'Fries & Nuggets', image: '/products/plain-fries.png', available: true },
  { id: 'fries-3', name: 'MASALA FRIES', price: 0.00, category: 'Fries & Nuggets', image: '/products/masala-fries.png', available: true },
  { id: 'fries-4', name: 'LOADED FRIES', price: 550.00, category: 'Fries & Nuggets', image: '/products/loaded-fries.png', available: true },
  { id: 'fries-5', name: 'OVEN BAKED FRIES', price: 850.00, category: 'Fries & Nuggets', image: '/products/oven-fries.png', available: true },
  { id: 'fries-6', name: 'QUARTER BROAST', price: 720.00, category: 'Fries & Nuggets', image: '/products/quarter-broast.png', available: true },
  { id: 'fries-7', name: 'HALF BROAST', price: 1230.00, category: 'Fries & Nuggets', image: '/products/half-broast.png', available: true },
  { id: 'fries-8', name: 'FULL BROAST', price: 2290.00, category: 'Fries & Nuggets', image: '/products/full-broast.png', available: true },
  { id: 'fries-9', name: 'MELLOW WRAP', price: 580.00, category: 'Fries & Nuggets', image: '/products/wrap.png', available: true },
  
  // Rolls & Sandwiches
  { id: 'roll-1', name: 'CHILLI FLAME', price: 580.00, category: 'Roll & Sandwich', image: '/products/chilli-flame.png', available: true },
  { id: 'roll-2', name: 'HNY SPECIAL ROLL', price: 590.00, category: 'Roll & Sandwich', image: '/products/special-roll.png', available: true },
  { id: 'roll-3', name: 'CHILLI MELLI ROLL', price: 620.00, category: 'Roll & Sandwich', image: '/products/chilli-melli.png', available: true },
  { id: 'roll-4', name: 'BEHARI ROLL', price: 620.00, category: 'Roll & Sandwich', image: '/products/behari-roll.png', available: true },
  { id: 'roll-5', name: 'PIZZA SANDWICH', price: 590.00, category: 'Roll & Sandwich', image: '/products/pizza-sandwich.png', available: true },
  { id: 'roll-6', name: 'CHICKEN CHEESE STICK', price: 590.00, category: 'Roll & Sandwich', image: '/products/cheese-stick.png', available: true },
  { id: 'roll-7', name: 'CHICKEN MAYO SANDWICH', price: 450.00, category: 'Roll & Sandwich', image: '/products/mayo-sandwich.png', available: true },
  { id: 'roll-8', name: 'CLUB SANDWICH', price: 520.00, category: 'Roll & Sandwich', image: '/products/club-sandwich.png', available: true },
  { id: 'roll-9', name: 'ZINGER ROLL', price: 480.00, category: 'Roll & Sandwich', image: '/products/zinger-roll.png', available: true },
  { id: 'roll-10', name: 'BBQ CHICKEN SANDWICH', price: 500.00, category: 'Roll & Sandwich', image: '/products/bbq-sandwich.png', available: true },
  
  // Broast
  { id: 'broast-1', name: 'QUARTER BROAST', price: 720.00, category: 'Broast', image: '/products/quarter-broast.png', available: true },
  { id: 'broast-2', name: 'HALF BROAST', price: 1230.00, category: 'Broast', image: '/products/half-broast.png', available: true },
  { id: 'broast-3', name: 'FULL BROAST', price: 2290.00, category: 'Broast', image: '/products/full-broast.png', available: true },
  { id: 'broast-4', name: 'BROAST WITH FRIES', price: 950.00, category: 'Broast', image: '/products/broast-fries.png', available: true },
  { id: 'broast-5', name: 'CRISPY BROAST BUCKET', price: 1850.00, category: 'Broast', image: '/products/broast-bucket.png', available: true },
  { id: 'broast-6', name: 'SPICY BROAST', price: 780.00, category: 'Broast', image: '/products/spicy-broast.png', available: true },
  { id: 'broast-7', name: 'FAMILY BROAST COMBO', price: 2650.00, category: 'Broast', image: '/products/family-broast.png', available: true },
  { id: 'broast-8', name: 'GARLIC BROAST', price: 850.00, category: 'Broast', image: '/products/garlic-broast.png', available: true },
  
  // Drinks
  { id: 'drink-1', name: 'MINERAL WATER (SMALL)', price: 60.00, category: 'Drinks', image: '/products/water-small.png', available: true },
  { id: 'drink-2', name: 'MINERAL WATER (LARGE)', price: 100.00, category: 'Drinks', image: '/products/water-large.png', available: true },
  { id: 'drink-3', name: 'PAK DRINK (300ML)', price: 100.00, category: 'Drinks', image: '/products/pak-drink.png', available: true },
  { id: 'drink-4', name: 'DRINK (1LTR)', price: 150.00, category: 'Drinks', image: '/products/drink-1ltr.png', available: true },
  { id: 'drink-5', name: 'PAK DRINK (1.5LTR)', price: 220.00, category: 'Drinks', image: '/products/pak-drink-1.5.png', available: true },
  { id: 'drink-6', name: 'PAK DRINK TIN', price: 200.00, category: 'Drinks', image: '/products/pak-tin.png', available: true },
  
  // Pasta
  { id: 'pasta-1', name: 'CRUNCHY PASTA', price: 0.00, category: 'Pasta', image: '/products/crunchy-pasta.png', available: true },
  { id: 'pasta-2', name: 'FLAMING PASTA', price: 0.00, category: 'Pasta', image: '/products/flaming-pasta.png', available: true },
  { id: 'pasta-3', name: 'CREAMY PASTA', price: 0.00, category: 'Pasta', image: '/products/creamy-pasta.png', available: true },
  { id: 'pasta-4', name: 'MALAI BOTI', price: 0.00, category: 'Pasta', image: '/products/malai-boti.png', available: true },
  { id: 'pasta-5', name: 'CHICKEN FAJITA', price: 0.00, category: 'Pasta', image: '/products/chicken-fajita.png', available: true },
  { id: 'pasta-6', name: 'VEGGIE LOVER', price: 0.00, category: 'Pasta', image: '/products/veggie-lover.png', available: true },
];

export const mockTables: Table[] = [
  // Ground Floor
  { id: 'g01', number: 'G1', floor: 'ground', capacity: 4, status: 'available' },
  { id: 'g02', number: 'G2', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g03', number: 'G3', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g04', number: 'G4', floor: 'ground', capacity: 6, status: 'available' },
  { id: 'g05', number: 'G5', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g06', number: 'G6', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g07', number: 'G7', floor: 'ground', capacity: 2, status: 'occupied' },
  { id: 'g08', number: 'G8', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g09', number: 'G9', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g10', number: 'G10', floor: 'ground', capacity: 6, status: 'occupied' },
  { id: 'g11', number: 'G11', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g12', number: 'G12', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g13', number: 'G13', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g14', number: 'G14', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g15', number: 'G15', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g16', number: 'G16', floor: 'ground', capacity: 4, status: 'available' },
  { id: 'g17', number: 'G17', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g18', number: 'G18', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g19', number: 'G19', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g20', number: 'G20', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g21', number: 'G21', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g22', number: 'G22', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g23', number: 'G23', floor: 'ground', capacity: 2, status: 'available' },
  { id: 'g24', number: 'G24', floor: 'ground', capacity: 4, status: 'occupied' },
  { id: 'g25', number: 'G25', floor: 'ground', capacity: 2, status: 'available' },
  
  // First Floor
  { id: 'f01', number: 'F1', floor: 'first', capacity: 4, status: 'available' },
  { id: 'f02', number: 'F2', floor: 'first', capacity: 4, status: 'available' },
  { id: 'f03', number: 'F3', floor: 'first', capacity: 2, status: 'occupied' },
  { id: 'f04', number: 'F4', floor: 'first', capacity: 6, status: 'occupied' },
  { id: 'f05', number: 'F5', floor: 'first', capacity: 4, status: 'occupied' },
  { id: 'f06', number: 'F6', floor: 'first', capacity: 4, status: 'occupied' },
  { id: 'f07', number: 'F7', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f08', number: 'F8', floor: 'first', capacity: 4, status: 'occupied' },
  { id: 'f09', number: 'F9', floor: 'first', capacity: 4, status: 'available' },
  { id: 'f10', number: 'F10', floor: 'first', capacity: 6, status: 'occupied' },
  { id: 'f11', number: 'F11', floor: 'first', capacity: 4, status: 'occupied' },
  { id: 'f12', number: 'F12', floor: 'first', capacity: 4, status: 'available' },
  { id: 'f13', number: 'F13', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f14', number: 'F14', floor: 'first', capacity: 2, status: 'occupied' },
  { id: 'f15', number: 'F15', floor: 'first', capacity: 2, status: 'occupied' },
  { id: 'f16', number: 'F16', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f17', number: 'F17', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f18', number: 'F18', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f19', number: 'F19', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f20', number: 'F20', floor: 'first', capacity: 2, status: 'occupied' },
  { id: 'f21', number: 'F21', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f22', number: 'F22', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f23', number: 'F23', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f24', number: 'F24', floor: 'first', capacity: 2, status: 'available' },
  { id: 'f25', number: 'F25', floor: 'first', capacity: 4, status: 'occupied' },
];

export const mockTakeawayOrders: TakeawayOrder[] = [
  {
    id: 'order-84',
    orderNumber: 'Order # 84',
    items: [
      { product: { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: '', available: true }, quantity: 1 },
    ],
    total: 1500.00,
    discount: 0,
    tax: 0,
    grandTotal: 1500.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    status: 'ready',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 37 * 60 * 1000).toISOString(),
    pickupTime: '37 minutes ago'
  },
  {
    id: 'order-88',
    orderNumber: 'Order # 88',
    items: [
      { product: { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'wings-1', name: 'PERI PERI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 2 },
      { product: { id: 'fries-4', name: 'LOADED FRIES', price: 550.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 3 },
    ],
    total: 4850.00,
    discount: 0,
    tax: 0,
    grandTotal: 4850.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Priya Sharma',
    customerPhone: '+91 99887 76654',
    status: 'preparing',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    pickupTime: '55 minutes ago'
  },
  {
    id: 'order-85',
    orderNumber: 'Order # 85',
    items: [
      { product: { id: 'pizza-4', name: 'CHEESE LOVER', price: 850.00, category: 'Pizza', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '', available: true }, quantity: 1 },
    ],
    total: 1280.00,
    discount: 0,
    tax: 0,
    grandTotal: 1280.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Amit Patel',
    customerPhone: '+91 97654 32198',
    status: 'served',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 113 * 60 * 1000).toISOString(),
    pickupTime: '1 hour ago'
  },
  {
    id: 'order-80',
    orderNumber: 'Order # 80',
    items: [
      { product: { id: 'burger-1', name: 'KABAB STUFFER', price: 460.00, category: 'Burger', image: '', available: true }, quantity: 1 },
    ],
    total: 480.00,
    discount: 0,
    tax: 0,
    grandTotal: 480.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Sneha Desai',
    customerPhone: '+91 96543 21987',
    status: 'served',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    pickupTime: '2 hours ago'
  },
  {
    id: 'order-79',
    orderNumber: 'Order # 79',
    items: [
      { product: { id: 'deal-3', name: 'STUDENT DEAL', price: 850.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '', available: true }, quantity: 1 },
    ],
    total: 1280.00,
    discount: 0,
    tax: 0,
    grandTotal: 1280.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Vikram Singh',
    customerPhone: '+91 95432 19876',
    status: 'preparing',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    pickupTime: '55 minutes ago'
  },
  {
    id: 'order-75',
    orderNumber: 'Order # 75',
    items: [
      { product: { id: 'deal-4', name: 'HNY DEAL', price: 1800.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'fries-7', name: 'HALF BROAST', price: 1230.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
      { product: { id: 'wings-3', name: 'BBQ WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
    ],
    total: 3810.00,
    discount: 0,
    tax: 0,
    grandTotal: 3810.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Neha Reddy',
    customerPhone: '+91 94321 98765',
    status: 'ready',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
    pickupTime: '31 minutes ago'
  },
  {
    id: 'order-71',
    orderNumber: 'Order # 71',
    items: [
      { product: { id: 'burger-5', name: 'FILLET BURGER', price: 410.00, category: 'Burger', image: '', available: true }, quantity: 2 },
      { product: { id: 'wings-4', name: 'SWEET CHILLI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
      { product: { id: 'fries-1', name: 'FUN NUGGETS (10PCS)', price: 580.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
    ],
    total: 2370.00,
    discount: 0,
    tax: 0,
    grandTotal: 2370.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Arjun Mehta',
    customerPhone: '+91 93219 87654',
    status: 'served',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    pickupTime: '45 minutes ago'
  },
  {
    id: 'order-59',
    orderNumber: 'Order # 59',
    items: [
      { product: { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: '', available: true }, quantity: 1 },
    ],
    total: 1500.00,
    discount: 0,
    tax: 0,
    grandTotal: 1500.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Kavita Nair',
    customerPhone: '+91 92109 87654',
    status: 'ready',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
    pickupTime: '27 minutes ago'
  },
  {
    id: 'order-22',
    orderNumber: 'Order # 22',
    items: [
      { product: { id: 'pizza-8', name: 'BEHARI PIZZA', price: 950.00, category: 'Pizza', image: '', available: true }, quantity: 2 },
    ],
    total: 4830.00,
    discount: 0,
    tax: 0,
    grandTotal: 4830.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Suresh Kumar',
    customerPhone: '+91 91098 76543',
    status: 'preparing',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    pickupTime: '9 minutes ago'
  },
 
  // Additional orders for testing
  
  
  {
    id: 'order-10',
    orderNumber: 'Order # 10',
    items: [
      { product: { id: 'pizza-5', name: 'HNY SPECIAL PIZZA', price: 950.00, category: 'Pizza', image: '', available: true }, quantity: 1 },
      { product: { id: 'fries-2', name: 'PLAIN FRIES', price: 350.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
      { product: { id: 'wings-2', name: 'HOT WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
    ],
    total: 1680.00,
    discount: 0,
    tax: 0,
    grandTotal: 1680.00,
    paymentMode: 'cash',
    cashBack: 0,
    customerName: 'Ravi Kapoor',
    customerPhone: '+91 90876 54321',
    status: 'preparing',
    type: 'takeaway',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    pickupTime: '7 hours ago'
  },
  
];

// Order interface for queue orders
interface Order {
  id: string;
  orderNumber: string;
  total: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMode: 'cash' | 'card' | 'online';
  cashBack: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  createdAt: string;
  tableId: string;
  items: any[];
}

// Mock Queue Orders
export const mockQueueOrders: Order[] = [
  { id: '1', orderNumber: '1/30/2026-562', total: 2395.00, discount: 0, tax: 0, grandTotal: 2395.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 9:09 PM', tableId: 'G6', items: [] },
  { id: '2', orderNumber: '1/30/2026-563', total: 8400.00, discount: 0, tax: 0, grandTotal: 8400.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 8:13 PM', tableId: 'G3', items: [] },
  { id: '3', orderNumber: '1/30/2026-564', total: 3360.00, discount: 0, tax: 0, grandTotal: 3360.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 8:08 PM', tableId: 'F14', items: [] },
  { id: '4', orderNumber: '1/30/2026-565', total: 2290.00, discount: 0, tax: 0, grandTotal: 2290.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 9:13 PM', tableId: 'G5', items: [] },
  { id: '5', orderNumber: '1/30/2026-566', total: 1900.00, discount: 0, tax: 0, grandTotal: 1900.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 8:13 PM', tableId: 'Ground', items: [] },
  { id: '6', orderNumber: '1/30/2026-567', total: 1900.00, discount: 0, tax: 0, grandTotal: 1900.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'dine-in', createdAt: '30-01-2026 8:01 PM', tableId: 'Ground', items: [] },
  { id: '7', orderNumber: '1/30/2026-568', total: 1900.00, discount: 0, tax: 0, grandTotal: 1900.00, paymentMode: 'cash', cashBack: 0, status: 'ready', type: 'takeaway', createdAt: '30-01-2026 9:01 PM', tableId: 'F8', items: [] },
  { id: '8', orderNumber: '1/30/2026-569', total: 1980.00, discount: 0, tax: 0, grandTotal: 1980.00, paymentMode: 'cash', cashBack: 0, status: 'ready', type: 'takeaway', createdAt: '30-01-2026 8:09 PM', tableId: 'F10', items: [] },
  { id: '9', orderNumber: '1/30/2026-570', total: 1380.00, discount: 0, tax: 0, grandTotal: 1380.00, paymentMode: 'cash', cashBack: 0, status: 'pending', type: 'delivery', createdAt: '30-01-2026 8:02 PM', tableId: 'F19', items: [] },
];

export const categories = [
  'All Products',
  'Deals',
  'Pizza',
  'Burger',
  'Roll & Sandwich',
  'Pasta',
  'Broast',
  'Fries & Nuggets',
  'Drinks',
  'Sauces',
  'Wraps',
];
