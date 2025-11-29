import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff, Loader2, Package } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Item {
  id: string;
  item_name: string;
  category: string;
  price: number;
  description: string | null;
  village: string;
  contact: string;
  image_urls: string[] | null;
  status: string;
  is_available: boolean;
  created_at: string;
  rejection_reason: string | null;
}

const MyListings = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMyItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to load your listings");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      setUpdatingId(itemId);
      const { error } = await supabase
        .from("items")
        .update({ is_available: !currentStatus })
        .eq("id", itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId ? { ...item, is_available: !currentStatus } : item
      ));

      toast.success(!currentStatus ? "Item marked as available" : "Item marked as unavailable");
    } catch (error: any) {
      toast.error("Failed to update item status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
      toast.success("Item deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete item");
    }
  };

  const getStatusBadge = (status: string, isAvailable: boolean) => {
    if (status === "pending") {
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Pending Review</Badge>;
    }
    if (status === "rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    if (!isAvailable) {
      return <Badge variant="secondary">Unavailable</Badge>;
    }
    return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
          <p className="text-muted-foreground text-center">
            You haven't posted any items for sale yet. Start selling by adding your first item!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Listings</h2>
          <p className="text-muted-foreground">Manage your posted items</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-48 flex-shrink-0">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <img
                      src={item.image_urls[0]}
                      alt={item.item_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{item.item_name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    {getStatusBadge(item.status, item.is_available)}
                  </div>

                  <p className="text-2xl font-bold text-primary">₹{item.price.toLocaleString()}</p>

                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>📍 {item.village}</span>
                    <span>•</span>
                    <span>📞 {item.contact}</span>
                  </div>

                  {item.status === "rejected" && item.rejection_reason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm font-semibold text-destructive mb-1">Rejection Reason:</p>
                      <p className="text-sm text-destructive/90">{item.rejection_reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {item.status === "approved" && (
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.is_available}
                          onCheckedChange={() => handleToggleAvailability(item.id, item.is_available)}
                          disabled={updatingId === item.id}
                        />
                        <span className="text-sm flex items-center gap-1">
                          {item.is_available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your listing "{item.item_name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
