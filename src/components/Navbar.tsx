import { BookOpen, Search, ShoppingBag, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Navbar = () => {
  const { 
    user, 
    cart, 
    view, 
    searchQuery, 
    setView, 
    setUser, 
    setSearchQuery, 
    setAuthMode,
    clearCart 
  } = useStore();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = () => {
    setView(user?.role === 'admin' ? 'admin' : 'home');
  };

  const handleCartClick = () => {
    if (!user) {
      setAuthMode('login');
      setView('login');
    } else {
      setView('cart');
    }
  };

  const handleLogout = () => {
    setUser(null);
    clearCart();
    setView('home');
  };

  const handleLogin = () => {
    setAuthMode('login');
    setView('login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="ml-2 text-2xl font-extrabold tracking-tight">
              WeBook
            </span>
          </div>

          {/* Search */}
          {view === 'home' && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  placeholder="Search bookstore..."
                />
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart button */}
            <button 
              onClick={handleCartClick}
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-destructive rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth controls */}
            <div className="flex items-center space-x-2 border-l pl-4 border-border">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs font-bold">{user.name}</p>
                    <p className="text-[9px] uppercase text-primary font-black">
                      {user.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-muted rounded-full hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-sm font-extrabold bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
