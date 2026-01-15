import { Minus, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const { 
    user, 
    cart, 
    pendingUserCart, 
    setPendingUserCart, 
    setAuthMode, 
    setView 
  } = useStore();

  const inCart = cart.find((c) => c.id === book.id)?.quantity || 0;
  const quantity = book.id in pendingUserCart ? pendingUserCart[book.id] : inCart;

  const handleAdjust = (delta: number) => {
    if (!user) {
      setAuthMode('login');
      setView('login');
      return;
    }

    const newQty = Math.max(0, Math.min(book.stocks, quantity + delta));
    setPendingUserCart(book.id, newQty);
  };

  return (
    <div className="book-card group">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl bg-muted">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="category-badge">{book.category}</span>
        </div>
      </div>
      
      <h3 className="font-bold truncate">{book.title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{book.author}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xl font-black text-primary">₱{book.price}</span>
        
        <div className="flex items-center bg-muted rounded-xl p-1">
          <button
            onClick={() => handleAdjust(-1)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="px-2 text-sm font-black min-w-[24px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleAdjust(1)}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
