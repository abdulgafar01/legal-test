"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const injectStylesheet = async (href: string) => {
  if (document.querySelector(`link[data-zoom-css="${href}"]`)) return;
  try {
    const response = await fetch(href, { mode: "cors" });
    if (response.ok) {
      const css = await response.text();
      const style = document.createElement("style");
      style.type = "text/css";
      style.dataset.zoomCss = href;
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
      return;
    }
    console.warn("[zoom-sdk] stylesheet fetch responded", response.status, href);
  } catch (error) {
    console.warn("[zoom-sdk] stylesheet fetch failed", href, error);
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  link.crossOrigin = "anonymous";
  link.dataset.zoomCss = href;
  document.head.appendChild(link);
};

const CONTROL_BUFFER = 0;

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-zoom-sdk="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.zoomSdk = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

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
  const [isIsolated, setIsIsolated] = useState<boolean | null>(null);

  const meetingRootRef = useRef<HTMLDivElement>(null);
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [meetingHeight, setMeetingHeight] = useState<number | null>(null);
  const clientRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const fetchedRef = useRef(false);
  const joiningRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      try {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const consultationId = Number(params.id);
        setLoading(true);

        const detail = await getConsultationById(consultationId);
        setConsultation(detail.data);

        const meetingResponse = await createOrGetZoomMeeting(consultationId);
        const meeting = meetingResponse.data;
        setJoinUrl(meeting.join_url);
        if (meeting.passcode) setPasscode(meeting.passcode);

        const signatureResponse = await getZoomSignature(
          consultationId,
          meeting.meeting_id
        );
        const { signature: sig, sdk_key, meeting_number, passcode: sigPasscode } =
          signatureResponse.data;

        setSignature(sig);
        setSdkKey(sdk_key);
        setMeetingNumber(meeting_number);
        setPasscode((previous) => sigPasscode || previous);
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Unable to load meeting";
        toast.error(message);
        setSdkError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.id]);

  useEffect(() => {
    if (!joinUrl) return;
    if (isIOS() && isSafari()) {
      window.location.href = joinUrl;
    }
  }, [joinUrl]);

  useLayoutEffect(() => {
    const computeHeight = () => {
      const nav = document.querySelector('[data-navbar-root]') as HTMLElement | null;
      const header = headerRef.current;
      const navHeight = nav?.offsetHeight ?? 0;
      const headerHeight = header?.offsetHeight ?? 0;
      const available = window.innerHeight - navHeight - headerHeight;
      setMeetingHeight(available > 0 ? available : 0);
    };

    computeHeight();
    window.addEventListener("resize", computeHeight);
    const ro = new ResizeObserver(computeHeight);
    const nav = document.querySelector('[data-navbar-root]');
    if (nav instanceof HTMLElement) ro.observe(nav);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => {
      window.removeEventListener("resize", computeHeight);
      ro.disconnect();
    };
  }, []);


  useEffect(() => {
    try {
      setIsIsolated(typeof crossOriginIsolated !== "undefined" ? !!crossOriginIsolated : false);
    } catch {
      setIsIsolated(false);
    }
  }, []);

  useEffect(() => {
    const startMeeting = async () => {
      if (loading) return;
      if (!signature || !sdkKey || !meetingNumber) return;
      if (!meetingRootRef.current) return;
      if (joiningRef.current) return;

      joiningRef.current = true;
      setSdkError(null);

      const cdnBase = `https://source.zoom.us/${ZOOM_SDK_VERSION}`;
      const cssAssets = [
        `${cdnBase}/lib/css/bootstrap.css`,
        `${cdnBase}/lib/css/react-select.css`,
      ];
      await Promise.all(cssAssets.map((href) => injectStylesheet(href)));

      const vendorScripts = [
        `${cdnBase}/lib/vendor/react.min.js`,
        `${cdnBase}/lib/vendor/react-dom.min.js`,
        `${cdnBase}/lib/vendor/lodash.min.js`,
        `${cdnBase}/lib/vendor/redux.min.js`,
        `${cdnBase}/lib/vendor/redux-thunk.min.js`,
      ];

      for (const script of vendorScripts) {
        await loadScript(script);
      }

      await loadScript(`${cdnBase}/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.js`);

      const ZoomMtgEmbedded = (window as any).ZoomMtgEmbedded;
      if (!ZoomMtgEmbedded) {
        throw new Error("Zoom Meeting SDK unavailable");
      }

      const rootElement = meetingRootRef.current;
      const client = ZoomMtgEmbedded.createClient();
      clientRef.current = client;

      const displayName =
        (typeof window !== "undefined" && localStorage.getItem("displayName")) || "Guest";

      // Ensure the embedded window always fills the container
      const applyFullSize = () => {
        if (!rootElement) return;
        const setSize = (el: HTMLElement) => {
          el.style.width = "100%";
          el.style.height = "100%";
          el.style.maxWidth = "unset";
          el.style.maxHeight = "unset";
        };
        const child = rootElement.firstElementChild as HTMLElement | null;
        if (child) setSize(child);
        // Also try one more nesting level (Zoom often nests the actual window)
        if (child?.firstElementChild instanceof HTMLElement) setSize(child.firstElementChild);
        // As a fallback, expand any sizable direct descendants
        Array.from(rootElement.querySelectorAll(':scope > div > div'))
          .slice(0, 3)
          .forEach((el) => setSize(el as HTMLElement));
      };

      // Observe container resizes so the meeting grows to the bottom of the screen
      const resizeObserver = new ResizeObserver(() => applyFullSize());
      resizeObserver.observe(rootElement);
      // Observe DOM mutations inside Zoom root to re-apply sizing when Zoom mounts nodes
      const mutationObserver = new MutationObserver(() => applyFullSize());
      mutationObserver.observe(rootElement, { childList: true, subtree: true });
      // add to cleanup
      const previousCleanup = cleanupRef.current;
      cleanupRef.current = () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        previousCleanup?.();
      };

      await client.init({
        zoomAppRoot: rootElement,
        language: "en-US",
        patchJsMedia: true,
        customize: {
          video: {
            defaultViewType: "gallery",
          },
        },
      });

      // Apply sizing once Zoom mounts its DOM
      applyFullSize();
      // Re-apply after join as Zoom may re-render
      setTimeout(applyFullSize, 250);

      await client.join({
        sdkKey,
        signature,
        meetingNumber,
        password: passcode || "",
        userName: displayName,
      });
    };

    startMeeting().catch((error: any) => {
      const message = error?.message || "Zoom SDK failed to load";
      setSdkError(message);
      toast.error(message);
      joiningRef.current = false;
      cleanupRef.current?.();
      cleanupRef.current = null;
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      joiningRef.current = false;
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch {}
        clientRef.current = null;
      }
    };
  }, [loading, signature, sdkKey, meetingNumber, passcode]);

  if (isIOS() && isSafari()) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-xl font-semibold">Opening Zoom…</h1>
        <p>
          If not redirected, <a className="text-blue-600 underline" href={joinUrl}>tap here</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      <div ref={headerRef} className="border-b p-4 flex-none">
        <h1 className="text-lg font-semibold">Video Consultation</h1>
        {consultation && (
          <p className="text-sm text-gray-600">
            With {consultation.practitioner_info.first_name}{" "}
            {consultation.practitioner_info.last_name}
          </p>
        )}
        {isIsolated === false && (
          <p className="mt-2 inline-block rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
            Gallery View may be limited in this browser. Use a desktop Chromium browser for best results.
          </p>
        )}
      </div>
      <div
        ref={meetingContainerRef}
        style={meetingHeight !== null ? { height: meetingHeight } : undefined}
        className="relative flex-1 min-h-0 w-full overflow-hidden"
      >
        <div
          ref={meetingRootRef}
          id="zoom-meeting-root"
          className="absolute inset-0 w-full h-full"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <div className="animate-pulse text-gray-700">Preparing meeting…</div>
          </div>
        )}
      </div>
      {sdkError && (
        <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-red-700 flex-shrink-0">
          {sdkError}. Please retry in a supported desktop browser or contact support.
        </div>
      )}
    </div>
  );
};

export default MeetingPage;

