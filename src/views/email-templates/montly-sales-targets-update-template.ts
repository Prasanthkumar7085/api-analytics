export const monthlyTargetsUpdateTemplate = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" />

    <style>
        body {
            margin: 0;
            line-height: normal;
        }
    </style>
</head>

<body>
    <div style="
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
      ">
        <img style="
          width: 669px;
          position: absolute;
          margin: 0 !important;
          top: 0px;
          left: calc(50% - 335px);
          border-radius: 0px 0px 0px 1px;
          height: 180px;
          z-index: 0;
        " alt="" src="./public/bluestrap1.svg" />

        <div style="
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
        ">
            <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 24px;
          ">
                <div style="
              align-self: stretch;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              gap: 24px;
            ">
                    <div style="
                align-self: stretch;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                gap: 24px;
              ">
                        <header style="
                  align-self: stretch;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                ">
                            <img style="
                    width: 155.4px;
                    position: relative;
                    height: 32px;
                    overflow: hidden;
                    flex-shrink: 0;
                  " alt="" src="./public/labsquirelogo.svg" />

                            <img style="
                    width: 32px;
                    position: relative;
                    height: 32px;
                    overflow: hidden;
                    flex-shrink: 0;
                  " alt="" src="./public/targeticon.svg" />
                        </header>
                        <img style="
                  align-self: stretch;
                  max-width: 100%;
                  overflow: hidden;
                  height: 4px;
                  flex-shrink: 0;
                " alt="" src="./public/dividerline.svg" />

                        <div style="
                  align-self: stretch;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 12px;
                ">
                            <h3 style="
                    margin: 0;
                    align-self: stretch;
                    position: relative;
                    font-size: inherit;
                    line-height: 100%;
                    font-weight: 400;
                    font-family: inherit;
                  ">
                                Monthly Sales Target Update(s)
                            </h3>
                            <div style="
                    align-self: stretch;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 6px;
                    font-size: 14px;
                    color: #000;
                  ">
                                <div style="
                      align-self: stretch;
                      display: flex;
                      flex-direction: row;
                      align-items: flex-start;
                      justify-content: flex-start;
                      gap: 2px;
                    ">
                                    <div style="position: relative; line-height: 100%">Hey</div>
                                    <div style="flex: 1; position: relative; line-height: 100%">
                                        Blake Glass,
                                    </div>
                                </div>
                                <div style="
                      align-self: stretch;
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      align-items: flex-start;
                      justify-content: flex-start;
                      color: #636363;
                    ">
                                    <div style="flex: 1; position: relative; line-height: 140%">
                                        <span>We’ve </span>
                                        <span style="
                          text-transform: uppercase;
                          font-weight: 500;
                          color: #bf1b39;
                        ">updated</span>
                                        <span>
                                            your monthly sales target(s). Please review below
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="
                width: 445px;
                border-radius: 6px 6px 0px 0px;
                background-color: #fff;
                border: 1px solid #e2e5f4;
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                max-width: 445px;
                font-size: 14px;
                color: #000;
              ">
                        <div style="
                  align-self: stretch;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                  color: #fff;
                ">
                            <div style="
                    width: 141px;
                    background-color: #bf1b39;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    CaseType
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #bf1b39;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Old Targets
                                </div>
                            </div>
                            <div style="
                    flex: 1;
                    background-color: #bf1b39;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Updated Targets
                                </div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: capitalize;
                    ">
                                    covid
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">50</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">50</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: capitalize;
                    ">
                                    covidFlu
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">100</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">100</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #ffeaee;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: capitalize;
                    ">
                                    clinical
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #ffeaee;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">30</div>
                            </div>
                            <div style="
                    flex: 1;
                    background-color: #ffeaee;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                    color: #bf1b39;
                  ">
                                <div style="position: relative; line-height: 100%">50</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: capitalize;
                    ">
                                    gastro
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">10</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">10</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: capitalize;
                    ">
                                    nail
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">100</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">100</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: uppercase;
                    ">
                                    pgx
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">0</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">0</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  background-color: #ffeaee;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="
                      position: relative;
                      line-height: 100%;
                      text-transform: uppercase;
                    ">
                                    rpp
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">2</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                    color: #bf1b39;
                  ">
                                <div style="position: relative; line-height: 100%">0</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Toxicology
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">20</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">20</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #ffeaee;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Urinalalysis
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #ffeaee;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">5</div>
                            </div>
                            <div style="
                    flex: 1;
                    background-color: #ffeaee;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                    color: #bf1b39;
                  ">
                                <div style="position: relative; line-height: 100%">4</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">UTI</div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">0</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">0</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">Wound</div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">1</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">1</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  background-color: #ffeaee;
                  border-bottom: 1px solid #ffeaee;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Cardiac
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">2</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                    color: #bf1b39;
                  ">
                                <div style="position: relative; line-height: 100%">3</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Diabetes
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">2</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">2</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">PAD</div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">8</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">8</div>
                            </div>
                        </div>
                        <div style="
                  align-self: stretch;
                  border-bottom: 1px solid #e2e5f4;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                ">
                            <div style="
                    width: 141px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">
                                    Pulmonary
                                </div>
                            </div>
                            <div style="
                    width: 136px;
                    background-color: #fff;
                    border-right: 1px solid #e2e5f4;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">10</div>
                            </div>
                            <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 14px 16px;
                  ">
                                <div style="position: relative; line-height: 100%">10</div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer style="
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
            ">
                    <div style="
                align-self: stretch;
                border-top: 1px solid #8d92ac;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 0px 0px;
              ">
                        <div style="
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 12px;
                ">
                            <h4 style="
                    margin: 0;
                    position: relative;
                    font-size: inherit;
                    line-height: 100%;
                    font-weight: 500;
                    font-family: inherit;
                  ">
                                Contact Details
                            </h4>
                            <div style="
                    align-self: stretch;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 20px;
                    color: #636363;
                  ">
                                <div style="
                      width: 140px;
                      display: flex;
                      flex-direction: row;
                      align-items: flex-start;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 140px;
                      max-width: 150px;
                    ">
                                    <img style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      " alt="" src="./public/homeicon.svg" />

                                    <p style="
                        margin: 0;
                        flex: 1;
                        position: relative;
                        line-height: 120%;
                      ">
                                        <span style="display: block">2925 Skyway Circle,</span>
                                        <span style="display: block">Irving, TX 75038</span>
                                    </p>
                                </div>
                                <div style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 100px;
                      max-width: 130px;
                    ">
                                    <img style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      " alt="" src="./public/callicon.svg" />

                                    <p style="
                        margin: 0;
                        position: relative;
                        text-decoration: underline;
                        line-height: 100%;
                      ">
                                        +1(214)704-3865
                                    </p>
                                </div>
                                <div style="
                      width: 150px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: flex-start;
                      gap: 6px;
                      min-width: 140px;
                      max-width: 150px;
                    ">
                                    <img style="
                        width: 14px;
                        position: relative;
                        height: 14px;
                        overflow: hidden;
                        flex-shrink: 0;
                      " alt="" src="./public/mailicon.svg" />

                                    <p style="
                        margin: 0;
                        flex: 1;
                        position: relative;
                        text-decoration: underline;
                        line-height: 100%;
                      ">
                                        labsquire@info.com
                                    </p>
                                </div>
                            </div>
                        </div>
                        <img style="
                  width: 36.3px;
                  position: relative;
                  height: 40px;
                  overflow: hidden;
                  flex-shrink: 0;
                " alt="" src="./public/labsquirelogoicon.svg" />
                    </div>
                    <p style="
                margin: 0;
                align-self: stretch;
                position: relative;
                font-size: 10px;
                line-height: 100%;
                color: #959595;
                text-align: center;
              ">
                        © Copyright 2024 LabSquire
                    </p>
                </footer>
            </div>
        </div>
    </div>
</body>

</html>

`