import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import CommentsPage from './pages/Comments';
import CategoriesPage from './pages/Categories';
import InventoryPage from './pages/Inventory';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'comments':
        return <CommentsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="lg:pl-64">
        <Navbar currentPage={currentPage} />
        <main className="p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
