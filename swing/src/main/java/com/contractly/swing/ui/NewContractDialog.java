package com.contractly.swing.ui;

import com.contractly.swing.dto.ApiResponse;
import com.contractly.swing.dto.ContractResponse;
import com.contractly.swing.model.ContractStatus;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import java.awt.*;
import java.math.BigDecimal;

public class NewContractDialog extends JDialog {
    private final MainFrame mainFrame;
    private JTextField titleField;
    private JTextField recipientNameField;
    private JTextField recipientEmailField;
    private JTextField amountField;
    private JTextArea contentArea;
    private JButton saveButton;

    public NewContractDialog(MainFrame mainFrame) {
        super(mainFrame, "Create New Contract", true);
        this.mainFrame = mainFrame;
        setSize(600, 500);
        setLocationRelativeTo(mainFrame);

        JPanel panel = new JPanel(new MigLayout("wrap, fillx, insets 20", "[fill]"));
        
        panel.add(new JLabel("Contract Title"), "gapbottom 5");
        titleField = new JTextField();
        panel.add(titleField, "gapbottom 15");

        panel.add(new JLabel("Recipient Name"), "gapbottom 5");
        recipientNameField = new JTextField();
        panel.add(recipientNameField, "gapbottom 15");

        panel.add(new JLabel("Recipient Email"), "gapbottom 5");
        recipientEmailField = new JTextField();
        panel.add(recipientEmailField, "gapbottom 15");

        panel.add(new JLabel("Amount"), "gapbottom 5");
        amountField = new JTextField();
        panel.add(amountField, "gapbottom 15");

        panel.add(new JLabel("Content"), "gapbottom 5");
        contentArea = new JTextArea(5, 20);
        panel.add(new JScrollPane(contentArea), "grow, gapbottom 20");

        saveButton = new JButton("Create Contract");
        saveButton.setBackground(new Color(63, 81, 181));
        saveButton.setForeground(Color.WHITE);
        saveButton.addActionListener(e -> handleSave());
        panel.add(saveButton, "height 40");

        add(panel);
    }

    private void handleSave() {
        // In a real app, we'd call the backend here.
        // For now, let's just show a message.
        JOptionPane.showMessageDialog(this, "Contract creation functionality would call the backend API /v1/contracts.");
        dispose();
    }
}
