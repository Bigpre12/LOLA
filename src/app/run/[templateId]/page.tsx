"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { WizardSteps, InputRenderer, OptionsRenderer, ReviewPanel, AdvancedMode } from "@/components/wizard";
import { Template } from "@/types";

const steps = [
  { id: 1, name: "Upload assets" },
  { id: 2, name: "Configure options" },
  { id: 3, name: "Review & run" },
];

// Mock templates for development
const mockTemplates: Record<string, Template> = {
  "product-gallery": {
    id: "1",
    slug: "product-gallery",
    name: "Product Gallery",
    category: "ECOMMERCE",
    description: "Generate an Amazon-style product gallery from one clean product photo.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true, placeholder: "Describe your product in detail..." },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numAngles", type: "slider", label: "Number of angles", default: 4, min: 2, max: 8 },
      ],
    },
    modelPipeline: {
      steps: [
        { id: "base_cleanup", type: "image_generate", promptTemplate: "Professional product photography of {{productDescription}}, clean white background, studio lighting" },
        { id: "angle_front", type: "image_generate", promptTemplate: "Front view of {{productDescription}}, professional product photography" },
        { id: "angle_side", type: "image_generate", promptTemplate: "Side view of {{productDescription}}, professional product photography" },
        { id: "angle_detail", type: "image_generate", promptTemplate: "Detail close-up of {{productDescription}}, professional product photography" },
      ],
    },
    estimatedCredits: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "lifestyle-set": {
    id: "2",
    slug: "lifestyle-set",
    name: "Lifestyle Set",
    category: "ECOMMERCE",
    description: "Create a lifestyle photography set from a studio product image.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "environmentDescription", type: "textarea", label: "Environment Description", required: true, placeholder: "Describe the lifestyle environment..." },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Number of variants", default: 6, min: 2, max: 10 },
      ],
    },
    modelPipeline: {
      steps: [
        { id: "lifestyle_kitchen", type: "image_generate", promptTemplate: "Product in a modern kitchen setting" },
        { id: "lifestyle_office", type: "image_generate", promptTemplate: "Product in a professional office" },
        { id: "lifestyle_outdoor", type: "image_generate", promptTemplate: "Product in an outdoor setting" },
        { id: "lifestyle_living", type: "image_generate", promptTemplate: "Product in a cozy living room" },
        { id: "lifestyle_studio", type: "image_generate", promptTemplate: "Product in a minimalist studio" },
        { id: "lifestyle_natural", type: "image_generate", promptTemplate: "Product with natural lighting" },
      ],
    },
    estimatedCredits: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "social-ad-pack": {
    id: "3",
    slug: "social-ad-pack",
    name: "Social Ad Pack",
    category: "ADS",
    description: "Generate a multi-format social ad pack from one hero image and tagline.",
    inputSchema: {
      fields: [
        { key: "heroImage", type: "image", label: "Hero Image", required: true },
        { key: "tagline", type: "text", label: "Tagline", required: true, placeholder: "Enter your catchy tagline..." },
        { key: "brandVoice", type: "textarea", label: "Brand Voice", required: false, placeholder: "Describe your brand voice and tone..." },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Number of variants", default: 5, min: 3, max: 10 },
      ],
    },
    modelPipeline: {
      steps: [
        { id: "instagram_square", type: "image_generate", promptTemplate: "Instagram square ad: {{tagline}}" },
        { id: "story_vertical", type: "image_generate", promptTemplate: "Instagram/TikTok story: {{tagline}}" },
        { id: "facebook_landscape", type: "image_generate", promptTemplate: "Facebook landscape ad: {{tagline}}" },
        { id: "tiktok_vertical", type: "image_generate", promptTemplate: "TikTok vertical ad: {{tagline}}" },
        { id: "twitter_banner", type: "image_generate", promptTemplate: "Twitter banner: {{tagline}}" },
      ],
    },
    estimatedCredits: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export default function RunWizardPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const templateId = params.templateId as string;
  const fromRunId = searchParams.get("fromRun");
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [options, setOptions] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showAdvancedToggle, setShowAdvancedToggle] = useState(false);

  // Check if user should see advanced mode
  useEffect(() => {
    async function checkAdvancedMode() {
      if (status !== "authenticated") return;
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const prefs = await res.json();
          setShowAdvancedToggle(prefs.usedAdvancedTools === true);
        }
      } catch {
        // Ignore errors
      }
    }
    checkAdvancedMode();
  }, [status]);

  // Load template
  useEffect(() => {
    async function loadTemplate() {
      try {
        // Try to fetch from API first
        const res = await fetch(`/api/templates/${templateId}`);
        if (res.ok) {
          const data = await res.json();
          setTemplate(data);
        } else {
          // Fall back to mock templates
          const mockTemplate = mockTemplates[templateId];
          if (mockTemplate) {
            setTemplate(mockTemplate);
          }
        }
      } catch {
        // Fall back to mock templates
        const mockTemplate = mockTemplates[templateId];
        if (mockTemplate) {
          setTemplate(mockTemplate);
        }
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  // Initialize default options
  useEffect(() => {
    if (template) {
      const defaultOptions: Record<string, unknown> = {};
      template.optionsSchema.fields.forEach((field) => {
        defaultOptions[field.key] = field.default;
      });
      setOptions(defaultOptions);
    }
  }, [template]);

  // Load previous run data if remixing
  useEffect(() => {
    if (fromRunId && template) {
      // TODO: Fetch previous run and pre-populate inputs/options
    }
  }, [fromRunId, template]);

  const handleInputChange = (key: string, value: unknown) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Clear error when user provides value
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleOptionChange = (key: string, value: unknown) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (!template) return false;

    if (step === 1) {
      const newErrors: Record<string, string> = {};
      template.inputSchema.fields.forEach((field) => {
        if (field.required && !inputs[field.key]) {
          newErrors[field.key] = `${field.label} is required`;
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!template || !session) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/run-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          inputs,
          options,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.runId}`);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to start run");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to start run");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Template not found</h1>
          <Link href="/templates">
            <Button>Browse templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold text-white mb-4">Sign in required</h2>
            <p className="text-slate-400 mb-6">You need to sign in to run workflows.</p>
            <Link href="/auth/signin">
              <Button>Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/templates"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Back to templates
              </Link>
              <h1 className="text-2xl font-bold text-white mt-2">{template.name}</h1>
              <p className="text-slate-400 mt-1">{template.description}</p>
            </div>
          </div>
          <WizardSteps steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 sm:p-8">
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-6">Upload your assets</h2>
                <InputRenderer
                  fields={template.inputSchema.fields}
                  values={inputs}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-6">Configure options</h2>
                <OptionsRenderer
                  fields={template.optionsSchema.fields}
                  values={options}
                  onChange={handleOptionChange}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-6">Review & run</h2>
                <ReviewPanel template={template} inputs={inputs} options={options} />
                
                {/* Advanced mode toggle - only shown for users who indicated experience with node tools */}
                {showAdvancedToggle && (
                  <AdvancedMode
                    pipeline={template.modelPipeline}
                    enabled={advancedMode}
                    onToggle={setAdvancedMode}
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Continue
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Starting run...
                    </>
                  ) : (
                    <>
                      Run workflow
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
