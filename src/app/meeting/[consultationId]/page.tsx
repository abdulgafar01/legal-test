"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getConsultationById,
  createOrGetZoomMeeting,
  getZoomSignature,
  type Consultation,
} from "@/lib/api/consultations";
import { useTranslations } from "next-intl";

// Zoom Meeting SDK version
const ZOOM_SDK_VERSION = "3.8.10";

/**
 * Fresh Zoom Meeting SDK Component View Implementation
 * Based on official Zoom documentation and best practices
 * https://developers.zoom.us/docs/meeting-sdk/web/component-view/
 */
export default function ZoomMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = Number(params.consultationId);
  const t = useTranslations("meeting")

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [meetingNumber, setMeetingNumber] = useState("");
  const [signature, setSignature] = useState("");
  const [sdkKey, setSdkKey] = useState("");
  const [passcode, setPasscode] = useState("");
  const [userName, setUserName] = useState("");

  // Refs
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const isJoiningRef = useRef(false);

  /**
   * Load Zoom Meeting SDK from CDN
   */
  const loadZoomSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if ((window as any).ZoomMtgEmbedded) {
        resolve();
        return;
      }

      // Load React dependencies first (required by Zoom SDK)
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        });
      };

      // Load dependencies in sequence
      Promise.all([
        loadScript(`https://source.zoom.us/${ZOOM_SDK_VERSION}/lib/vendor/react.min.js`),
        loadScript(`https://source.zoom.us/${ZOOM_SDK_VERSION}/lib/vendor/react-dom.min.js`),
      ])
        .then(() => loadScript(`https://source.zoom.us/${ZOOM_SDK_VERSION}/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.js`))
        .then(() => resolve())
        .catch(reject);
    });
  };

  /**
   * Fetch meeting data and credentials
   */
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get consultation details
        const consultationResponse = await getConsultationById(consultationId);
        setConsultation(consultationResponse.data);

        // Create or get existing Zoom meeting
        const meetingResponse = await createOrGetZoomMeeting(consultationId);
        const meeting = meetingResponse.data;

        // Get SDK signature
        const signatureResponse = await getZoomSignature(
          consultationId,
          meeting.meeting_id
        );
        const sigData = signatureResponse.data;

        // Set meeting credentials
        setMeetingNumber(sigData.meeting_number);
        setSignature(sigData.signature);
        setSdkKey(sigData.sdk_key);
        setPasscode(sigData.passcode || meeting.passcode || "");
        
        // Set user name from localStorage or consultation data
        const storedName = localStorage.getItem("displayName");
        const fullName = `${consultationResponse.data.service_seeker_info.first_name} ${consultationResponse.data.service_seeker_info.last_name}`;
        setUserName(storedName || fullName);

        setLoading(false);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to load meeting";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchMeetingData();
    }
  }, [consultationId]);

  /**
   * Initialize and join Zoom meeting
   */
  useEffect(() => {
    const initializeZoomMeeting = async () => {
      // Only proceed if we have all required data and container is ready
      if (
        loading ||
        !signature ||
        !sdkKey ||
        !meetingNumber ||
        !meetingContainerRef.current ||
        isJoiningRef.current
      ) {
        return;
      }

      try {
        isJoiningRef.current = true;
        setError(null);

        // Load Zoom SDK
        await loadZoomSDK();

        const ZoomMtgEmbedded = (window as any).ZoomMtgEmbedded;
        if (!ZoomMtgEmbedded) {
          throw new Error("Zoom Meeting SDK failed to load");
        }

        // Create Zoom client
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        // Initialize the SDK
        await client.init({
          zoomAppRoot: meetingContainerRef.current,
          language: "en-US",
          patchJsMedia: true,
          leaveOnPageUnload: true,
          customize: {
                video: {
                isResizable: true,
                viewSizes: {
                    default: {
                    width: 1000,
                    height: 600
                    }
                }
                }
            }
        });

        console.log("✅ Zoom SDK initialized successfully");

        // Join the meeting
        await client.join({
          sdkKey: sdkKey,
          signature: signature,
          meetingNumber: meetingNumber,
          password: passcode,
          userName: userName,
        });

        console.log("✅ Joined Zoom meeting successfully");
        toast.success("Connected to meeting");
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to join meeting";
        setError(errorMsg);
        toast.error(errorMsg);
        isJoiningRef.current = false;
      }
    };

    initializeZoomMeeting();

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting?.();
        } catch (e) {
          console.error("Error leaving meeting:", e);
        }
        clientRef.current = null;
      }
      isJoiningRef.current = false;
    };
  }, [loading, signature, sdkKey, meetingNumber, passcode, userName]);

  /**
   * Render meeting interface
   */
  return (
    <div className="flex flex-col h-full w-full bg-gray-900">
      {/* Meeting header */}
      <div className="flex-none bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {t("Video Consultation")}
            </h1>
            {consultation && (
              <p className="text-sm text-gray-400 mt-1">
                {t("With")} {consultation.practitioner_info.first_name}{" "}
                {consultation.practitioner_info.last_name}
              </p>
            )}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {t("Leave Meeting")}
          </button>
        </div>
      </div>

      {/* Meeting container */}
      <div className="flex-1 relative w-full min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-sm">{t("Loading meeting")}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md">
              <h3 className="text-red-200 font-semibold mb-2">
                {t("Unable to join meeting")}
              </h3>
              <p className="text-red-300 text-sm mb-4">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
              >
                {t("Go Back")}
              </button>
            </div>
          </div>
        )}

        {/* Zoom SDK will mount here */}
        <div
          ref={meetingContainerRef}
          id="zoom-meeting-container"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
