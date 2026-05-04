package com.contractly.swing.ui;

import com.contractly.swing.dto.ClientResponse;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class ClientsPanel extends JPanel {
    private final MainFrame mainFrame;
    private DefaultTableModel tableModel;

    public ClientsPanel(MainFrame mainFrame) {
        this.mainFrame = mainFrame;
        setLayout(new MigLayout("fill, insets 30", "[fill]"));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("\uD83D\uDC65 Clients");
        title.setFont(new Font("SansSerif", Font.BOLD, 24));
        header.add(title, BorderLayout.WEST);
        add(header, "wrap, gapbottom 20");

        String[] columns = {"ID", "Full Name", "Company", "Email", "Phone", "Created"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        JTable table = new JTable(tableModel);
        table.setRowHeight(35);
        table.getTableHeader().setReorderingAllowed(false);

        add(new JScrollPane(table), "grow");

        loadData();
    }

    private void loadData() {
        new SwingWorker<List<ClientResponse>, Void>() {
            @Override
            protected List<ClientResponse> doInBackground() throws Exception {
                return mainFrame.getBackendService().getClients();
            }
            @Override
            protected void done() {
                try {
                    List<ClientResponse> list = get();
                    tableModel.setRowCount(0);
                    for (ClientResponse c : list) {
                        tableModel.addRow(new Object[]{
                            c.getId(), c.getFullName(), c.getCompanyName(), c.getEmail(),
                            c.getPhoneNumber(), c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate() : ""
                        });
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }.execute();
    }
}
