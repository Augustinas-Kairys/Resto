import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, tempPassword: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Account Details and Next Steps',
    html: `</head>
    <body style="background-color: #f6f6f6; font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
      <tr>
        <td align="center" bgcolor="#f6f6f6">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);">
  
            <tr>
              <td align="center" bgcolor="#8c1414" style="padding: 20px;">
                <img src="https://i.ibb.co/CmYByWC/restobg.png" alt="Logo" border="0" style="display: block; width: 100px; height: auto;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 10px 0 0;">Welcome to Resto System</h1>
              </td>
            </tr>
  
            <tr>
              <td align="left" style="padding: 30px 40px;">
                <h2 style="color: #333333; font-size: 22px; margin-bottom: 20px;">Register Your Account</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We're excited to have you on board. To complete your registration, please click the button below:</p>
  
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="http://localhost:3000/complete-registration?token=${token}" target="_blank" style="background-color: #8c1414; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 6px; display: inline-block;">Register</a>
                </div>
  
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">If the button above doesn’t work, paste this link into your browser:</p>
                <p style="text-align: center; word-wrap: break-word;"><a href="http://localhost:3000/complete-registration?token=${token}" style="color: #8c1414;" target="_blank">http://localhost:3000/complete-registration?token=${token}</a></p>
              </td>
            </tr>
  
            <tr>
              <td align="center" bgcolor="#f0f0f0" style="padding: 20px; text-align: center; font-size: 14px; color: #999999; border-top: 1px solid #d4dadf;">
                <p style="margin: 0;">Best Regards,<br> Resto System</p>
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#f6f6f6" style="padding: 24px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="center" bgcolor="#f6f6f6" style="padding: 12px 24px; font-size: 14px; line-height: 20px; color: #666;">
                <p style="margin: 0;">You received this email because a registration was requested for your account. If you did not request this, please ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
        </tr>
      </table>
      
        </body>
        </html>

`
    
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};


export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { background-color: #f6f6f6; font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); }
          .header { background-color: #8c1414; padding: 20px; text-align: center; }
          .header img { width: 100px; height: auto; }
          .header h1 { color: #ffffff; font-size: 24px; margin: 10px 0 0; }
          .content { padding: 30px 40px; }
          .content h2 { color: #333333; font-size: 22px; margin-bottom: 20px; }
          .content p { color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
          .content a { background-color: #8c1414; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 14px; color: #999999; border-top: 1px solid #d4dadf; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://i.ibb.co/CmYByWC/restobg.png" alt="Logo">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. To reset your password, click the link below:</p>
            <a href="http://localhost:3000/reset-password?token=${token}" target="_blank">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best Regards,<br> Resto System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
};