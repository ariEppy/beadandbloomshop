import { useEffect, useRef, useState } from "react";

const CLOUD_NAME = "hv5vw8ox";
const UPLOAD_PRESET = "bead_bloom_inspiration";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function ImageUpload({ imageUrl, onUploaded, onRemoved }) {
  const widgetRef = useRef(null);
  const onUploadedRef = useRef(onUploaded);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Keep the latest callback without re-creating the widget on every render.
  useEffect(() => {
    onUploadedRef.current = onUploaded;
  }, [onUploaded]);

  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary Upload Widget script was not loaded.");

      return undefined;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,

        sources: ["local", "camera"],

        multiple: false,

        maxFileSize: MAX_FILE_SIZE,

        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],

        maxImageWidth: 3000,
        maxImageHeight: 3000,

        cropping: false,

        showAdvancedOptions: false,

        showUploadMoreButton: false,

        singleUploadAutoClose: true,

        language: "en",

        styles: {
          palette: {
            window: "#fffdf9",
            windowBorder: "#cbbfb0",
            tabIcon: "#1d1a17",
            menuIcons: "#5c544c",
            textDark: "#1d1a17",
            textLight: "#fffdf9",
            link: "#3d68a8",
            action: "#1d1a17",
            inactiveTabIcon: "#8a8077",
            error: "#a3402f",
            inProgress: "#1d1a17",
            complete: "#4c6b4f",
            sourceBg: "#f6f1ea",
          },
        },
      },
      (uploadError, result) => {
        if (uploadError) {
          console.error("Cloudinary upload error:", uploadError);

          setUploading(false);
          setError(
            "Something went wrong while uploading your picture. Please try again.",
          );

          return;
        }

        if (!result) {
          return;
        }

        if (result.event === "upload-added") {
          setError("");
          setUploading(true);
        }

        if (result.event === "success" && result.info) {
          setUploading(false);
          setError("");

          const uploadedUrl = result.info.secure_url || result.info.url;

          if (uploadedUrl) {
            onUploadedRef.current(uploadedUrl);
          }
        }

        if (result.event === "close") {
          setUploading(false);
        }
      },
    );

    widgetRef.current = widget;

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
    // Create the widget once on mount; latest onUploaded is read via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openUploader() {
    setError("");

    if (!widgetRef.current) {
      setError(
        "The image uploader is not ready yet. Please refresh the page and try again.",
      );

      return;
    }

    widgetRef.current.open();
  }

  function removeImage() {
    setError("");
    onRemoved();
  }

  return (
    <div className="image-upload-section">
      <div className="field-heading">
        <span className="field-label">Inspiration picture</span>

        <span className="field-helper">
          Have a picture that shows what you have in mind? You can upload it
          here.
        </span>
      </div>

      {!imageUrl && (
        <button
          type="button"
          className="image-upload-button"
          onClick={openUploader}
          disabled={uploading}
        >
          <svg
            className="upload-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V5" />
            <path d="M7.5 9.5 12 5l4.5 4.5" />
            <path d="M5 15v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
          </svg>

          <span>{uploading ? "Uploading..." : "Upload a picture"}</span>
        </button>
      )}

      {uploading && (
        <div className="upload-status">Uploading your picture...</div>
      )}

      {imageUrl && (
        <div className="uploaded-image-card">
          <div className="uploaded-image-preview">
            <img src={imageUrl} alt="Your inspiration" />
          </div>

          <div className="uploaded-image-info">
            <span className="upload-success">
              ✓ Inspiration picture uploaded
            </span>

            <button
              type="button"
              className="remove-image-button"
              onClick={removeImage}
            >
              Remove & upload another
            </button>
          </div>
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}

      <p className="upload-note">JPG, PNG, or WebP · Maximum 5 MB</p>
    </div>
  );
}

export default ImageUpload;
