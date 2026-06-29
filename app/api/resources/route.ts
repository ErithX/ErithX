import { NextResponse } from "next/server";
import {
  createSlug,
  getResourcesCollection,
  listResources,
  readResourceForm,
  saveResourceFile,
  serializeResource,
} from "@/app/lib/resources/resourceStore";
import type { ResourceDocument } from "@/app/lib/resources/types";
import { getCurrentUser, toSubmitter } from "@/app/lib/superadmin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const resources = await listResources({ status: "approved" });

    return NextResponse.json({
      success: true,
      resources: resources.map(serializeResource),
    });
  } catch (error) {
    console.error("Resources GET error:", error);
    return NextResponse.json({
      success: false,
      resources: [],
      error: "Dynamic resources are not available yet.",
    });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fields = readResourceForm(formData);
    const fileValue = formData.get("attachment");
    const file = fileValue instanceof File ? fileValue : null;
    const savedFile = await saveResourceFile(file);
    const now = new Date();

    const resource: ResourceDocument = {
      ...fields,
      attachmentId: savedFile?.id || null,
      attachmentName: savedFile?.name || null,
      attachmentType: savedFile?.type || null,
      slug: createSlug(fields.title),
      status: "pending",
      source: "user",
      submittedBy: toSubmitter(user),
      createdAt: now,
      updatedAt: now,
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
    };

    const collection = await getResourcesCollection();
    const result = await collection.insertOne(resource);

    return NextResponse.json({
      success: true,
      message: "Resource submitted for verification.",
      resourceId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Resources POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to submit resource.",
      },
      { status: 400 },
    );
  }
}
