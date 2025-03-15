"use client";

import React, { useEffect, useState } from "react";
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
import { Copy, Send, LogOutIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  ADMIN_EMAIL_TEMPLATES,
  EMAIL_TEMPLATES,
  EmailTemplate,
  getTemplateById,
  RadioFilers,
} from "@/lib/email-templates";
import clipboardCopy from "clipboard-copy";
import { deleteTemplate, getTemplates } from "@/lib/actions/template.actions";
import AddTemplateForm from "./AddTemplateForm";
import { Template } from "@/types/appwrite.types";
import Modal from "../ui/Modal";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import { loggedinUserId, userDetails } from "@/lib/constants";
import { RadioGroup, RadioItem } from "../ui/radio";
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
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [availableTemplates, setAvailableTemplates] =
    useState<EmailTemplate[]>(EMAIL_TEMPLATES);
  const [addTemplateModalOpen, setAddTemplateModalOpen] =
    useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<any>();
  // const [selectedTemplate] = useState<string>("");

  let loggedInUserId: string | null = null;
  let loggedinuserSession: string | null = null;

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    loggedInUserId = localStorage.getItem(loggedinUserId);
    loggedinuserSession = localStorage.getItem(userDetails);
  }
  useEffect(() => {
    if (loggedInUserId && loggedinuserSession) {
      setIsUserLoggedIn(true);
      setUserSession(JSON.parse(loggedinuserSession));
    }
  }, [addTemplateModalOpen, loggedInUserId, loggedinuserSession]);

  const getAllTemplates = async (userId?: string) => {
    try {
      const templates = await getTemplates(userId);

      if (templates.length > 0) {
        return templates.map((temp: Template) => ({
          id: temp.$id,
          name: temp.name,
          subject: temp.subject,
          body: temp.body,
          placeholders: temp.placeholders,
          type: temp.type,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error getting templates - ", error);
      setAvailableTemplates(EMAIL_TEMPLATES);
    }
  };

  useEffect(() => {
    getAllTemplates().then((templates) =>
      setAvailableTemplates((prev) => [...EMAIL_TEMPLATES, ...templates])
    );
  }, []);

  const updateAvailableTemplate = (newTemplate: EmailTemplate) => {
    setAvailableTemplates((prev) => [...prev, newTemplate]);
    setAddTemplateModalOpen(false);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = getTemplateById(availableTemplates, templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      setPreviewEmail({ subject: "", body: "" });
      setRecipientEmail("");

      // Reset email data based on template placeholders
      const initialData: { [key: string]: string } = {};
      template.placeholders.forEach((placeholder) => {
        initialData[placeholder] = "";
      });

      setEmailData(initialData);
    }
  };

  const handleRadioFilterChange = async (value: RadioFilers) => {
    setSelectedTemplateId("");
    setEmailData({});
    setPreviewEmail({ subject: "", body: "" });
    setRecipientEmail("");

    switch (value) {
      case "all":
        const templates = await getAllTemplates();
        setAvailableTemplates([...EMAIL_TEMPLATES, ...templates]);
        break;
      case "yours":
        if (loggedInUserId) {
          const templates = await getAllTemplates(loggedInUserId);
          setAvailableTemplates(templates);
        }
        break;
      case "admin":
        setAvailableTemplates(ADMIN_EMAIL_TEMPLATES);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (key: string, value: string) => {
    const updatedData = { ...emailData, [key]: value };
    setEmailData(updatedData);

    // Generate preview
    if (selectedTemplateId) {
      const template = getTemplateById(availableTemplates, selectedTemplateId);
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

  console.log({
    selectedTemplateId,
    isThere: [...EMAIL_TEMPLATES, ...ADMIN_EMAIL_TEMPLATES].find(
      (temp) => temp.id !== selectedTemplateId
    ),
  });

  const handleDeleteTemplate = async (selectedTemplateId: string) => {
    try {
      await deleteTemplate(selectedTemplateId);
      location.reload();
      setRecipientEmail("");
    } catch (error) {
      console.error("Error deleting template: ", error);
    }
  };

  const handleCopyToClipboard = () => {
    const fullEmail = `Subject: ${previewEmail.subject}\n\n${previewEmail.body}`;
    clipboardCopy(fullEmail);
    alert("Email copied to clipboard!");
  };

  const generateMailToLink = () => {
    const encodedSubject = encodeURIComponent(previewEmail.subject);
    const encodedBody = encodeURIComponent(previewEmail.body);
    return `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const handleLogout = () => {
    localStorage.removeItem(loggedinUserId);
    localStorage.removeItem(userDetails);
    location.reload();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 md:items-center">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Recruiter Email Generator
        </h1>
        {isUserLoggedIn && (
          <div className="flex gap-5 items-center">
            <h3>Hello, {userSession?.providerUid?.split("@")?.[0]}</h3>
            <LogOutIcon
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
            <CardTitle>Email Configuration</CardTitle>
            <div className="flex">
              <RadioGroup
                className="flex-row gap-5 items-center justify-center"
                defaultChecked
                defaultValue="all"
                onValueChange={handleRadioFilterChange}
              >
                <RadioItem value="all" className="mt-0">
                  All
                </RadioItem>
                {isUserLoggedIn && (
                  <RadioItem value="yours" className="mt-0">
                    Yours
                  </RadioItem>
                )}
                <RadioItem value="admin">Admin</RadioItem>
              </RadioGroup>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Template Selector */}
              <div>
                <label className="block mb-2">Select Email Template</label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Input Fields */}
              {selectedTemplateId && (
                <div>
                  {getTemplateById(
                    availableTemplates,
                    selectedTemplateId
                  )?.placeholders.map((placeholder, index) => (
                    <div key={placeholder + index}>
                      <label className="block mb-1 mt-2 capitalize">
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
                  ))}
                  <div>
                    <label className="block mb-1 mt-2 capitalize">
                      Recipient Email
                    </label>
                    <Input
                      value={recipientEmail || ""}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder={`Enter recipient email address`}
                      type="email"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Preview */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Email Preview</CardTitle>
            {selectedTemplateId &&
              ![...EMAIL_TEMPLATES, ...ADMIN_EMAIL_TEMPLATES].find(
                (temp) => temp.id === selectedTemplateId
              ) && (
                <Trash2Icon
                  className="w-4 h-4 text-red-600 cursor-pointer"
                  onClick={() => handleDeleteTemplate(selectedTemplateId)}
                />
              )}
          </CardHeader>
          <CardContent>
            {previewEmail.subject || previewEmail.body ? (
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
                <Button
                  onClick={generateMailToLink}
                  className="mt-4 w-full"
                  disabled={!recipientEmail}
                >
                  <a
                    href={generateMailToLink()}
                    className="text-white py-2 flex justify-center text-center gap-2 rounded w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send className="mr-2 h-4 w-4" /> Open and Edit in Gmail
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">
                Select and Edit a template to see preview
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex items-end justify-center md:justify-end mt-6">
        <h4 className="pr-4">
          Didn't find helpful template or want to add yours?
        </h4>
        <Button
          className="border rounded p-2"
          onClick={() => setAddTemplateModalOpen(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      {/* Modal to add template */}
      <Modal
        isOpen={addTemplateModalOpen}
        onClose={() => setAddTemplateModalOpen(false)}
        children={
          isUserLoggedIn ? (
            <AddTemplateForm
              updateAvailableTemplate={updateAvailableTemplate}
            />
          ) : showLoginForm ? (
            <LoginForm
              onSwitchToSignup={() => setShowLoginForm(false)}
              closeModal={() => setAddTemplateModalOpen(false)}
            />
          ) : (
            <SignupForm onSwitchToLogin={() => setShowLoginForm(true)} />
          )
        }
      ></Modal>
    </div>
  );
}
