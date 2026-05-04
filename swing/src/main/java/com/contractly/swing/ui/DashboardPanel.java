package com.contractly.swing.ui;

import com.contractly.swing.dto.AuthResponse;
import com.contractly.swing.dto.ContractResponse;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class DashboardPanel extends JPanel {
    private final MainFrame mainFrame;
    private final AuthResponse user;
    private JTable contractTable;
    private DefaultTableModel tableModel;

    public DashboardPanel(MainFrame mainFrame, AuthResponse user) {
        this.mainFrame = mainFrame;
        this.user = user;
        setLayout(new BorderLayout());

        // Sidebar
        JPanel sidebar = new JPanel(new MigLayout("wrap, fillx, insets 20", "[fill]"));
        sidebar.setBackground(new Color(30, 30, 30));
        sidebar.setPreferredSize(new Dimension(250, 0));

        JLabel logoLabel = new JLabel("\uD83D\uDCDD Contractly");
        logoLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        logoLabel.setForeground(Color.WHITE);
        sidebar.add(logoLabel, "gapbottom 30");

        JButton dashBtn = createSidebarButton("\uD83D\uDCCA  Dashboard", true);
        dashBtn.addActionListener(e -> mainFrame.navigateTo("DASHBOARD"));
        sidebar.add(dashBtn, "height 40");

        JButton contractsBtn = createSidebarButton("\uD83D\uDCC4  Contracts", false);
        contractsBtn.addActionListener(e -> mainFrame.navigateTo("CONTRACTS"));
        sidebar.add(contractsBtn, "height 40");

        JButton clientsBtn = createSidebarButton("\uD83D\uDC65  Clients", false);
        clientsBtn.addActionListener(e -> mainFrame.navigateTo("CLIENTS"));
        sidebar.add(clientsBtn, "height 40");

        JButton templatesBtn = createSidebarButton("\uD83D\uDCC2  Templates", false);
        templatesBtn.addActionListener(e -> mainFrame.navigateTo("TEMPLATES"));
        sidebar.add(templatesBtn, "height 40");

        sidebar.add(Box.createVerticalGlue(), "push");

        JButton logoutBtn = new JButton("\uD83D\uDEAA Logout");
        logoutBtn.addActionListener(e -> mainFrame.logout());
        sidebar.add(logoutBtn, "height 35");

        // Main Content
        JPanel contentArea = new JPanel(new MigLayout("fill, insets 30", "[fill]"));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel welcomeLabel = new JLabel("Welcome back, " + user.getUser().getFullName());
        welcomeLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        header.add(welcomeLabel, BorderLayout.WEST);

        JButton newContractBtn = new JButton("+ New Contract");
        newContractBtn.setBackground(new Color(63, 81, 181));
        newContractBtn.setForeground(Color.WHITE);
        newContractBtn.addActionListener(e -> {
            NewContractDialog dialog = new NewContractDialog(mainFrame);
            dialog.setVisible(true);
        });
        header.add(newContractBtn, BorderLayout.EAST);

        contentArea.add(header, "wrap, gapbottom 20");

        // Stats Row
        JPanel statsPanel = new JPanel(new GridLayout(1, 4, 20, 0));
        statsPanel.setOpaque(false);
        statsPanel.add(createStatCard("Total Contracts", "—", "\uD83D\uDCC4", new Color(63, 81, 181)));
        statsPanel.add(createStatCard("Pending Signatures", "—", "\u23F3", new Color(255, 152, 0)));
        statsPanel.add(createStatCard("Signed", "—", "\u2705", new Color(76, 175, 80)));
        statsPanel.add(createStatCard("Revenue", "—", "\uD83D\uDCB0", new Color(156, 39, 176)));

        contentArea.add(statsPanel, "wrap, gapbottom 30, height 100!");

        // Table
        String[] columnNames = {"ID", "Title", "Recipient", "Status", "Amount", "Date"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        contractTable = new JTable(tableModel);
        contractTable.setRowHeight(35);
        contractTable.getTableHeader().setReorderingAllowed(false);
        JScrollPane scrollPane = new JScrollPane(contractTable);

        contentArea.add(new JLabel("Recent Contracts"), "wrap, gapbottom 10");
        contentArea.add(scrollPane, "grow");

        add(sidebar, BorderLayout.WEST);
        add(contentArea, BorderLayout.CENTER);

        refreshData();
    }

    private JButton createSidebarButton(String text, boolean active) {
        JButton btn = new JButton(text);
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setContentAreaFilled(active);
        if (active) {
            btn.setBackground(new Color(50, 50, 50));
        } else {
            btn.setOpaque(false);
        }
        btn.setForeground(Color.WHITE);
        return btn;
    }

    private JPanel createStatCard(String title, String value, String icon, Color accentColor) {
        JPanel card = new JPanel(new MigLayout("insets 15", "[fill]push[40!]"));
        card.setBackground(new Color(45, 45, 45));
        card.setBorder(BorderFactory.createMatteBorder(0, 4, 0, 0, accentColor));

        JPanel textPanel = new JPanel(new MigLayout("wrap, insets 0", "[fill]"));
        textPanel.setOpaque(false);

        JLabel t = new JLabel(title);
        t.setForeground(Color.GRAY);
        t.setFont(new Font("SansSerif", Font.PLAIN, 12));

        JLabel v = new JLabel(value);
        v.setFont(new Font("SansSerif", Font.BOLD, 20));

        textPanel.add(t);
        textPanel.add(v);

        JLabel iconLabel = new JLabel(icon);
        iconLabel.setFont(new Font("SansSerif", Font.PLAIN, 28));

        card.add(textPanel);
        card.add(iconLabel);
        return card;
    }

    private void refreshData() {
        new SwingWorker<List<ContractResponse>, Void>() {
            @Override
            protected List<ContractResponse> doInBackground() throws Exception {
                return mainFrame.getBackendService().getContracts();
            }

            @Override
            protected void done() {
                try {
                    List<ContractResponse> contracts = get();
                    tableModel.setRowCount(0);

                    int total = contracts.size();
                    int pending = 0, signed = 0;
                    double revenue = 0;

                    for (ContractResponse c : contracts) {
                        tableModel.addRow(new Object[]{
                                c.getId(),
                                c.getTitle(),
                                c.getRecipientName(),
                                c.getStatus(),
                                (c.getCurrency() != null ? c.getCurrency() : "INR") + " " + (c.getAmount() != null ? c.getAmount() : "0"),
                                c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate() : ""
                        });

                        if (c.getStatus() != null) {
                            switch (c.getStatus()) {
                                case SENT, VIEWED -> pending++;
                                case SIGNED -> {
                                    signed++;
                                    if (c.getAmount() != null) revenue += c.getAmount().doubleValue();
                                }
                            }
                        }
                    }

                    // Update stat cards
                    updateStatCards(total, pending, signed, revenue);

                } catch (Exception ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(DashboardPanel.this,
                            "Failed to load contracts: " + ex.getMessage(),
                            "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        }.execute();
    }

    private void updateStatCards(int total, int pending, int signed, double revenue) {
        // Get the stats panel (first child after header in contentArea)
        Component contentArea = ((BorderLayout) getLayout()).getLayoutComponent(BorderLayout.CENTER);
        if (contentArea instanceof JPanel) {
            for (Component comp : ((JPanel) contentArea).getComponents()) {
                if (comp instanceof JPanel panel && panel.getLayout() instanceof GridLayout) {
                    Component[] cards = panel.getComponents();
                    if (cards.length >= 4) {
                        updateCardValue((JPanel) cards[0], String.valueOf(total));
                        updateCardValue((JPanel) cards[1], String.valueOf(pending));
                        updateCardValue((JPanel) cards[2], String.valueOf(signed));
                        updateCardValue((JPanel) cards[3], String.format("\u20B9%.0f", revenue));
                    }
                    break;
                }
            }
        }
    }

    private void updateCardValue(JPanel card, String newValue) {
        for (Component comp : card.getComponents()) {
            if (comp instanceof JPanel textPanel) {
                for (Component inner : textPanel.getComponents()) {
                    if (inner instanceof JLabel label && label.getFont().getSize() == 20) {
                        label.setText(newValue);
                        return;
                    }
                }
            }
        }
    }
}
