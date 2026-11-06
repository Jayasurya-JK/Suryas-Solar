// Turns the on-screen A4 sheets into a real .pdf file.
//
// The quote is already laid out as A4 pages in the DOM, so we photograph each page and stack them into a
// PDF. That means the file looks exactly like the preview - no second layout engine to drift out of sync.
// Both libraries are loaded on demand, so they cost the app nothing until someone actually saves a PDF.

export const quoteFileName = (q = {}) => {
  const who = String(q.customer?.name || "Quote").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  const ref = String(q.ref_no || "").replace(/[\/\\]/g, "-");
  return `${who}-${ref}.pdf`;
};

const nextPaint = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export async function saveQuotePdf(root, filename) {
  if (!root) throw new Error("Nothing to save");
  const sheets = Array.from(root.querySelectorAll(".sheet"));
  if (sheets.length === 0) throw new Error("The quote has no pages yet");

  const [html2canvasMod, jspdfMod] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
  const html2canvas = html2canvasMod.default;
  const { jsPDF } = jspdfMod;

  // The sheets are scaled with CSS zoom to fit the column. Photograph them at full size instead.
  const zoomed = root.closest(".qd-zoom");
  const previousZoom = zoomed ? zoomed.style.zoom : null;
  if (zoomed) zoomed.style.zoom = "1";
  await nextPaint();

  try {
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    for (let i = 0; i < sheets.length; i++) {
      const canvas = await html2canvas(sheets[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/jpeg", 0.82);
      if (i > 0) pdf.addPage();
      pdf.addImage(image, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    const url = URL.createObjectURL(pdf.output("blob"));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { pages: sheets.length };
  } finally {
    if (zoomed && previousZoom !== null) zoomed.style.zoom = previousZoom;
  }
}
