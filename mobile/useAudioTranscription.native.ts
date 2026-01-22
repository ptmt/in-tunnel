import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { AudioManager, AudioRecorder } from "react-native-audio-api";
import { useSpeechToText, WHISPER_TINY_EN } from "react-native-executorch";

type PermissionState = "unknown" | "granted" | "denied";

const SAMPLE_RATE = 16000;
const BUFFER_LENGTH_IN_SAMPLES = 1600;

export default function useAudioTranscription() {
  const model = useSpeechToText({
    model: WHISPER_TINY_EN,
  });
  const recorderRef = useRef<AudioRecorder | null>(null);
  const streamingRef = useRef(false);
  const [permissionState, setPermissionState] = useState<PermissionState>("unknown");
  const [recorderReady, setRecorderReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensurePermissions = useCallback(async () => {
    if (permissionState === "granted") return true;
    try {
      const result = await AudioManager.requestRecordingPermissions();
      if (result === "Granted") {
        setPermissionState("granted");
        return true;
      }
      if (result === "Denied") {
        setPermissionState("denied");
        return false;
      }
      setPermissionState("unknown");
      return false;
    } catch {
      setPermissionState("denied");
      return false;
    }
  }, [permissionState]);

  const stop = useCallback(() => {
    streamingRef.current = false;
    try {
      recorderRef.current?.stop();
    } catch {
      // Ignore stop errors.
    }
    try {
      model.streamStop();
    } catch {
      // Ignore stream stop errors.
    }
  }, [model]);

  const start = useCallback(async () => {
    if (model.isGenerating) return;
    setError(null);
    const allowed = await ensurePermissions();
    if (!allowed) {
      setError("Microphone permission is required to start transcription.");
      return;
    }
    const recorder = recorderRef.current;
    if (!recorder) {
      setError("Recorder is not ready yet.");
      return;
    }

    streamingRef.current = true;
    recorder.onAudioReady(({ buffer }) => {
      if (!streamingRef.current) return;
      try {
        const samples = Array.from(buffer.getChannelData(0));
        model.streamInsert(samples);
      } catch {
        setError("Audio buffer processing failed.");
        stop();
      }
    });

    try {
      recorder.start();
    } catch {
      setError("Failed to start the audio recorder.");
      streamingRef.current = false;
      return;
    }

    try {
      await model.stream();
    } catch {
      setError("Transcription error. Please try again.");
      stop();
    }
  }, [ensurePermissions, model, stop]);

  const toggle = useCallback(() => {
    if (model.isGenerating) {
      stop();
      return;
    }
    void start();
  }, [model.isGenerating, start, stop]);

  useEffect(() => {
    const recorder = new AudioRecorder({
      sampleRate: SAMPLE_RATE,
      bufferLengthInSamples: BUFFER_LENGTH_IN_SAMPLES,
    });
    recorderRef.current = recorder;
    setRecorderReady(true);

    if (Platform.OS === "ios") {
      AudioManager.setAudioSessionOptions({
        iosCategory: "playAndRecord",
        iosMode: "spokenAudio",
        iosOptions: ["allowBluetooth", "defaultToSpeaker"],
      });
    }

    return () => {
      streamingRef.current = false;
      try {
        recorder.stop();
      } catch {
        // Ignore stop errors on teardown.
      }
      try {
        model.streamStop();
      } catch {
        // Ignore stream stop errors on teardown.
      }
      recorderRef.current = null;
    };
  }, [model]);

  const isReady = model.isReady && recorderReady;
  const canStart = isReady && permissionState !== "denied";

  return {
    isSupported: true,
    isReady,
    canStart,
    isRecording: model.isGenerating,
    permissionState,
    error,
    downloadProgress: model.downloadProgress,
    committedText: model.committedTranscription,
    partialText: model.nonCommittedTranscription,
    start,
    stop,
    toggle,
  };
}
