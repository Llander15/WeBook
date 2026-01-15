import { FormEvent } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export const BookForm = () => {
  const { 
    editingBookId, 
    adminFormDraft, 
    setAdminFormDraft, 
    resetAdminFormDraft,
    addBook,
    updateBook 
  } = useStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (editingBookId) {
      updateBook(editingBookId, adminFormDraft);
      toast.success('Book updated successfully');
    } else {
      addBook({ ...adminFormDraft, id: Date.now() });
      toast.success('New book published');
    }
    
    resetAdminFormDraft();
  };

  const handleChange = (field: string, value: string | number) => {
    setAdminFormDraft({ [field]: value });
  };

  return (
    <div className="admin-panel p-8 rounded-[2.5rem] sticky top-24">
      <h4 className="font-black uppercase text-xs tracking-widest text-primary mb-4">
        {editingBookId ? 'Edit Book' : 'Add New Book'}
      </h4>

      {/* Preview Card */}
      <div className="mb-4">
        <div className="bg-card/10 rounded-2xl p-3 border-2 border-dashed border-primary/30 opacity-80 scale-90">
          <div className="aspect-[3/4] mb-2 rounded-xl bg-muted/20 overflow-hidden">
            {adminFormDraft.cover && (
              <img
                src={adminFormDraft.cover}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <p className="text-[10px] font-black uppercase text-primary">
            {adminFormDraft.category || 'Category'}
          </p>
          <p className="font-bold truncate text-xs">
            {adminFormDraft.title || 'Draft Title'}
          </p>
          <p className="text-[10px] font-black mt-1">
            ₱{adminFormDraft.price || 0}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={adminFormDraft.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          placeholder="Book Title"
          className="admin-input"
        />
        
        <input
          value={adminFormDraft.author}
          onChange={(e) => handleChange('author', e.target.value)}
          required
          placeholder="Author"
          className="admin-input"
        />
        
        <input
          value={adminFormDraft.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
          placeholder="Category"
          className="admin-input"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <input
            value={adminFormDraft.price || ''}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            type="number"
            step="0.01"
            required
            placeholder="Price"
            className="admin-input"
          />
          <input
            value={adminFormDraft.stocks || ''}
            onChange={(e) => handleChange('stocks', parseInt(e.target.value) || 0)}
            type="number"
            required
            placeholder="Stocks"
            className="admin-input"
          />
        </div>
        
        <input
          value={adminFormDraft.cover}
          onChange={(e) => handleChange('cover', e.target.value)}
          placeholder="Image URL"
          className="admin-input"
        />

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-grow py-3 bg-primary rounded-xl font-black text-xs uppercase text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {editingBookId ? 'Update' : 'Publish'}
          </button>
          
          {editingBookId && (
            <button
              type="button"
              onClick={resetAdminFormDraft}
              className="px-4 py-3 bg-muted/30 rounded-xl font-black text-xs uppercase hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
