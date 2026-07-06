package com.ecoverse.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

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
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                logger.info("OTP verification email sent successfully to {}", toEmail);
            } else {
                throw new IllegalStateException("JavaMailSender is not initialized.");
            }
        } catch (Exception e) {
            logger.warn("Could not send email via JavaMailSender (Reason: {}). Falling back to console logging.", e.getMessage());
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
}
