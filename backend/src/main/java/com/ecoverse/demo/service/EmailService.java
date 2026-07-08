package com.ecoverse.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private static final String BREVO_API_KEY = System.getenv("BREVO_API_KEY");
    private static final String SENDER_EMAIL = "postmanmail21@gmail.com";
    private static final String SENDER_NAME = "Ecoversee Team";

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Ecoversee Verification Code: " + otp;
        String content = "Welcome to Ecoversee - Your Gamified Environmental Education Platform!\n\n" +
                "Thank you for joining our community to help protect the environment, learn sustainability, and build your virtual eco garden.\n\n" +
                "Your 6-digit One-Time Password (OTP) for account verification / password recovery is:\n" +
                "-----------------------------------------\n" +
                "                " + otp + "\n" +
                "-----------------------------------------\n\n" +
                "Please enter this code in the verification screen to proceed.\n" +
                "This OTP is valid for 5 minutes and should not be shared with anyone for security reasons.\n\n" +
                "Let's make the planet greener together!\n\n" +
                "Best regards,\n" +
                "The Ecoversee Team";

        try {
            URL url = new URL("https://api.brevo.com/v3/smtp/email");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("api-key", BREVO_API_KEY);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            // Escape backslashes, double quotes, and newlines for clean JSON formatting
            String escapedContent = content
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "");

            String jsonPayload = "{"
                    + "\"sender\":{\"name\":\"" + SENDER_NAME + "\",\"email\":\"" + SENDER_EMAIL + "\"},"
                    + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                    + "\"subject\":\"" + subject + "\","
                    + "\"textContent\":\"" + escapedContent + "\""
                    + "}";

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            if (responseCode >= 200 && responseCode < 300) {
                logger.info("OTP verification email successfully sent via Brevo to {}", toEmail);
            } else {
                logger.warn("Brevo API returned error status: {}. Falling back to console logging.", responseCode);
                printFallbackOtp(toEmail, subject, otp, content);
            }
        } catch (Exception e) {
            logger.warn("Could not send email via Brevo API (Reason: {}). Falling back to console logging.", e.getMessage());
            printFallbackOtp(toEmail, subject, otp, content);
        }
    }

    private void printFallbackOtp(String toEmail, String subject, String otp, String content) {
        System.out.println("==================================================");
        System.out.println("                   ECOVERSEE MAIL MOCK             ");
        System.out.println("==================================================");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: " + subject);
        System.out.println("OTP: " + otp);
        System.out.println("CONTENT:\n" + content);
        System.out.println("==================================================");
    }
}
