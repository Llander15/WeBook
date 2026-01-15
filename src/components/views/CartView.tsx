import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export const CartView = () => {
  const { cart, clearCart, setView } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Add items first!');
      return;
    }
    toast.success('Order successful!');
    clearCart();
    setView('home');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in">
      <h2 className="text-3xl font-black mb-10 text-center italic">
        Your Shopping Bag
      </h2>

      <div className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Your bag is empty.
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-card p-5 rounded-3xl border border-border flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-16 w-12 object-cover rounded-lg"
                />
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    {item.quantity} × ₱{item.price}
                  </p>
                </div>
              </div>
              <span className="text-lg font-black text-primary">
                ₱{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        )}

        <div className="pt-8 flex justify-between items-center border-t mt-6">
          <span className="text-xs font-black uppercase text-muted-foreground">
            Total
          </span>
          <span className="text-4xl font-black">₱{total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-5 bg-foreground text-background rounded-3xl font-black text-xl mt-6 hover:bg-foreground/90 transition-colors"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};
