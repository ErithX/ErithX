import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import {
  getResourcesCollection,
  serializeResource,
} from "@/app/lib/resources/resourceStore";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const collection = await getResourcesCollection();
    const resourceDocument = await collection.findOne({
      slug,
      status: "approved",
    });

    if (!resourceDocument) {
      notFound();
    }

    const resource = serializeResource(resourceDocument);

    return (
      <main className="min-h-screen bg-zinc-100 px-4 py-8 text-black">
        <article className="mx-auto max-w-4xl rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_#000] md:p-8">
          <Link
            href="/resources"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-yellow-300 px-4 py-2 font-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full border-2 border-black bg-blue-200 px-3 py-1 text-sm font-black">
              {resource.resourceType}
            </span>
            <span className="rounded-full border-2 border-black bg-green-200 px-3 py-1 text-sm font-black">
              {resource.category}
            </span>
            <span className="rounded-full border-2 border-black bg-zinc-100 px-3 py-1 text-sm font-black">
              {formatDate(resource.approvedAt || resource.createdAt)}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-tight md:text-6xl">
            {resource.title}
          </h1>

          <div className="mb-8 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border-2 border-black bg-pink-100 px-3 py-1 text-sm font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {resource.imageUrl && (
            <img
              src={resource.imageUrl}
              alt={resource.title}
              className="mb-8 max-h-[440px] w-full rounded-2xl border-4 border-black object-cover"
            />
          )}

          <div className="prose prose-zinc max-w-none whitespace-pre-wrap text-lg font-semibold leading-8">
            {resource.body}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 border-t-4 border-dashed border-zinc-300 pt-6">
            {resource.linkUrl && (
              <a
                href={resource.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-green-400 px-5 py-3 font-black"
              >
                Open external resource
                <ExternalLink className="h-5 w-5" />
              </a>
            )}

            {resource.hasAttachment && (
              <a
                href={`/api/resources/${resource.id}/file`}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-blue-300 px-5 py-3 font-black"
              >
                Download {resource.attachmentName || "file"}
                <Download className="h-5 w-5" />
              </a>
            )}
          </div>
        </article>
      </main>
    );
  } catch (error) {
    console.error("Resource detail page error:", error);
    notFound();
  }
}
