/* eslint-disable */
// Generated from openapi.yaml by `npm run gen:api` (openapi-typescript).
// Hand-written stand-in until the generator can be run; regenerate instead of editing.

export interface components {
  schemas: {
    Problem: {
      type: string;
      title: string;
      status: number;
      code: string;
      request_id: string;
      field_errors?: {
        field: string;
        code: string;
        message: string;
      }[];
    };
    ProviderProfile: {
      provider_id: number;
      display_name: string;
      description: string;
      time_zone: string;
      is_active: boolean;
      verification_status: "pending" | "verified" | "rejected";
    };
    ProviderProfileInput: {
      display_name: string;
      description?: string;
      time_zone?: string;
      is_active: boolean;
    };
    Service: {
      id: number;
      provider_id: number;
      name: string;
      description: string;
      duration_minutes: number;
      price_irr: number;
      buffer_minutes: number;
      is_active: boolean;
    };
    ServiceInput: {
      name: string;
      description?: string;
      duration_minutes: number;
      price_irr: number;
      buffer_minutes?: number;
      is_active?: boolean;
    };
    ServicePatch: {
      name?: string;
      description?: string;
      duration_minutes?: number;
      price_irr?: number;
      buffer_minutes?: number;
      is_active?: boolean;
    };
    ServicePage: {
      items: components["schemas"]["Service"][];
      next_cursor: number | null;
    };
    WorkingInterval: {
      weekday: number;
      opens_at: string;
      closes_at: string;
    };
    TimeOff: {
      id: number;
      kind: "time_off" | "blocked" | "holiday";
      starts_at: string;
      ends_at: string;
      reason: string;
      holiday_date?: string | null;
    };
    TimeOffInput:
      | {
          kind: "time_off" | "blocked";
          starts_at: string;
          ends_at: string;
          reason?: string;
        }
      | {
          kind: "holiday";
          holiday_date: string;
        };
    TimeOffPage: {
      items: components["schemas"]["TimeOff"][];
      next_cursor: number | null;
    };
    WalletBalance: {
      available_irr: number;
      held_irr: number;
      provider_earnings_irr: number;
      currency: "IRR";
    };
    WalletTransaction: {
      id: number;
      reference: string;
      kind:
        | "funding"
        | "hold_place"
        | "hold_release"
        | "refund_release"
        | "hold_settle"
        | "reversal";
      created_at: string;
      amount_irr: number;
    };
    WalletTransactionPage: {
      items: components["schemas"]["WalletTransaction"][];
      next_cursor: number | null;
    };
    PaymentCreateInput: {
      amount_irr: number;
    };
    Payment: {
      id: number;
      amount_irr: number;
      status: "created" | "pending" | "succeeded" | "failed" | "verification_unknown";
      authority?: string | null;
      gateway_reference_id?: string | null;
      created_at: string;
      updated_at: string;
      succeeded_at?: string | null;
    };
    PaymentCreateResponse: {
      payment: components["schemas"]["Payment"];
      redirect_url?: string;
    };
    BookingCreateInput: {
      service_id: number;
      starts_at: string;
    };
    Booking: {
      id: number;
      client_id: number;
      provider_id: number;
      service_id: number;
      service_name: string;
      starts_at: string;
      ends_at: string;
      duration_minutes: number;
      price_irr: number;
      buffer_minutes: number;
      status: "confirmed" | "in_progress" | "completed" | "cancelled" | "expired";
      created_at: string;
      updated_at: string;
    };
    BookingPage: {
      items: components["schemas"]["Booking"][];
      next_cursor: number | null;
    };
    AvailabilityResponse: {
      provider_id: number;
      service_id: number;
      date: string;
      time_zone: string;
      slots: {
        start_at: string;
        end_at: string;
      }[];
    };
  };
}
