/**
 * Robust print helper for printing official school letters in web browsers and iframes.
 */

export function executeIframePrint(elementId: string): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for printing.`);
    return false;
  }

  try {
    let printIframe = document.getElementById('hidden-print-iframe') as HTMLIFrameElement;
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'hidden-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '1px';
      printIframe.style.height = '1px';
      printIframe.style.opacity = '0.01';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);
    }

    const doc = printIframe.contentWindow?.document || printIframe.contentDocument;
    if (!doc) {
      window.print();
      return true;
    }

    // Collect all stylesheets from main document
    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Surat Resmi Sekolah</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 15mm 10mm 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0;
            padding: 10px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .letter-paper {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        </style>
        ${headStyles}
      </head>
      <body>
        <div style="width: 100%; max-width: 210mm; margin: 0 auto;">
          ${element.innerHTML}
        </div>
        <script>
          setTimeout(function() {
            window.focus();
            try {
              window.print();
            } catch (err) {
              console.warn('Iframe print blocked:', err);
            }
          }, 350);
        <\/script>
      </body>
      </html>
    `);
    doc.close();

    // Trigger iframe print
    setTimeout(() => {
      try {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
      } catch (e) {
        console.warn('Direct iframe print exception:', e);
        try {
          window.print();
        } catch (winErr) {
          console.error('Fallback window.print also blocked:', winErr);
        }
      }
    }, 450);

    return true;
  } catch (err) {
    console.error('Error executing iframe print:', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Generates and downloads a self-contained HTML file of the letter.
 * When opened in any browser, it opens the letter and automatically triggers the print dialog.
 */
export function downloadPrintableLetterHtml(
  elementId: string,
  letterNumber: string,
  recipientName: string
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  const cleanNum = letterNumber.replace(/[\/\\:]/g, '_');
  const safeTitle = `Surat_${cleanNum}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - ${recipientName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 15mm 10mm 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      background: #f8fafc;
      color: #000;
      margin: 0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-bar {
      width: 100%;
      max-width: 210mm;
      background: #1e3a8a;
      color: white;
      padding: 12px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: sans-serif;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .print-btn {
      background: #ffffff;
      color: #1e3a8a;
      border: none;
      padding: 8px 18px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    .print-btn:hover {
      background: #e0e7ff;
    }
    .letter-paper {
      width: 210mm;
      min-height: 297mm;
      background: white;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      box-sizing: border-box;
    }
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .print-bar {
        display: none !important;
      }
      .letter-paper {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  </style>
  ${headStyles}
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong style="font-size: 15px;">Dokumen Cetak Surat Resmi</strong>
      <div style="font-size: 12px; opacity: 0.9;">Nomor: ${letterNumber}</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF (Ctrl+P)</button>
  </div>

  <div class="letter-paper">
    ${element.innerHTML}
  </div>

  <script>
    // Automatically trigger print dialog upon opening
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  <\/script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeTitle}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
