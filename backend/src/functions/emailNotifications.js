import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Helper function to format updates for email
function formatUpdates(updates) {
  return Object.entries(updates)
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase());
      return `- ${formattedKey}: ${value}`;
    })
    .join('\n');
}

// Process email notifications from Firestore
export const processEmailNotifications = functions.firestore
  .document('emailNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const { userId, type, updates, status } = notification;

    if (status !== 'pending') {
      console.log('Notification is not pending, skipping');
      return null;
    }

    try {
      // Get user data
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      const userData = userDoc.data();

      // Prepare email content based on notification type
      let emailContent;
      let subject;

      switch (type) {
        case 'PROFILE_UPDATE':
          subject = 'Your TeachAI Profile Has Been Updated';
          emailContent = `
            <h2>Profile Update Notification</h2>
            <p>Hello ${userData.fullName || userData.email},</p>
            <p>Your TeachAI profile has been updated with the following changes:</p>
            <pre>${formatUpdates(updates)}</pre>
            <p>If you did not make these changes, please contact support immediately.</p>
            <p>Best regards,<br>The TeachAI Team</p>
          `;
          break;

        default:
          throw new Error(`Unknown notification type: ${type}`);
      }

      // Send email
      const mailOptions = {
        from: '"TeachAI" <notifications@teachai.com>',
        to: userData.email,
        subject,
        html: emailContent
      };

      await transporter.sendMail(mailOptions);

      // Update notification status
      await snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Email notification sent successfully to ${userData.email}`);
      return null;

    } catch (error) {
      console.error('Error processing email notification:', error);

      // Update notification status to failed
      await snap.ref.update({
        status: 'failed',
        error: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      throw error;
    }
  });

// Retry failed notifications periodically
export const retryFailedNotifications = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const failedNotifications = await db
      .collection('emailNotifications')
      .where('status', '==', 'failed')
      .where('retryCount', '<', 3)
      .get();

    const retryPromises = failedNotifications.docs.map(async (doc) => {
      const notification = doc.data();
      const retryCount = notification.retryCount || 0;

      try {
        // Reset status to pending for retry
        await doc.ref.update({
          status: 'pending',
          retryCount: retryCount + 1,
          lastRetry: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (error) {
        console.error(`Failed to retry notification ${doc.id}:`, error);
      }
    });

    await Promise.all(retryPromises);
    return null;
  });