import type { components } from "./schema.gen";

type Schemas = components["schemas"];

export type Problem = Schemas["Problem"];
export type ProviderProfile = Schemas["ProviderProfile"];
export type ProviderProfileInput = Schemas["ProviderProfileInput"];
export type Service = Schemas["Service"];
export type ServiceInput = Schemas["ServiceInput"];
export type ServicePatch = Schemas["ServicePatch"];
export type ServicePage = Schemas["ServicePage"];
export type WorkingInterval = Schemas["WorkingInterval"];
export type TimeOff = Schemas["TimeOff"];
export type TimeOffInput = Schemas["TimeOffInput"];
export type TimeOffPage = Schemas["TimeOffPage"];
export type WalletBalance = Schemas["WalletBalance"];
export type WalletTransaction = Schemas["WalletTransaction"];
export type WalletTransactionPage = Schemas["WalletTransactionPage"];
export type PaymentCreateInput = Schemas["PaymentCreateInput"];
export type Payment = Schemas["Payment"];
export type PaymentCreateResponse = Schemas["PaymentCreateResponse"];
export type BookingCreateInput = Schemas["BookingCreateInput"];
export type Booking = Schemas["Booking"];
export type BookingPage = Schemas["BookingPage"];
export type AvailabilityResponse = Schemas["AvailabilityResponse"];
