package com.contractly.swing.ui;

import com.contractly.swing.dto.AuthResponse;
import com.contractly.swing.service.BackendService;

import javax.swing.*;
import java.awt.*;

public class MainFrame extends JFrame {
    private final CardLayout cardLayout;
    private final JPanel mainPanel;
    private final BackendService backendService;
    private final LoginPanel loginPanel;
    private DashboardPanel dashboardPanel;

    public MainFrame() {
        setTitle("Contractly - Digital Contract Lifecycle Manager");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1200, 800);
        setLocationRelativeTo(null);

        backendService = new BackendService();
        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        loginPanel = new LoginPanel(this);
        mainPanel.add(loginPanel, "LOGIN");

        add(mainPanel);
        cardLayout.show(mainPanel, "LOGIN");
    }

    public BackendService getBackendService() {
        return backendService;
    }

    public void onLoginSuccess(AuthResponse authResponse) {
        dashboardPanel = new DashboardPanel(this, authResponse);
        mainPanel.add(dashboardPanel, "DASHBOARD");
        cardLayout.show(mainPanel, "DASHBOARD");
    }

    public void logout() {
        cardLayout.show(mainPanel, "LOGIN");
    }
}
