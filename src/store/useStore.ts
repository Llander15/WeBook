import { create } from 'zustand';
import { User, Book, CartItem, View, AdminSubView, AuthMode } from '@/types';

interface BookFormDraft {
  title: string;
  author: string;
  category: string;
  price: number;
  stocks: number;
  cover: string;
}

interface AppState {
  view: View;
  adminSubView: AdminSubView;
  authMode: AuthMode;
  user: User | null;
  users: User[];
  books: Book[];
  cart: CartItem[];
  pendingStocks: Record<number, number>;
  pendingUserCart: Record<number, number>;
  searchQuery: string;
  editingBookId: number | null;
  adminFormDraft: BookFormDraft;
  
  // Actions
  setView: (view: View) => void;
  setAdminSubView: (subView: AdminSubView) => void;
  setAuthMode: (mode: AuthMode) => void;
  setUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Book actions
  addBook: (book: Book) => void;
  updateBook: (id: number, book: Partial<Book>) => void;
  deleteBook: (id: number) => void;
  setEditingBookId: (id: number | null) => void;
  setAdminFormDraft: (draft: Partial<BookFormDraft>) => void;
  resetAdminFormDraft: () => void;
  
  // User actions
  addUser: (user: User) => void;
  updateUserRole: (id: number, role: 'admin' | 'user') => void;
  deleteUser: (id: number) => void;
  
  // Cart actions
  updateCart: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Pending changes
  setPendingStock: (bookId: number, stock: number) => void;
  clearPendingStocks: () => void;
  confirmStockChanges: () => void;
  
  setPendingUserCart: (bookId: number, quantity: number) => void;
  clearPendingUserCart: () => void;
  confirmCartChanges: () => void;
}

const initialFormDraft: BookFormDraft = {
  title: '',
  author: '',
  category: '',
  price: 0,
  stocks: 0,
  cover: '',
};

const initialBooks: Book[] = [
  { id: 101, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 450.00, stocks: 15, cover: "https://images.unsplash.com/photo-1543004629-142a46460322?q=80&w=800", category: "Classic" },
  { id: 102, title: "Eloquent JavaScript", author: "Marijn Haverbeke", price: 1200.00, stocks: 5, cover: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800", category: "Tech" },
  { id: 103, title: "Atomic Habits", author: "James Clear", price: 890.00, stocks: 20, cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800", category: "Self-Help" },
];

const initialUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@webook.com', role: 'admin' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'John Smith', email: 'john@smith.com', role: 'user' },
];

export const useStore = create<AppState>((set, get) => ({
  view: 'home',
  adminSubView: 'inventory',
  authMode: 'login',
  user: null,
  users: initialUsers,
  books: initialBooks,
  cart: [],
  pendingStocks: {},
  pendingUserCart: {},
  searchQuery: '',
  editingBookId: null,
  adminFormDraft: initialFormDraft,
  
  setView: (view) => set({ 
    view, 
    pendingStocks: {}, 
    pendingUserCart: {}, 
    editingBookId: null 
  }),
  
  setAdminSubView: (adminSubView) => set({ adminSubView }),
  setAuthMode: (authMode) => set({ authMode }),
  setUser: (user) => set({ user }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  addBook: (book) => set((state) => ({ books: [book, ...state.books] })),
  
  updateBook: (id, bookUpdate) => set((state) => ({
    books: state.books.map((b) => b.id === id ? { ...b, ...bookUpdate } : b),
  })),
  
  deleteBook: (id) => set((state) => ({
    books: state.books.filter((b) => b.id !== id),
  })),
  
  setEditingBookId: (editingBookId) => set({ editingBookId }),
  
  setAdminFormDraft: (draft) => set((state) => ({
    adminFormDraft: { ...state.adminFormDraft, ...draft },
  })),
  
  resetAdminFormDraft: () => set({ adminFormDraft: initialFormDraft, editingBookId: null }),
  
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  
  updateUserRole: (id, role) => set((state) => ({
    users: state.users.map((u) => u.id === id ? { ...u, role } : u),
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
  
  updateCart: (bookId, quantity) => set((state) => {
    const book = state.books.find((b) => b.id === bookId);
    if (!book) return state;
    
    const existingIndex = state.cart.findIndex((c) => c.id === bookId);
    
    if (quantity === 0) {
      return { cart: state.cart.filter((c) => c.id !== bookId) };
    }
    
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      newCart[existingIndex] = { ...newCart[existingIndex], quantity };
      return { cart: newCart };
    }
    
    return { cart: [...state.cart, { ...book, quantity }] };
  }),
  
  clearCart: () => set({ cart: [] }),
  
  setPendingStock: (bookId, stock) => set((state) => {
    const book = state.books.find((b) => b.id === bookId);
    if (!book) return state;
    
    if (stock === book.stocks) {
      const { [bookId]: _, ...rest } = state.pendingStocks;
      return { pendingStocks: rest };
    }
    
    return { pendingStocks: { ...state.pendingStocks, [bookId]: stock } };
  }),
  
  clearPendingStocks: () => set({ pendingStocks: {} }),
  
  confirmStockChanges: () => set((state) => {
    const updatedBooks = state.books.map((book) => {
      if (book.id in state.pendingStocks) {
        return { ...book, stocks: state.pendingStocks[book.id] };
      }
      return book;
    });
    return { books: updatedBooks, pendingStocks: {} };
  }),
  
  setPendingUserCart: (bookId, quantity) => set((state) => {
    const inCart = state.cart.find((c) => c.id === bookId)?.quantity || 0;
    
    if (quantity === inCart) {
      const { [bookId]: _, ...rest } = state.pendingUserCart;
      return { pendingUserCart: rest };
    }
    
    return { pendingUserCart: { ...state.pendingUserCart, [bookId]: quantity } };
  }),
  
  clearPendingUserCart: () => set({ pendingUserCart: {} }),
  
  confirmCartChanges: () => set((state) => {
    let newCart = [...state.cart];
    
    Object.entries(state.pendingUserCart).forEach(([idStr, qty]) => {
      const id = parseInt(idStr);
      const book = state.books.find((b) => b.id === id);
      if (!book) return;
      
      const existingIdx = newCart.findIndex((c) => c.id === id);
      
      if (qty === 0) {
        newCart = newCart.filter((c) => c.id !== id);
      } else if (existingIdx > -1) {
        newCart[existingIdx] = { ...newCart[existingIdx], quantity: qty };
      } else {
        newCart.push({ ...book, quantity: qty });
      }
    });
    
    return { cart: newCart, pendingUserCart: {} };
  }),
}));
