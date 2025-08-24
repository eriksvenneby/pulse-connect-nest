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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      loading_quotes: {
        Row: {
          author: string
          created_at: string
          id: string
          is_active: boolean
          quote: string
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          is_active?: boolean
          quote: string
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          is_active?: boolean
          quote?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      personality_tests: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          questions: Json
          scoring_rules: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          questions: Json
          scoring_rules: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          questions?: Json
          scoring_rules?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          photo_order: number
          status: Database["public"]["Enums"]["photo_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          photo_order: number
          status?: Database["public"]["Enums"]["photo_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          photo_order?: number
          status?: Database["public"]["Enums"]["photo_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          bio: string | null
          birthday: string | null
          created_at: string
          dating_preference:
            | Database["public"]["Enums"]["dating_preference"]
            | null
          education: string | null
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          is_premium: boolean
          latitude: number | null
          location_name: string | null
          longitude: number | null
          max_distance: number | null
          occupation: string | null
          profile_complete: boolean | null
          profile_picture_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          sex: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          bio?: string | null
          birthday?: string | null
          created_at?: string
          dating_preference?:
            | Database["public"]["Enums"]["dating_preference"]
            | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          max_distance?: number | null
          occupation?: string | null
          profile_complete?: boolean | null
          profile_picture_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          bio?: string | null
          birthday?: string | null
          created_at?: string
          dating_preference?:
            | Database["public"]["Enums"]["dating_preference"]
            | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          max_distance?: number | null
          occupation?: string | null
          profile_complete?: boolean | null
          profile_picture_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_profile_picture_id_fkey"
            columns: ["profile_picture_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          id: string
          is_like: boolean
          target_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_like: boolean
          target_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_like?: boolean
          target_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_test_responses: {
        Row: {
          completed_at: string
          id: string
          responses: Json
          score: Json
          test_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          responses: Json
          score: Json
          test_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          responses?: Json
          score?: Json
          test_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "personality_tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_potential_matches: {
        Args: { limit_count?: number; requesting_user_id: string }
        Returns: {
          age: number
          bio: string
          birthday: string
          distance_km: number
          education: string
          full_name: string
          interests: string[]
          location_name: string
          occupation: string
          personality_match: number
          profile_picture_id: string
          user_id: string
        }[]
      }
      user_has_completed_test: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      dating_preference: "men" | "women" | "both"
      photo_status: "pending" | "approved" | "rejected"
      user_role: "admin" | "user"
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
      dating_preference: ["men", "women", "both"],
      photo_status: ["pending", "approved", "rejected"],
      user_role: ["admin", "user"],
    },
  },
} as const
