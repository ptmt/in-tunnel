import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useAudioTranscription from "./useAudioTranscription";
import { THEME } from "./theme";

const formatPercent = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0%";
  return `${Math.round(value * 100)}%`;
};

export default function AudioTranscription() {
  const transcription = useAudioTranscription();
  const isDisabled = transcription.isRecording ? false : !transcription.canStart;
  const hasTranscript = Boolean(transcription.committedText || transcription.partialText);

  return (
    <View style={styles.container}>
      {!transcription.isReady ? (
        <View style={styles.loadingBlock}>
          <Text style={styles.label}>Loading Whisper model...</Text>
          <Text style={styles.muted}>{formatPercent(transcription.downloadProgress)}</Text>
        </View>
      ) : (
        <>
          {hasTranscript ? (
            <Text style={styles.transcriptionText}>
              {transcription.committedText}
              {transcription.committedText ? " " : ""}
              <Text style={styles.transcriptionMuted}>{transcription.partialText}</Text>
            </Text>
          ) : (
            <Text style={styles.muted}>Tap Start Recording to begin transcription.</Text>
          )}
        </>
      )}

      {transcription.permissionState === "denied" ? (
        <Text style={styles.errorText}>Microphone permission denied. Enable it in settings.</Text>
      ) : null}
      {transcription.error ? <Text style={styles.errorText}>{transcription.error}</Text> : null}

      <View style={styles.controls}>
        <Pressable
          style={[
            styles.button,
            transcription.isRecording ? styles.buttonDanger : styles.buttonPrimary,
            isDisabled && styles.buttonDisabled,
          ]}
          onPress={transcription.isRecording ? transcription.stop : transcription.start}
          disabled={isDisabled}
        >
          <Text style={styles.buttonText}>
            {transcription.isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </Pressable>
        <Text style={styles.muted}>{transcription.isRecording ? "Listening..." : "Idle"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  loadingBlock: {
    gap: 4,
  },
  label: {
    fontFamily: "SpaceGrotesk_700Bold",
    color: THEME.colors.text,
    fontSize: 14,
  },
  muted: {
    fontFamily: "SpaceGrotesk_500Medium",
    color: THEME.colors.muted,
    fontSize: 12,
  },
  transcriptionText: {
    fontFamily: "SpaceGrotesk_700Bold",
    color: THEME.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  transcriptionMuted: {
    fontFamily: "SpaceGrotesk_500Medium",
    color: THEME.colors.muted,
    fontStyle: "italic",
  },
  errorText: {
    fontFamily: "SpaceGrotesk_500Medium",
    color: THEME.colors.danger,
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonPrimary: {
    backgroundColor: THEME.colors.primary,
  },
  buttonDanger: {
    backgroundColor: THEME.colors.danger,
  },
  buttonDisabled: {
    backgroundColor: THEME.colors.primaryDark,
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: "SpaceGrotesk_700Bold",
    color: THEME.colors.text,
    fontSize: 14,
  },
});
