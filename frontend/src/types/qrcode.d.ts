declare module 'qrcode' {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions,
    callback?: (error: Error | null, canvas: HTMLCanvasElement) => void
  ): Promise<HTMLCanvasElement>;

  export { toDataURL, toCanvas, QRCodeOptions };
}
