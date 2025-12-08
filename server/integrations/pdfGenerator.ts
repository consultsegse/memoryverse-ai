/**
 * Gerador de PDF para livros do MemoryVerse AI
 * 
 * Usa WeasyPrint (disponível no sandbox) para gerar PDFs de alta qualidade
 * a partir de HTML/CSS.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { storagePut } from '../storage';

const execAsync = promisify(exec);

interface BookContent {
  title: string;
  author?: string;
  chapters: Array<{
    title: string;
    content: string;
  }>;
  coverImageUrl?: string;
  illustrations?: Array<{
    chapterIndex: number;
    imageUrl: string;
    caption?: string;
  }>;
}

interface GeneratePDFResult {
  success: boolean;
  pdfUrl?: string;
  error?: string;
}

/**
 * Gera PDF de livro a partir do conteúdo
 */
export async function generateBookPDF(
  memoryId: number,
  content: BookContent
): Promise<GeneratePDFResult> {
  try {
    // 1. Gerar HTML do livro
    const html = generateBookHTML(content);
    
    // 2. Salvar HTML temporário
    const tempHtmlPath = `/tmp/book-${memoryId}.html`;
    const tempPdfPath = `/tmp/book-${memoryId}.pdf`;
    
    await writeFile(tempHtmlPath, html, 'utf-8');
    
    // 3. Converter HTML para PDF usando WeasyPrint
    console.log(`[PDF] Generating PDF for memory ${memoryId}`);
    
    try {
      await execAsync(`weasyprint ${tempHtmlPath} ${tempPdfPath}`);
    } catch (error: any) {
      console.error('[PDF] WeasyPrint error:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
    
    // 4. Ler PDF gerado
    const { readFile } = await import('fs/promises');
    const pdfBuffer = await readFile(tempPdfPath);
    
    // 5. Upload para S3
    const pdfKey = `memories/${memoryId}/book.pdf`;
    const { url: pdfUrl } = await storagePut(pdfKey, pdfBuffer, 'application/pdf');
    
    // 6. Limpar arquivos temporários
    await unlink(tempHtmlPath).catch(() => {});
    await unlink(tempPdfPath).catch(() => {});
    
    console.log(`[PDF] PDF generated successfully: ${pdfUrl}`);
    
    return {
      success: true,
      pdfUrl,
    };
  } catch (error: any) {
    console.error('[PDF] Error generating PDF:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Gera HTML do livro com CSS para impressão
 */
function generateBookHTML(content: BookContent): string {
  const { title, author, chapters, coverImageUrl, illustrations } = content;
  
  // Mapear ilustrações por capítulo
  const illustrationsByChapter = new Map<number, string[]>();
  illustrations?.forEach(ill => {
    const existing = illustrationsByChapter.get(ill.chapterIndex) || [];
    existing.push(ill.imageUrl);
    illustrationsByChapter.set(ill.chapterIndex, existing);
  });
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 2.5cm 2cm;
      
      @top-center {
        content: "${escapeHtml(title)}";
        font-size: 10pt;
        color: #666;
      }
      
      @bottom-center {
        content: counter(page);
        font-size: 10pt;
        color: #666;
      }
    }
    
    @page:first {
      @top-center { content: none; }
      @bottom-center { content: none; }
    }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      text-align: justify;
      hyphens: auto;
    }
    
    h1 {
      font-size: 32pt;
      font-weight: bold;
      text-align: center;
      margin-top: 5cm;
      margin-bottom: 1cm;
      color: #1a1a1a;
      page-break-before: always;
    }
    
    h1:first-of-type {
      page-break-before: avoid;
    }
    
    h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 2cm;
      margin-bottom: 0.5cm;
      color: #2a2a2a;
      page-break-after: avoid;
    }
    
    p {
      margin-bottom: 0.5cm;
      text-indent: 1cm;
      orphans: 3;
      widows: 3;
    }
    
    p:first-of-type {
      text-indent: 0;
    }
    
    .cover {
      page-break-after: always;
      text-align: center;
      margin-top: 8cm;
    }
    
    .cover h1 {
      margin-top: 0;
      page-break-before: avoid;
    }
    
    .cover .author {
      font-size: 14pt;
      color: #666;
      margin-top: 1cm;
    }
    
    .cover-image {
      max-width: 100%;
      max-height: 15cm;
      margin: 2cm auto;
      display: block;
    }
    
    .chapter {
      page-break-before: always;
    }
    
    .illustration {
      max-width: 100%;
      max-height: 12cm;
      margin: 1cm auto;
      display: block;
      page-break-inside: avoid;
    }
    
    .caption {
      text-align: center;
      font-size: 10pt;
      color: #666;
      font-style: italic;
      margin-top: 0.3cm;
      margin-bottom: 1cm;
    }
  </style>
</head>
<body>
  <!-- Capa -->
  <div class="cover">
    ${coverImageUrl ? `<img src="${coverImageUrl}" class="cover-image" alt="Capa" />` : ''}
    <h1>${escapeHtml(title)}</h1>
    ${author ? `<div class="author">por ${escapeHtml(author)}</div>` : ''}
  </div>
  
  <!-- Capítulos -->
  ${chapters.map((chapter, index) => `
    <div class="chapter">
      <h2>Capítulo ${index + 1}: ${escapeHtml(chapter.title)}</h2>
      ${formatContent(chapter.content)}
      ${renderIllustrations(illustrationsByChapter.get(index) || [])}
    </div>
  `).join('\n')}
</body>
</html>
  `.trim();
}

/**
 * Formata conteúdo do capítulo (quebra em parágrafos)
 */
function formatContent(content: string): string {
  return content
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${escapeHtml(p.trim())}</p>`)
    .join('\n');
}

/**
 * Renderiza ilustrações
 */
function renderIllustrations(imageUrls: string[]): string {
  if (imageUrls.length === 0) return '';
  
  return imageUrls
    .map(url => `
      <img src="${url}" class="illustration" alt="Ilustração" />
    `)
    .join('\n');
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Gera PDF simples (fallback se WeasyPrint falhar)
 */
export async function generateSimplePDF(
  memoryId: number,
  content: BookContent
): Promise<GeneratePDFResult> {
  try {
    // Usar biblioteca FPDF2 do Python (disponível no sandbox)
    const { title, chapters } = content;
    
    const pythonScript = `
import sys
from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font('Arial', 'B', 16)

# Título
pdf.cell(0, 10, '${title.replace(/'/g, "\\'")}', ln=True, align='C')
pdf.ln(10)

# Capítulos
pdf.set_font('Arial', '', 12)
${chapters.map((ch, i) => `
pdf.add_page()
pdf.set_font('Arial', 'B', 14)
pdf.cell(0, 10, 'Capítulo ${i + 1}: ${ch.title.replace(/'/g, "\\'")}', ln=True)
pdf.ln(5)
pdf.set_font('Arial', '', 12)
pdf.multi_cell(0, 5, '''${ch.content.replace(/'/g, "\\'")}''')
`).join('\n')}

pdf.output('/tmp/book-${memoryId}.pdf')
print('PDF generated')
    `;
    
    const tempPyPath = `/tmp/generate-book-${memoryId}.py`;
    await writeFile(tempPyPath, pythonScript, 'utf-8');
    
    await execAsync(`python3 ${tempPyPath}`);
    
    // Upload para S3
    const { readFile } = await import('fs/promises');
    const pdfBuffer = await readFile(`/tmp/book-${memoryId}.pdf`);
    
    const pdfKey = `memories/${memoryId}/book.pdf`;
    const { url: pdfUrl } = await storagePut(pdfKey, pdfBuffer, 'application/pdf');
    
    // Limpar
    await unlink(tempPyPath).catch(() => {});
    await unlink(`/tmp/book-${memoryId}.pdf`).catch(() => {});
    
    return {
      success: true,
      pdfUrl,
    };
  } catch (error: any) {
    console.error('[PDF] Simple PDF generation failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
