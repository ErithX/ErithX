import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getResourceFilesBucket } from "@/app/lib/mongodb";
import { findResourceById } from "@/app/lib/resources/resourceStore";
import { requireSuperadmin } from "@/app/lib/superadmin";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const resource = await findResourceById(slug);

    if (!resource) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Allow download if resource is approved OR if requesting user is superadmin
    const isAdmin = await requireSuperadmin();
    const isAllowed = resource.status === "approved" || !!isAdmin;

    if (!isAllowed || !resource.attachmentId) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const bucket = await getResourceFilesBucket();
    const downloadStream = bucket.openDownloadStream(resource.attachmentId);

    return new Response(Readable.toWeb(downloadStream) as ReadableStream, {
      headers: {
        "Content-Type": resource.attachmentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${resource.attachmentName || "resource-file"}"`,
      },
    });
  } catch (error) {
    console.error("Resource file error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
