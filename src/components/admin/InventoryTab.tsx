import { MinusSquare, PlusSquare, Edit3, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { BookForm } from './BookForm';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

export const InventoryTab = () => {
  const { 
    books, 
    setBooks,
    pendingStocks, 
    setPendingStock, 
    setEditingBookId, 
    setAdminFormDraft,
    deleteBook 
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustStock = (bookId: number, delta: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const currentVal = bookId in pendingStocks ? pendingStocks[bookId] : book.stocks;
    const newVal = Math.max(0, currentVal + delta);
    setPendingStock(bookId, newVal);
  };

  const handleEdit = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    
    setEditingBookId(bookId);
    setAdminFormDraft({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      stocks: book.stocks,
      cover: book.cover,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (bookId: number) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete book');
      
      deleteBook(bookId);
      toast.success('Book removed from catalog');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-xl font-black mb-4">Master Catalog</h3>
        
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No books in catalog yet. Add one using the form!
          </div>
        ) : (
          books.map((book) => {
            const stock = book.id in pendingStocks ? pendingStocks[book.id] : book.stocks;
            const hasPending = book.id in pendingStocks;

            return (
              <div
                key={book.id}
                className={`bg-card p-4 rounded-2xl border flex items-center justify-between group transition-colors ${
                  hasPending ? 'pending-change' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-14 w-10 object-cover rounded shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-sm">{book.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">
                      ₱{book.price} • {book.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase font-black">
                      Stocks
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjustStock(book.id, -1)}
                        className="text-muted-foreground/50 hover:text-destructive transition-colors"
                      >
                        <MinusSquare className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-black min-w-[25px] text-center">
                        {stock}
                      </span>
                      <button
                        onClick={() => handleAdjustStock(book.id, 1)}
                        className="text-muted-foreground/50 hover:text-success transition-colors"
                      >
                        <PlusSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(book.id)}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BookForm />
    </div>
  );
};
