export const salesRepsTargetsTemplate = `
<!DOCTYPE html>
<html>
​

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title></title>
</head>
<style>
    body {
        background: #cbe6f7;
        padding: 20px;
        font-family: 'Verdana', sans-serif;
    }

    table,
    td,
    th {
        border: 1px solid #000 !important;
        border-collapse: collapse;
        font-size: 13px;
    }

    .email-template {
        max-width: 100%;
        margin: 0 auto;
        background: #fff;
        padding: 20px;
        min-height: 350px;
    }

    .email-template h1 {
        font-size: 18px;
        font-weight: normal;
        color: #2333ad;
    }

    .email-template p {
        margin-bottom: 0;
        margin-top: 8px;
    }

    .email-template table {
        max-width: 100%;
        border-collapse: collapse;
        border: 1px solid #000000;
    }

    th,
    td {
        border-color: #000000 !important;
    }

    .email-template th {
        padding: 8px 10px;
        text-align: left;
        font-size: 14px;
    }

    .email-template td {
        padding: 8px 10px;
        font-size: 14px;
    }

    .email-template th,
    .email-template td {
        border-color: #ded5d5;
    }

    .email-template .table-view {
        margin-top: 30px;
    }
</style>
​

<body>
    <div class="email-template">
        <p>Hi <%= sales_rep_name %>,</p>
        <p>Reminder for your volume targets.</p>
        <br></br>
        <p>Following is the summary of this <%= month %> month</p>
        <div class="table-view">
            <table>
                <thead>
                    <tr>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Month
                        </th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Target
                            Volume</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Target
                            Volume Achieved</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= month %> (<%= year %>)
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= target_volume %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= total_cases %>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
</body>

</html>`;