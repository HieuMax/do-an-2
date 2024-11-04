const {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE
  } = require("./emailTemplates.js");
  
  const { mailtrapClient, sender } = require("./mailtrap.config.js");
  
  const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		subject: "Verify your email",
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		category: "Email Verification",
	  });
  
	  console.log("Email sent successfully", response);
	} catch (error) {
	  console.error("Error sending verification", error);
	  throw new Error(`Error sending verification email: ${error}`);
	}
  };
  
  const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		template_uuid: "412ad062-6958-46ec-9844-2888fffbece3",
		template_variables: {
		  "company_info_name": "Test_Company_info_name",
		  "name": "Test_Name",
		  "company_info_address": "Test_Company_info_address",
		  "company_info_city": "Test_Company_info_city",
		  "company_info_zip_code": "Test_Company_info_zip_code",
		  "company_info_country": "Test_Company_info_country"
		}
	  });
  
	  console.log("Welcome email sent successfully", response);
	} catch (error) {
	  console.error("Error sending welcome email", error);
	  throw new Error(`Error sending welcome email: ${error}`);
	}
  };
  
  const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		category: "Password Reset",
	  });
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset email", error);
	  throw new Error(`Error sending password reset email: ${error}`);
	}
  };
  
  const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];
  
	try {
	  const response = await mailtrapClient.send({
		from: sender,
		to: recipient,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		category: "Password Reset",
	  });
  
	  console.log("Password reset success email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset success email", error);
	  throw new Error(`Error sending password reset success email: ${error}`);
	}
  };
  
  module.exports = {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessEmail
  };
  