import { NextResponse } from "next/server";
import {
  getResourcesCollection,
  serializeResource,
} from "@/app/lib/resources/resourceStore";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const collection = await getResourcesCollection();
    const resource = await collection.findOne({ slug, status: "approved" });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      resource: serializeResource(resource),
    });
  } catch (error) {
    console.error("Resource detail API error:", error);
    return NextResponse.json(
      { error: "Failed to load resource" },
      { status: 500 },
    );
  }
}
