export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stocks: number;
  cover: string;
  category: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export type View = 'home' | 'admin' | 'login' | 'cart';
export type AdminSubView = 'inventory' | 'users';
export type AuthMode = 'login' | 'signup';
