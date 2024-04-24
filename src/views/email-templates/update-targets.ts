export const salesRepsUpdateTargetsNotifyTemplate = `
<!DOCTYPE html>
<html>

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

<body>
    <div class="email-template">
        <p>Hey  <%= sales_rep_name %>,</p>
        <br></br>
        <p>Your monthly sales targets got updated as below</p>
        <div class="table-view">
            <table>
                <thead style="background-color: #ffeff2">
                    <tr>
                        <th
                            style="color: #60737d; font-size: clamp(11px, 0.72vw, 14px); font-weight: 400; text-align: left; padding: 4px 8px; border-bottom: 1px solid #f2f5f9; border-radius: 6px 0 0 0;">
                            Case Type
                        </th>
                        <th
                            style="color: #60737d; font-size: clamp(11px, 0.72vw, 14px); font-weight: 400; text-align: left; padding: 4px 8px; border-bottom: 1px solid #f2f5f9;">
                            Old Targets
                        </th>
                        <th
                            style="color: #60737d; font-size: clamp(11px, 0.72vw, 14px); font-weight: 400; text-align: left; padding: 4px 8px; border-bottom: 1px solid #f2f5f9; border-radius: 0 6px 0 0;">
                            Updated Targets
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <% emailContent.forEach((target)=> { %>
                        <tr style="border-bottom: 1px solid #ddd1ff">
                            <td
                                style="color: #202528; font-size: clamp(10px, 0.625vw, 12px); font-weight: 400; padding: 6px 8px; border-bottom: 1px solid #eaecf0; border-left: 1px solid #eaecf0; border-radius: 0 0 0 6px;">
                                <%= target.caseType %>
                            </td>
                            <td
                                style="color: #202528; font-size: clamp(10px, 0.625vw, 12px); font-weight: 400; padding: 6px 8px; border-bottom: 1px solid #eaecf0;">
                                <%= target.oldTargets %>
                            </td>
                            <td style="color: #202528; font-size: clamp(10px, 0.625vw, 12px); font-weight: 400; padding: 6px 8px;           border-bottom:    1px solid #eaecf0; border-right: 1px solid #eaecf0; border-radius: 0 0 6px 0;
                            <% if (target.updatedTargets !== target.oldTargets) { %> background-color: #ffd8d8; <% } %>">
                            <%= target.updatedTargets %>
</td>
                        </tr>
                        <% }); %>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>
`;