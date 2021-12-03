const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../../.env"),
});

const { PDFDocument } = require("pdf-lib");
const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");
const ejs = require("ejs");
const { headerTemplate, footerTemplate } = require("./stubs/defaultTemplates");

const spacesEndpoint = new AWS.Endpoint(process.env.END_POINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/** Print hospital pdf with cover page */
async function printPdf(filename, content) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content, {
    waitUntil: "networkidle0",
  });

  const page1 = await page.pdf({
    format: "A4",
    path: `${filename}1.pdf`,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate: "<div></div>",
    pageRanges: "1",
  });

  const remainingPages = await page.pdf({
    format: "A4",
    path: `${filename}2.pdf`,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate,
    pageRanges: "2-",
    // pageRanges: "1",
  });

  await browser.close();

  const pdfDoc = await PDFDocument.create();

  const coverDoc = await PDFDocument.load(page1);
  const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
  pdfDoc.addPage(coverPage);

  const mainDoc = await PDFDocument.load(remainingPages);
  for (let i = 0; i < mainDoc.getPageCount(); i++) {
    const [aMainPage] = await pdfDoc.copyPages(mainDoc, [i]);
    pdfDoc.addPage(aMainPage);
  }

  pdfDoc.setTitle("Hospital analytics");
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setAuthor("Anup Neupane");
  pdfDoc.setSubject("Hospital analytics report");
  pdfDoc.setKeywords(["hospital analytics", "Hospital research"]);
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports.getCloudObjectURL = (key) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="hospital-report.pdf"`,
  });
  return url.replace("sgp1.", "sgp1.cdn.");
};

const filename = "reports";

module.exports.createReport = (data) => {
  const selfCloudObjectURL = (key) => {
    return this.getCloudObjectURL(key);
  };
  return new Promise((res) => {
    ejs.renderFile(
      path.join(__dirname, "./template/index.ejs"),
      { data },
      {},
      async function (err, str) {
        // return res(str);
        const pdfBytes = await printPdf(filename, str);
        var params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `hospital/${filename}.pdf`,
          Body: Buffer.from(pdfBytes),
          ACL: "private",
          ContentType: "application/pdf",
        };
        s3.putObject(params, async function (err) {
          if (err) {
            return { error: true, err };
            // return res.send("Couldn't complete your request");
          } else {
            const reportUrl = `hospital/${filename}.pdf`;
            res(selfCloudObjectURL(reportUrl));
            // const solutionUrl = `pdfs/exams/${version}/${filename}_solutions.pdf`;
            // await ExamPdfVersion.create({
            //   exam_id: exam.id,
            //   version: runningVersion,
            //   question_pdf: `pdfs/exams/${version}/${filename}_question.pdf`,
            //   solution_pdf: solutionUrl,
            // });
            // res.send(getCloudObjectURL(solutionUrl));
          }
        });
      }
    );
  });
};
