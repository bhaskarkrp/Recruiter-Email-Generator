import { TemplateType } from "@/lib/email-templates";
import { Models } from "node-appwrite";

export interface Template extends Models.Document {
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  placeholders: string[];
}
