import { useStore } from '@/store/useStore';
import { InventoryTab } from '@/components/admin/InventoryTab';
import { UsersTab } from '@/components/admin/UsersTab';

export const AdminView = () => {
  const { adminSubView, setAdminSubView } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setAdminSubView('inventory')}
            className={`pb-4 font-bold text-sm transition-colors ${
              adminSubView === 'inventory'
                ? 'tab-active'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Inventory & Catalog
          </button>
          <button
            onClick={() => setAdminSubView('users')}
            className={`pb-4 font-bold text-sm transition-colors ${
              adminSubView === 'users'
                ? 'tab-active'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            User Accounts
          </button>
        </div>
      </div>

      {/* Content */}
      {adminSubView === 'inventory' ? <InventoryTab /> : <UsersTab />}
    </div>
  );
};
