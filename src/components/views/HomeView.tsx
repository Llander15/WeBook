import { useStore } from '@/store/useStore';
import { BookCard } from '@/components/BookCard';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

export const HomeView = () => {
  const { books, searchQuery, setBooks } = useStore();
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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
      
      {!isLoading && filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};
