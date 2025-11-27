import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export type UserRole = 'admin' | 'teacher' | 'student' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setRole(data.role as UserRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading, isTeacher: role === 'teacher', isStudent: role === 'student', isAdmin: role === 'admin' };
};
