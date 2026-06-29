import type { ObjectId } from "mongodb";

export type ResourceStatus = "pending" | "approved" | "rejected";

export type ResourceSource = "user" | "admin";

export interface ResourceSubmitter {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

export interface ResourceDocument {
  _id?: ObjectId;
  title: string;
  body: string;
  tags: string[];
  resourceType: string;
  category: string;
  linkUrl: string | null;
  imageUrl: string | null;
  attachmentId: ObjectId | null;
  attachmentName: string | null;
  attachmentType: string | null;
  slug: string;
  status: ResourceStatus;
  source: ResourceSource;
  submittedBy: ResourceSubmitter | null;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
  approvedBy: ResourceSubmitter | null;
  rejectionReason?: string | null;
}

export interface PublicResource {
  id: string;
  title: string;
  body: string;
  tags: string[];
  resourceType: string;
  category: string;
  linkUrl: string | null;
  imageUrl: string | null;
  hasAttachment: boolean;
  attachmentName: string | null;
  attachmentType: string | null;
  slug: string;
  status: ResourceStatus;
  source: ResourceSource;
  submittedBy: ResourceSubmitter | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}
