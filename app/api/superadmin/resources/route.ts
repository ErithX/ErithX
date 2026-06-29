import { NextResponse } from "next/server";
import {
  createSlug,
  getResourcesCollection,
  listResources,
  readResourceForm,
  saveResourceFile,
  serializeResource,
} from "@/app/lib/resources/resourceStore";
import type {
  ResourceDocument,
  ResourceStatus,
} from "@/app/lib/resources/types";
import { requireSuperadmin, toSubmitter } from "@/app/lib/superadmin";

export const runtime = "nodejs";

const allowedStatuses = new Set<ResourceStatus>([
  "pending",
  "approved",
  "rejected",
]);

export async function GET(request: Request) {
  try {
    const adminUser = await requireSuperadmin();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ResourceStatus | null;
    const filter =
      status && allowedStatuses.has(status) ? { status } : {};
    const resources = await listResources(filter);

    return NextResponse.json({
      success: true,
      resources: resources.map(serializeResource),
    });
  } catch (error) {
    console.error("Superadmin resources GET error:", error);
    return NextResponse.json(
      { error: "Failed to load resources" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await requireSuperadmin();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
      status: "approved",
      source: "admin",
      submittedBy: toSubmitter(adminUser),
      createdAt: now,
      updatedAt: now,
      approvedAt: now,
      approvedBy: toSubmitter(adminUser),
      rejectionReason: null,
    };

    const collection = await getResourcesCollection();
    const result = await collection.insertOne(resource);

    return NextResponse.json({
      success: true,
      resourceId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Superadmin resources POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create resource",
      },
      { status: 400 },
    );
  }
}
