/**
 * RBAC Management Page - API-based
 * Uses REST API instead of Supabase for RBAC operations
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useApiAuth } from "@/hooks/useApiAuth";
import { rbacApi, adminUsersApi, Role, Permission, AdminUser } from "@/api";
import { BackendHealth } from "@/components/BackendHealth";
import { ArrowLeft, Plus, Trash2, RefreshCw, Shield, Key, Settings2, UserCog } from "lucide-react";

const RbacManagement = () => {
  usePageSEO({ title: "RBAC Management", description: "Manage roles, permissions, and user assignments" });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading, isAuthenticated, isSuperAdmin } = useApiAuth();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [createPermissionOpen, setCreatePermissionOpen] = useState(false);
  const [assignPermissionsOpen, setAssignPermissionsOpen] = useState(false);
  const [assignRolesOpen, setAssignRolesOpen] = useState(false);
  
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newPermissionName, setNewPermissionName] = useState("");
  const [newPermissionDescription, setNewPermissionDescription] = useState("");
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!authLoading && !isSuperAdmin) {
      toast({ title: "Access Denied", description: "Only Super Admin can access RBAC Management.", variant: "destructive" });
      navigate("/admin");
    }
  }, [authLoading, isAuthenticated, isSuperAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        rbacApi.getRoles(),
        rbacApi.getPermissions(),
        adminUsersApi.getUsers({ size: 100 }),
      ]);
      if (rolesRes.success && rolesRes.data) setRoles(rolesRes.data);
      if (permissionsRes.success && permissionsRes.data) setPermissions(permissionsRes.data);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data.content);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch RBAC data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isSuperAdmin) fetchData();
  }, [authLoading, isSuperAdmin]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return toast({ title: "Error", description: "Role name is required", variant: "destructive" });
    setActionLoading(true);
    try {
      const response = await rbacApi.createRole({ name: newRoleName, description: newRoleDescription });
      if (response.success) {
        toast({ title: "Success", description: "Role created" });
        setCreateRoleOpen(false);
        setNewRoleName("");
        setNewRoleDescription("");
        fetchData();
      } else {
        toast({ title: "Error", description: response.error?.message || "Failed", variant: "destructive" });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) return toast({ title: "Error", description: "Permission name required", variant: "destructive" });
    setActionLoading(true);
    try {
      const response = await rbacApi.createPermission({ name: newPermissionName, description: newPermissionDescription });
      if (response.success) {
        toast({ title: "Success", description: "Permission created" });
        setCreatePermissionOpen(false);
        setNewPermissionName("");
        setNewPermissionDescription("");
        fetchData();
      } else {
        toast({ title: "Error", description: response.error?.message || "Failed", variant: "destructive" });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPermissions = async () => {
    if (!selectedRole || selectedPermissionIds.length === 0) return;
    setActionLoading(true);
    try {
      const response = await rbacApi.assignPermissionsToRole(selectedRole.id, selectedPermissionIds);
      if (response.success) {
        toast({ title: "Success", description: "Permissions assigned" });
        setAssignPermissionsOpen(false);
        setSelectedRole(null);
        setSelectedPermissionIds([]);
        fetchData();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser || selectedRoleIds.length === 0) return;
    setActionLoading(true);
    try {
      const response = await rbacApi.assignRolesToUser(selectedUser.userId, selectedRoleIds);
      if (response.success) {
        toast({ title: "Success", description: "Roles assigned" });
        setAssignRolesOpen(false);
        setSelectedUser(null);
        setSelectedRoleIds([]);
        fetchData();
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6" />RBAC Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <BackendHealth showDetails={false} />
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="roles"><Settings2 className="h-4 w-4 mr-2" />Roles</TabsTrigger>
            <TabsTrigger value="permissions"><Key className="h-4 w-4 mr-2" />Permissions</TabsTrigger>
            <TabsTrigger value="users"><UserCog className="h-4 w-4 mr-2" />User Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Roles</CardTitle><CardDescription>Manage system roles</CardDescription></div>
                <Button onClick={() => setCreateRoleOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Role</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>System</TableHead><TableHead>Permissions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || "-"}</TableCell>
                        <TableCell><Badge variant={role.isSystemRole ? "secondary" : "outline"}>{role.isSystemRole ? "System" : "Custom"}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{role.permissions.length} permissions</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Permissions</CardTitle><CardDescription>Manage system permissions</CardDescription></div>
                <Button onClick={() => setCreatePermissionOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Permission</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {permissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell className="font-medium">{perm.name}</TableCell>
                        <TableCell>{perm.description || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{perm.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>User Role Assignments</CardTitle><CardDescription>Assign roles to users</CardDescription></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Roles</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><div className="flex gap-1">{user.roles.map(r => <Badge key={r.id} variant="outline">{r.name}</Badge>)}</div></TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setAssignRolesOpen(true); }}>
                            Assign Roles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Role Dialog */}
        <Dialog open={createRoleOpen} onOpenChange={setCreateRoleOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateRoleOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateRole} disabled={actionLoading}>{actionLoading ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Permission Dialog */}
        <Dialog open={createPermissionOpen} onOpenChange={setCreatePermissionOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Permission</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={newPermissionName} onChange={(e) => setNewPermissionName(e.target.value)} placeholder="e.g., users:create" /></div>
              <div><Label>Description</Label><Textarea value={newPermissionDescription} onChange={(e) => setNewPermissionDescription(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreatePermissionOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePermission} disabled={actionLoading}>{actionLoading ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Roles Dialog */}
        <Dialog open={assignRolesOpen} onOpenChange={setAssignRolesOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Assign Roles to {selectedUser?.fullName}</DialogTitle></DialogHeader>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={(checked) => {
                      setSelectedRoleIds(checked ? [...selectedRoleIds, role.id] : selectedRoleIds.filter(id => id !== role.id));
                    }}
                  />
                  <span>{role.name}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignRolesOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignRoles} disabled={actionLoading}>{actionLoading ? "Assigning..." : "Assign"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RbacManagement;
