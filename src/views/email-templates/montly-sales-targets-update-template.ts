export const monthlyTargetsUpdateTemplate = `<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Simple Responsive HTML Email With Button</title>
  <link rel="stylesheet" href="/email.css" />
  <style>
    img {
      border: none;
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
    }

    body {
      background-color: #eaebed;
      font-family: sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      min-width: 100%;
      width: 100%;
    }

    table td {
      font-family: sans-serif;
      font-size: 14px;
      vertical-align: top;
    }

    /* -------------------------------------
      BODY & CONTAINER
      ------------------------------------- */

    .body {
      background-color: #eaebed;
      width: 100%;
    }

    /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also
      shrink down on a phone or something */
    .container {
      display: block;
      margin: 0 auto !important;
      /* makes it centered */
      max-width: 580px;
      padding: 10px;
      width: 580px;
    }

    /* This should also be a block element, so that it will fill 100% of the .container */
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 580px;
      padding: 10px;
    }

    /* -------------------------------------
      HEADER, FOOTER, MAIN
      ------------------------------------- */
    .main {
      background: #ffffff;
      border-radius: 3px;
      width: 100%;
    }

    .header {
      padding: 20px 0;
    }

    .wrapper {
      box-sizing: border-box;
      padding: 20px;
    }

    .content-block {
      padding-bottom: 10px;
      padding-top: 10px;
    }

    .footer {
      clear: both;
      margin-top: 10px;
      text-align: center;
      width: 100%;
    }

    .footer td,
    .footer p,
    .footer span,
    .footer a {
      color: #9a9ea6;
      font-size: 12px;
      text-align: center;
    }

    /* -------------------------------------
      TYPOGRAPHY
      ------------------------------------- */
    h1,
    h2,
    h3,
    h4 {
      color: #06090f;
      font-family: sans-serif;
      font-weight: 400;
      line-height: 1.4;
      margin: 0;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 35px;
      font-weight: 300;
      text-align: center;
      text-transform: capitalize;
    }

    p,
    ul,
    ol {
      font-family: sans-serif;
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 15px;
    }

    p li,
    ul li,
    ol li {
      list-style-position: inside;
      margin-left: 5px;
    }

    a {
      color: #ec0867;
      text-decoration: underline;
    }

    /* -------------------------------------
      BUTTONS
      ------------------------------------- */
    .btn {
      box-sizing: border-box;
      width: 100%;
    }

    .btn>tbody>tr>td {
      padding-bottom: 15px;
    }

    .btn table {
      min-width: auto;
      width: auto;
    }

    .btn table td {
      background-color: #ffffff;
      border-radius: 5px;
      text-align: center;
    }

    .btn a {
      background-color: #ffffff;
      border: solid 1px #ec0867;
      border-radius: 5px;
      box-sizing: border-box;
      color: #ec0867;
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      padding: 12px 25px;
      text-decoration: none;
      text-transform: capitalize;
    }

    .btn-primary table td {
      background-color: #ec0867;
    }

    .btn-primary a {
      background-color: #ec0867;
      border-color: #ec0867;
      color: #ffffff;
    }

    /* -------------------------------------
      OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
    .last {
      margin-bottom: 0;
    }

    .first {
      margin-top: 0;
    }

    .align-center {
      text-align: center;
    }

    .align-right {
      text-align: right;
    }

    .align-left {
      text-align: left;
    }

    .clear {
      clear: both;
    }

    .mt0 {
      margin-top: 0;
    }

    .mb0 {
      margin-bottom: 0;
    }

    .preheader {
      color: transparent;
      display: none;
      height: 0;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      mso-hide: all;
      visibility: hidden;
      width: 0;
    }

    .powered-by a {
      text-decoration: none;
    }

    hr {
      border: 0;
      border-bottom: 1px solid #f6f6f6;
      margin: 20px 0;
    }

    /* -------------------------------------
      RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
    @media only screen and (max-width: 620px) {
      table[class="body"] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table[class="body"] p,
      table[class="body"] ul,
      table[class="body"] ol,
      table[class="body"] td,
      table[class="body"] span,
      table[class="body"] a {
        font-size: 16px !important;
      }

      table[class="body"] .wrapper,
      table[class="body"] .article {
        padding: 10px !important;
      }

      table[class="body"] .content {
        padding: 0 !important;
      }

      table[class="body"] .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table[class="body"] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table[class="body"] .btn table {
        width: 100% !important;
      }

      table[class="body"] .btn a {
        width: 100% !important;
      }

      table[class="body"] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    /* -------------------------------------
      PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      .btn-primary table td:hover {
        background-color: #d5075d !important;
      }

      .btn-primary a:hover {
        background-color: #d5075d !important;
        border-color: #d5075d !important;
      }
    }

    p {
      margin: 0;
    }

    .section-heading {
      padding: 1rem 0 1.5rem;
    }

    .section-heading .person-name {
      padding: 5px 0;
      color: #000000;
    }

    .section-heading h3 {
      margin: 0;
      color: #1b2459;
      font-size: 1rem;
    }

    .section-heading p {
      color: #8d92ac;
    }

    .section-heading .spl-text-one {
      color: #bf1b39;
      text-transform: uppercase;
    }

    .section-heading .spl-text-two {
      color: #000000;
      font-weight: 600;
    }

    .data-table {
      margin-bottom: 1rem;
      border-radius: 6px 6px 0 0;
      overflow: hidden;
    }

    .data-table table {
      border-collapse: collapse;
      box-shadow: 0 0 0 2px #000;
    }

    .data-table th {
      text-align: left;
      background: #bf1b39;
      padding: 14px 16px;
      color: #fff;
      font-weight: 400;
      font-size: 14px;
      border: 1px solid #e2e5f4;
    }

    .data-table td {
      padding: 14px 16px;
      border: 1px solid #e2e5f4;
      font-size: 14px;
    }

    .postive td {
      background: #ffeaee;
    }

    .postive .updated {
      color: #bf1b39;
    }

    .footer-section .contact-details h6 {
      color: #141414;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      padding: 0.8rem 0;
    }

    .footer-section .contact-details .details-block .each-details img {
      width: 15px !important;
      height: 15px !important;
    }

    .footer-section .contact-details .details-block .each-details p {
      font-size: 12px;
      line-height: 14px;
      color: #636363;
    }

    .footer-section .logo {
      text-align: right;
    }

    .footer-section .logo img {
      width: 50px;
    }
  </style>
</head>

<body class="">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
      <td>&nbsp;</td>
      <td class="container">
        <div class="content">
          <table role="presentation" class="main">
            <tr>
              <td class="wrapper">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <table>
                        <tr>
                          <td>
                            <img
                              src="https://ci3.googleusercontent.com/meips/ADKq_NZwruj5ATZd4OzoYJ7Jjz0dtph_xio9zb1676UcECytTmdJHgmYr_fgIHU3-qx5fXUmQLaUvpFmVp01MryfKxAZTC3yO4ZGyEVpa3FlFiVlIACtVEwoIu9DYKzt112e0c_fAXFO1dxoef_X=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/LabsquireLogo.png"
                              alt="" />
                          </td>
                          <td style="text-align: right">
                            <img
                              src="https://ci3.googleusercontent.com/meips/ADKq_NZgqykhQKtf558muVx7jlnA22SXIdJOJ8_18Cog0m5g2BeTwe7yypiv5zRULRZZ_iyUTkQnTXDnRwofVWcx6wSQ9tsJHKHzB3w6ZIfASbyeV6dk28KcLFZ03wLHuNOXbdpVRYiViQU3=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/TargetIcon.png"
                              alt="" />
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <img style="
                                  max-width: 100%;
                                  overflow: hidden;
                                  height: 4px;
                                " alt=""
                              src="https://ci3.googleusercontent.com/meips/ADKq_NZv-V8Pe_d5FBr4yXe7EvS_he9Nu1v3r8F_VB3Fagmh22huAaLgNzRoVQ_eHzYR7kWSXOs7Qb2ydIzZi2GqsdkByNywHAZNQGdY3dbPkHmVgFcKMpPG_nHzILzb4_VOrsKNcDyqLL0_cQ=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/DividerLine.png"
                              class="CToWUd" data-bit="iit" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <div class="section-heading">
                  <h3>Reminder for sales target update.</h3>
                  <p class="person-name">Hey <%= sales_rep_name %>,</p>
                  <p>
                    Your monthly sales targets got
                    <span class="spl-text-one">updated</span> as below for the
                    month of <span class="spl-text-two"> <%= month %>, <year>.</span>
                  </p>
                </div>
                <div class="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>CaseType</th>
                        <th>Old Targets</th>
                        <th>Updated Targets</th>
                      </tr>
                    </thead>
                    <tbody>
                      <% emailContent.forEach((row)=> { %>
                        <tr class="<%= row.class %> <%= row.updatedTargets !== row.oldTargets ? 'postive updated' : '' %>">
                          <td>
                            <%= row.caseType %>
                          </td>
                          <td>
                            <%= row.oldTargets %>
                          </td>
                          <td>
                            <%= row.updatedTargets %>
                          </td>
                        </tr>
                        <% }); %>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table>
                    <tr class="footer-section">
                      <td>
                        <div class="contact-details">
                          <h6>Contact Details</h6>
                          <table>
                            <tr class="details-block">
                              <td style="width: 120px">
                                <table>
                                  <tr class="each-details">
                                    <td>
                                      <img
                                        src="https://api-analyticslabsquire-staging.up.railway.app/public/images/HomeIcon.png" />
                                    </td>
                                    <td>
                                      <p>
                                        2925 Skyway Circle,Irving, TX 75038
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="width: 100px">
                                <table>
                                  <tr class="each-details">
                                    <td>
                                      <img
                                        src="https://ci3.googleusercontent.com/meips/ADKq_NaRXTGhpyA0gfviK6490-R-RKRUifhgTinZoCBi_STtmiFRcisQzb_CeKqcGGJ56FaumRAeoGLB8-6TsI-IHTm9D37leCxHACkGLYaTH2eyOBl20Ggls-K9oq0cSQrl_xGB1Li9Kg=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/CallIcon.png" />
                                    </td>
                                    <td>
                                      <p>9235481365</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="width: 100px">
                                <table>
                                  <tr class="each-details">
                                    <td>
                                      <img
                                        src="https://ci3.googleusercontent.com/meips/ADKq_NaSqWBobel-jeHoka-DB3pVvuamDYYjUgrp-4WL6Yd18fJLXqYguyE3tZtxt_akX18ZTNB3Xo6oSjcjJberYMrnyaowcFscuQQYqkoCT40dF21qef1RJmVQiXKilB54j0nlrhxboQ=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/MailIcon.png" />
                                    </td>
                                    <td>
                                      <p>labsquire@info.com</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                      <td>
                        <div class="logo">
                          <img
                            src="https://ci3.googleusercontent.com/meips/ADKq_NayFz-fLfFTmBtKWwqsDeaWSKJgXz_nwT68E71nQu-7IkVDpvssEiUmJmRnL_PgSNJSgy5n5MoW0xGz2Xz-UNb9P-WMgzGcr3zqoWuxh937kmBfYnvqvnPy90oi2e81hu0Rk_hJQZlHVPzZ14KQMg=s0-d-e1-ft#https://api-analyticslabsquire-staging.up.railway.app/public/images/LabsquireLogoIcon.png" />
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </td>
      <td>&nbsp;</td>
    </tr>
  </table>
</body>

</html>

`;