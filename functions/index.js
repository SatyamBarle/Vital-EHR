const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// Initialize Firebase Admin
admin.initializeApp();

// Set up SendGrid with your API key
sgMail.setApiKey(functions.config().sendgrid.key);

// Cloud Function triggered by Firestore when an appointment is updated
exports.sendAppointmentUpdateEmail = functions.firestore
    .document("appointments/{appointmentId}")
    .onUpdate((change, context) => {
      const newValue = change.after.data();

      const patientEmail = newValue.patientEmail;
      const doctorName = newValue.doctorName;
      const newDate = newValue.date;
      const newTime = newValue.time;

      // Construct the email
      const msg = {
        to: patientEmail,
        from: "your-email@domain.com", // Use your verified sender email
        subject: "Appointment Update Notification",
        text: `Dear Patient,\n\nYour appointment with Dr. 
        ${doctorName} has been updated.\n
             New Date: ${newDate}, New Time: ${newTime}.\n\nThank you.`,
      };

      // Send the email
      return sgMail
          .send(msg)
          .then(() => {
            console.log("Appointment update email sent successfully.");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
    });
