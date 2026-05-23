import { createFileRoute } from "@tanstack/react-router";
import { FormStoreProvider } from "@/lib/form-store";
import { BuilderHeader } from "@/components/builder/builder-header";
import { ChatPanel } from "@/components/builder/chat-panel";
import { FormCanvas } from "@/components/builder/form-canvas";
import { Inspector } from "@/components/builder/inspector";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Symmetry — AI Form Builder" },
      {
        name: "description",
        content:
          "Build advanced, dynamic forms by describing them to an AI. 50+ field types, conditional logic, payments, signatures, and more.",
      },
      { property: "og:title", content: "Symmetry — AI Form Builder" },
      {
        property: "og:description",
        content: "Describe your form. Get a beautifully styled, production-ready form in seconds.",
      },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  return (
    <FormStoreProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <BuilderHeader />
        <div className="flex flex-1 overflow-hidden">
          <ChatPanel />
          <FormCanvas />
          <Inspector />
        </div>
      </div>
      <Toaster />
    </FormStoreProvider>
  );
}
