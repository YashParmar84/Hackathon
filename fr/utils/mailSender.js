const nodeMailer = require('nodemailer');
const fs = require('fs');

const mailSender = async (email, title, body, attachmentPath) => {
  try {
    let transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
    });

    const mailOptions = {
      from: 'Expesee',
      to: email,
      subject: title,
      html: body,
    };

    if (attachmentPath && fs.existsSync(attachmentPath)) {
      mailOptions.attachments = [
        {
          filename: attachmentPath.split('/').pop(),
          path: attachmentPath
        }
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }
};

// Email template for user ban notification
const sendBanNotification = async (userEmail, userName, banReason, banDuration, adminName) => {
  const title = 'Account Suspension Notice';
  const durationText = banDuration ? `${banDuration} days` : 'permanently';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">Account Suspension Notice</h2>
      <p>Dear ${userName},</p>
      <p>Your account has been suspended due to a policy violation.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Details:</h3>
        <p><strong>Reason:</strong> ${banReason}</p>
        <p><strong>Duration:</strong> ${durationText}</p>
        <p><strong>Actioned by:</strong> ${adminName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>If you believe this action was taken in error, please contact our support team.</p>
      <p>Best regards,<br>The Skill Swap Team</p>
    </div>
  `;

  return await mailSender(userEmail, title, body);
};

// Email template for skill rejection notification
const sendSkillRejectionNotification = async (userEmail, userName, skillName, skillType, reason, adminName) => {
  const title = 'Skill Description Rejected';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f57c00;">Skill Description Rejected</h2>
      <p>Dear ${userName},</p>
      <p>One of your skill descriptions has been rejected for not meeting our community guidelines.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Details:</h3>
        <p><strong>Skill:</strong> ${skillName}</p>
        <p><strong>Type:</strong> ${skillType}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Actioned by:</strong> ${adminName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>Please review our community guidelines and update your skill descriptions accordingly.</p>
      <p>Best regards,<br>The Skill Swap Team</p>
    </div>
  `;

  return await mailSender(userEmail, title, body);
};

// Email template for platform-wide messages
const sendPlatformMessage = async (userEmail, userName, messageTitle, messageContent) => {
  const title = `Platform Update: ${messageTitle}`;
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">Platform Update</h2>
      <p>Dear ${userName},</p>
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>${messageTitle}</h3>
        <p>${messageContent}</p>
      </div>
      <p>Thank you for being part of our community!</p>
      <p>Best regards,<br>The Skill Swap Team</p>
    </div>
  `;

  return await mailSender(userEmail, title, body);
};

// Email template for account status change
const sendStatusChangeNotification = async (userEmail, userName, newStatus, reason, adminName) => {
  const title = 'Account Status Update';
  
  const statusColors = {
    'active': '#4caf50',
    'disabled': '#d32f2f',
    'under_review': '#f57c00'
  };
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColors[newStatus] || '#1976d2'};">Account Status Update</h2>
      <p>Dear ${userName},</p>
      <p>Your account status has been updated.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Details:</h3>
        <p><strong>New Status:</strong> <span style="color: ${statusColors[newStatus] || '#1976d2'}; font-weight: bold;">${newStatus.replace('_', ' ').toUpperCase()}</span></p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Actioned by:</strong> ${adminName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>The Skill Swap Team</p>
    </div>
  `;

  return await mailSender(userEmail, title, body);
};

// Email template for review notes added
const sendReviewNotesNotification = async (userEmail, userName, reviewNotes, adminName) => {
  const title = 'Account Review Update';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">Account Review Update</h2>
      <p>Dear ${userName},</p>
      <p>Review notes have been added to your account.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Review Notes:</h3>
        <p>${reviewNotes}</p>
        <p><strong>Reviewed by:</strong> ${adminName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>Please review these notes and take appropriate action if needed.</p>
      <p>Best regards,<br>The Skill Swap Team</p>
    </div>
  `;

  return await mailSender(userEmail, title, body);
};

module.exports = {
  mailSender,
  sendBanNotification,
  sendSkillRejectionNotification,
  sendPlatformMessage,
  sendStatusChangeNotification,
  sendReviewNotesNotification
};
