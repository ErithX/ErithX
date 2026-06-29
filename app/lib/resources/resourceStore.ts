import { ObjectId, type Filter } from "mongodb";
import { getMongoDb, getResourceFilesBucket } from "@/app/lib/mongodb";
import type { PublicResource, ResourceDocument } from "./types";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function getResourcesCollection() {
  const db = await getMongoDb();
  return db.collection<ResourceDocument>("resources");
}

// Converts a resource title into a readable URL slug.
export function createSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${base || "resource"}-${Date.now().toString(36)}`;
}

function cleanText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function cleanOptionalUrl(value: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function readResourceForm(formData: FormData) {
  const title = cleanText(formData.get("title"));
  const body = cleanText(formData.get("body"));
  const tags = cleanText(formData.get("tags"))
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (!title || !body || tags.length === 0) {
    throw new Error("Title, body, and tags are required.");
  }

  return {
    title: title.slice(0, 160),
    body: body.slice(0, 20000),
    tags,
    resourceType: cleanText(formData.get("resourceType"), "Resource").slice(
      0,
      60,
    ),
    category: cleanText(formData.get("category"), "General").slice(0, 80),
    linkUrl: cleanOptionalUrl(cleanText(formData.get("linkUrl"))),
    imageUrl: cleanOptionalUrl(cleanText(formData.get("imageUrl"))),
  };
}

// Stores optional uploaded files in MongoDB GridFS.
export async function saveResourceFile(file: File | null) {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File must be 8 MB or smaller.");
  }

  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    throw new Error("File type is not supported.");
  }

  const bucket = await getResourceFilesBucket();
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120);
  const uploadStream = bucket.openUploadStream(safeName || "resource-file", {
    metadata: { 
      contentType: file.type,
      createdAt: new Date() 
    },
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.end(buffer, (error?: Error | null) => {
      if (error) reject(error);
      else resolve();
    });
  });

  return {
    id: uploadStream.id as ObjectId,
    name: safeName || file.name,
    type: file.type,
  };
}

export function serializeResource(resource: ResourceDocument): PublicResource {
  const id = resource._id?.toString() || "";

  return {
    id,
    title: resource.title,
    body: resource.body,
    tags: resource.tags,
    resourceType: resource.resourceType,
    category: resource.category,
    linkUrl: resource.linkUrl,
    imageUrl: resource.imageUrl,
    hasAttachment: Boolean(resource.attachmentId),
    attachmentName: resource.attachmentName,
    attachmentType: resource.attachmentType,
    slug: resource.slug,
    status: resource.status,
    source: resource.source,
    submittedBy: resource.submittedBy,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
    approvedAt: resource.approvedAt?.toISOString() || null,
  };
}

export async function findResourceById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getResourcesCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function listResources(filter: Filter<ResourceDocument>) {
  const collection = await getResourcesCollection();

  return collection
    .find(filter)
    .sort({ approvedAt: -1, createdAt: -1 })
    .limit(80)
    .toArray();
}
