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
            window: "#ffffff",
            windowBorder: "#c4d9fb",
            tabIcon: "#5f7fae",
            menuIcons: "#5f7fae",
            textDark: "#243247",
            textLight: "#ffffff",
            link: "#5f7fae",
            action: "#5f7fae",
            inactiveTabIcon: "#9aa7b8",
            error: "#c94c4c",
            inProgress: "#5f7fae",
            complete: "#5f7fae",
            sourceBg: "#f5f8fc",
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
          <span className="upload-icon">📷</span>

          <span>
            {uploading ? "Uploading..." : "Upload Inspiration Picture"}
          </span>
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
