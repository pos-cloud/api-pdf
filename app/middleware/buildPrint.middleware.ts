import jsPDF from "jspdf";

export function buildPrint(printer: any, article: any){

    const pageWidth = printer.pageWidth;
    const pageHigh = printer.pageHigh;
    const units: any = 'mm';
    const orientation: any = printer.orientation;

    const doc = new jsPDF(
      orientation,
      units,
      [pageWidth, pageHigh]
    )
    doc.text(printer.fields[0].positionStartX, printer.fields[0].positionStartY, printer.fields[0].value);
    const pdfBase64 = doc.output('datauristring');
    doc.save()
    console.log(printer.fields[0].positionStartX)
    return pdfBase64

}