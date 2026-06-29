import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  getResourcesCollection,
  serializeResource,
} from "@/app/lib/resources/resourceStore";
import { requireSuperadmin, toSubmitter } from "@/app/lib/superadmin";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const adminUser = await requireSuperadmin();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
    }

    const body = await request.json();
    const action = body.action;
    const now = new Date();
    const collection = await getResourcesCollection();

    if (action === "approve") {
      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "approved",
            approvedAt: now,
            approvedBy: toSubmitter(adminUser),
            updatedAt: now,
            rejectionReason: null,
          },
        },
      );
    } else if (action === "reject") {
      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "rejected",
            rejectionReason: String(body.rejectionReason || "").slice(0, 500),
            updatedAt: now,
          },
        },
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });

    if (!updated) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      resource: serializeResource(updated),
    });
  } catch (error) {
    console.error("Superadmin resource PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 },
    );
  }
}
