// EmailJS rejects with { status, text } (e.g. 400 "The template ID is invalid"),
// or a plain Error for network problems. Return a short reason to show the
// customer so a failed send can be diagnosed without opening the console.
export function emailErrorReason(error) {
  if (!error) {
    return "";
  }

  const text = error.text || error.message || "";
  const status = error.status ? String(error.status) : "";

  if (status && text) {
    return `${status}: ${text}`;
  }

  return status || text;
}
