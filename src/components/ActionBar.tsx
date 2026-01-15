import { useStore } from '@/store/useStore';

export const ActionBar = () => {
  const { 
    view, 
    pendingStocks, 
    pendingUserCart, 
    clearPendingStocks, 
    clearPendingUserCart,
    confirmStockChanges,
    confirmCartChanges
  } = useStore();
  
  const stockChangesCount = Object.keys(pendingStocks).length;
  const cartChangesCount = Object.keys(pendingUserCart).length;
  
  const showAdminBar = view === 'admin' && stockChangesCount > 0;
  const showUserBar = view === 'home' && cartChangesCount > 0;
  
  if (!showAdminBar && !showUserBar) return null;

  const handleConfirm = () => {
    if (showAdminBar) {
      confirmStockChanges();
    } else {
      confirmCartChanges();
    }
  };

  const handleCancel = () => {
    if (showAdminBar) {
      clearPendingStocks();
    } else {
      clearPendingUserCart();
    }
  };

  const text = showAdminBar 
    ? `${stockChangesCount} stock change(s) pending`
    : `${cartChangesCount} items changed in bag`;

  return (
    <div className="action-bar animate-fade-in">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-primary">
          Unsaved Changes
        </span>
        <span className="text-sm font-bold">{text}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-xs font-bold hover:bg-muted/20 rounded-lg transition-colors"
        >
          Discard
        </button>
        <button
          onClick={handleConfirm}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-xs font-black rounded-lg transition-all"
        >
          Confirm & Save
        </button>
      </div>
    </div>
  );
};
