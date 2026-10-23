import type { Metadata } from "next";

import { t, type MessageKey } from "@/config/messages.fa";
import { IANA_TIME_ZONES } from "@/config/time-zones";
import { getProviderProfile } from "@/lib/api/provider";
import type { ProviderProfile } from "@/lib/api/types";
import { ApiError } from "@/lib/api/problem";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { ProviderProfileForm } from "@/components/provider/ProviderProfileForm";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  uploadProfileImageAction,
  deleteProfileImageAction,
} from "@/lib/auth/image-actions";
import {
  uploadCoverImageAction,
  deleteCoverImageAction,
} from "@/lib/provider/image-actions";

export const metadata: Metadata = {
  title: `${t("provider.profile.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const verificationLabels: Record<ProviderProfile["verification_status"], MessageKey> = {
  pending: "provider.profile.verification.pending",
  verified: "provider.profile.verification.verified",
  rejected: "provider.profile.verification.rejected",
};

const verificationClasses: Record<ProviderProfile["verification_status"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  verified: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-rose-200 bg-rose-50 text-rose-800",
};

export default async function ProviderProfilePage() {
  let profile: ProviderProfile | null = null;
  try {
    profile = await getProviderProfile();
  } catch (error) {
    redirectOnUnauthorized(error);
    if (!(error instanceof ApiError && error.status === 404)) throw error;
  }

  const verificationStatus = profile?.verification_status;
  const defaultTimeZone = profile?.time_zone ?? "Asia/Tehran";
  const timeZoneOptions = [...new Set([defaultTimeZone, ...IANA_TIME_ZONES])]
    .sort()
    .map((timeZone) => ({ value: timeZone, label: timeZone }));

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-text">{t("provider.profile.title")}</h1>
          {verificationStatus && (
            <span className={`inline-flex rounded-sm border px-2 py-1 text-xs font-medium ${verificationClasses[verificationStatus]}`}>
              {t(verificationLabels[verificationStatus])}
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted">{t("provider.profile.verificationNote")}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUpload
            currentImageUrl={profile?.cover_image_url}
            aspect="cover"
            title={t("image.upload.coverTitle")}
            hint={t("image.upload.coverHint")}
            uploadAction={uploadCoverImageAction}
            deleteAction={deleteCoverImageAction}
          />
          <ImageUpload
            currentImageUrl={profile?.profile_image_url}
            aspect="square"
            title={t("image.upload.profileTitle")}
            hint={t("image.upload.profileHint")}
            uploadAction={uploadProfileImageAction}
            deleteAction={deleteProfileImageAction}
          />
        </div>
        <ProviderProfileForm
          profile={profile}
          timeZoneOptions={timeZoneOptions}
          defaultTimeZone={defaultTimeZone}
        />
      </section>
    </main>
  );
}
