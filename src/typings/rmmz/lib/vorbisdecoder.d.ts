declare class VorbisDecoder {
  public constructor(context: AudioContext, onDecode: Function, onError: Function);

  public send(arrayBuffer: ArrayBuffer, isLoaded: boolean): void;
  public destroy(): void;
}
