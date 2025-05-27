const { configDotenv } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const client = SibApiV3Sdk.ApiClient.instance;


// Configure API key authorization
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;

const sendEmail = async (useremail, subject, message) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        try {
            async function SendMain(email) {
                const response = await apiInstance.sendTransacEmail(email);
                console.log("Brevo Response:", response);
                return true
            }
            const messageHtml = `${message}`
            const year = new Date().getFullYear()
            const footerMessage = `
            <p>Best regards,<br>The ASFI Team</p>
    </div>
    
    <div class="footer">
        <p>ASFI - Advancing Scientific Frontiers Initiative</p>
        <p>&copy; ${year} ASFI. All rights reserved.</p>
        <p>
            <a href="https://asfischolar.org" style="color: purple; text-decoration: none;">asfischolar.org</a> | 
            <a href="mailto:info@asfischolar.org" style="color: purple; text-decoration: none;">info@asfischolar.org</a>
        </p>
        <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
            You're receiving this email because you registered for an ASFI event. 
            <a href="#" style="color: purple;">Unsubscribe</a> from future emails.
        </p>
    </div>
          `;
          
                const email = {
                    to: [{ email: useremail }],
                    sender: { email: 'support@asfischolar.org', name: 'ASFI Support' },
                    subject:subject,
                    htmlContent: `<html>                 <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASFIMeet Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: purple;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            background-color: #f9fafb;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            background-color: #f3f4f6;
            border-radius: 0 0 8px 8px;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: purple;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .details {
            background-color: white;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .details-row {
            display: flex;
            margin-bottom: 10px;
        }
        .details-label {
            font-weight: bold;
            width: 120px;
            color: #4b5563;
        }
        .logo {
            height: 40px;
            margin-bottom: 15px;
        }
    </style>
</head>

                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <!-- Logo Container -->
    <div style="
      background-color: purple;
      padding: 20px 0;
      text-align: center;
      border-bottom: 1px solid #eeeeee;
    ">
      <img src="https://res.cloudinary.com/dll8awuig/image/upload/v1747772457/Invoz_white_xpoiqu.png" 
           alt="InvoX Logo" 
           style="max-height: 60px; width: auto; data-imagetype="External">
    </div>
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    ">
                    ${messageHtml}
                    ${footerMessage}
                        </body></html>`
                };
                await SendMain(email);

        } catch (error) {
            console.log("Error sending email:", error);
            return false
           
        }

};

module.exports = sendEmail;