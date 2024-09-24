import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

export default function PdfImages() {
  const [pdf, setPdf] = useState(null);
  const [width, setWidth] = useState(0);
  const [image, setImage] = useState("");
  const [height, setHeight] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfRendering, setPdfRendering] = useState(false);
  const [pageRendering, setPageRendering] = useState(false);

  const showPdf = async (event) => {
    try {
      setPdfRendering(true);
      const file = event.target.files[0];
      const uri = URL.createObjectURL(file);

      // Load the PDF document
      const _PDF_DOC = await pdfjsLib.getDocument(uri).promise;
      setPdf(_PDF_DOC);
      setTotalPages(_PDF_DOC.numPages);
      setPdfRendering(false);
    } catch (error) {
      alert(error.message);
      console.error("Error loading PDF:", error);
    }
  };

  const renderPage = async () => {
    if (!pdf) return;

    try {
      setPageRendering(true);

      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.querySelector("#pdf-canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const img = canvas.toDataURL("image/png");
      setImage(img);
      setWidth(viewport.width);
      setHeight(viewport.height);
      setPageRendering(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setPageRendering(false);
    }
  };

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    renderPage();
  }, [pdf, currentPage]);

  return (
    <div className="App">
      <button
        id="upload-button"
        onClick={() => document.getElementById("file-to-upload").click()}
      >
        Select PDF
      </button>
      <input
        type="file"
        id="file-to-upload"
        accept="application/pdf"
        hidden
        onChange={showPdf}
      />

      <div id="pdf-main-container">
        <div id="pdf-loader" hidden={!pdfRendering}>
          Loading document...
        </div>
        <div id="page-count-container">
          Page {currentPage} of <span id="pdf-total-pages">{totalPages}</span>
        </div>
        <div id="pdf-contents">
          <div id="pdf-meta">
            <div id="pdf-buttons">
              <button id="pdf-prev" onClick={() => changePage(currentPage - 1)}>
                Previous
              </button>
              <button id="pdf-next" onClick={() => changePage(currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
          <div id="image-canvas-row">
            <canvas id="pdf-canvas"></canvas>
            {image && (
              <img
                id="image-generated"
                src={image}
                alt="PDF Image"
                style={{ width: width, height: height }}
              />
            )}
          </div>
          <div id="page-loader" hidden={!pageRendering}>
            Loading page...
          </div>
        </div>
      </div>
    </div>
  );
}
