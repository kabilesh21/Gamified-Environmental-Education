package com.ecoverse.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private static final String BREVO_API_KEY = System.getenv("BREVO_API_KEY");
    private static final String SENDER_EMAIL = System.getenv("SENDER_EMAIL") != null && !System.getenv("SENDER_EMAIL").trim().isEmpty()
            ? System.getenv("SENDER_EMAIL")
            : "kabileshclg0678@gmail.com";
    private static final String SENDER_NAME = "Greenizo Team";

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        CompletableFuture.runAsync(() -> {
            String subject = "Greenizo Verification Code: " + otp;
            String content = "Welcome to Greenizo - Your Gamified Environmental Education Platform!\n\n" +
                    "Thank you for joining our community to help protect the environment, learn sustainability, and build your virtual eco garden.\n\n" +
                    "Your 6-digit One-Time Password (OTP) for account verification / password recovery is:\n" +
                    "-----------------------------------------\n" +
                    "                " + otp + "\n" +
                    "-----------------------------------------\n\n" +
                    "Please enter this code in the verification screen to proceed.\n" +
                    "This OTP is valid for 5 minutes and should not be shared with anyone for security reasons.\n\n" +
                    "Let's make the planet greener together!\n\n" +
                    "Best regards,\n" +
                    "The Greenizo Team";

            boolean sent = false;

            // 1. Try Brevo API if key is configured
            if (BREVO_API_KEY != null && !BREVO_API_KEY.trim().isEmpty()) {
                try {
                    logger.info("Attempting to send OTP email to {} via Brevo...", toEmail);
                    URL url = new URL("https://api.brevo.com/v3/smtp/email");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("api-key", BREVO_API_KEY);
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setConnectTimeout(5000);
                    conn.setReadTimeout(5000);
                    conn.setDoOutput(true);

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
                        sent = true;
                    } else {
                        logger.warn("Brevo API returned error status: {}.", responseCode);
                    }
                } catch (Exception e) {
                    logger.warn("Could not send email via Brevo API: {}", e.getMessage());
                }
            } else {
                logger.info("Brevo API key is not configured. Skipping Brevo.");
            }

            // 2. Try Spring Mail as a fallback/alternative
            if (!sent) {
                try {
                    logger.info("Attempting to send OTP email to {} via Spring Mail...", toEmail);
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setFrom(SENDER_EMAIL);
                    message.setTo(toEmail);
                    message.setSubject(subject);
                    message.setText(content);
                    mailSender.send(message);
                    logger.info("OTP verification email successfully sent via Spring Mail to {}", toEmail);
                    sent = true;
                } catch (Exception e) {
                    logger.warn("Could not send email via Spring Mail (Reason: {}).", e.getMessage());
                }
            }

            // 3. Fallback to console logging if all failed
            if (!sent) {
                logger.warn("All email delivery methods failed. Falling back to console logging.");
                printFallbackOtp(toEmail, subject, otp, content);
            }
        });
    }

    private void printFallbackOtp(String toEmail, String subject, String otp, String content) {
        System.out.println("==================================================");
        System.out.println("                   GREENIZO MAIL MOCK             ");
        System.out.println("==================================================");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: " + subject);
        System.out.println("OTP: " + otp);
        System.out.println("CONTENT:\n" + content);
        System.out.println("==================================================");
    }
}
