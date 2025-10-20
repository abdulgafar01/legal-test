"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Consultation,
  createOrGetZoomMeeting,
  getConsultationById,
  getZoomSignature,
} from "@/lib/api/consultations";

const ZOOM_SDK_VERSION = "4.0.7";

const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1)
  );
};

const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
};

const MeetingPage = () => {
  const params = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [joinUrl, setJoinUrl] = useState("");
  const [signature, setSignature] = useState("");
  const [meetingNumber, setMeetingNumber] = useState("");
  const [sdkKey, setSdkKey] = useState("");
  const [passcode, setPasscode] = useState<string | undefined>();
  const [sdkError, setSdkError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const joiningRef = useRef(false);

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const cid = Number(params.id);
        setLoading(true);

        const detail = await getConsultationById(cid);
        const data = detail.data;
        setConsultation(data);

        const meetingResponse = await createOrGetZoomMeeting(cid);
        const meeting = meetingResponse.data;
        setJoinUrl(meeting.join_url);
        if (meeting.passcode) setPasscode(meeting.passcode);

        const signatureResponse = await getZoomSignature(cid, meeting.meeting_id);
        const { signature: sig, sdk_key, meeting_number, passcode: sigPasscode } =
          signatureResponse.data;

        setSignature(sig);
        setSdkKey(sdk_key);
        setMeetingNumber(meeting_number);
        setPasscode((previous) => sigPasscode || previous);
      } catch (error: any) {
        console.error("Failed to initialise consultation meeting", error);
        const message =
          error?.response?.data?.message || error?.message || "Unable to load meeting";
        toast.error(message);
        setSdkError(message);
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [params.id]);

  useEffect(() => {
    if (!joinUrl) return;
    if (isIOS() && isSafari()) {
      window.location.href = joinUrl;
    }
  }, [joinUrl]);

  useEffect(() => {
    if (loading || !signature || !containerRef.current || joiningRef.current) return;

    const ensureCss = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.crossOrigin = "anonymous";
      console.info("[zoom-loader] injecting css", href);
      document.head.appendChild(link);
    };

    const loadScriptOnce = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[data-zoom-sdk="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.zoomSdk = src;
        script.crossOrigin = "anonymous";
        console.info("[zoom-loader] injecting script", src);
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });

    let client: any = null;
    joiningRef.current = true;
    setSdkError(null);

    (async () => {
      try {
        const cdnBase = `https://source.zoom.us/${ZOOM_SDK_VERSION}`;

        ensureCss(`${cdnBase}/css/bootstrap.css`);
        ensureCss(`${cdnBase}/css/react-select.css`);

        const vendorScripts = [
          `${cdnBase}/lib/vendor/react.min.js`,
          `${cdnBase}/lib/vendor/react-dom.min.js`,
          `${cdnBase}/lib/vendor/lodash.min.js`,
          `${cdnBase}/lib/vendor/redux.min.js`,
          `${cdnBase}/lib/vendor/redux-thunk.min.js`,
        ];

        for (const src of vendorScripts) {
          await loadScriptOnce(src);
        }

        await loadScriptOnce(`${cdnBase}/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.js`);

        const ZoomMtgEmbedded = (window as any).ZoomMtgEmbedded;
        if (!ZoomMtgEmbedded) throw new Error("ZoomMtgEmbedded package import failed");

        client = ZoomMtgEmbedded.createClient();
        const root = containerRef.current!;
        const name =
          (typeof window !== "undefined" && localStorage.getItem("displayName")) ||
          "Guest";

        await client.init({
          zoomAppRoot: root,
          language: "en-US",
          patchJsMedia: true,
          customize: {
            video: { isResizable: true },
          },
        });

        await client.join({
          sdkKey,
          signature,
          meetingNumber,
          password: passcode || "",
          userName: name,
        });
      } catch (err: any) {
        console.error("Zoom Embedded SDK error", err);
        const message = err?.message || "Zoom SDK failed to load";
        setSdkError(message);
        toast.error(message);
        joiningRef.current = false;
      }
    })();

    return () => {
      joiningRef.current = false;
      if (client) {
        try {
          client.leaveMeeting();
        } catch (error) {
          console.warn("Failed to leave meeting", error);
        }
      }
    };
  }, [loading, signature, sdkKey, meetingNumber, passcode]);

  if (isIOS() && isSafari()) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Opening Zoom…</h1>
        <p>
          If not redirected, <a className="text-blue-600 underline" href={joinUrl}>tap here</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Video Consultation</h1>
        {consultation && (
          <p className="text-sm text-gray-600">
            With {consultation.practitioner_info.first_name} {" "}
            {consultation.practitioner_info.last_name}
          </p>
        )}
      </div>
      <div ref={containerRef} id="zmmtg-root" className="flex-1 overflow-hidden" />
      {sdkError && (
        <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-200">
          {sdkError}. Please retry in a supported desktop browser or contact support.
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <div className="animate-pulse text-gray-700">Preparing meeting…</div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;

