/**
 * Village Management - API-based
 * Uses REST API instead of Supabase for village CRUD operations
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useApiAuth } from "@/hooks/useApiAuth";
import { villagesApi, Village } from "@/api";
import { Loader2, Plus, Edit, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const VillageManagement = () => {
  usePageSEO({ 
    title: "Village Management", 
    description: "Manage village information and settings" 
  });

  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState<Village[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    state: "",
    district: "",
    taluka: "",
    pincode: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading, isAuthenticated, isSuperAdmin, isAdmin } = useApiAuth();

  // Check authorization
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    if (!authLoading && !isSuperAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }
  }, [authLoading, isAuthenticated, isSuperAdmin, isAdmin, navigate]);

  const fetchVillages = async () => {
    setLoading(true);
    try {
      const response = await villagesApi.getVillages(false); // Get all villages, not just active
      
      if (response.success && response.data) {
        setVillages(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to load villages.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
      toast({
        title: "Error",
        description: "Failed to load villages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (isSuperAdmin || isAdmin)) {
      fetchVillages();
    }
  }, [authLoading, isSuperAdmin, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingVillage) {
        const response = await villagesApi.updateVillage(editingVillage.id, {
          name: formData.name,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
        });

        if (response.success) {
          toast({
            title: "Success",
            description: "Village updated successfully.",
          });
        } else {
          throw new Error(response.error?.message || "Failed to update village");
        }
      } else {
        const response = await villagesApi.createVillage({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          district: formData.district,
          taluka: formData.taluka,
          state: formData.state,
          pincode: formData.pincode,
        });

        if (response.success) {
          toast({
            title: "Success",
            description: "Village created successfully.",
          });
        } else {
          throw new Error(response.error?.message || "Failed to create village");
        }
      }

      setIsDialogOpen(false);
      setEditingVillage(null);
      resetForm();
      fetchVillages();
    } catch (error: unknown) {
      console.error("Error saving village:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save village.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (village: Village) => {
    setEditingVillage(village);
    setFormData({
      name: village.name,
      slug: village.slug,
      state: village.state,
      district: village.district,
      taluka: village.taluka || "",
      pincode: village.pincode,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this village?")) return;

    setActionLoading(true);
    try {
      const response = await villagesApi.deleteVillage(id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Village deleted successfully.",
        });
        fetchVillages();
      } else {
        throw new Error(response.error?.message || "Failed to delete village");
      }
    } catch (error) {
      console.error("Error deleting village:", error);
      toast({
        title: "Error",
        description: "Failed to delete village.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      state: "",
      district: "",
      taluka: "",
      pincode: "",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold">Village Management</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchVillages} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => {
              resetForm();
              setEditingVillage(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Village
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Villages ({villages.length})</CardTitle>
            <CardDescription>Manage village information and settings</CardDescription>
          </CardHeader>
          <CardContent>
            {villages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No villages found. Create your first village to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {villages.map((village) => (
                    <TableRow key={village.id}>
                      <TableCell className="font-medium">{village.name}</TableCell>
                      <TableCell className="text-muted-foreground">{village.slug}</TableCell>
                      <TableCell>{village.district}</TableCell>
                      <TableCell>{village.state}</TableCell>
                      <TableCell>{village.pincode}</TableCell>
                      <TableCell>
                        <Badge variant={village.isActive ? "default" : "secondary"}>
                          {village.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(village)}
                            disabled={actionLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(village.id)}
                            disabled={actionLoading}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVillage ? "Edit Village" : "Add New Village"}
              </DialogTitle>
              <DialogDescription>
                {editingVillage ? "Update village information" : "Create a new village entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Village Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taluka">Taluka</Label>
                  <Input
                    id="taluka"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingVillage ? "Update" : "Create"} Village
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VillageManagement;
