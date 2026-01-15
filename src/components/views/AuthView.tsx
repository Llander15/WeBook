import { FormEvent, useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

export const AuthView = () => {
  const { authMode, setAuthMode, setUser, setView } = useStore();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = authMode === 'login';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password, fullname } = formData;

      if (isLogin) {
        // Login flow
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        setView(data.user.role === 'admin' ? 'admin' : 'home');
      } else {
        // Register flow
        if (!fullname.trim()) {
          throw new Error('Full name is required');
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fullname, email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        setUser(data.user);
        toast.success('Account created successfully!');
        setView(data.user.role === 'admin' ? 'admin' : 'home');
      }

      // Reset form
      setFormData({ fullname: '', email: '', password: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
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
