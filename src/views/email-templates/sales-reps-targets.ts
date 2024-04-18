const salesRepsTargets = `
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
        border: 1px solid #000!important;
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
        border-color: #000000!important;
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
        <p>Hi Team,</p>
        <p>A Genetic test case is added to pending cases with existing patient for your approval.</p>
        <br></br>
        <p>Following are the details of newly created case</p>
        <div class="table-view">
            <table>
                <thead>
                    <tr>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Patient Name</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Date Of Birth</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Case Types</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Hospital</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Physician</th>
                        <th style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">Date Of Service</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.patient_name %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.date_of_birth %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.case_type %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.hospital %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.physician %>
                        </td>
                        <td style="overflow:hidden;padding:5px;vertical-align:bottom;border:1px solid #999999;">
                            <%= case_data.date_of_service %>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
</body>

</html>`;

export default salesRepsTargets;