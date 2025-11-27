import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!roleLoading && role !== 'admin') {
      navigate("/dashboard");
      return;
    }

    fetchUsers();
  }, [user, role, roleLoading, navigate]);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*, user_roles(role)");

    if (profiles) {
      setUsers(profiles);
    }
    setLoading(false);
  };

  const assignRole = async (userId: string, newRole: 'teacher' | 'student') => {
    // First, delete existing role
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    // Then insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: newRole });

    if (error) {
      toast.error("Failed to assign role");
      return;
    }

    toast.success(`Role assigned successfully`);
    fetchUsers();
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  Manage user roles
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Assign teacher or student roles to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{user.full_name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {user.user_roles?.[0]?.role || 'No role'}
                    </p>
                  </div>
                  <Select
                    value={user.user_roles?.[0]?.role || ''}
                    onValueChange={(value) => assignRole(user.id, value as 'teacher' | 'student')}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
