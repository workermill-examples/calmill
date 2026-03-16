"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ExternalLink,
  Code,
  Palette,
  Settings,
  Eye,
} from "lucide-react";

interface EventType {
  id: string;
  title: string;
  slug: string;
  duration: number;
  color?: string;
  isActive: boolean;
}

interface User {
  id: string;
  username: string;
  name: string;
}

interface EmbedConfig {
  mode: "inline" | "popup";
  width: string;
  height: string;
  backgroundColor: string;
  borderRadius: string;
  showTitle: boolean;
  customCSS: string;
}

const defaultConfig: EmbedConfig = {
  mode: "inline",
  width: "100%",
  height: "600px",
  backgroundColor: "transparent",
  borderRadius: "8px",
  showTitle: true,
  customCSS: "",
};

function EmbedCodeGeneratorContent() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [config, setConfig] = useState<EmbedConfig>(defaultConfig);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) throw new Error("Failed to fetch user");
      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch event types
      const eventTypesResponse = await fetch("/api/event-types");
      if (!eventTypesResponse.ok)
        throw new Error("Failed to fetch event types");
      const eventTypesData = await eventTypesResponse.json();
      const activeEventTypes = eventTypesData.eventTypes.filter(
        (et: EventType) => et.isActive,
      );
      setEventTypes(activeEventTypes);

      if (activeEventTypes.length > 0 && !selectedEventType) {
        setSelectedEventType(activeEventTypes[0].slug);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load embed generator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedCode = (type: "html" | "script" | "react") => {
    if (!user || !selectedEventType) return "";

    const embedPath = `${user.username}/${selectedEventType}`;
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://calmill.workermill.com";

    switch (type) {
      case "html":
        if (config.mode === "inline") {
          return `<div data-calmill-embed="${embedPath}" style="width: ${config.width}; height: ${config.height}; border-radius: ${config.borderRadius}; overflow: hidden;${config.backgroundColor !== "transparent" ? ` background-color: ${config.backgroundColor};` : ""}"></div>
<script src="${baseUrl}/embed/calmill-embed.js"></script>`;
        } else {
          return `<button data-calmill-popup="${embedPath}" style="padding: 12px 24px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: system-ui, sans-serif;">Book a Meeting</button>
<script src="${baseUrl}/embed/calmill-embed.js"></script>`;
        }

      case "script":
        return `<script>
// Load CalMill embed script
(function() {
  const script = document.createElement('script');
  script.src = '${baseUrl}/embed/calmill-embed.js';
  script.async = true;
  document.head.appendChild(script);

  script.onload = function() {
    ${
      config.mode === "inline"
        ? `CalMill.embed('#calmill-container', '${embedPath}');`
        : `// Use CalMill.popup('${embedPath}') to open booking popup`
    }
  };
})();
</script>
${config.mode === "inline" ? `<div id="calmill-container" style="width: ${config.width}; height: ${config.height}; border-radius: ${config.borderRadius};${config.backgroundColor !== "transparent" ? ` background-color: ${config.backgroundColor};` : ""}"></div>` : ""}`;

      case "react":
        return `import { useEffect } from 'react';

export function CalMillEmbed() {
  useEffect(() => {
    // Load CalMill embed script
    const script = document.createElement('script');
    script.src = '${baseUrl}/embed/calmill-embed.js';
    script.async = true;
    document.head.appendChild(script);

    ${
      config.mode === "inline"
        ? `script.onload = () => {
      if (window.CalMill) {
        window.CalMill.embed('#calmill-container', '${embedPath}');
      }
    };`
        : `// Listen for booking events
    const handleBooking = (event) => {
      console.log('Booking completed:', event.detail);
      // Handle booking completion
    };

    document.addEventListener('calmillBooking', handleBooking);

    return () => {
      document.removeEventListener('calmillBooking', handleBooking);
    };`
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  ${
    config.mode === "inline"
      ? `return (
    <div
      id="calmill-container"
      style={{
        width: '${config.width}',
        height: '${config.height}',
        borderRadius: '${config.borderRadius}',
        ${config.backgroundColor !== "transparent" ? `backgroundColor: '${config.backgroundColor}',` : ""}
        overflow: 'hidden'
      }}
    />
  );`
      : `const openBooking = () => {
    if (window.CalMill) {
      window.CalMill.popup('${embedPath}');
    }
  };

  return (
    <button
      onClick={openBooking}
      style={{
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      Book a Meeting
    </button>
  );`
  }
}`;

      default:
        return "";
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [key]: true });
      setTimeout(() => {
        setCopied({ ...copied, [key]: false });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const updateConfig = (updates: Partial<EmbedConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    // Force preview refresh
    setPreviewKey((prev) => prev + 1);
  };

  const getPreviewUrl = () => {
    if (!user || !selectedEventType) return "";
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://calmill.workermill.com";
    return `${baseUrl}/embed/${user.username}/${selectedEventType}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <LoadingSkeleton className="w-64 h-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <LoadingSkeleton className="w-full h-32" />
              <LoadingSkeleton className="w-full h-40" />
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="w-full h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <ErrorState
          title="Failed to Load Embed Generator"
          description={error || "Unable to load your profile and event types."}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Embed Code Generator
          </h1>
          <p className="text-muted-foreground">
            Generate embeddable booking widgets for your website. Choose your
            event type, customize the appearance, and copy the code.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Event Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select
                    value={selectedEventType}
                    onValueChange={setSelectedEventType}
                    placeholder="Select an event type"
                    options={[
                      { value: "", label: "Select an event type" },
                      ...eventTypes.map((eventType) => ({
                        value: eventType.slug,
                        label: `${eventType.title} (${eventType.duration} min)`
                      }))
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Embed Mode</label>
                  <Select
                    value={config.mode}
                    onValueChange={(value) =>
                      updateConfig({ mode: value as "inline" | "popup" })
                    }
                    options={[
                      { value: "inline", label: "Inline Widget" },
                      { value: "popup", label: "Popup Button" }
                    ]}
                  />
                  <p className="text-xs text-muted-foreground">
                    {config.mode === "inline"
                      ? "Embeds the booking widget directly in your page"
                      : "Shows a button that opens booking in a popup window"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            {config.mode === "inline" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Width</label>
                      <Input
                        value={config.width}
                        onChange={(e) =>
                          updateConfig({ width: e.target.value })
                        }
                        placeholder="100%"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Height</label>
                      <Input
                        value={config.height}
                        onChange={(e) =>
                          updateConfig({ height: e.target.value })
                        }
                        placeholder="600px"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Background Color
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        value={config.backgroundColor}
                        onChange={(e) =>
                          updateConfig({ backgroundColor: e.target.value })
                        }
                        placeholder="transparent"
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={
                          config.backgroundColor === "transparent"
                            ? "#ffffff"
                            : config.backgroundColor
                        }
                        onChange={(e) =>
                          updateConfig({ backgroundColor: e.target.value })
                        }
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Border Radius</label>
                    <Input
                      value={config.borderRadius}
                      onChange={(e) =>
                        updateConfig({ borderRadius: e.target.value })
                      }
                      placeholder="8px"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Generated Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="space-y-4">
                  <div className="border-b">
                    <nav className="flex space-x-8" aria-label="Tabs">
                      <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                        HTML
                      </button>
                      <button className="border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gray-300">
                        JavaScript
                      </button>
                      <button className="border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gray-300">
                        React
                      </button>
                    </nav>
                  </div>

                  <div className="space-y-4">
                    {["html", "script", "react"].map((type) => (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{type.toUpperCase()}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                generateEmbedCode(type as any),
                                type,
                              )
                            }
                            className="flex items-center space-x-2"
                          >
                            {copied[type] ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                            <span>{copied[type] ? "Copied!" : "Copy"}</span>
                          </Button>
                        </div>
                        <pre className="p-4 bg-gray-50 rounded-lg text-sm overflow-x-auto">
                          <code>{generateEmbedCode(type as any)}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Live Preview</span>
                  </div>
                  {selectedEventType && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getPreviewUrl(), "_blank")}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Full Page</span>
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Preview how your embed will look on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEventType ? (
                  <div className="border rounded-lg overflow-hidden">
                    {config.mode === "inline" ? (
                      <iframe
                        key={previewKey}
                        src={getPreviewUrl()}
                        width="100%"
                        height={config.height}
                        style={{
                          border: "none",
                          background: config.backgroundColor,
                          borderRadius: config.borderRadius,
                        }}
                        title="CalMill Embed Preview"
                      />
                    ) : (
                      <div className="p-8 text-center bg-gray-50">
                        <Button
                          onClick={() =>
                            window.open(
                              getPreviewUrl(),
                              "_blank",
                              "width=800,height=700",
                            )
                          }
                          className="mb-4"
                        >
                          Book a Meeting
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Click the button to test the popup experience
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Select an event type to see the preview
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Copy the code</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred format (HTML, JavaScript, or React)
                    and copy the generated code.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Add to your website</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste the code where you want the booking widget to appear
                    on your website.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">3. Customize (optional)</h4>
                  <p className="text-sm text-muted-foreground">
                    Modify the styling or add event listeners to customize the
                    integration further.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    🎯 Pro Tips
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use inline embeds for a seamless experience</li>
                    <li>• Use popup embeds to save space on your page</li>
                    <li>• Test on different devices and screen sizes</li>
                    <li>
                      • Listen for the `calmillBooking` event to track
                      conversions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmbedGeneratorSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <LoadingSkeleton className="w-64 h-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LoadingSkeleton className="w-full h-32" />
            <LoadingSkeleton className="w-full h-40" />
            <LoadingSkeleton className="w-full h-64" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton className="w-full h-96" />
            <LoadingSkeleton className="w-full h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmbedGeneratorPage() {
  return (
    <Suspense fallback={<EmbedGeneratorSkeleton />}>
      <EmbedCodeGeneratorContent />
    </Suspense>
  );
}
