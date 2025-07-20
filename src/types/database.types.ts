export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      insights: {
        Row: {
          id: string;
          title: string;
          summary: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          created_at?: string;
          user_id?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          description: string;
          priority: string;
          insight_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          priority: string;
          insight_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          priority?: string;
          insight_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      daily_kpi_summary_view: {
        Row: {
          date: string;
          total_sessions: number;
          total_users: number;
          total_pageviews: number;
          total_revenue: number;
          conversion_rate: number;
          avg_order_value: number;
          bounce_rate: number;
          avg_session_duration: number;
        };
      };
      utm_funnel_performance_view: {
        Row: {
          utm_source: string;
          utm_medium: string;
          utm_campaign: string;
          sessions: number;
          product_views: number;
          add_to_cart: number;
          checkouts: number;
          purchases: number;
          conversion_rate: number;
          revenue: number;
          date: string;
        };
      };
      page_optimization_view: {
        Row: {
          page_path: string;
          page_title: string;
          sessions: number;
          pageviews: number;
          avg_time_on_page: number;
          bounce_rate: number;
          exit_rate: number;
          conversion_rate: number;
          revenue_contribution: number;
          date: string;
        };
      };
    };
    Functions: {};
  };
} 