import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  EmailTemplate,
  TEMPLATE_TYPES,
  TemplateType,
} from "@/lib/email-templates";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { createTemplate } from "@/lib/actions/template.actions";
import { Template } from "@/types/appwrite.types";
import { Spinner } from "../ui/Spinner";

interface TemplateData {
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  placeholders: string[];
}

interface AddTemplateProps {
  updateAvailableTemplate: (newTemplate: EmailTemplate) => void;
}

export default function AddTemplateForm({
  updateAvailableTemplate,
}: AddTemplateProps) {
  const [templateFormData, setTemplateFormData] = useState<TemplateData>({
    name: "",
    type: "job-referral",
    subject: "",
    body: "",
    placeholders: [],
  });
  const [tempPlaceholders, setTemplPlaceholders] = useState<string>("");
  const [isAddingTemplateInProgress, setIsAddingTemplateInProgress] =
    useState<boolean>(false);

  const isButtonDisabled = useMemo(() => {
    return (
      isAddingTemplateInProgress ||
      !(
        templateFormData.name.length &&
        templateFormData.body.length &&
        templateFormData.placeholders.length &&
        templateFormData.subject.length &&
        templateFormData.type
      )
    );
  }, [templateFormData, isAddingTemplateInProgress]);

  const changeTemplateData = (fieldName: string, newValue: string) => {
    if (fieldName === "placeholders") {
      setTemplPlaceholders(newValue);
      return setTemplateFormData((prev) => ({
        ...prev,
        [fieldName]: newValue.length
          ? newValue
              .split(",")
              .map((val) => val.trim())
              .filter(Boolean)
          : [],
      }));
    }

    return setTemplateFormData((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleAddTemplate = async () => {
    const { name, type, subject, body, placeholders } = templateFormData;
    if (!name || !type || !subject || !body || !placeholders.length) {
      return;
    }

    try {
      setIsAddingTemplateInProgress(true);
      const template: Template = await createTemplate(
        templateFormData as Template
      );
      console.log({ addedtemplate: template });
      updateAvailableTemplate({
        id: template.$id,
        name: template.name,
        subject: template.subject,
        body: template.body,
        placeholders: template.placeholders,
        type: template.type,
      });
    } catch (error) {
      console.error(`Error adding new template: Error - `, error);
    } finally {
      setIsAddingTemplateInProgress(false);
    }
  };
  console.log({ templateFormData });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label htmlFor="name" className="block mb-1 mt-2 capitalize">
            Name *
          </label>
          <Input
            required
            value={templateFormData.name}
            onChange={(event) => changeTemplateData("name", event.target.value)}
            placeholder="Identifier Of Your Template"
          />
        </div>

        <div>
          <label
            htmlFor="Select-Email-Template-Type"
            className="block mb-1 mt-2 capitalize"
          >
            Select Email Template Type *
          </label>
          <Select onValueChange={(value) => changeTemplateData("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose A Template Type" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="subject" className="block mb-1 mt-2 capitalize">
            Subject *
          </label>
          <Input
            required
            value={templateFormData.subject}
            onChange={(event) =>
              changeTemplateData("subject", event.target.value)
            }
            placeholder="Ex- Referral Request for {position} Position at.."
          />
        </div>

        <div>
          <label htmlFor="body" className="block mb-1 mt-2 capitalize">
            Body *
          </label>
          <Textarea
            required
            value={templateFormData.body}
            onChange={(event) => changeTemplateData("body", event.target.value)}
            placeholder={`Ex- 
Hi {recipientName},

I hope you are healthy and doing great! 
                
sI recently came across an open position of {position} role at {companyName}.`}
          />
        </div>

        <div>
          <label htmlFor="placeholders" className="block mb-1 mt-2 capitalize">
            Placeholders *
          </label>
          <Input
            required
            value={tempPlaceholders}
            onChange={(event) =>
              changeTemplateData("placeholders", event.target.value)
            }
            placeholder="Comma Separeated Placeholders. Ex - recipientName position companyName"
          />
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            disabled={isButtonDisabled}
            onClick={handleAddTemplate}
          >
            {isAddingTemplateInProgress ? (
              <Spinner loading className="h-4 w-4" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" />
            )}
            Add Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
