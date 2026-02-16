export const mockNotifications = [
  {
    id: 1,
    title: 'New Order #1234',
    message: 'Order received from John Doe',
    time: '2 min ago',
    unread: true,
    type: 'order',
    orderDetails: {
      orderId: '#1234',
      customerName: 'John Doe',
      phoneNumber: '+92 300 1234567',
      address: '123 Main Street, Block A, Gulberg Town, Lahore, Pakistan',
      orderDate: '2026-02-11',
      orderTime: '10:30 AM',
      totalAmount: 1250.0,
      items: [
        { name: 'Chicken Pizza Large', quantity: 2, price: 500 },
        { name: 'Garlic Bread', quantity: 1, price: 150 },
        { name: 'Cold Drink 1.5L', quantity: 1, price: 100 },
      ],
    },
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Pizza dough running low',
    time: '15 min ago',
    unread: true,
    type: 'alert',
    orderDetails: {
      orderId: '#ALERT-002',
      customerName: 'Inventory System',
      phoneNumber: 'Available on request',
      address: 'Main Branch - Stock Room',
      orderDate: '2026-02-11',
      orderTime: '10:15 AM',
      totalAmount: 0,
      items: [
        { name: 'Pizza Dough', quantity: 5, price: 0, status: 'Low Stock - Reorder Required' },
      ],
    },
  },
  {
    id: 3,
    title: 'New Review',
    message: '5-star review from customer',
    time: '1 hour ago',
    unread: false,
    type: 'review',
    orderDetails: {
      orderId: '#5678',
      customerName: 'Sarah Ahmed',
      phoneNumber: '+92 321 9876543',
      address: '45 Park Avenue, DHA Phase 5, Karachi, Pakistan',
      orderDate: '2026-02-11',
      orderTime: '09:00 AM',
      totalAmount: 850.0,
      items: [
        { name: 'Beef Burger Combo', quantity: 1, price: 450 },
        { name: 'French Fries', quantity: 2, price: 200 },
        { name: 'Milkshake', quantity: 1, price: 200 },
      ],
    },
  },
  {
    id: 4,
    title: 'Payment Received',
    message: 'Payment of PKR 1500 confirmed',
    time: '2 hours ago',
    unread: false,
    type: 'payment',
    orderDetails: {
      orderId: '#9012',
      customerName: 'Ali Hassan',
      phoneNumber: '+92 333 4567890',
      address: '78 Mall Road, Gulberg, Lahore, Pakistan',
      orderDate: '2026-02-11',
      orderTime: '08:30 AM',
      totalAmount: 1500.0,
      items: [
        { name: 'Family Deal - 2 Large Pizzas', quantity: 1, price: 1200 },
        { name: 'Garlic Bread', quantity: 2, price: 300 },
      ],
    },
  },
];
// Mock Data for POS Module

import { Product, Table, TakeawayOrder, Order, Rider } from './types';

export const mockProducts: Product[] = [
  // Deals
  { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: 'https://www.kfcpakistan.com/images/98cb5e60-7688-11f0-b6cc-7b8f56c77b94-WowBoxcopy-2025-08-11075549.png', available: true, dealItems: ['2 Small Pizzas', '1.5L Soft Drink'] },
  { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: 'https://www.kfcpakistan.com/images/ff4103d0-9789-11f0-b6e5-d9c08b0eb28c-FamilyFestival3-2025-09-22075859.png', available: true, dealItems: ['2 Medium Pizzas', '2.5L Soft Drink', 'Garlic Bread'] },
  { id: 'deal-3', name: 'STUDENT DEAL', price: 850.00, category: 'Deals', image: 'https://www.kfcpakistan.com/images/440cfeb0-7322-11f0-b954-a7e4d4e58325-CrispyBoxcopy-2025-08-07000545.png', available: true, dealItems: ['1 Zinger Burger', 'Regular Fries', '300ml Drink'] },
  { id: 'deal-4', name: 'HNY DEAL', price: 1800.00, category: 'Deals', image: 'https://www.kfcpakistan.com/images/4d334d30-7324-11f0-b22b-41b1303a1fa3-CrispyDuoBoxcopy-2025-08-07002019.png', available: true, dealItems: ['10pcs Wings', 'Large Pizza', '1.5L Soft Drink'] },
  { id: 'deal-5', name: 'MIX PLATTER', price: 1400.00, category: 'Deals', image: 'https://www.kfcpakistan.com/images/b0c33f70-bc52-11ee-b144-5b816f8c83f0-Riceandspice_variant_0-2024-01-26135623.png', available: true, dealItems: ['Nuggets', 'Wings', 'Fries', 'Sauces'] },

  // Pizzas
  { id: 'pizza-1', name: 'CHICKEN TIKKA', price: 950.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/a8e33779-ec04-4f48-9608-5b1a7daf60ec/pizza1.png', available: true },
  { id: 'pizza-2', name: 'CHICKEN EURO', price: 980.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/0fc1bf8f-070d-421c-93f0-861e4b5c551d/slazzerpreviewejw121.png', available: true },
  { id: 'pizza-3', name: 'ITALIAN PIZZA', price: 1150.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/8e9b60e9-5905-4b67-bdb2-228728df8b32/slazzerpreviewtbn5f.png', available: true },
  { id: 'pizza-4', name: 'CHEESE LOVER', price: 1050.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/125001e8-76d9-4494-b327-cfbd573866f3/slazzerpreviewzu6z01.png', available: true },
  { id: 'pizza-5', name: 'HNY SPECIAL PIZZA', price: 1350.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/43e4bd81-7b67-4452-a217-f73f0ac6589d/slazzerpreview0sos71.png', available: true },
  { id: 'pizza-6', name: 'CHICKEN SUPREME', price: 1100.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/e0d0ec88-589e-41a0-955a-31f04ff8f63a/slazzerpreviewpev2l.png', available: true },
  { id: 'pizza-7', name: 'YUM CROWN PIZZA', price: 1450.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/9e40b43c-51bc-4d83-82bf-f98727cf7f61/slazzerpreview30udw.png', available: true },
  { id: 'pizza-8', name: 'BEHARI PIZZA', price: 1250.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/e62285d1-8262-478c-bf2a-676fc588640f/slazzerpreviewlvqij.png', available: true },
  { id: 'pizza-9', name: 'CHICKEN & CHEESE STUFFER', price: 1100.00, category: 'Pizza', image: 'https://4xs9fttk0t.ucarecd.net/7444fbdd-f667-48fd-ab51-237c7994f74e/slazzerpreviewjgsj7.png', available: true },

  // Burgers
  { id: 'burger-1', name: 'KABAB STUFFER', price: 460.00, category: 'Burger', image: 'https://www.kfcpakistan.com/images/29700d60-f1a2-11ef-9e56-b384176afb2a-Krunchburger_variant_0-2025-02-23045345.png', available: true },
  { id: 'burger-2', name: 'CRUNCH CRAZE ZINGER', price: 370.00, category: 'Burger', image: 'https://www.kfcpakistan.com/images/19b05560-bc56-11ee-97d6-7187fd7553de-Zingeratha_variant_0-2024-01-26142047.png', available: true },
  { id: 'burger-3', name: 'SPICY PATTY BURGER', price: 370.00, category: 'Burger', image: 'https://www.kfcpakistan.com/images/20a9c8f0-ea3c-11ef-a1fe-ef7899095965-Twister_variant_0-2025-02-13185543.png', available: true },
  { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: 'https://4xs9fttk0t.ucarecd.net/284bc4db-1a0a-4a7d-bf52-613de217a512/slazzerpreview790b9.png', available: true },
  { id: 'burger-5', name: 'FILLET BURGER', price: 410.00, category: 'Burger', image: 'https://www.kfcpakistan.com/images/87ef3cb0-7be7-11f0-a76e-319aa2038f18-1-2025-08-18035759.png', available: true },
  // Wings
  { id: 'wings-1', name: 'PERI PERI WINGS (10PCS)', price: 580.00, category: 'Wings', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'wings-2', name: 'HOT WINGS (10PCS)', price: 580.00, category: 'Wings', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'wings-3', name: 'BBQ WINGS (10PCS)', price: 580.00, category: 'Wings', image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'wings-4', name: 'SWEET CHILLI WINGS (10PCS)', price: 580.00, category: 'Wings', image: 'https://images.unsplash.com/photo-1634063228148-932cf90048af?q=80&w=300&auto=format&fit=crop', available: true },
  // Fries & Nuggets
  { id: 'fries-1', name: 'FUN NUGGETS (10PCS)', price: 580.00, category: 'Fries & Nuggets', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'fries-2', name: 'PLAIN FRIES', price: 250.00, category: 'Fries & Nuggets', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'fries-3', name: 'MASALA FRIES', price: 300.00, category: 'Fries & Nuggets', image: 'https://images.unsplash.com/photo-1630384066252-19e1f5735848?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'fries-4', name: 'LOADED FRIES', price: 550.00, category: 'Fries & Nuggets', image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'fries-5', name: 'OVEN BAKED FRIES', price: 850.00, category: 'Fries & Nuggets', image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'fries-6', name: 'QUARTER BROAST', price: 720.00, category: 'Fries & Nuggets', image: 'https://www.kfcpakistan.com/images/32258900-7592-11f0-8081-2946661625ed-1pc-2025-08-10041432.png', available: true },
  { id: 'fries-7', name: 'HALF BROAST', price: 1230.00, category: 'Fries & Nuggets', image: 'https://www.kfcpakistan.com/images/87ef3cb0-7be7-11f0-a76e-319aa2038f18-1-2025-08-18035759.png', available: true },
  { id: 'fries-8', name: 'FULL BROAST', price: 2290.00, category: 'Fries & Nuggets', image: 'https://www.kfcpakistan.com/images/ff4103d0-9789-11f0-b6e5-d9c08b0eb28c-FamilyFestival3-2025-09-22075859.png', available: true },
  { id: 'fries-9', name: 'MELLOW WRAP', price: 580.00, category: 'Fries & Nuggets', image: 'https://www.kfcpakistan.com/images/20a9c8f0-ea3c-11ef-a1fe-ef7899095965-Twister_variant_0-2025-02-13185543.png', available: true },
  // Rolls & Sandwiches
  { id: 'roll-1', name: 'CHILLI FLAME', price: 580.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1626700051175-656fc7c3dbe6?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-2', name: 'HNY SPECIAL ROLL', price: 590.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1539252554452-96940fd29260?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-3', name: 'CHILLI MELLI ROLL', price: 620.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-4', name: 'BEHARI ROLL', price: 620.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-5', name: 'PIZZA SANDWICH', price: 590.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-6', name: 'CHICKEN CHEESE STICK', price: 590.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-7', name: 'CHICKEN MAYO SANDWICH', price: 450.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1554522723-b2a47cb105e3?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-8', name: 'CLUB SANDWICH', price: 520.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-9', name: 'ZINGER ROLL', price: 480.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'roll-10', name: 'BBQ CHICKEN SANDWICH', price: 500.00, category: 'Roll & Sandwich', image: 'https://images.unsplash.com/photo-1521390188846-e2a39973e5bf?q=80&w=300&auto=format&fit=crop', available: true },

  // Broast
  { id: 'broast-1', name: 'QUARTER BROAST', price: 720.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/32258900-7592-11f0-8081-2946661625ed-1pc-2025-08-10041432.png', available: true },
  { id: 'broast-2', name: 'HALF BROAST', price: 1230.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/87ef3cb0-7be7-11f0-a76e-319aa2038f18-1-2025-08-18035759.png', available: true },
  { id: 'broast-3', name: 'FULL BROAST', price: 2290.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/ff4103d0-9789-11f0-b6e5-d9c08b0eb28c-FamilyFestival3-2025-09-22075859.png', available: true },
  { id: 'broast-4', name: 'BROAST WITH FRIES', price: 950.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/19b05560-bc56-11ee-97d6-7187fd7553de-Zingeratha_variant_0-2024-01-26142047.png', available: true },
  { id: 'broast-5', name: 'CRISPY BROAST BUCKET', price: 1850.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/4d334d30-7324-11f0-b22b-41b1303a1fa3-CrispyDuoBoxcopy-2025-08-07002019.png', available: true },
  { id: 'broast-6', name: 'SPICY BROAST', price: 780.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/29700d60-f1a2-11ef-9e56-b384176afb2a-Krunchburger_variant_0-2025-02-23045345.png', available: true },
  { id: 'broast-7', name: 'FAMILY BROAST COMBO', price: 2650.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/ff4103d0-9789-11f0-b6e5-d9c08b0eb28c-FamilyFestival3-2025-09-22075859.png', available: true },
  { id: 'broast-8', name: 'GARLIC BROAST', price: 850.00, category: 'Broast', image: 'https://www.kfcpakistan.com/images/b0c33f70-bc52-11ee-b144-5b816f8c83f0-Riceandspice_variant_0-2024-01-26135623.png', available: true },

  // Drinks
  { id: 'drink-1', name: 'MINERAL WATER (SMALL)', price: 60.00, category: 'Drinks', image: 'https://www.dominos.com.pk/images/561f7ee0-9c0c-11ef-8241-d70815871548-Aquafina_variant_0-2024-11-06065707.jpg', available: true },
  { id: 'drink-2', name: 'MINERAL WATER (LARGE)', price: 100.00, category: 'Drinks', image: 'https://www.dominos.com.pk/images/561f7ee0-9c0c-11ef-8241-d70815871548-Aquafina_variant_0-2024-11-06065707.jpg', available: true },
  { id: 'drink-3', name: 'PAK DRINK (300ML)', price: 100.00, category: 'Drinks', image: 'https://www.kfcpakistan.com/images/f9ef5210-9789-11f0-a9fb-8733de1157b1-MirindaRegular_variant_0-2025-09-22075850.png', available: true },
  { id: 'drink-4', name: 'DRINK (1LTR)', price: 150.00, category: 'Drinks', image: 'https://www.kfcpakistan.com/images/0a68d020-73c8-11f0-9aa3-ad226d559836-Pepsiltr_variant_0-2025-08-07195225.png', available: true },
  { id: 'drink-5', name: 'PAK DRINK (1.5LTR)', price: 220.00, category: 'Drinks', image: 'https://www.kfcpakistan.com/images/f9ef5210-9789-11f0-a9fb-8733de1157b1-MirindaRegular_variant_0-2025-09-22075850.png', available: true },
  { id: 'drink-6', name: 'PAK DRINK TIN', price: 200.00, category: 'Drinks', image: 'https://www.kfcpakistan.com/images/f9ef5210-9789-11f0-8081-2946661625ed-7UPMint_variant_0-2025-09-22075850.png', available: true },

  // Pasta
  { id: 'pasta-1', name: 'CRUNCHY PASTA', price: 650.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'pasta-2', name: 'FLAMING PASTA', price: 720.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'pasta-3', name: 'CREAMY PASTA', price: 680.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'pasta-4', name: 'MALAI BOTI', price: 850.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'pasta-5', name: 'CHICKEN FAJITA', price: 780.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=300&auto=format&fit=crop', available: true },
  { id: 'pasta-6', name: 'VEGGIE LOVER', price: 620.00, category: 'Pasta', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=300&auto=format&fit=crop', available: true },
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

// Inventory Management Mock Data
export interface InventoryItem {
  id: string;
  name: string;
  image?: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  sales: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const mockInventory: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Chicken Tikka Pizza',
    category: 'Pizza',
    stock: 45,
    minStock: 20,
    price: 950,
    sales: 8500,
    image: 'https://4xs9fttk0t.ucarecd.net/a8e33779-ec04-4f48-9608-5b1a7daf60ec/pizza1.png',
    status: 'In Stock'
  },
  {
    id: 'INV-002',
    name: 'Zinger Burger',
    category: 'Burger',
    stock: 32,
    minStock: 25,
    price: 460,
    sales: 6200,
    image: 'https://www.kfcpakistan.com/images/19b05560-bc56-11ee-97d6-7187fd7553de-Zingeratha_variant_0-2024-01-26142047.png',
    status: 'In Stock'
  },
  {
    id: 'INV-003',
    name: 'Peri Peri Wings (10pcs)',
    category: 'Wings',
    stock: 15,
    minStock: 30,
    price: 580,
    sales: 4350,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=300&auto=format&fit=crop',
    status: 'Low Stock'
  },
  {
    id: 'INV-004',
    name: 'Italian Pizza',
    category: 'Pizza',
    stock: 38,
    minStock: 20,
    price: 1150,
    sales: 9200,
    image: 'https://4xs9fttk0t.ucarecd.net/8e9b60e9-5905-4b67-bdb2-228728df8b32/slazzerpreviewtbn5f.png',
    status: 'In Stock'
  },
  {
    id: 'INV-005',
    name: 'Fillet Burger',
    category: 'Burger',
    stock: 8,
    minStock: 20,
    price: 410,
    sales: 2800,
    image: 'https://www.kfcpakistan.com/images/87ef3cb0-7be7-11f0-a76e-319aa2038f18-1-2025-08-18035759.png',
    status: 'Low Stock'
  },
  {
    id: 'INV-006',
    name: 'BBQ Wings (10pcs)',
    category: 'Wings',
    stock: 0,
    minStock: 25,
    price: 580,
    sales: 3500,
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=300&auto=format&fit=crop',
    status: 'Out of Stock'
  },
  {
    id: 'INV-007',
    name: 'Cheese Lover Pizza',
    category: 'Pizza',
    stock: 28,
    minStock: 15,
    price: 1050,
    sales: 7200,
    image: 'https://4xs9fttk0t.ucarecd.net/125001e8-76d9-4494-b327-cfbd573866f3/slazzerpreviewzu6z01.png',
    status: 'In Stock'
  },
  {
    id: 'INV-008',
    name: 'Loaded Fries',
    category: 'Fries & Sides',
    stock: 55,
    minStock: 30,
    price: 550,
    sales: 5500,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=300&auto=format&fit=crop',
    status: 'In Stock'
  },
  {
    id: 'INV-009',
    name: 'Fun Nuggets (10pcs)',
    category: 'Fries & Sides',
    stock: 12,
    minStock: 25,
    price: 580,
    sales: 3200,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=300&auto=format&fit=crop',
    status: 'Low Stock'
  },
  {
    id: 'INV-010',
    name: 'Pepsi 1.5 Liter',
    category: 'Drinks',
    stock: 0,
    minStock: 50,
    price: 220,
    sales: 4400,
    image: 'https://www.kfcpakistan.com/images/0a68d020-73c8-11f0-9aa3-ad226d559836-Pepsiltr_variant_0-2025-08-07195225.png',
    status: 'Out of Stock'
  },
  {
    id: 'INV-011',
    name: 'HNY Special Pizza',
    category: 'Pizza',
    stock: 22,
    minStock: 15,
    price: 1350,
    sales: 8100,
    image: 'https://4xs9fttk0t.ucarecd.net/43e4bd81-7b67-4452-a217-f73f0ac6589d/slazzerpreview0sos71.png',
    status: 'In Stock'
  },
  {
    id: 'INV-012',
    name: 'Quarter Broast',
    category: 'Broast',
    stock: 35,
    minStock: 20,
    price: 720,
    sales: 6300,
    image: 'https://www.kfcpakistan.com/images/32258900-7592-11f0-8081-2946661625ed-1pc-2025-08-10041432.png',
    status: 'In Stock'
  },
  {
    id: 'INV-013',
    name: 'Zinger Roll',
    category: 'Rolls & Wraps',
    stock: 18,
    minStock: 25,
    price: 480,
    sales: 3840,
    image: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?q=80&w=300&auto=format&fit=crop',
    status: 'Low Stock'
  },
  {
    id: 'INV-014',
    name: 'Economy Deal',
    category: 'Deals',
    stock: 25,
    minStock: 15,
    price: 1500,
    sales: 12000,
    image: 'https://www.kfcpakistan.com/images/98cb5e60-7688-11f0-b6cc-7b8f56c77b94-WowBoxcopy-2025-08-11075549.png',
    status: 'In Stock'
  },
  {
    id: 'INV-015',
    name: 'Mineral Water (Small)',
    category: 'Drinks',
    stock: 120,
    minStock: 80,
    price: 60,
    sales: 2400,
    image: 'https://www.dominos.com.pk/images/561f7ee0-9c0c-11ef-8241-d70815871548-Aquafina_variant_0-2024-11-06065707.jpg',
    status: 'In Stock'
  },
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

// Mock Queue Orders
export const mockQueueOrders: Order[] = [
  {
    id: '1',
    orderNumber: '1/30/2026-562',
    total: 2395.00,
    discount: 0,
    tax: 0,
    grandTotal: 2395.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'pending',
    type: 'dine-in',
    createdAt: '30-01-2026 9:09 PM',
    tableId: 'G6',
    waiterName: 'Ahmed Khan',
    items: [
      { product: { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-2', name: 'CRUNCH CRAZE ZINGER', price: 370.00, category: 'Burger', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-4', name: 'DRINK (1LTR)', price: 150.00, category: 'Drinks', image: '', available: true }, quantity: 2 },
      { product: { id: 'fries-4', name: 'LOADED FRIES', price: 550.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '2',
    orderNumber: '1/30/2026-563',
    total: 8400.00,
    discount: 0,
    tax: 0,
    grandTotal: 8400.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'pending',
    type: 'dine-in',
    createdAt: '30-01-2026 8:13 PM',
    tableId: 'G3',
    waiterName: 'Bilal Hussain',
    items: [
      { product: { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '', available: true }, quantity: 2 },
      { product: { id: 'broast-3', name: 'FULL BROAST', price: 2290.00, category: 'Broast', image: '', available: true }, quantity: 1 },
      { product: { id: 'wings-1', name: 'PERI PERI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 3 },
    ]
  },
  {
    id: '3',
    orderNumber: '1/30/2026-564',
    total: 3360.00,
    discount: 0,
    tax: 0,
    grandTotal: 3360.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'preparing',
    type: 'dine-in',
    createdAt: '30-01-2026 8:08 PM',
    tableId: 'F14',
    waiterName: 'Sohail Malik',
    items: [
      { product: { id: 'deal-4', name: 'HNY DEAL', price: 1800.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-5', name: 'FILLET BURGER', price: 410.00, category: 'Burger', image: '', available: true }, quantity: 2 },
      { product: { id: 'fries-1', name: 'FUN NUGGETS (10PCS)', price: 580.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-3', name: 'PAK DRINK (300ML)', price: 100.00, category: 'Drinks', image: '', available: true }, quantity: 2 },
    ]
  },
  {
    id: '4',
    orderNumber: '1/30/2026-565',
    total: 2290.00,
    discount: 0,
    tax: 0,
    grandTotal: 2290.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'ready',
    type: 'dine-in',
    createdAt: '30-01-2026 9:13 PM',
    tableId: 'G5',
    waiterName: 'Ahmed Khan',
    items: [
      { product: { id: 'broast-3', name: 'FULL BROAST', price: 2290.00, category: 'Broast', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '5',
    orderNumber: '1/30/2026-566',
    total: 1900.00,
    discount: 0,
    tax: 0,
    grandTotal: 1900.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'served',
    type: 'dine-in',
    createdAt: '30-01-2026 8:13 PM',
    tableId: 'G2',
    waiterName: 'Bilal Hussain',
    items: [
      { product: { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '6',
    orderNumber: '1/30/2026-567',
    total: 1900.00,
    discount: 0,
    tax: 0,
    grandTotal: 1900.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'cancelled',
    type: 'dine-in',
    createdAt: '30-01-2026 8:01 PM',
    tableId: 'F3',
    waiterName: 'Sohail Malik',
    items: [
      { product: { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '7',
    orderNumber: '1/30/2026-568',
    total: 1900.00,
    discount: 0,
    tax: 0,
    grandTotal: 1900.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'ready',
    type: 'takeaway',
    createdAt: '30-01-2026 9:01 PM',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    items: [
      { product: { id: 'deal-2', name: 'EXTREME DEAL', price: 1900.00, category: 'Deals', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '8',
    orderNumber: '1/30/2026-569',
    total: 1980.00,
    discount: 0,
    tax: 0,
    grandTotal: 1980.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'preparing',
    type: 'takeaway',
    createdAt: '30-01-2026 8:09 PM',
    customerName: 'Priya Sharma',
    customerPhone: '+91 99887 76654',
    items: [
      { product: { id: 'burger-1', name: 'KABAB STUFFER', price: 460.00, category: 'Burger', image: '', available: true }, quantity: 2 },
      { product: { id: 'wings-2', name: 'HOT WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-6', name: 'PAK DRINK TIN', price: 200.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '9',
    orderNumber: '1/30/2026-570',
    total: 1380.00,
    discount: 0,
    tax: 0,
    grandTotal: 1380.00,
    paymentMode: 'online',
    cashBack: 0,
    status: 'pending',
    type: 'delivery',
    createdAt: '30-01-2026 8:02 PM',
    customerName: 'Amit Patel',
    customerPhone: '+91 97654 32198',
    riderName: 'Zeeshan Khan',
    riderPhone: '+92 300 1111111',
    deliveryAddress: 'House #42, Street 12, Block A, Gulshan-e-Iqbal, Karachi',
    items: [
      { product: { id: 'deal-3', name: 'STUDENT DEAL', price: 850.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-5', name: 'PAK DRINK (1.5LTR)', price: 220.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '10',
    orderNumber: '1/30/2026-571',
    total: 3610.00,
    discount: 0,
    tax: 0,
    grandTotal: 3610.00,
    paymentMode: 'online',
    cashBack: 0,
    status: 'preparing',
    type: 'delivery',
    createdAt: '30-01-2026 7:45 PM',
    customerName: 'Sneha Desai',
    customerPhone: '+91 96543 21987',
    riderName: 'Bilal Ahmed',
    riderPhone: '+92 321 2222222',
    deliveryAddress: 'Apartment 5B, Tower 3, DHA Phase 6, Karachi',
    items: [
      { product: { id: 'deal-4', name: 'HNY DEAL', price: 1800.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'broast-2', name: 'HALF BROAST', price: 1230.00, category: 'Broast', image: '', available: true }, quantity: 1 },
      { product: { id: 'wings-3', name: 'BBQ WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: '11',
    orderNumber: '1/30/2026-572',
    total: 2450.00,
    discount: 0,
    tax: 0,
    grandTotal: 2450.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'ready',
    type: 'delivery',
    createdAt: '30-01-2026 7:30 PM',
    customerName: 'Vikram Singh',
    customerPhone: '+91 95432 19876',
    riderName: 'Danish Ali',
    riderPhone: '+92 345 4444444',
    deliveryAddress: 'Plot #88, Sector C, Bahria Town, Lahore',
    items: [
      { product: { id: 'burger-5', name: 'FILLET BURGER', price: 410.00, category: 'Burger', image: '', available: true }, quantity: 2 },
      { product: { id: 'wings-4', name: 'SWEET CHILLI WINGS (10PCS)', price: 580.00, category: 'Wings', image: '', available: true }, quantity: 1 },
      { product: { id: 'fries-1', name: 'FUN NUGGETS (10PCS)', price: 580.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
      { product: { id: 'burger-4', name: 'CHICKEN PATTY', price: 280.00, category: 'Burger', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-6', name: 'PAK DRINK TIN', price: 200.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
    ]
  },
];

export const mockOnlineOrders: Order[] = [
  {
    id: 'online-1',
    orderNumber: 'ONLINE-001',
    total: 1890.00,
    discount: 100,
    tax: 0,
    grandTotal: 1790.00,
    paymentMode: 'online',
    cashBack: 0,
    status: 'pending',
    type: 'delivery',
    createdAt: '30-01-2026 10:15 AM',
    customerName: 'John Doe',
    customerPhone: '+91 99887 76654',
    deliveryAddress: 'House #12, Street 3, Block B, North Nazimabad, Karachi',
    riderName: 'Asad Ali',
    riderPhone: '+92 333 1234567',
    items: [
      { product: { id: 'deal-1', name: 'ECONOMY DEAL', price: 1500.00, category: 'Deals', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-4', name: 'DRINK (1LTR)', price: 150.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
      { product: { id: 'fries-3', name: 'MASALA FRIES', price: 240.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: 'online-2',
    orderNumber: 'ONLINE-002',
    total: 2450.00,
    discount: 0,
    tax: 0,
    grandTotal: 2450.00,
    paymentMode: 'card',
    cashBack: 0,
    status: 'preparing',
    type: 'delivery',
    createdAt: '30-01-2026 10:30 AM',
    customerName: 'Jane Smith',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Flat 402, Al-Azam Tower, Gulshan-e-Iqbal, Karachi',
    riderName: 'Kashif Mehmood',
    riderPhone: '+92 300 9876543',
    items: [
      { product: { id: 'pizza-5', name: 'HNY SPECIAL PIZZA', price: 1850.00, category: 'Pizza', image: '', available: true }, quantity: 1 },
      { product: { id: 'roll-6', name: 'CHICKEN CHEESE STICK', price: 600.00, category: 'Roll & Sandwich', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: 'online-3',
    orderNumber: 'ONLINE-003',
    total: 1200.00,
    discount: 50,
    tax: 0,
    grandTotal: 1150.00,
    paymentMode: 'online',
    cashBack: 0,
    status: 'ready',
    type: 'delivery',
    createdAt: '30-01-2026 10:45 AM',
    customerName: 'Mike Johnson',
    customerPhone: '+91 91234 56789',
    deliveryAddress: 'Shop #5, Market Area, Phase 4, DHA, Karachi',
    riderName: 'Sajid Khan',
    riderPhone: '+92 321 5556667',
    items: [
      { product: { id: 'burger-2', name: 'CRUNCH CRAZE ZINGER', price: 370.00, category: 'Burger', image: '', available: true }, quantity: 2 },
      { product: { id: 'fries-4', name: 'LOADED FRIES', price: 460.00, category: 'Fries & Nuggets', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: 'online-4',
    orderNumber: 'ONLINE-004',
    total: 3200.00,
    discount: 200,
    tax: 0,
    grandTotal: 3000.00,
    paymentMode: 'cash',
    cashBack: 0,
    status: 'pending',
    type: 'delivery',
    createdAt: '30-01-2026 11:00 AM',
    customerName: 'Sarah Wilson',
    customerPhone: '+91 92345 67890',
    deliveryAddress: 'House 7-A, Street 5, Lalazar Colony, Lahore',
    riderName: 'Farhan Sheikh',
    riderPhone: '+92 345 1112223',
    items: [
      { product: { id: 'broast-3', name: 'FULL BROAST', price: 2290.00, category: 'Broast', image: '', available: true }, quantity: 1 },
      { product: { id: 'roll-1', name: 'CHILLI FLAME', price: 580.00, category: 'Roll & Sandwich', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-5', name: 'PAK DRINK (1.5LTR)', price: 330.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
    ]
  },
  {
    id: 'online-5',
    orderNumber: 'ONLINE-005',
    total: 950.00,
    discount: 0,
    tax: 0,
    grandTotal: 950.00,
    paymentMode: 'online',
    cashBack: 0,
    status: 'preparing',
    type: 'delivery',
    createdAt: '30-01-2026 11:15 AM',
    customerName: 'David Brown',
    customerPhone: '+91 93456 78901',
    deliveryAddress: 'Office 12, Corporate Hub, Gulberg, Lahore',
    riderName: 'Usman Ghani',
    riderPhone: '+92 311 9998887',
    items: [
      { product: { id: 'roll-4', name: 'BEHARI ROLL', price: 620.00, category: 'Roll & Sandwich', image: '', available: true }, quantity: 1 },
      { product: { id: 'drink-3', name: 'PAK DRINK (300ML)', price: 330.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
    ]
  },
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

export const mockRiders: Rider[] = [
  {
    id: 'R-001',
    name: 'Zeeshan Khan',
    phone: '+92 300 1111111',
    cnic: '42101-1234567-1',
    avatar: 'https://i.pravatar.cc/150?u=r1',
    vehicleType: 'bike',
    vehicleNumber: 'ABC-1234',
    cityArea: 'Gulshan-e-Iqbal, Karachi',
    joiningDate: '2023-01-15',
    status: 'busy',
    accountStatus: 'active',
    currentOrders: 1,
    activeTask: {
      orderNumber: 'ORD-5721',
      itemsCount: 3,
      totalAmount: 1850.00,
      paymentStatus: 'pending',
      items: [
        { product: { id: 'p1', name: 'Crunch Craze Zinger', price: 370.00, category: 'Burger', image: '', available: true }, quantity: 2 },
        { product: { id: 'p2', name: 'Loaded Fries', price: 550.00, category: 'Fries', image: '', available: true }, quantity: 1 },
        { product: { id: 'p3', name: 'Drink (1LTR)', price: 150.00, category: 'Drinks', image: '', available: true }, quantity: 2 }
      ],
      customerAddress: 'House 123, Street 4, Sector G-11, Islamabad'
    },
    currentLocation: {
      lat: 24.8607,
      lng: 67.0011
    },
    rating: 4.8,
    performance: {
      avgDeliveryTime: '25 min',
      completedOrders: 1240,
      completedToday: 12,
      cancelledOrders: 12,
      complaints: 2
    },
    earnings: {
      total: 45000,
      perOrderRate: 60,
      tips: 3500,
      bonus: 2000,
      penalty: 0,
      cashCollected: 15400,
      netPayable: 50500
    },
    attendance: {
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  },
  {
    id: 'R-002',
    name: 'Bilal Ahmed',
    phone: '+92 321 2222222',
    cnic: '42101-7654321-2',
    avatar: 'https://i.pravatar.cc/150?u=r2',
    vehicleType: 'bike',
    vehicleNumber: 'KHI-5678',
    cityArea: 'DHA Phase 6, Karachi',
    joiningDate: '2023-05-20',
    status: 'busy',
    accountStatus: 'active',
    currentOrders: 2,
    currentLocation: {
      lat: 24.8145,
      lng: 67.0784
    },
    rating: 4.5,
    performance: {
      avgDeliveryTime: '32 min',
      completedOrders: 850,
      completedToday: 8,
      cancelledOrders: 24,
      complaints: 5
    },
    earnings: {
      total: 32000,
      perOrderRate: 60,
      tips: 1200,
      bonus: 1000,
      penalty: 500,
      cashCollected: 8900,
      netPayable: 33700
    },
    attendance: {
      shiftStart: '10:00 AM',
      shiftEnd: '07:00 PM',
      totalHours: 9,
      lateCheckIn: true,
      isPresent: true
    }
  },
  {
    id: 'R-003',
    name: 'Kamran Akmal',
    phone: '+92 333 3333333',
    cnic: '42101-9999999-3',
    avatar: 'https://i.pravatar.cc/150?u=r3',
    vehicleType: 'cycle',
    vehicleNumber: 'N/A',
    cityArea: 'M.A Jinnah Road, Okara',
    joiningDate: '2023-08-10',
    status: 'available',
    accountStatus: 'active',
    currentOrders: 0,
    currentLocation: {
      lat: 30.8081,
      lng: 73.4458
    },
    rating: 4.2,
    performance: {
      avgDeliveryTime: '45 min',
      completedOrders: 420,
      completedToday: 5,
      cancelledOrders: 5,
      complaints: 1
    },
    earnings: {
      total: 15000,
      perOrderRate: 40,
      tips: 800,
      bonus: 500,
      penalty: 0,
      cashCollected: 3200,
      netPayable: 16300
    },
    attendance: {
      shiftStart: '11:00 AM',
      shiftEnd: '08:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  },
  {
    id: 'R-004',
    name: 'Danish Ali',
    phone: '+92 345 4444444',
    cnic: '42101-1111111-4',
    avatar: 'https://i.pravatar.cc/150?u=r4',
    vehicleType: 'bike',
    vehicleNumber: 'LE-1122',
    cityArea: 'Bahria Town, Lahore',
    joiningDate: '2023-03-05',
    status: 'busy',
    accountStatus: 'active',
    currentOrders: 1,
    activeTask: {
      orderNumber: 'ORD-8922',
      itemsCount: 5,
      totalAmount: 3450.00,
      paymentStatus: 'received',
      items: [
        { product: { id: 'p4', name: 'Economy Deal', price: 1500.00, category: 'Deals', image: '', available: true }, quantity: 1 },
        { product: { id: 'p5', name: 'Full Broast', price: 1200.00, category: 'Broast', image: '', available: true }, quantity: 1 },
        { product: { id: 'p6', name: 'Pasta (Family)', price: 750.00, category: 'Pasta', image: '', available: true }, quantity: 1 }
      ],
      customerAddress: 'Flat 402, Block 5, Gulshan-e-Iqbal, Karachi'
    },
    currentLocation: {
      lat: 31.4697,
      lng: 74.2728
    },
    rating: 4.9,
    performance: {
      avgDeliveryTime: '22 min',
      completedOrders: 1560,
      completedToday: 15,
      cancelledOrders: 8,
      complaints: 0
    },
    earnings: {
      total: 58000,
      perOrderRate: 65,
      tips: 5200,
      bonus: 4000,
      penalty: 0,
      cashCollected: 21000,
      netPayable: 67200
    },
    attendance: {
      shiftStart: '08:00 AM',
      shiftEnd: '05:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  },
  {
    id: 'R-005',
    name: 'Farhan Saeed',
    phone: '+92 312 5555555',
    cnic: '42101-5555555-5',
    avatar: 'https://i.pravatar.cc/150?u=r5',
    vehicleType: 'bike',
    vehicleNumber: 'RN-5555',
    cityArea: 'Saddar, Karachi',
    joiningDate: '2023-11-12',
    status: 'offline',
    accountStatus: 'blocked',
    currentOrders: 0,
    currentLocation: {
      lat: 24.8586,
      lng: 67.0095
    },
    rating: 3.6,
    performance: {
      avgDeliveryTime: '40 min',
      completedOrders: 120,
      completedToday: 0,
      cancelledOrders: 45,
      complaints: 15
    },
    earnings: {
      total: 5000,
      perOrderRate: 50,
      tips: 100,
      bonus: 0,
      penalty: 2000,
      cashCollected: 1200,
      netPayable: 3100
    },
    attendance: {
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      totalHours: 0,
      lateCheckIn: false,
      isPresent: false
    }
  },
  {
    id: 'R-006',
    name: 'Hassan Nisar',
    phone: '+92 301 6666666',
    cnic: '42101-6666666-6',
    avatar: 'https://i.pravatar.cc/150?u=r6',
    vehicleType: 'others',
    vehicleNumber: 'APP-666',
    cityArea: 'Model Town, Lahore',
    joiningDate: '2023-02-14',
    status: 'on-break',
    accountStatus: 'active',
    currentOrders: 0,
    currentLocation: {
      lat: 31.4822,
      lng: 74.3163
    },
    rating: 4.7,
    performance: {
      avgDeliveryTime: '28 min',
      completedOrders: 980,
      completedToday: 7,
      cancelledOrders: 10,
      complaints: 3
    },
    earnings: {
      total: 38000,
      perOrderRate: 60,
      tips: 2100,
      bonus: 1500,
      penalty: 0,
      cashCollected: 11200,
      netPayable: 41600
    },
    attendance: {
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  },
  {
    id: 'R-007',
    name: 'Asif Ali',
    phone: '+92 300 7777777',
    cnic: '42101-7777777-7',
    avatar: 'https://i.pravatar.cc/150?u=r7',
    vehicleType: 'bike',
    vehicleNumber: 'KHI-7777',
    cityArea: 'Gulberg, Lahore',
    joiningDate: '2024-01-01',
    status: 'busy',
    accountStatus: 'active',
    currentOrders: 1,
    currentLocation: {
    lat: 31.5204, 
    lng: 74.3587
},
    activeTask: {
      orderNumber: 'ORD-1234',
      itemsCount: 2,
      totalAmount: 920.00,
      paymentStatus: 'pending',
      items: [
        { product: { id: 'p7', name: 'Zinger Burger', price: 460.00, category: 'Burger', image: '', available: true }, quantity: 2 },
        { product: { id: 'p8', name: 'Regular Fries', price: 250.00, category: 'Sides', image: '', available: true }, quantity: 1 }
      ],
      customerAddress: 'Gulberg III, Lahore'
    },
    // currentLocation: {
    //   lat: 31.5204,
    //   lng: 74.3587
    // },
    rating: 4.6,
    performance: {
      avgDeliveryTime: '30 min',
      completedOrders: 50,
      completedToday: 3,
      cancelledOrders: 1,
      complaints: 0
    },
    earnings: {
      total: 3000,
      perOrderRate: 60,
      tips: 200,
      bonus: 0,
      penalty: 0,
      cashCollected: 1200,
      netPayable: 3200
    },
    attendance: {
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  },
  {
    id: 'R-008',
    name: 'Salman Ahmed',
    phone: '+92 344 8888888',
    cnic: '42101-8888888-8',
    avatar: 'https://i.pravatar.cc/150?u=r8',
    vehicleType: 'bike',
    vehicleNumber: 'LHR-8888',
    cityArea: 'Johar Town, Lahore',
    joiningDate: '2024-02-01',
    status: 'busy',
    accountStatus: 'active',
    currentOrders: 1,
        currentLocation: {
    lat: 31.5204, 
    lng: 74.3587
},
    activeTask: {
      orderNumber: 'ORD-5678',
      itemsCount: 3,
      totalAmount: 1250.00,
      paymentStatus: 'pending',
      items: [
        { product: { id: 'p9', name: 'Chicken Pizza Medium', price: 850.00, category: 'Pizza', image: '', available: true }, quantity: 1 },
        { product: { id: 'p10', name: 'Cold Drink 1.5L', price: 200.00, category: 'Drinks', image: '', available: true }, quantity: 1 },
        { product: { id: 'p11', name: 'Garlic Bread', price: 200.00, category: 'Sides', image: '', available: true }, quantity: 1 }
      ],
      customerAddress: 'Apartment 12B, Block R, Johar Town, Lahore'
    },
    rating: 4.7,
    performance: {
      avgDeliveryTime: '28 min',
      completedOrders: 10,
      completedToday: 2,
      cancelledOrders: 0,
      complaints: 0
    },
    earnings: {
      total: 1000,
      perOrderRate: 60,
      tips: 150,
      bonus: 0,
      penalty: 0,
      cashCollected: 500,
      netPayable: 1150
    },
    attendance: {
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      totalHours: 9,
      lateCheckIn: false,
      isPresent: true
    }
  }
];


// Helper function to generate mock history orders
const generateMockHistoryOrders = () => {
  const orders: any[] = [];
  const statuses = ['pending', 'completed', 'cancelled', 'refunded'];
  const types = ['dine-in', 'takeaway', 'delivery'];
  const customerNames = ['John Doe', 'Jane Smith', 'Ali Khan', 'Sarah Wilson', 'Fatima Ahmed', 'Bilal Hassan', 'Ayesha Malik', 'Usman Gondal'];
  const waiterNames = ['Ahmed Khan', 'Bilal Hussain', 'Sohail Malik', 'Raza Ali'];

  // 15 days ago from today
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate ~5 orders per day
    const ordersPerDay = 5 + Math.floor(Math.random() * 3); // 5 to 7 orders

    for (let j = 0; j < ordersPerDay; j++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const customer = customerNames[Math.floor(Math.random() * customerNames.length)];

      // Generate items
      const numItems = 1 + Math.floor(Math.random() * 4);
      const items = [];
      let subtotal = 0;

      for (let k = 0; k < numItems; k++) {
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const quantity = 1 + Math.floor(Math.random() * 2);
        items.push({
          name: product.name,
          price: product.price,
          quantity: quantity
        });
        subtotal += product.price * quantity;
      }

      const tax = subtotal * 0.16; // 16% tax
      const discount = Math.random() > 0.7 ? subtotal * 0.1 : 0;
      const grandTotal = subtotal + tax - discount;

      const hour = 12 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      const timeStr = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

      const orderDate = `${dateStr} ${timeStr}`;

      // Calculate completed/refunded times
      const completedTime = new Date(new Date(orderDate).getTime() + 45 * 60000); // +45 mins
      const completedAt = `${completedTime.toISOString().split('T')[0]} ${completedTime.getHours() > 12 ? completedTime.getHours() - 12 : completedTime.getHours()}:${completedTime.getMinutes().toString().padStart(2, '0')} ${completedTime.getHours() >= 12 ? 'PM' : 'AM'}`;

      // Basic order structure
      const order: any = {
        id: `h-${i}-${j}`,
        orderNumber: `ORD-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${100 + j}`,
        customerName: customer,
        customerPhone: `+92 300 ${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: status,
        type: type,
        items: items,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        grandTotal: grandTotal,
        createdAt: orderDate,
        completedAt: (status === 'completed' || status === 'refunded') ? completedAt : '',
        paymentMethod: Math.random() > 0.5 ? 'Cash' : 'Card',
      };

      if (status === 'refunded') {
        order.refundedAt = completedAt;
        order.refundReason = 'Quality Issue';
      }

      if (status === 'cancelled') {
        order.cancellationReason = 'Customer changed mind';
      }

      if (type === 'dine-in') {
        order.tableId = `Table ${1 + Math.floor(Math.random() * 15)}`;
        order.waiterName = waiterNames[Math.floor(Math.random() * waiterNames.length)];
      } else if (type === 'delivery') {
        const rider = mockRiders[Math.floor(Math.random() * mockRiders.length)];
        order.riderName = rider.name;
        order.riderPhone = rider.phone;
        order.deliveryAddress = 'Some Address Block A';
      }

      orders.push(order);
    }
  }
  return orders;
};

export const mockHistoryOrders = generateMockHistoryOrders();
