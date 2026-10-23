import { apiFetch } from "./client";
import type { Image, ImageSet } from "./types";

export function getMyImages(): Promise<ImageSet> {
  return apiFetch<ImageSet>("/api/v1/me/images", {
    auth: true,
    cache: "no-store",
  });
}

export function uploadProfileImage(formData: FormData): Promise<Image> {
  return apiFetch<Image>("/api/v1/me/images/profile", {
    method: "PUT",
    body: formData,
    auth: true,
    cache: "no-store",
  });
}

export function deleteProfileImage(): Promise<void> {
  return apiFetch<void>("/api/v1/me/images/profile", {
    method: "DELETE",
    auth: true,
    cache: "no-store",
  });
}

export function uploadCoverImage(formData: FormData): Promise<Image> {
  return apiFetch<Image>("/api/v1/me/images/cover", {
    method: "PUT",
    body: formData,
    auth: true,
    cache: "no-store",
  });
}

export function deleteCoverImage(): Promise<void> {
  return apiFetch<void>("/api/v1/me/images/cover", {
    method: "DELETE",
    auth: true,
    cache: "no-store",
  });
}

