package com.contractly.swing;

import com.contractly.swing.ui.MainFrame;
import com.formdev.flatlaf.FlatDarkLaf;
import javax.swing.*;

public class ContractlyApp {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(new FlatDarkLaf());
                MainFrame frame = new MainFrame();
                frame.setVisible(true);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });
    }
}
