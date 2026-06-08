import { useCallback, useState } from "react";

import type { Resume } from "~/types/resume";

export type ExportFormat = "pdf" | "png" | "jpg" | "docx";

/**
 * Client-side resume export.
 * - pdf: opens a print-optimised window (user can "Save as PDF").
 * - png/jpg: rasterises the preview node via SVG foreignObject -> canvas.
 * - docx: generates a minimal Word-compatible HTML document.
 */
export function useResumeExport() {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const exportResume = useCallback(
    async (format: ExportFormat, node: HTMLElement | null, resume: Resume) => {
      if (!node) return;
      setExporting(format);
      try {
        const fileBase = sanitize(resume.title || "resume");
        if (format === "pdf") {
          printNode(node, resume.title);
        } else if (format === "docx") {
          downloadDocx(node, fileBase);
        } else {
          await downloadImage(node, format, fileBase);
        }
      } finally {
        setExporting(null);
      }
    },
    []
  );

  return { exportResume, exporting };
}

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function printNode(node: HTMLElement, title: string) {
  const win = window.open("", "_blank", "width=820,height=1060");
  if (!win) return;
  win.document.write(
    `<html><head><title>${title}</title><style>body{margin:0;background:#fff;}` +
      `@media print{@page{margin:0;}}</style></head><body>${node.outerHTML}</body></html>`
  );
  // Inline computed styles for fidelity
  copyStyles(node, win);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 400);
}

function copyStyles(node: HTMLElement, win: Window) {
  const styleSheets = Array.from(document.styleSheets);
  const styleEl = win.document.createElement("style");
  let css = "";
  for (const sheet of styleSheets) {
    try {
      for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + "\n";
    } catch {
      /* cross-origin sheet, skip */
    }
  }
  styleEl.textContent = css;
  win.document.head.appendChild(styleEl);
  void node;
}

async function downloadImage(node: HTMLElement, format: "png" | "jpg", fileBase: string) {
  const rect = node.getBoundingClientRect();
  const width = Math.ceil(rect.width);
  const height = Math.ceil(node.scrollHeight);
  const clone = node.cloneNode(true) as HTMLElement;
  inlineComputedStyles(node, clone);

  const xml = new XMLSerializer().serializeToString(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml">${xml}</div>` +
    `</foreignObject></svg>`;

  const img = new Image();
  img.crossOrigin = "anonymous";
  const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("render failed"));
    img.src = svgUrl;
  });

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);

  const mime = format === "png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mime, 0.95);
  triggerDownload(dataUrl, `${fileBase}.${format}`);
}

function inlineComputedStyles(source: HTMLElement, target: HTMLElement) {
  const sChildren = source.querySelectorAll<HTMLElement>("*");
  const tChildren = target.querySelectorAll<HTMLElement>("*");
  applyInline(source, target);
  sChildren.forEach((el, i) => {
    if (tChildren[i]) applyInline(el, tChildren[i]);
  });
}

function applyInline(source: HTMLElement, target: HTMLElement) {
  const computed = window.getComputedStyle(source);
  let cssText = "";
  for (const key of computed) {
    cssText += `${key}:${computed.getPropertyValue(key)};`;
  }
  target.setAttribute("style", cssText);
}

function downloadDocx(node: HTMLElement, fileBase: string) {
  const clone = node.cloneNode(true) as HTMLElement;
  inlineComputedStyles(node, clone);
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" ` +
    `xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="utf-8"></head><body>${clone.outerHTML}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${fileBase}.doc`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
