import jsPDF from "jspdf";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

export const GenerateHtmlToPdf = (htmlId, filename) => {
  const doc = new jsPDF();

  //get table html
  const pdfTable = document.getElementById(htmlId);
  //html to pdf format
  var html = htmlToPdfmake(pdfTable.innerHTML);

  const documentDefinition = { content: html };
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.createPdf(documentDefinition).download(filename);
};
