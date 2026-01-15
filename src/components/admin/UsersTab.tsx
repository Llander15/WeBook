import { UserMinus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

export const UsersTab = () => {
  const { users, setUsers, user: currentUser, updateUserRole, deleteUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (userId: number) => {
    const target = users.find((u) => u.id === userId);
    
    if (!target) return;
    
    if (target.id === currentUser?.id) {
      toast.error("Cannot change your own role");
      return;
    }
    
    const newRole = target.role === 'admin' ? 'user' : 'admin';
    
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) throw new Error('Failed to update role');
      
      updateUserRole(userId, newRole);
      toast.success(`Updated ${target.name} to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentUser?.id) {
      toast.error("Cannot delete your own account while logged in");
      return;
    }
    
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      deleteUser(userId);
      toast.success(`Account for ${target.name} has been deleted`);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="max-w-5xl space-y-4">
      <h3 className="text-xl font-black mb-4">Manage Access</h3>
      
      {isLoading ? (
        <div className="bg-card rounded-3xl border border-border p-8 text-center text-muted-foreground">
          Loading users...
        </div>
      ) : (
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
      )}
    </div>
  );
};
