package com.contractly.swing.ui;

import com.contractly.swing.dto.ContractResponse;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class ContractsPanel extends JPanel {
    private final MainFrame mainFrame;
    private DefaultTableModel tableModel;

    public ContractsPanel(MainFrame mainFrame) {
        this.mainFrame = mainFrame;
        setLayout(new MigLayout("fill, insets 30", "[fill]"));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("\uD83D\uDCC4 Contracts");
        title.setFont(new Font("SansSerif", Font.BOLD, 24));
        header.add(title, BorderLayout.WEST);

        JButton newBtn = new JButton("+ New Contract");
        newBtn.setBackground(new Color(63, 81, 181));
        newBtn.setForeground(Color.WHITE);
        newBtn.addActionListener(e -> {
            NewContractDialog dialog = new NewContractDialog(mainFrame);
            dialog.setVisible(true);
        });
        header.add(newBtn, BorderLayout.EAST);
        add(header, "wrap, gapbottom 20");

        String[] columns = {"ID", "Title", "Recipient", "Email", "Status", "Amount", "Created"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        JTable table = new JTable(tableModel);
        table.setRowHeight(35);
        table.getTableHeader().setReorderingAllowed(false);

        // Color-code the status column
        table.getColumnModel().getColumn(4).setCellRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable t, Object val, boolean sel, boolean foc, int r, int c) {
                Component comp = super.getTableCellRendererComponent(t, val, sel, foc, r, c);
                if (!sel && val != null) {
                    switch (val.toString()) {
                        case "SIGNED" -> comp.setForeground(new Color(76, 175, 80));
                        case "SENT" -> comp.setForeground(new Color(33, 150, 243));
                        case "VIEWED" -> comp.setForeground(new Color(255, 152, 0));
                        case "DRAFT" -> comp.setForeground(Color.GRAY);
                        case "EXPIRED" -> comp.setForeground(new Color(244, 67, 54));
                        default -> comp.setForeground(Color.WHITE);
                    }
                }
                return comp;
            }
        });

        add(new JScrollPane(table), "grow");

        loadData();
    }

    private void loadData() {
        new SwingWorker<List<ContractResponse>, Void>() {
            @Override
            protected List<ContractResponse> doInBackground() throws Exception {
                return mainFrame.getBackendService().getContracts();
            }
            @Override
            protected void done() {
                try {
                    List<ContractResponse> list = get();
                    tableModel.setRowCount(0);
                    for (ContractResponse c : list) {
                        tableModel.addRow(new Object[]{
                            c.getId(), c.getTitle(), c.getRecipientName(), c.getRecipientEmail(),
                            c.getStatus(), (c.getCurrency() != null ? c.getCurrency() : "INR") + " " + (c.getAmount() != null ? c.getAmount() : "0"),
                            c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate() : ""
                        });
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }.execute();
    }
}
