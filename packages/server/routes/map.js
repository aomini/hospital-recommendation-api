const express = require("express");
const router = express.Router();
const UserAuth = require("../middlewares/UserAuth");
const AWS = require("aws-sdk");
const multer = require("multer");
var multerS3 = require("multer-s3");
const puppeteer = require("puppeteer");

// const upload = multer({ dest: "uploads/" });

const spacesEndpoint = new AWS.Endpoint(process.env.END_POINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    // Key: `maps/${filename}.png`,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `maps/${file.originalname}`);
    },
  }),
});

router.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.body);
  res.send("done");
});

router.get("/screenshot", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/street-map?file=base-screenshot");

  await page.waitForSelector("#export");
  await page.click("#export");

  const waitForResponse = (page, url) => {
    return new Promise((resolve) => {
      page.on("response", function callback(response) {
        if (response.url() === url) {
          resolve(response);
          page.removeListener("response", callback);
        }
      });
    });
  };

  await page.waitForResponse((response) => {
    return response.url().includes("/map/upload");
  });

  const exportMaps = async () => {
    return Promise.all([
      await page.waitForSelector("#export"),
      await page.click("#export"),
      await page.waitForResponse((response) => {
        return response.url().includes("/map/upload");
      }),
    ]);
  };

  /** get significant screenshot */
  // await page.goto(
  //   `${process.env.FRONT_END_URL}/street-map?file=significant-screenshot&hospitals=[97,98,99]&zoom=1`
  // );
  // await exportMaps();

  /** Get all significant hospital isoline screenshot with time 10 */
  await page.goto(
    `${process.env.FRONT_END_URL}/street-map?file=significant-screenshot-isoline-10&hospitals=[97,98,99]&isoline=true&time=10`
  );
  await page.waitForResponse((response) => {
    return response
      .url()
      .startsWith(
        "https://api.geoapify.com/v1/isoline?lat=27.6972168&lon=85.33765179999999"
      );
  });
  await page.waitForResponse((response) => {
    return response
      .url()
      .startsWith(
        "https://api.geoapify.com/v1/isoline?lat=27.6883782&lon=85.3335907"
      );
  });
  await exportMaps();

  /** Get all significant hospital isoline screenshot with time 20 */
  // await page.goto(
  //   `${process.env.FRONT_END_URL}/street-map?file=significant-screenshot-isoline-20&hospitals=[97,98,99]&isoline=true&time=20`
  // );
  // await exportMaps();
  // await page.waitForResponse((response) => {
  //   return response.url().includes("/v1/isoline");
  // });

  /** Get single hospital screenshot */
  // await page.goto(
  //   `${process.env.FRONT_END_URL}/street-map?file=hospital-1-default&hospital=99`
  // );
  // await exportMaps();

  /** Get single hospital screenshot isoline with 10km */
  // await page.goto(
  //   `${process.env.FRONT_END_URL}/street-map?file=hospital-area-1-10-isoline&hospital=99&isoline=true&time=10`
  // );
  // await exportMaps();
  // await page.waitForResponse((response) => {
  //   return response.url().includes("/v1/isoline");
  // });

  /** Get single hospital screenshot isoline with 20km */
  // await page.goto(
  //   `${process.env.FRONT_END_URL}/street-map?file=hospital-area-1-20-isoline&hospital=99&isoline=true&time=20`
  // );
  // await exportMaps();
  // await page.waitForResponse((response) => {
  //   return response.url().includes("/v1/isoline");
  // });

  await page.screenshot({ path: "example.png" });

  await browser.close();
  res.send("done");
});

module.exports = router;
