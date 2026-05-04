package com.contractly.swing.ui;

import com.contractly.swing.dto.AuthResponse;
import com.contractly.swing.dto.ContractResponse;
import net.miginfocom.swing.MigLayout;
import org.kordamp.ikonli.materialdesign2.MaterialDesignA;
import org.kordamp.ikonli.materialdesign2.MaterialDesignF;
import org.kordamp.ikonli.materialdesign2.MaterialDesignV;
import org.kordamp.ikonli.materialdesign2.MaterialDesignC;
import org.kordamp.ikonli.materialdesign2.MaterialDesignL;
import org.kordamp.ikonli.swing.FontIcon;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.IOException;
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

        JLabel logoLabel = new JLabel("Contractly");
        logoLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        logoLabel.setForeground(Color.WHITE);
        logoLabel.setIcon(FontIcon.of(MaterialDesignF.FILE_DOCUMENT_EDIT_OUTLINE, 24, Color.WHITE));
        logoLabel.setIconTextGap(10);
        sidebar.add(logoLabel, "gapbottom 30");

        sidebar.add(createSidebarButton("Dashboard", MaterialDesignV.VIEW_DASHBOARD, true), "height 40");
        sidebar.add(createSidebarButton("Contracts", MaterialDesignF.FILE_DOCUMENT_OUTLINE, false), "height 40");
        sidebar.add(createSidebarButton("Clients", MaterialDesignA.ACCOUNT_GROUP_OUTLINE, false), "height 40");
        sidebar.add(createSidebarButton("Templates", MaterialDesignF.FILE_MULTIPLE_OUTLINE, false), "height 40");
        
        sidebar.add(Box.createVerticalGlue(), "push");
        
        JButton logoutBtn = new JButton("Logout");
        logoutBtn.setIcon(FontIcon.of(MaterialDesignL.LOGOUT, 18, Color.LIGHT_GRAY));
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

        // Stats Row (Mockup)
        JPanel statsPanel = new JPanel(new GridLayout(1, 4, 20, 0));
        statsPanel.setOpaque(false);
        statsPanel.add(createStatCard("Total Contracts", "12", MaterialDesignF.FILE_DOCUMENT, new Color(63, 81, 181)));
        statsPanel.add(createStatCard("Pending Signatures", "3", MaterialDesignC.CLOCK_OUTLINE, new Color(255, 152, 0)));
        statsPanel.add(createStatCard("Signed Today", "2", MaterialDesignC.CHECK_CIRCLE_OUTLINE, new Color(76, 175, 80)));
        statsPanel.add(createStatCard("Revenue", "$4,500", MaterialDesignC.CURRENCY_USD, new Color(156, 39, 176)));
        
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

    private JButton createSidebarButton(String text, org.kordamp.ikonli.Ikon icon, boolean active) {
        JButton btn = new JButton(text);
        btn.setIcon(FontIcon.of(icon, 18, Color.WHITE));
        btn.setIconTextGap(15);
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

    private JPanel createStatCard(String title, String value, org.kordamp.ikonli.Ikon icon, Color accentColor) {
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

        JLabel iconLabel = new JLabel(FontIcon.of(icon, 32, accentColor));
        
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
                    for (ContractResponse c : contracts) {
                        tableModel.addRow(new Object[]{
                                c.getId(),
                                c.getTitle(),
                                c.getRecipientName(),
                                c.getStatus(),
                                c.getCurrency() + " " + c.getAmount(),
                                c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate() : ""
                        });
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(DashboardPanel.this, 
                        "Failed to load contracts: " + ex.getMessage(), 
                        "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        }.execute();
    }
}
