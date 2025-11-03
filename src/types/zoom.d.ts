/**
 * TypeScript type definitions for Zoom Meeting SDK (Component View)
 * Based on Zoom Meeting SDK v3.8.10
 * https://developers.zoom.us/docs/meeting-sdk/web/component-view/
 */

declare global {
  interface Window {
    ZoomMtgEmbedded: typeof ZoomMtgEmbedded;
  }
}

export interface ZoomMtgEmbedded {
  createClient(): ZoomClient;
}

export interface ZoomClient {
  /**
   * Initialize the Zoom Meeting SDK
   */
  init(config: InitConfig): Promise<void>;

  /**
   * Join a Zoom meeting
   */
  join(config: JoinConfig): Promise<void>;

  /**
   * Leave the current meeting
   */
  leaveMeeting(): Promise<void>;

  /**
   * Get current user information
   */
  getCurrentUser(): Promise<UserInfo>;

  /**
   * Get meeting information
   */
  getMeetingInfo(): Promise<MeetingInfo>;
}

export interface InitConfig {
  /**
   * The root HTML element where Zoom will be embedded
   */
  zoomAppRoot: HTMLElement;

  /**
   * Language code (e.g., "en-US", "es-ES")
   * @default "en-US"
   */
  language?: string;

  /**
   * Enable patching of JS Media APIs
   * @default false
   */
  patchJsMedia?: boolean;

  /**
   * Leave meeting when page unloads
   * @default true
   */
  leaveOnPageUnload?: boolean;

  /**
   * Asset path for CDN resources
   */
  assetPath?: string;

  /**
   * Web endpoint for Zoom services
   * @default "zoom.us"
   */
  webEndpoint?: string;

  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean;

  /**
   * Customize SDK behavior
   */
  customize?: {
    video?: {
      /**
       * Default view type
       * @default "gallery"
       */
      defaultViewType?: "gallery" | "speaker";
      
      /**
       * View sizes
       */
      viewSizes?: {
        default?: {
          width: number;
          height: number;
        };
        ribbon?: {
          width: number;
          height: number;
        };
      };
    };
    toolbar?: {
      buttons?: Array<{
        text: string;
        className?: string;
        onClick: () => void;
      }>;
    };
  };
}

export interface JoinConfig {
  /**
   * SDK Key from Zoom Marketplace
   */
  sdkKey: string;

  /**
   * Meeting SDK JWT signature
   */
  signature: string;

  /**
   * Meeting number
   */
  meetingNumber: string;

  /**
   * Meeting password/passcode
   */
  password?: string;

  /**
   * User's display name
   */
  userName: string;

  /**
   * User's email (optional)
   */
  userEmail?: string;

  /**
   * Encryption key (optional)
   */
  tk?: string;

  /**
   * Zoom access token (optional, for Zoom users)
   */
  zak?: string;
}

export interface UserInfo {
  userId: number;
  displayName: string;
  audio: "computer" | "phone" | "muted";
  muted: boolean;
  isHost: boolean;
  isCoHost: boolean;
}

export interface MeetingInfo {
  meetingNumber: string;
  meetingId: string;
  topic: string;
  host: {
    userId: number;
    displayName: string;
  };
  isLocked: boolean;
  isRecording: boolean;
}

export {};
