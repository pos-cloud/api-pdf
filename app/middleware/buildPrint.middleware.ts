import jsPDF from 'jspdf';
import { PositionPrint } from '../utils/enum';
const { getBarcode } = require('../utils/getBarcode');
const { getCompanyPictureData } = require('../utils/getPicture')

export async function buildPrint(printer: any, article: any, movementOfArticle: any, movementOfCash: any, token: string) {
  return new Promise((resolve, reject) => {
    const pageWidth = printer.pageWidth;
    const pageHigh = printer.pageHigh;
    const units = 'mm';
    const orientation = printer.orientation;
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    async function generatePDF() {
      if (printer.quantity) {
        await buildLayout(doc, PositionPrint.Header, printer, article, token);
        for (let index = 0; index < printer.quantity - 1; index++) {
          doc.addPage();
          await buildLayout(doc, PositionPrint.Header, printer, article, token);
        }
      } else {
        await buildLayout(doc, PositionPrint.Header, printer, article, token);
        await buildBody(doc, movementOfArticle, movementOfCash, printer, article, token);
        await buildLayout(doc, PositionPrint.Footer, printer, article, token);
        if (printer.quantity && printer.quantity > 1) {
          for (let index = 0; index < printer.quantity - 1; index++) {
            doc.addPage();
            await buildLayout(doc, PositionPrint.Header, printer, article, token);
            await buildBody(doc, movementOfArticle, movementOfCash, printer, article, token);
            await buildLayout(doc, PositionPrint.Footer, printer, article, token);
          }
        }
      }

      const pdfDataUri = doc.output('datauristring');
      doc.autoPrint()
      doc.save()
      resolve(pdfDataUri);
    }

    generatePDF().catch(reject);
  });
}


async function buildLayout(doc: any, position: any, printer: any, article: any, token: string) {
  for (const field of printer.fields) {
    if (position && position === field.position) {
      switch (field.type) {
        case 'label':
          await addLabel(field, doc);
          break;
        case 'line':
          addLine(field, doc);
          break;
        case 'image':
          await addImage(field, doc, article, token);
          break;
        case 'barcode':
          await addBarcode(field, doc, article, token);
          break;
        case 'data':
          addData(field, doc, article);
          break;
        case 'dataEsp':
          addDataEsp(field, doc);
          break;
        // case 'dataSum':
        //   await addDataSum(field, doc, movementOfArticle, movementOfCash);
        //   break;
        default:
          break;
      }
    }
  }
  return true;
}

async function addLabel(field: any, doc: any) {
  if (field.font !== 'default') {
    doc.setFont(field.font);
  }
  doc.setFont('', field.fontType);
  doc.setFontSize(field.fontSize);
  doc.text(field.positionStartX, field.positionStartY, field.value);
}

function addLine(field: any, doc: any) {
  doc.setLineWidth(field.fontSize);
  doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
}

async function addImage(field: any, doc: any, article: any, token: string) {
  try {
    const img = await getCompanyPicture(eval(field.value), token);
    doc.addImage(img, 'jpeg', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
  } catch (error) {
    console.log(error)
  }
}

async function getCompanyPicture(img: any, token: string) {
  try {
    const response: any = await getCompanyPictureData(img, token)
    if (!response) {
      return 'error'
    } else {
      let imageURL = 'data:image/jpeg;base64,' + response;
      return imageURL
    }
  } catch (error) {
    console.log(error)
  }


}

async function addBarcode(field: any, doc: any, article: any, token: string) {
  try {
    const response = await getBarcode64('code128?value=' + eval(field.value), token);
    doc.addImage(response, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
  } catch (error) {
    return error
  }
}

async function getBarcode64(barcode: any, token: string) {
  try {
    const barcodeData = await getBarcode(barcode, token);
    if (!barcodeData.data.bc64) {
      return false
    } else {
      const barcode64 = barcodeData.data.bc64;
      const imageURL = 'data:image/png;base64,' + barcode64;
      return imageURL
    }
  } catch (error) {
    return error
  }
}

async function addData(field: any, doc: any, article: any) {
  if (field.font !== 'default') {
    doc.setFont(field.font);
  }
  doc.setFont('', field.fontType);
  doc.setFontSize(field.fontSize);

  try {
    const text = field.positionEndX || field.positionEndY
      ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
      : eval(field.value).toString();
    doc.text(field.positionStartX, field.positionStartY, text);
  } catch (e) {
    doc.text(field.positionStartX, field.positionStartY, " ");
  }
}

function addDataEsp(field: any, doc: any) {
  if (field.font !== 'default') {
    doc.setFont(field.font);
  }
  doc.setFont('', field.fontType);
  doc.setFontSize(field.fontSize);

  try {
    const text = field.positionEndX || field.positionEndY
      ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
      : eval(field.value).toString();

    doc.text(field.positionStartX, field.positionStartY, text);
  } catch (e) {
    doc.text(field.positionStartX, field.positionStartY, " ");
  }
}

///////////////////////////////////////////////////// FALTA CODIGO ////////////////////////////////////////////////
// async function addDataSum(field: any, doc: any,  movementOfArticle: any, movementOfCash: any) {
//   let sum = 0;
//   if (field.font !== 'default') {
//     doc.setFont(field.font);
//   }
//   doc.setFont('', field.fontType);
//   doc.setFontSize(field.fontSize);

//   if (field.value.split('.')[0] === "movementOfArticle" && this.movementOfArticle) {
//     movementOfArticle.forEach(async (movementOfArticle: any) => {
//       sum = sum + eval(field.value);
//     });
//     try {
//       doc.text(field.positionStartX, field.positionStartY, this.roundNumber.transform(sum).toString());
//     } catch (e) {
//       doc.text(field.positionStartX, field.positionStartY, " ");
//     }
//   } else if (field.value.split('.')[0] === "movementOfCash" && this.movementOfCash) {
//     movementOfCash.forEach(async (movementOfCash: any) => {
//       let sum = 0;
//       if (typeof eval("this." + field.value) === "number") {
//         sum = sum + eval("this." + field.value);
//       }
//       try {
//         doc.text(field.positionStartX, field.positionStartY, sum.toString());
//       } catch (e) {
//         doc.text(field.positionStartX, field.positionStartY, " ");
//       }
//     });
//   } else if (field.value.split('.')[0] === "movementOfCancellation" && this.movementOfCancellation) {
//     movementOfCancellation.forEach(async (movementOfCancellation) => {
//       let sum = 0;
//       if (typeof eval("this." + field.value) === "number") {
//         sum = sum + eval("this." + field.value);
//       }
//       try {
//         doc.text(field.positionStartX, field.positionStartY, this.roundNumber.transform(sum).toString());
//       } catch (e) {
//         doc.text(field.positionStartX, field.positionStartY, "");
//       }
//     });
//   } else {
//     try {
//       doc.text(field.positionStartX, field.positionStartY, eval(field.value));
//     } catch (error) {
//       doc.text(field.positionStartX, field.positionStartY, '');
//     }
//   }
// }

async function buildBody(doc: any, movementOfArticle: any, movementOfCash: any, printer: any, articles: any, token: string) {
  let row = 0;
  if (movementOfArticle && movementOfArticle.length > 0) {
    for (const movementOfArticleItem of movementOfArticle) {
      for (const field of printer.fields) {
        if (field.position === PositionPrint.Body && field.value.split('.')[0] === "movementOfArticle") {
          if (field.font !== 'default') {
            doc.setFont(field.font);
          }
          doc.setFont('', field.fontType);
          doc.setFontSize(field.fontSize);

          if (row < field.positionStartY) {
            row = field.positionStartY;
          }

          try {
            doc.text(field.positionStartX, row, (eval(field.value)).toString().slice(field.positionEndX, field.positionEndY));
          } catch (e) {
            doc.text(field.positionStartX, row, " ");
          }
        }
      }

      row = row + printer.row;
      if (row > printer.addPag) {
        row = 0;
        doc.addPage();
        await buildLayout(doc, PositionPrint.Header, printer, articles, token);
      }
    }
  }

  if (movementOfCash && movementOfCash.length > 0) {
    for (const movementOfCashItem of movementOfCash) {
      for (const field of printer.fields) {
        if (field.position === PositionPrint.Body && field.value.split('.')[0] === "movementOfCash") {
          if (field.font !== 'default') {
            doc.setFont(field.font);
          }
          doc.setFont('', field.fontType);
          doc.setFontSize(field.fontSize);

          if (row < field.positionStartY) {
            row = field.positionStartY;
          }

          try {
            doc.text(field.positionStartX, row, (eval(field.value)).toString().slice(field.positionEndX, field.positionEndY));
          } catch (e) {
            doc.text(field.positionStartX, row, " ");
          }
        }
      }

      row = row + printer.row;
      if (row > printer.addPag) {
        row = 0;
        doc.addPage();
        await buildLayout(doc, PositionPrint.Header, printer, articles, token);
      }
    }
  }
  if (articles && articles.length > 0) {
    let largoEtiqueta = 0;
    let altoEtiqueta = printer.labelHigh;

    for (const article of articles) {
      if (largoEtiqueta > printer.pageWidth) {
        row = row + altoEtiqueta;
        largoEtiqueta = 0;

        if (row > printer.pageHigh) {
          row = 0;
          largoEtiqueta = 0;
          doc.addPage();
          await buildLayout(doc, PositionPrint.Header, printer, articles, token);
        }
      }

      for (const field of printer.fields) {
        if (field.position === PositionPrint.Body && field.value.split('.')[0] === "article") {
          if (field.font) {
            doc.setFont(field.font);
          }
          doc.setFont('', field.fontType);
          doc.setFontSize(field.fontSize);

          if (row < field.positionStartY) {
            row = field.positionStartY;
          }
          try {
            doc.text(field.positionStartX + largoEtiqueta, row, (eval(field.value)).toString());
          } catch (e) {
            doc.text(field.positionStartX + largoEtiqueta, row, " ");
          }
        }
      }
      largoEtiqueta = largoEtiqueta + printer.labelWidth;
    }
  }
}