export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          adaptive_hint: string | null
          clarity_analysis: string | null
          clarity_score: number | null
          code_best_practices: string | null
          code_efficiency: string | null
          code_suggestions: string[] | null
          conceptual_gaps: string[] | null
          conceptual_understanding: string | null
          created_at: string | null
          id: string
          interaction_id: string
          misconceptions: string[] | null
          suggested_next_topic: string | null
          user_id: string
        }
        Insert: {
          adaptive_hint?: string | null
          clarity_analysis?: string | null
          clarity_score?: number | null
          code_best_practices?: string | null
          code_efficiency?: string | null
          code_suggestions?: string[] | null
          conceptual_gaps?: string[] | null
          conceptual_understanding?: string | null
          created_at?: string | null
          id?: string
          interaction_id: string
          misconceptions?: string[] | null
          suggested_next_topic?: string | null
          user_id: string
        }
        Update: {
          adaptive_hint?: string | null
          clarity_analysis?: string | null
          clarity_score?: number | null
          code_best_practices?: string | null
          code_efficiency?: string | null
          code_suggestions?: string[] | null
          conceptual_gaps?: string[] | null
          conceptual_understanding?: string | null
          created_at?: string | null
          id?: string
          interaction_id?: string
          misconceptions?: string[] | null
          suggested_next_topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "student_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          areas_for_improvement: string[] | null
          current_topic: string
          id: string
          next_milestone: string | null
          recommended_topics: string[] | null
          skill_level: number | null
          strengths: string[] | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          areas_for_improvement?: string[] | null
          current_topic: string
          id?: string
          next_milestone?: string | null
          recommended_topics?: string[] | null
          skill_level?: number | null
          strengths?: string[] | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          areas_for_improvement?: string[] | null
          current_topic?: string
          id?: string
          next_milestone?: string | null
          recommended_topics?: string[] | null
          skill_level?: number | null
          strengths?: string[] | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          description: string
          difficulty: string
          expected_concepts: string[] | null
          id: string
          programming_language: string
          starter_code: string | null
          teacher_id: string
          title: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          difficulty: string
          expected_concepts?: string[] | null
          id?: string
          programming_language?: string
          starter_code?: string | null
          teacher_id: string
          title: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          difficulty?: string
          expected_concepts?: string[] | null
          id?: string
          programming_language?: string
          starter_code?: string | null
          teacher_id?: string
          title?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_interactions: {
        Row: {
          created_at: string | null
          id: string
          input_content: string
          input_type: string
          programming_language: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_content: string
          input_type: string
          programming_language?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_content?: string
          input_type?: string
          programming_language?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          created_at: string | null
          id: string
          interactions_count: number | null
          last_interaction_at: string | null
          skill_level: number | null
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interactions_count?: number | null
          last_interaction_at?: string | null
          skill_level?: number | null
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interactions_count?: number | null
          last_interaction_at?: string | null
          skill_level?: number | null
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      teacher_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string
          id: string
          rating: number | null
          student_id: string
          submission_id: string | null
          teacher_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_text: string
          id?: string
          rating?: number | null
          student_id: string
          submission_id?: string | null
          teacher_id: string
        }
        Update: {
          created_at?: string | null
          feedback_text?: string
          id?: string
          rating?: number | null
          student_id?: string
          submission_id?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "test_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_assignments: {
        Row: {
          assigned_at: string | null
          due_date: string | null
          id: string
          student_id: string
          test_id: string
        }
        Insert: {
          assigned_at?: string | null
          due_date?: string | null
          id?: string
          student_id: string
          test_id: string
        }
        Update: {
          assigned_at?: string | null
          due_date?: string | null
          id?: string
          student_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string | null
          id: string
          order_index: number
          points: number | null
          question_id: string
          test_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_index: number
          points?: number | null
          question_id: string
          test_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_index?: number
          points?: number | null
          question_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_submissions: {
        Row: {
          ai_analysis: Json | null
          code_submission: string
          id: string
          question_id: string
          score: number | null
          student_id: string
          submitted_at: string | null
          test_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          code_submission: string
          id?: string
          question_id: string
          score?: number | null
          student_id: string
          submitted_at?: string | null
          test_id: string
        }
        Update: {
          ai_analysis?: Json | null
          code_submission?: string
          id?: string
          question_id?: string
          score?: number | null
          student_id?: string
          submitted_at?: string | null
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_submissions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          teacher_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          teacher_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          teacher_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "teacher", "student"],
    },
  },
} as const
