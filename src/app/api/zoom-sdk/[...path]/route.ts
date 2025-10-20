import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const VERSION = "2.18.3";
const SDK_ROOT = path.join(process.cwd(), "node_modules", "@zoomus", "websdk", "dist");

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

export async function GET(_request: NextRequest, { params }: { params: { path: string[] } }) {
  const [version, ...segments] = params.path;

  if (version !== VERSION || segments.length === 0) {
    console.warn(`[zoom-sdk] blocked request for unsupported asset: ${params.path.join("/")}`);
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  let filePath: string | null = null;

  if (segments[0] === "css" && segments[1]) {
    filePath = path.join(SDK_ROOT, "css", segments[1]);
  } else if (segments[0] === "lib" && segments[1] === "vendor" && segments[2]) {
    filePath = path.join(SDK_ROOT, "lib", "vendor", segments[2]);
  } else if (segments[0] === `zoomus-websdk-embedded.umd.min.js`) {
    filePath = path.join(SDK_ROOT, "zoomus-websdk-embedded.umd.min.js");
  } else if (segments[0] === `zoom-meeting-embedded-${VERSION}.min.js`) {
    filePath = path.join(SDK_ROOT, "zoom-meeting-embedded-ES5.min.js");
  }

  if (!filePath) {
    console.warn(`[zoom-sdk] unsupported asset path: ${params.path.join("/")}`);
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const extension = filePath.endsWith(".css") ? ".css" : ".js";

    const headers = new Headers();
    headers.set("Content-Type", CONTENT_TYPES[extension]);
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");

    console.info(`[zoom-sdk] served ${params.path.join("/")}`);
    return new NextResponse(new Uint8Array(fileBuffer), { status: 200, headers });
  } catch (error) {
    console.error(`[zoom-sdk] failed to read ${params.path.join("/")}`, error);
    return NextResponse.json(
      { message: "Unable to read SDK asset", detail: (error as Error).message },
      { status: 500 },
    );
  }
}
