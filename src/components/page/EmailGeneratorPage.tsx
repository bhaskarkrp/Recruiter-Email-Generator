'use client'

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { EMAIL_TEMPLATES, getTemplateById } from "@/lib/email-templates";
import clipboardCopy from "clipboard-copy";

export default function EmailGeneratorPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [emailData, setEmailData] = useState<{ [key: string]: string }>({});
  const [previewEmail, setPreviewEmail] = useState<{
    subject: string;
    body: string;
  }>({
    subject: "",
    body: "",
  });

  const handleTemplateChange = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplateId(templateId);

      // Reset email data based on template placeholders
      const initialData: { [key: string]: string } = {};
      template.placeholders.forEach((placeholder) => {
        initialData[placeholder] = "";
      });

      setEmailData(initialData);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    const updatedData = { ...emailData, [key]: value };
    setEmailData(updatedData);

    // Generate preview
    if (selectedTemplateId) {
      const template = getTemplateById(selectedTemplateId);
      if (template) {
        const previewSubject = template.subject.replace(
          /{(\w+)}/g,
          (_, k) => updatedData[k] || `{${k}}`
        );
        const previewBody = template.body.replace(
          /{(\w+)}/g,
          (_, k) => updatedData[k] || `{${k}}`
        );

        setPreviewEmail({ subject: previewSubject, body: previewBody });
      }
    }
  };

  const handleCopyToClipboard = () => {
    const fullEmail = `Subject: ${previewEmail.subject}\n\n${previewEmail.body}`;
    clipboardCopy(fullEmail);
    alert("Email copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recruiter Email Generator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Template Selector */}
              <div>
                <label className="block mb-2">Select Email Template</label>
                <Select onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Input Fields */}
              {selectedTemplateId &&
                getTemplateById(selectedTemplateId)?.placeholders.map(
                  (placeholder) => (
                    <div key={placeholder}>
                      <label className="block mb-2 capitalize">
                        {placeholder.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </label>
                      <Input
                        value={emailData[placeholder] || ""}
                        onChange={(e) =>
                          handleInputChange(placeholder, e.target.value)
                        }
                        placeholder={`Enter ${placeholder}`}
                      />
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>

        {/* Email Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewEmail.subject ? (
              <div>
                <div className="mb-4">
                  <strong>Subject:</strong>
                  <p className="border p-2 rounded">{previewEmail.subject}</p>
                </div>
                <div>
                  <strong>Body:</strong>
                  <Textarea
                    value={previewEmail.body}
                    className="min-h-[300px]"
                    readOnly
                  />
                </div>
                <Button onClick={handleCopyToClipboard} className="mt-4 w-full">
                  <Copy className="mr-2 h-4 w-4" /> Copy Email
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">Select a template to see preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
