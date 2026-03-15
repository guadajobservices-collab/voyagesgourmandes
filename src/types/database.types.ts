export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    PostgrestVersion: '12'
    Tables: {
      tenants: {
        Row: {
          id: string
          slug: string
          name: string
          email: string
          phone: string | null
          description: string | null
          status: 'active' | 'inactive' | 'suspended'
          stripe_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          email: string
          phone?: string | null
          description?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          email?: string
          phone?: string | null
          description?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          stripe_account_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tenant_config: {
        Row: {
          id: string
          tenant_id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string
          hero_image_url: string | null
          opening_hours: Json
          pickup_slots: Json
          whatsapp_number: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          hero_image_url?: string | null
          opening_hours?: Json
          pickup_slots?: Json
          whatsapp_number?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          hero_image_url?: string | null
          opening_hours?: Json
          pickup_slots?: Json
          whatsapp_number?: string | null
          meta_description?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenant_config_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: true
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          tenant_id: string | null
          role: 'client' | 'restaurateur' | 'admin'
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id?: string | null
          role?: 'client' | 'restaurateur' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          tenant_id?: string | null
          role?: 'client' | 'restaurateur' | 'admin'
          full_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menus: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'menus_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      menu_items: {
        Row: {
          id: string
          tenant_id: string
          menu_id: string
          name: string
          description: string | null
          price: number
          photo_url: string | null
          sort_order: number
          is_available: boolean
          allergens: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          menu_id: string
          name: string
          description?: string | null
          price: number
          photo_url?: string | null
          sort_order?: number
          is_available?: boolean
          allergens?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          photo_url?: string | null
          sort_order?: number
          is_available?: boolean
          allergens?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'menu_items_menu_id_fkey'
            columns: ['menu_id']
            isOneToOne: false
            referencedRelation: 'menus'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          status: 'pending' | 'paid' | 'preparing' | 'ready' | 'picked_up' | 'cancelled'
          total_amount: number
          notes: string | null
          pickup_slot: string | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          loyalty_points_used: number
          loyalty_points_earned: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          status?: 'pending' | 'paid' | 'preparing' | 'ready' | 'picked_up' | 'cancelled'
          total_amount: number
          notes?: string | null
          pickup_slot?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          loyalty_points_used?: number
          loyalty_points_earned?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'paid' | 'preparing' | 'ready' | 'picked_up' | 'cancelled'
          notes?: string | null
          pickup_slot?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          loyalty_points_used?: number
          loyalty_points_earned?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          tenant_id: string
          menu_item_id: string
          name: string
          unit_price: number
          quantity: number
          subtotal: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          tenant_id: string
          menu_item_id: string
          name: string
          unit_price: number
          quantity: number
          subtotal: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          quantity?: number
          subtotal?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      loyalty_points: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          order_id: string | null
          points: number
          type: 'earned' | 'redeemed' | 'expired' | 'bonus'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          customer_id: string
          order_id?: string | null
          points: number
          type: 'earned' | 'redeemed' | 'expired' | 'bonus'
          description?: string | null
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          points_required: number
          reward_type: 'discount_fixed' | 'discount_percent' | 'free_item'
          reward_value: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          points_required: number
          reward_type: 'discount_fixed' | 'discount_percent' | 'free_item'
          reward_value: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          points_required?: number
          reward_type?: 'discount_fixed' | 'discount_percent' | 'free_item'
          reward_value?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_config: {
        Row: {
          id: string
          tenant_id: string
          points_per_euro: number
          min_points_redeem: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          points_per_euro?: number
          min_points_redeem?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          points_per_euro?: number
          min_points_redeem?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      get_user_tenant_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type TenantConfig = Database['public']['Tables']['tenant_config']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Menu = Database['public']['Tables']['menus']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type LoyaltyPoint = Database['public']['Tables']['loyalty_points']['Row']
export type LoyaltyReward = Database['public']['Tables']['loyalty_rewards']['Row']
export type LoyaltyConfig = Database['public']['Tables']['loyalty_config']['Row']

// Extended types
export type MenuWithItems = Menu & { menu_items: MenuItem[] }
export type OrderWithItems = Order & { order_items: OrderItem[] }
export type TenantWithConfig = Tenant & { tenant_config: TenantConfig | null }
