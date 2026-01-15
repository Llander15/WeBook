import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ActionBar } from "@/components/ActionBar";
import { HomeView } from "@/components/views/HomeView";
import { AuthView } from "@/components/views/AuthView";
import { CartView } from "@/components/views/CartView";
import { AdminView } from "@/components/views/AdminView";
import { useStore } from "@/store/useStore";

const queryClient = new QueryClient();

const AppContent = () => {
  const { view } = useStore();

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView />;
      case 'login':
        return <AuthView />;
      case 'cart':
        return <CartView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{renderView()}</main>
      <ActionBar />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
