import { jsPDF } from 'jspdf';
import type { Tool } from '../../types';

export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '');
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }).replace(':', '');
    return `${date}_${time}`;
  }

  private getFileName(toolName: string): string {
    const timestamp = this.getFormattedTimestamp();
    const formattedToolName = toolName.replace(/\s+/g, '_');
    return `${formattedToolName}_${timestamp}`;
  }

  private formatContent(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/#{1,6}\s(.*)/g, '$1')
      .replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1')
      .replace(/`([^`]+)`/g, '$1');
  }

  public exportAsText(content: string, tool: Tool): void {
    const plainText = this.formatContent(content).replace(/\n/g, '\r\n');
    const fileName = this.getFileName(tool.name);
    
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public exportAsPDF(content: string, tool: Tool): void {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    
    const pdfText = this.formatContent(content);
    const lines = doc.splitTextToSize(pdfText, maxWidth);
    let y = margin;

    // Add title
    doc.setFontSize(16);
    doc.text(tool.name, margin, y);
    y += lineHeight * 2;

    // Add content
    doc.setFontSize(12);
    lines.forEach(line => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    const fileName = this.getFileName(tool.name);
    doc.save(`${fileName}.pdf`);
  }
}