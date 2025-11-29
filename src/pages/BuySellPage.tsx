import { usePageSEO } from "@/hooks/usePageSEO";
import { ShoppingBag } from "lucide-react";
import ItemList from "@/components/marketplace/ItemList";
import PostItemForm from "@/components/marketplace/PostItemForm";
import MyListings from "@/components/marketplace/MyListings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BuySellPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  usePageSEO({
    title: "Buy & Sell - Shivankhed Khurd Market",
    description: "Buy, sell, and exchange items in your village. Find farming tools, electronics, vehicles, animals, and more from local sellers.",
    keywords: ["buy", "sell", "marketplace", "village market", "OLX", "local sellers", "Shivankhed Khurd"],
    canonical: window.location.origin + "/buy-sell"
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Buy & Sell – Market
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse available items in your village
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className={`grid w-full max-w-2xl mx-auto mb-8 ${user ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="browse">Browse Items</TabsTrigger>
            {user ? (
              <>
                <TabsTrigger value="sell">Sell an Item</TabsTrigger>
                <TabsTrigger value="mylistings">My Listings</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="sell" onClick={(e) => {
                e.preventDefault();
                toast.error("Please login to sell items");
                navigate("/auth");
              }}>
                Sell an Item
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="browse">
            <ItemList />
          </TabsContent>
          
          {user && (
            <>
              <TabsContent value="sell">
                <div className="max-w-3xl mx-auto">
                  <PostItemForm 
                    onSuccess={() => {
                      toast.success("Item posted successfully! It will be visible after admin approval.");
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="mylistings">
                <MyListings />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default BuySellPage;
