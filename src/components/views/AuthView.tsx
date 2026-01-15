import { FormEvent, useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export const AuthView = () => {
  const { authMode, setAuthMode, setUser, setView, users, addUser } = useStore();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const isLogin = authMode === 'login';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const { email, fullname } = formData;
    const name = fullname || email.split('@')[0];
    
    let existing = users.find((u) => u.email === email);
    
    if (!existing) {
      const newUser = {
        id: Date.now(),
        name,
        email,
        role: email.includes('admin') ? 'admin' as const : 'user' as const,
      };
      addUser(newUser);
      existing = newUser;
    }
    
    setUser(existing);
    toast.success(isLogin ? `Welcome back, ${existing.name}!` : 'Account created!');
    setView(existing.role === 'admin' ? 'admin' : 'home');
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? 'signup' : 'login');
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-fade-in">
      <form 
        onSubmit={handleSubmit} 
        className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl space-y-6"
      >
        <div className="text-center">
          <h2 className="text-4xl font-black">
            {isLogin ? 'Login' : 'Join Us'}
          </h2>
          <p className="text-muted-foreground text-sm mt-3">
            {isLogin ? 'Access your library.' : 'Create your bookish profile.'}
          </p>
        </div>

        {!isLogin && (
          <input
            name="fullname"
            required
            placeholder="Full Name"
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className="input-field"
          />
        )}

        <input
          name="email"
          type="email"
          required
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="input-field"
        />

        <button 
          type="submit"
          className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl hover:bg-primary/90 transition-colors"
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "New here? Create account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};
