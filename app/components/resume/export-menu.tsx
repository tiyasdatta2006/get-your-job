import { DropdownMenu } from "radix-ui";
import {
  IconDownload,
  IconFileTypeDocx,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypePng,
} from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import type { ExportFormat } from "~/hooks/use-resume-export";

import styles from "./export-menu.module.css";

const FORMATS: { value: ExportFormat; label: string; icon: typeof IconFileTypePdf }[] = [
  { value: "pdf", label: "PDF document", icon: IconFileTypePdf },
  { value: "docx", label: "Word (DOCX)", icon: IconFileTypeDocx },
  { value: "png", label: "PNG image", icon: IconFileTypePng },
  { value: "jpg", label: "JPG image", icon: IconFileTypeJpg },
];

interface ExportMenuProps {
  onExport: (format: ExportFormat) => void;
  exporting: ExportFormat | null;
}

export function ExportMenu({ onExport, exporting }: ExportMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>
          {exporting ? <Spinner size={16} /> : <IconDownload size={16} />} Export
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} align="end" sideOffset={8}>
          {FORMATS.map(({ value, label, icon: Icon }) => (
            <DropdownMenu.Item
              key={value}
              className={styles.item}
              onSelect={() => onExport(value)}
            >
              <Icon size={18} /> {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
