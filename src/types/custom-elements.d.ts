declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      ar?: string;
      autoRotate?: boolean;
      cameraControls?: boolean;
      poster?: string;
      shadowIntensity?: number;
      exposure?: number;
      environmentImage?: string;
      [key: string]: any;
    };
  }
}
