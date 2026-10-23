"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import type { ImageActionState } from "@/lib/auth/image-actions";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImageUploadProps = {
  currentImageUrl?: string | null;
  aspect?: "square" | "cover";
  title?: string;
  hint?: string;
  uploadAction: (prev: ImageActionState, formData: FormData) => Promise<ImageActionState>;
  deleteAction?: (prev: ImageActionState, formData: FormData) => Promise<ImageActionState>;
  onSuccess?: () => void;
};

export function ImageUpload({
  currentImageUrl,
  aspect = "square",
  title,
  hint,
  uploadAction,
  deleteAction,
  onSuccess,
}: ImageUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    uploadAction,
    {} as ImageActionState,
  );

  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAction ?? (() => Promise.resolve({} as ImageActionState)),
    {} as ImageActionState,
  );

  const isPending = uploadPending || deletePending;

  useActionFeedback(uploadState, {
    onSuccess: () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      router.refresh();
      onSuccess?.();
    },
  });

  useActionFeedback(deleteState, {
    onSuccess: () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      router.refresh();
      onSuccess?.();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setClientError(t("image.upload.invalidType"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setClientError(t("image.upload.tooLarge"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setClientError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayUrl = previewUrl || currentImageUrl;
  const isSquare = aspect === "square";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
      {title && <h3 className="text-base font-semibold text-text">{title}</h3>}
      {hint && <p className="text-xs text-text-muted">{hint}</p>}

      <div className="flex flex-wrap items-center gap-4">
        {/* Image Preview / Avatar Area */}
        <div
          className={`relative overflow-hidden border border-border bg-surface ${
            isSquare
              ? "size-28 rounded-full sm:size-32"
              : "h-36 w-full max-w-md rounded-xl sm:h-44"
          }`}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={previewUrl ? t("image.upload.previewAlt") : t("image.upload.currentAlt")}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-muted">
              {isSquare ? (
                <svg
                  aria-hidden="true"
                  className="size-14 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="size-12 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-1 flex-col gap-2 min-w-48">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />

          {selectedFile ? (
            <div className="flex flex-wrap items-center gap-2">
              <form action={uploadFormAction} className="inline">
                {/* Re-attach the selected file to the server action form */}
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  ref={(input) => {
                    if (input && selectedFile) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(selectedFile);
                      input.files = dataTransfer.files;
                    }
                  }}
                />
                <Button type="submit" loading={uploadPending} disabled={isPending}>
                  {t("image.upload.saveButton")}
                </Button>
              </form>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelSelection}
                disabled={isPending}
              >
                {t("image.upload.cancelButton")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                {currentImageUrl
                  ? t("image.upload.changeButton")
                  : t("image.upload.selectButton")}
              </Button>

              {currentImageUrl && deleteAction && (
                <form action={deleteFormAction} className="inline">
                  <Button
                    type="submit"
                    variant="outline"
                    loading={deletePending}
                    disabled={isPending}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    {t("image.upload.removeButton")}
                  </Button>
                </form>
              )}
            </div>
          )}

          {clientError && (
            <p role="alert" className="text-xs text-rose-600">
              {clientError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

