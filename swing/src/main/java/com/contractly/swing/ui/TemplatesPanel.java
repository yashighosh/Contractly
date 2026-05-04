package com.contractly.swing.ui;

import com.contractly.swing.dto.TemplateResponse;
import net.miginfocom.swing.MigLayout;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class TemplatesPanel extends JPanel {
    private final MainFrame mainFrame;
    private DefaultTableModel tableModel;

    public TemplatesPanel(MainFrame mainFrame) {
        this.mainFrame = mainFrame;
        setLayout(new MigLayout("fill, insets 30", "[fill]"));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("\uD83D\uDCC2 Templates");
        title.setFont(new Font("SansSerif", Font.BOLD, 24));
        header.add(title, BorderLayout.WEST);
        add(header, "wrap, gapbottom 20");

        String[] columns = {"ID", "Title", "Description", "Public", "Created"};
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
        new SwingWorker<List<TemplateResponse>, Void>() {
            @Override
            protected List<TemplateResponse> doInBackground() throws Exception {
                return mainFrame.getBackendService().getTemplates();
            }
            @Override
            protected void done() {
                try {
                    List<TemplateResponse> list = get();
                    tableModel.setRowCount(0);
                    for (TemplateResponse t : list) {
                        tableModel.addRow(new Object[]{
                            t.getId(), t.getTitle(), t.getDescription(),
                            t.isPublic() ? "Yes" : "No",
                            t.getCreatedAt() != null ? t.getCreatedAt().toLocalDate() : ""
                        });
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }.execute();
    }
}
