import { Product, Category, Warranty, Order, Review, InventoryLog } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Computing',
    description: 'High-performance laptops, desktops, and computing accessories.',
    image: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=600&q=80',
    status: 'Active',
  },
  {
    id: 'cat-2',
    name: 'Wearables',
    description: 'Smartwatches, fitness trackers, and wearable technology.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    status: 'Active',
  },
  {
    id: 'cat-3',
    name: 'Accessories',
    description: 'Audio gear, chargers, cables, and peripheral essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    status: 'Active',
  },
  {
    id: 'cat-4',
    name: 'Smart Home',
    description: 'Intelligent lighting, speakers, security, and home automation.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    status: 'Active',
  },
  {
    id: 'cat-5',
    name: 'Mobile Devices',
    description: 'Smartphones, tablets, and mobile computing gear.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    status: 'Inactive',
  }
];

export const initialWarranties: Warranty[] = [
  {
    id: 'war-1',
    name: '1-Year Standard Warranty',
    duration: '12 Months',
    type: 'Manufacturer',
    status: 'Active',
  },
  {
    id: 'war-2',
    name: '2-Year Gold Protection',
    duration: '24 Months',
    type: 'Extended',
    status: 'Active',
  },
  {
    id: 'war-3',
    name: 'Lifetime Hardware Coverage',
    duration: 'Lifetime',
    type: 'Lifetime',
    status: 'Active',
  },
  {
    id: 'war-4',
    name: '6-Month Refurbished Warranty',
    duration: '6 Months',
    type: 'Manufacturer',
    status: 'Inactive',
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'UltraBook Pro 15',
    sku: 'UB-PRO15-01',
    price: 1299.99,
    salePrice: 1199.99,
    quantity: 12,
    description: 'Thin, light, and powerful notebook with a 15-inch Retina display, Intel Core i7, 16GB RAM, and 512GB SSD. Engineered for professionals and creators.',
    category: 'Computing',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-1',
    variants: ['Space Gray', 'Silver', '16GB RAM', '32GB RAM'],
  },
  {
    id: 'prod-2',
    name: 'AcousticNoise Wireless Over-Ear',
    sku: 'AN-WLHP-02',
    price: 299.99,
    salePrice: 249.99,
    quantity: 45,
    description: 'Industry-leading active noise canceling headphones with 30-hour battery life, high-fidelity sound, and touch sensor controls.',
    category: 'Accessories',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-2',
    variants: ['Matte Black', 'Sandstone', 'Midnight Blue'],
  },
  {
    id: 'prod-3',
    name: 'FitPulse Smartwatch v4',
    sku: 'FP-SMWV4-03',
    price: 199.99,
    salePrice: 179.99,
    quantity: 4, // Low Stock Alert
    description: 'Advanced fitness watch with continuous heart rate monitoring, GPS tracking, sleep analysis, and water resistance up to 50m.',
    category: 'Wearables',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-1',
    variants: ['Black Sport', 'Rose Gold', 'Ocean Blue'],
  },
  {
    id: 'prod-4',
    name: 'ChargeStream Duo Wireless Pad',
    sku: 'CS-DWP-04',
    price: 59.99,
    salePrice: 49.99,
    quantity: 85,
    description: 'Fast-charging dual Qi wireless charging pad. Charge your phone and wireless earbuds simultaneously with sleek, fabric-covered design.',
    category: 'Accessories',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-1',
    variants: ['Charcoal', 'White'],
  },
  {
    id: 'prod-5',
    name: 'SmartAmbient LED Bulb Pack',
    sku: 'SA-LEDB-05',
    price: 39.99,
    salePrice: 34.99,
    quantity: 0, // Out of Stock
    description: 'Pack of 4 smart color-changing LED bulbs. Compatible with Alexa, Google Home, and Siri. Syncs with music and schedules.',
    category: 'Smart Home',
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-1',
    variants: ['A19 E26 Fitting', 'GU10 Fitting'],
  },
  {
    id: 'prod-6',
    name: 'Mechanical Tactile Keyboard',
    sku: 'ME-TCKB-06',
    price: 149.99,
    salePrice: 129.99,
    quantity: 18,
    description: 'Tenkeyless mechanical keyboard with hot-swappable tactile switches, aluminum top case, PBT keycaps, and customizable RGB backlighting.',
    category: 'Computing',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-3',
    variants: ['Brown Switches', 'Red Switches', 'Blue Switches'],
  },
  {
    id: 'prod-7',
    name: 'Spherical Pro Smart Speaker',
    sku: 'SP-SPSP-07',
    price: 99.99,
    salePrice: 89.99,
    quantity: 3, // Low Stock Alert
    description: 'Compact smart speaker with premium 360-degree sound. Ask voice assistants to play music, answer questions, read news, and control smart home.',
    category: 'Smart Home',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-1',
    variants: ['Chalk White', 'Charcoal Black'],
  },
  {
    id: 'prod-8',
    name: 'ProStream 4K Webcam',
    sku: 'PS-4KWC-08',
    price: 179.99,
    salePrice: 159.99,
    quantity: 25,
    description: 'Ultra-high definition web camera with HDR, autofocus, dual omnidirectional microphones, and tripod mount. Ideal for streaming and meetings.',
    category: 'Accessories',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    warrantyId: 'war-2',
    variants: ['Standard Mount', 'Ring Light Bundle'],
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-9842',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    phone: '+1 (555) 234-5678',
    shippingAddress: '128 Aspen Dr, San Francisco, CA 94102',
    orderDate: '2026-03-01T14:22:00Z',
    orderStatus: 'Pending',
    paymentStatus: 'Paid',
    totalAmount: 1449.98,
    items: [
      { productId: 'prod-1', name: 'UltraBook Pro 15', quantity: 1, price: 1199.99 },
      { productId: 'prod-2', name: 'AcousticNoise Wireless Over-Ear', quantity: 1, price: 249.99 }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-9841',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    shippingAddress: '402 Elm St, Seattle, WA 98101',
    orderDate: '2026-02-28T09:15:00Z',
    orderStatus: 'Shipped',
    paymentStatus: 'Paid',
    totalAmount: 179.99,
    items: [
      { productId: 'prod-3', name: 'FitPulse Smartwatch v4', quantity: 1, price: 179.99 }
    ]
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-9840',
    customerName: 'Michael Chang',
    customerEmail: 'm.chang@example.com',
    phone: '+1 (555) 456-7890',
    shippingAddress: '88 Eighth Ave, New York, NY 10011',
    orderDate: '2026-02-27T18:45:00Z',
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    totalAmount: 298.98,
    items: [
      { productId: 'prod-8', name: 'ProStream 4K Webcam', quantity: 1, price: 159.99 },
      { productId: 'prod-6', name: 'Mechanical Tactile Keyboard', quantity: 1, price: 129.99 }
    ]
  },
  {
    id: 'ord-4',
    orderNumber: 'ORD-9839',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rod@example.com',
    phone: '+1 (555) 321-7654',
    shippingAddress: '714 Sunset Blvd, Los Angeles, CA 90028',
    orderDate: '2026-02-26T11:04:00Z',
    orderStatus: 'Processing',
    paymentStatus: 'Unpaid',
    totalAmount: 34.99,
    items: [
      { productId: 'prod-5', name: 'SmartAmbient LED Bulb Pack', quantity: 1, price: 34.99 }
    ]
  },
  {
    id: 'ord-5',
    orderNumber: 'ORD-9838',
    customerName: 'David Kim',
    customerEmail: 'david.kim@example.com',
    phone: '+1 (555) 654-3210',
    shippingAddress: '150 Oak St, Chicago, IL 60611',
    orderDate: '2026-02-24T15:30:00Z',
    orderStatus: 'Cancelled',
    paymentStatus: 'Refunded',
    totalAmount: 249.99,
    items: [
      { productId: 'prod-2', name: 'AcousticNoise Wireless Over-Ear', quantity: 1, price: 249.99 }
    ]
  },
  {
    id: 'ord-6',
    orderNumber: 'ORD-9837',
    customerName: 'Jessica Taylor',
    customerEmail: 'jess.taylor@example.com',
    phone: '+1 (555) 876-5432',
    shippingAddress: '239 Pine Rd, Austin, TX 78701',
    orderDate: '2026-02-22T08:20:00Z',
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    totalAmount: 399.98,
    items: [
      { productId: 'prod-7', name: 'Spherical Pro Smart Speaker', quantity: 1, price: 89.99 },
      { productId: 'prod-6', name: 'Mechanical Tactile Keyboard', quantity: 1, price: 129.99 },
      { productId: 'prod-3', name: 'FitPulse Smartwatch v4', quantity: 1, price: 179.99 }
    ]
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'UltraBook Pro 15',
    customerName: 'John Doe',
    rating: 5,
    reviewText: 'The UltraBook Pro 15 is exceptionally fast, the Retina display is absolutely gorgeous, and battery life easily gets me through a full day of heavy coding. Highly recommended for software developers.',
    status: 'Approved',
    date: '2026-03-01T15:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'AcousticNoise Wireless Over-Ear',
    customerName: 'Sarah Jenkins',
    rating: 4,
    reviewText: 'Sound cancellation is superb, making my train commutes wonderfully quiet. The audio is crisp with balanced bass. The only reason it’s not 5 stars is it feels slightly tight after wearing for 3+ hours.',
    status: 'Approved',
    date: '2026-02-28T10:45:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    productName: 'FitPulse Smartwatch v4',
    customerName: 'Robert Chen',
    rating: 2,
    reviewText: 'The heart rate monitor works well, but the battery life is disappointing. It barely lasts 36 hours before needing a charge, and the sync with my phone is sluggish. Will likely return it.',
    status: 'Pending',
    date: '2026-02-28T21:12:00Z'
  },
  {
    id: 'rev-4',
    productId: 'prod-6',
    productName: 'Mechanical Tactile Keyboard',
    customerName: 'Alice Vance',
    rating: 5,
    reviewText: 'Incredible keyboard! The tactile bump on the brown switches is perfect, and the metal housing feels premium and heavy. Keycaps feel great under the fingers, and the RGB customization is top tier!',
    status: 'Approved',
    date: '2026-02-27T19:50:00Z'
  },
  {
    id: 'rev-5',
    productId: 'prod-5',
    productName: 'SmartAmbient LED Bulb Pack',
    customerName: 'Clara Oswald',
    rating: 3,
    reviewText: 'The light colors are beautiful and bright, and it syncs nicely with Google Home. However, one of the bulbs occasionally drops Wi-Fi connection and has to be reset. Decent product overall.',
    status: 'Pending',
    date: '2026-02-26T14:35:00Z'
  },
  {
    id: 'rev-6',
    productId: 'prod-8',
    productName: 'ProStream 4K Webcam',
    customerName: 'Mark Thompson',
    rating: 5,
    reviewText: 'Excellent image quality even in low light. The autofocus is fast and doesn’t hunt. The built-in microphones are surprisingly good, though I still use my dedicated mic. Best webcam on the market.',
    status: 'Approved',
    date: '2026-02-25T11:22:00Z'
  }
];

export const initialInventoryLogs: InventoryLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    productName: 'UltraBook Pro 15',
    sku: 'UB-PRO15-01',
    type: 'Restock',
    quantityChanged: 10,
    newQuantity: 12,
    reason: 'Received standard monthly replenishment shipment',
    date: '2026-02-27T08:00:00Z'
  },
  {
    id: 'log-2',
    productId: 'prod-2',
    productName: 'AcousticNoise Wireless Over-Ear',
    sku: 'AN-WLHP-02',
    type: 'Sale',
    quantityChanged: -1,
    newQuantity: 45,
    reason: 'Fulfilled Order #ORD-9842',
    date: '2026-03-01T14:22:00Z'
  },
  {
    id: 'log-3',
    productId: 'prod-3',
    productName: 'FitPulse Smartwatch v4',
    sku: 'FP-SMWV4-03',
    type: 'Sale',
    quantityChanged: -1,
    newQuantity: 4,
    reason: 'Fulfilled Order #ORD-9841',
    date: '2026-02-28T09:15:00Z'
  },
  {
    id: 'log-4',
    productId: 'prod-5',
    productName: 'SmartAmbient LED Bulb Pack',
    sku: 'SA-LEDB-05',
    type: 'Decrease',
    quantityChanged: -5,
    newQuantity: 0,
    reason: 'Damaged in warehouse transit (water leak)',
    date: '2026-02-25T16:40:00Z'
  },
  {
    id: 'log-5',
    productId: 'prod-7',
    productName: 'Spherical Pro Smart Speaker',
    sku: 'SP-SPSP-07',
    type: 'Restock',
    quantityChanged: 5,
    newQuantity: 6,
    reason: 'Restocked from local distributor',
    date: '2026-02-22T10:15:00Z'
  },
  {
    id: 'log-6',
    productId: 'prod-7',
    productName: 'Spherical Pro Smart Speaker',
    sku: 'SP-SPSP-07',
    type: 'Sale',
    quantityChanged: -3,
    newQuantity: 3,
    reason: 'Fulfilled Order #ORD-9837',
    date: '2026-02-22T08:20:00Z'
  }
];
