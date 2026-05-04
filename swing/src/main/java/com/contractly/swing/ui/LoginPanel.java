package com.contractly.swing.ui;

import com.contractly.swing.dto.ApiResponse;
import com.contractly.swing.dto.AuthResponse;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.util.concurrent.ExecutionException;

public class LoginPanel extends JPanel {
    private final MainFrame mainFrame;
    private JTextField emailField;
    private JPasswordField passwordField;
    private JButton loginButton;
    private JLabel statusLabel;

    public LoginPanel(MainFrame mainFrame) {
        this.mainFrame = mainFrame;
        setLayout(new GridBagLayout());
        
        JPanel card = new JPanel(new MigLayout("wrap, fillx, insets 40", "[fill, 300]"));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(60, 60, 60), 1),
                BorderFactory.createEmptyBorder(20, 20, 20, 20)
        ));

        JLabel titleLabel = new JLabel("Contractly");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 32));
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);

        JLabel subtitleLabel = new JLabel("Sign in to manage your contracts");
        subtitleLabel.setForeground(Color.GRAY);
        subtitleLabel.setHorizontalAlignment(SwingConstants.CENTER);

        emailField = new JTextField();
        emailField.putClientProperty("JTextField.placeholderText", "Email");
        
        passwordField = new JPasswordField();
        passwordField.putClientProperty("JTextField.placeholderText", "Password");

        loginButton = new JButton("Login");
        loginButton.setBackground(new Color(63, 81, 181));
        loginButton.setForeground(Color.WHITE);
        loginButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        loginButton.addActionListener(this::handleLogin);

        statusLabel = new JLabel(" ");
        statusLabel.setForeground(Color.RED);
        statusLabel.setHorizontalAlignment(SwingConstants.CENTER);

        card.add(titleLabel, "gapbottom 5");
        card.add(subtitleLabel, "gapbottom 30");
        card.add(new JLabel("Email Address"), "gapbottom 5");
        card.add(emailField, "gapbottom 15, height 35");
        card.add(new JLabel("Password"), "gapbottom 5");
        card.add(passwordField, "gapbottom 20, height 35");
        card.add(loginButton, "height 40, gapbottom 10");
        card.add(statusLabel);

        add(card);
    }

    private void handleLogin(ActionEvent e) {
        String email = emailField.getText();
        String password = new String(passwordField.getPassword());

        if (email.isEmpty() || password.isEmpty()) {
            statusLabel.setText("Please fill in all fields");
            return;
        }

        loginButton.setEnabled(false);
        statusLabel.setText("Logging in...");
        statusLabel.setForeground(new Color(100, 149, 237));

        new SwingWorker<ApiResponse<AuthResponse>, Void>() {
            @Override
            protected ApiResponse<AuthResponse> doInBackground() throws Exception {
                return mainFrame.getBackendService().login(email, password);
            }

            @Override
            protected void done() {
                try {
                    ApiResponse<AuthResponse> response = get();
                    if (response.isSuccess()) {
                        mainFrame.onLoginSuccess(response.getData());
                    } else {
                        statusLabel.setText(response.getMessage() != null ? response.getMessage() : "Login failed");
                        statusLabel.setForeground(Color.RED);
                    }
                } catch (ExecutionException ex) {
                    // Unwrap the real cause
                    Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
                    String msg = cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
                    statusLabel.setText("<html><body style='width:280px'>" + msg + "</body></html>");
                    statusLabel.setForeground(Color.RED);
                    cause.printStackTrace();
                } catch (Exception ex) {
                    String msg = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
                    statusLabel.setText("<html><body style='width:280px'>" + msg + "</body></html>");
                    statusLabel.setForeground(Color.RED);
                    ex.printStackTrace();
                } finally {
                    loginButton.setEnabled(true);
                }
            }
        }.execute();
    }
}
