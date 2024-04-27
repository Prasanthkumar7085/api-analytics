export const monthlyTargetsOverviewTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />

    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
    />

    <style>
      body {
        margin: 0;
        line-height: normal;
      }
    </style>
  </head>
  <body>
    <div
      style="
        width: 100%;
        position: relative;
        background-color: #f2f2f2;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 20px;
        box-sizing: border-box;
        gap: 10px;
        text-align: left;
        font-size: 16px;
        color: #1b2459;
        font-family: Poppins;
      "
    >
      <img
        style="
          width: 669px;
          position: absolute;
          margin: 0 !important;
          top: 0px;
          left: calc(50% - 335px);
          height: 180px;
          z-index: 0;
        "
        alt=""
        src="./public/bluestrap.svg"
      />

      <div
        style="
          flex: 1;
          box-shadow: 4px 4px 9px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          background-color: #fff;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 16px;
          z-index: 1;
        "
      >
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 367px;
          "
        >
          <div
            style="
              align-self: stretch;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              gap: 24px;
            "
          >
            <div
              style="
                align-self: stretch;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                gap: 24px;
              "
            >
              <header
                style="
                  align-self: stretch;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <img
                  style="
                    width: 155.4px;
                    position: relative;
                    height: 32px;
                    overflow: hidden;
                    flex-shrink: 0;
                  "
                  alt=""
                  src="./public/labsquirelogo.svg"
                />

                <img
                  style="
                    width: 32px;
                    position: relative;
                    height: 32px;
                    overflow: hidden;
                    flex-shrink: 0;
                  "
                  alt=""
                  src="./public/targeticon.svg"
                />
              </header>
              <img
                style="
                  align-self: stretch;
                  max-width: 100%;
                  overflow: hidden;
                  height: 4px;
                  flex-shrink: 0;
                "
                alt=""
                src="./public/dividerline.svg"
              />

              <div
                style="
                  align-self: stretch;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 12px;
                "
              >
                <h3
                  style="
                    margin: 0;
                    align-self: stretch;
                    position: relative;
                    font-size: inherit;
                    line-height: 100%;
                    font-weight: 400;
                    font-family: inherit;
                  "
                >
                  Monthly Sales Target Overview
                </h3>
                <div
                  style="
                    align-self: stretch;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 6px;
                    font-size: 14px;
                    color: #000;
                  "
                >
                  <div
                    style="
                      align-self: stretch;
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      align-items: flex-start;
                      justify-content: flex-start;
                      gap: 2px;
                    "
                  >
                    <h4
                      style="
                        margin: 0;
                        position: relative;
                        font-size: inherit;
                        line-height: 100%;
                        font-weight: 400;
                        font-family: inherit;
                      "
                    >
                      Hi
                    </h4>
                    <h4
                      style="
                        margin: 0;
                        flex: 1;
                        position: relative;
                        font-size: inherit;
                        line-height: 100%;
                        font-weight: 400;
                        font-family: inherit;
                      "
                    >
                      AFIZ HUDANI,
                    </h4>
                  </div>
                  <div
                    style="
                      align-self: stretch;
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      align-items: flex-start;
                      justify-content: flex-start;
                      gap: 4px;
                      color: #636363;
                    "
                  >
                    <p style="margin: 0; position: relative; line-height: 140%">
                      The Following is the summary report for the month of
                    </p>
                    <p
                      style="
                        margin: 0;
                        position: relative;
                        line-height: 140%;
                        font-weight: 500;
                        color: #000;
                      "
                    >
                      <span>April, 2024</span>
                      <span style="color: #636363">.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <table
              style="
                border-radius: 6px 6px 0px 0px;
                background-color: #fff;
                border: 1px solid #e2e5f4;
                overflow: hidden;
              "
            >
              <tbody>
                <tr>
                  <td
                    style="
                      position: relative;
                      padding-right: 0px;
                      padding-bottom: 0px;
                    "
                  >
                    <div
                      style="
                        width: 100%;
                        background-color: #bf1b39;
                        border-right: 1px solid #e2e5f4;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #fff;
                          text-align: left;
                        "
                      >
                        Month
                      </div>
                    </div>
                  </td>
                  <td
                    style="
                      position: relative;
                      padding-right: 0px;
                      padding-bottom: 0px;
                    "
                  >
                    <div
                      style="
                        background-color: #bf1b39;
                        border-right: 1px solid #e2e5f4;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        width: 100%;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #fff;
                          text-align: left;
                        "
                      >
                        Target Volume
                      </div>
                    </div>
                  </td>
                  <td style="position: relative; padding-bottom: 0px">
                    <div
                      style="
                        width: 100%;
                        background-color: #bf1b39;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        box-sizing: border-box;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #fff;
                          text-align: left;
                        "
                      >
                        Avcheived
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="position: relative; padding-right: 0px">
                    <div
                      style="
                        width: 100%;
                        background-color: #fff;
                        border-right: 1px solid #e2e5f4;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #000;
                          text-align: left;
                        "
                      >
                        January -2024
                      </div>
                    </div>
                  </td>
                  <td style="position: relative; padding-right: 0px">
                    <div
                      style="
                        width: 100%;
                        background-color: #fff;
                        border-right: 1px solid #e2e5f4;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #000;
                          text-align: left;
                        "
                      >
                        200
                      </div>
                    </div>
                  </td>
                  <td style="position: relative">
                    <div
                      style="
                        background-color: rgba(241, 145, 0, 0.2);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 14px 16px;
                        width: 100%;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          position: relative;
                          font-size: 14px;
                          line-height: 100%;
                          font-family: Poppins;
                          color: #f19100;
                          text-align: left;
                        "
                      >
                        50
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer
            style="
              align-self: stretch;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 8px;
              text-align: left;
              font-size: 12px;
              color: #141414;
              font-family: Poppins;
            "
          >
            <div
              style="
                align-self: stretch;
                border-top: 1px solid #8d92ac;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 0px 0px;
              "
            >
              <div
                style="
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 12px;
                "
              >
                <h4
                  style="
                    margin: 0;
                    position: relative;
                    font-size: inherit;
                    line-height: 100%;
                    font-weight: 500;
                    font-family: inherit;
                  "
                >
                  Contact Details
                </h4>
                <div
                  style="
                    align-self: stretch;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 20px;
                    color: #636363;
                  "
                >
                  <div
                    style="
                      width: 140px;
                      display: flex;
                      flex-direction: row;
                      align-items: flex-start;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 140px;
                      max-width: 150px;
                    "
                  >
                    <img
                      style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      "
                      alt=""
                      src="./public/homeicon.svg"
                    />

                    <p
                      style="
                        margin: 0;
                        flex: 1;
                        position: relative;
                        line-height: 120%;
                      "
                    >
                      <span style="display: block">2925 Skyway Circle,</span>
                      <span style="display: block">Irving, TX 75038</span>
                    </p>
                  </div>
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 100px;
                      max-width: 130px;
                    "
                  >
                    <img
                      style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      "
                      alt=""
                      src="./public/callicon.svg"
                    />

                    <p
                      style="
                        margin: 0;
                        position: relative;
                        text-decoration: underline;
                        line-height: 100%;
                      "
                    >
                      +1(214)704-3865
                    </p>
                  </div>
                  <div
                    style="
                      width: 150px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 140px;
                      max-width: 150px;
                    "
                  >
                    <img
                      style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      "
                      alt=""
                      src="./public/mailicon.svg"
                    />

                    <p
                      style="
                        margin: 0;
                        flex: 1;
                        position: relative;
                        text-decoration: underline;
                        line-height: 100%;
                      "
                    >
                      labsquire@info.com
                    </p>
                  </div>
                </div>
              </div>
              <img
                style="
                  width: 36.3px;
                  position: relative;
                  height: 40px;
                  overflow: hidden;
                  flex-shrink: 0;
                "
                alt=""
                src="./public/labsquirelogoicon.svg"
              />
            </div>
            <p
              style="
                margin: 0;
                align-self: stretch;
                position: relative;
                font-size: 10px;
                line-height: 100%;
                color: #959595;
                text-align: center;
              "
            >
              © Copyright 2024 LabSquire
            </p>
          </footer>
        </div>
      </div>
    </div>
  </body>
</html>

`;