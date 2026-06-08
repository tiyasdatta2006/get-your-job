import { IconSparkles } from "@tabler/icons-react";

import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export interface EnhancePrompt {
  title: string;
  description: string;
  onConfirm: () => void;
}

interface AiEnhanceModalProps {
  prompt: EnhancePrompt | null;
  loading: boolean;
  onClose: () => void;
}

export function AiEnhanceModal({ prompt, loading, onClose }: AiEnhanceModalProps) {
  return (
    <Modal
      open={!!prompt}
      onOpenChange={(o) => {
        if (!o && !loading) onClose();
      }}
      icon={<IconSparkles size={24} />}
      title={prompt?.title ?? ""}
      description={prompt?.description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Not now
          </Button>
          <Button onClick={() => prompt?.onConfirm()} disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} /> Enhancing…
              </>
            ) : (
              <>
                <IconSparkles size={16} /> Continue
              </>
            )}
          </Button>
        </>
      }
    />
  );
}
