import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Warranty, Order, Review, InventoryLog, ToastMessage } from '../types';
import { api, fetchSystemStatus } from '../services/api';

interface AppContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  warranties: Warranty[];
  reviews: Review[];
  inventoryLogs: InventoryLog[];
  systemStatus: any;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  isLoading: {
    products: boolean;
    categories: boolean;
    orders: boolean;
    warranties: boolean;
    reviews: boolean;
    inventoryLogs: boolean;
    global: boolean;
  };
  
  // Actions
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Warranty actions
  addWarranty: (warranty: Omit<Warranty, 'id'>) => Promise<boolean>;
  updateWarranty: (id: string, warranty: Partial<Warranty>) => Promise<boolean>;
  deleteWarranty: (id: string) => Promise<boolean>;
  
  // Order actions
  updateOrderStatus: (id: string, status: Order['orderStatus']) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  
  // Review actions
  approveReview: (id: string) => Promise<boolean>;
  rejectReview: (id: string) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  
  // Inventory actions
  adjustStock: (productId: string, amount: number, reason: string) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [isLoading, setIsLoading] = useState({
    products: true,
    categories: true,
    orders: true,
    warranties: true,
    reviews: true,
    inventoryLogs: true,
    global: true,
  });

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle responsive sidebar behavior on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all initial data from mock API
  const fetchAllData = async () => {
    setIsLoading(prev => ({ ...prev, global: true }));
    try {
      const [prods, cats, wars, ords, revs, logs, sys] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getWarranties(),
        api.getOrders(),
        api.getReviews(),
        api.getInventoryLogs(),
        fetchSystemStatus(),
      ]);
      
      setProducts(prods);
      setCategories(cats);
      setWarranties(wars);
      setOrders(ords);
      setReviews(revs);
      setInventoryLogs(logs);
      setSystemStatus(sys);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      addToast('error', 'Failed to load dashboard data. Please refresh.');
    } finally {
      setIsLoading({
        products: false,
        categories: false,
        orders: false,
        warranties: false,
        reviews: false,
        inventoryLogs: false,
        global: false,
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshAllData = async () => {
    await fetchAllData();
    addToast('success', 'Dashboard metrics synchronized successfully.');
  };

  // Theme action
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast actions
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // PRODUCT CRUD
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    setIsLoading(prev => ({ ...prev, products: true }));
    try {
      const newProd = await api.createProduct(productData);
      setProducts(prev => [newProd, ...prev]);
      
      // Update inventory logs state
      const updatedLogs = await api.getInventoryLogs();
      setInventoryLogs(updatedLogs);

      addToast('success', `Product "${newProd.name}" created successfully with SKU ${newProd.sku}.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to create product.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setIsLoading(prev => ({ ...prev, products: true }));
    try {
      const updatedProd = await api.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProd : p));
      
      // Update inventory logs state in case quantity was updated
      const updatedLogs = await api.getInventoryLogs();
      setInventoryLogs(updatedLogs);

      addToast('success', `Product "${updatedProd.name}" updated successfully.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to update product.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(prev => ({ ...prev, products: true }));
    try {
      const success = await api.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        addToast('success', 'Product deleted successfully.');
        return true;
      }
      return false;
    } catch (err) {
      addToast('error', 'Failed to delete product.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  };

  // CATEGORY CRUD
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    setIsLoading(prev => ({ ...prev, categories: true }));
    try {
      const newCat = await api.createCategory(categoryData);
      setCategories(prev => [newCat, ...prev]);
      addToast('success', `Category "${newCat.name}" added successfully.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to add category.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    setIsLoading(prev => ({ ...prev, categories: true }));
    try {
      const updatedCat = await api.updateCategory(id, categoryData);
      setCategories(prev => prev.map(c => c.id === id ? updatedCat : c));
      addToast('success', `Category "${updatedCat.name}" updated successfully.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to update category.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(prev => ({ ...prev, categories: true }));
    try {
      const categoryToDelete = categories.find(c => c.id === id);
      const isUsed = products.some(p => p.category === categoryToDelete?.name);
      if (isUsed) {
        addToast('error', `Cannot delete "${categoryToDelete?.name}" because it is currently assigned to one or more products.`);
        return false;
      }

      const success = await api.deleteCategory(id);
      if (success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        addToast('success', 'Category deleted successfully.');
        return true;
      }
      return false;
    } catch (err) {
      addToast('error', 'Failed to delete category.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // WARRANTY CRUD
  const addWarranty = async (warrantyData: Omit<Warranty, 'id'>) => {
    setIsLoading(prev => ({ ...prev, warranties: true }));
    try {
      const newWar = await api.createWarranty(warrantyData);
      setWarranties(prev => [newWar, ...prev]);
      addToast('success', `Warranty policy "${newWar.name}" created.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to create warranty.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, warranties: false }));
    }
  };

  const updateWarranty = async (id: string, warrantyData: Partial<Warranty>) => {
    setIsLoading(prev => ({ ...prev, warranties: true }));
    try {
      const updatedWar = await api.updateWarranty(id, warrantyData);
      setWarranties(prev => prev.map(w => w.id === id ? updatedWar : w));
      addToast('success', `Warranty "${updatedWar.name}" updated.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to update warranty.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, warranties: false }));
    }
  };

  const deleteWarranty = async (id: string) => {
    setIsLoading(prev => ({ ...prev, warranties: true }));
    try {
      // Check if warranty is used by products
      const isUsed = products.some(p => p.warrantyId === id);
      if (isUsed) {
        addToast('warning', 'This warranty is assigned to some products. Please reassign those products first.');
        return false;
      }

      const success = await api.deleteWarranty(id);
      if (success) {
        setWarranties(prev => prev.filter(w => w.id !== id));
        addToast('success', 'Warranty policy deleted successfully.');
        return true;
      }
      return false;
    } catch (err) {
      addToast('error', 'Failed to delete warranty.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, warranties: false }));
    }
  };

  // ORDER ACTIONS
  const updateOrderStatus = async (id: string, status: Order['orderStatus']) => {
    setIsLoading(prev => ({ ...prev, orders: true }));
    try {
      const updatedOrder = await api.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      
      // Refresh products and logs in case order was cancelled (returns stock)
      if (status === 'Cancelled') {
        const [prods, logs] = await Promise.all([api.getProducts(), api.getInventoryLogs()]);
        setProducts(prods);
        setInventoryLogs(logs);
        addToast('info', `Order ${updatedOrder.orderNumber} cancelled. Items restocked into inventory.`);
      } else {
        addToast('success', `Order ${updatedOrder.orderNumber} status updated to ${status}.`);
      }
      
      return true;
    } catch (err) {
      addToast('error', 'Failed to update order status.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const deleteOrder = async (id: string) => {
    setIsLoading(prev => ({ ...prev, orders: true }));
    try {
      const success = await api.deleteOrder(id);
      if (success) {
        setOrders(prev => prev.filter(o => o.id !== id));
        addToast('success', 'Order deleted from records.');
        return true;
      }
      return false;
    } catch (err) {
      addToast('error', 'Failed to delete order.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // REVIEW ACTIONS
  const approveReview = async (id: string) => {
    setIsLoading(prev => ({ ...prev, reviews: true }));
    try {
      const updatedReview = await api.updateReviewStatus(id, 'Approved');
      setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
      addToast('success', `Review by ${updatedReview.customerName} approved and published.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to approve review.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const rejectReview = async (id: string) => {
    setIsLoading(prev => ({ ...prev, reviews: true }));
    try {
      const updatedReview = await api.updateReviewStatus(id, 'Rejected');
      setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
      addToast('info', `Review by ${updatedReview.customerName} rejected.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to reject review.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const deleteReview = async (id: string) => {
    setIsLoading(prev => ({ ...prev, reviews: true }));
    try {
      const success = await api.deleteReview(id);
      if (success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        addToast('success', 'Review deleted.');
        return true;
      }
      return false;
    } catch (err) {
      addToast('error', 'Failed to delete review.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  // INVENTORY ACTIONS
  const adjustStock = async (productId: string, amount: number, reason: string) => {
    setIsLoading(prev => ({ ...prev, inventoryLogs: true, products: true }));
    try {
      const updatedProduct = await api.adjustStock(productId, amount, reason);
      
      // Update products state
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      
      // Update inventory logs state
      const logs = await api.getInventoryLogs();
      setInventoryLogs(logs);
      
      const typeText = amount > 0 ? 'increased' : 'decreased';
      addToast('success', `Stock for ${updatedProduct.name} ${typeText} by ${Math.abs(amount)}. New quantity: ${updatedProduct.quantity}.`);
      return true;
    } catch (err) {
      addToast('error', 'Failed to adjust stock level.');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, inventoryLogs: false, products: false }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        orders,
        warranties,
        reviews,
        inventoryLogs,
        systemStatus,
        theme,
        sidebarOpen,
        toasts,
        isLoading,
        
        toggleTheme,
        setSidebarOpen,
        addToast,
        removeToast,
        
        addProduct,
        updateProduct,
        deleteProduct,
        
        addCategory,
        updateCategory,
        deleteCategory,
        
        addWarranty,
        updateWarranty,
        deleteWarranty,
        
        updateOrderStatus,
        deleteOrder,
        
        approveReview,
        rejectReview,
        deleteReview,
        
        adjustStock,
        refreshAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
