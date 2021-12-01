const date = new Intl.DateTimeFormat("en-us").format(new Date());

module.exports.headerTemplate = `
  <div style='min-height: 100px; width:100%; font-size: 12px; padding: 10px; position: relative'>
    <h3 style="position: absolute;top: -15px; left: 9mm;"><span style='color: red'>Hospital</span><span style="font-weight: 300">Analytics</span></h3>
    <div style="position: absolute; right: 9mm; top: 1%;">
      <span style="color: #ccc; font-size: 9px !important;">${date}</span>
    </div>
  </div>
`;

module.exports.footerTemplate = `
 <div class="footer-template" style="border-top: solid 0.5px #e8e8e8; width: 100%; font-size: 9px;padding: 5px 5px 0; color: #bbb; position: relative;">
    <div style="position: absolute; left: 9mm; top: 5px;">
    <span>© 2021 <a href="https://ombryo.com/">Ombryo</a></span></div>
    <div style="position: absolute; right: 9mm; top: 5px;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
  </div>
`;
