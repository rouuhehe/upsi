import { ResultAsync } from "neverthrow";

type AudioRecorder = {
  stop: () => ResultAsync<Blob, Error>;
};

export const createRecorder = (): ResultAsync<AudioRecorder, Error> => {
  return ResultAsync.fromPromise(
    navigator.mediaDevices.getUserMedia({ audio: true }),
    () => new Error("No se pudo acceder al micrófono"),
  ).andThen((stream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.start();

      const recorder: AudioRecorder = {
        stop: () =>
          ResultAsync.fromPromise(
            new Promise<Blob>((resolve) => {
              mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
              };

              mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                resolve(blob);
              };

              mediaRecorder.stop();
            }),
            () => new Error("Error al detener la grabación"),
          ),
      };

      return ResultAsync.fromPromise(Promise.resolve(recorder), () =>
        new Error("No se pudo crear el grabador"),
      );
    } catch {
      return ResultAsync.fromPromise(
        Promise.reject(new Error("No se pudo crear el MediaRecorder")),
        (e) => e as Error,
      );
    }
  });
};
