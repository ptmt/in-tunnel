import { useCallback } from "react";

type PermissionState = "unknown" | "granted" | "denied";

export default function useAudioTranscription() {
  const start = useCallback(() => {
    // Web builds do not support native transcription.
  }, []);

  const stop = useCallback(() => {
    // Web builds do not support native transcription.
  }, []);

  const toggle = useCallback(() => {
    // Web builds do not support native transcription.
  }, []);

  return {
    isSupported: false,
    isReady: false,
    canStart: false,
    isRecording: false,
    permissionState: "unknown" as PermissionState,
    error: null,
    downloadProgress: 0,
    committedText: "",
    partialText: "",
    start,
    stop,
    toggle,
  };
}
