import { UserMinus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export const UsersTab = () => {
  const { users, user: currentUser, updateUserRole, deleteUser } = useStore();

  const handleToggleRole = (userId: number) => {
    const target = users.find((u) => u.id === userId);
    
    if (!target) return;
    
    if (target.id === currentUser?.id) {
      toast.error("Cannot change your own role");
      return;
    }
    
    const newRole = target.role === 'admin' ? 'user' : 'admin';
    updateUserRole(userId, newRole);
    toast.success(`Updated ${target.name} to ${newRole}`);
  };

  const handleDeleteUser = (userId: number) => {
    if (userId === currentUser?.id) {
      toast.error("Cannot delete your own account while logged in");
      return;
    }
    
    const target = users.find((u) => u.id === userId);
    if (target) {
      deleteUser(userId);
      toast.success(`Account for ${target.name} has been deleted`);
    }
  };

  return (
    <div className="max-w-5xl space-y-4">
      <h3 className="text-xl font-black mb-4">Manage Access</h3>
      
      <div className="bg-card rounded-3xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-[10px] font-black uppercase text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr
                key={u.id}
                className="group hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">
                    {u.name}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-[8px] bg-foreground text-background px-1.5 py-0.5 rounded tracking-widest">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      u.role === 'admin' ? 'role-badge-admin' : 'role-badge-user'
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => handleToggleRole(u.id)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Promote/Demote
                    </button>
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-destructive/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    )}
                    {u.id === currentUser?.id && <div className="w-8" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
