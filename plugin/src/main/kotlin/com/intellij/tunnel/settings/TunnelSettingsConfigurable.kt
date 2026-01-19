package com.intellij.tunnel.settings

import com.intellij.openapi.options.Configurable
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBPanel
import com.intellij.util.ui.JBUI
import java.awt.BorderLayout
import javax.swing.BoxLayout
import javax.swing.JComponent

class TunnelSettingsConfigurable : Configurable {
    private val settingsService = TunnelTerminalSettingsService.getInstance()
    private var forceClassicCheckBox: JBCheckBox? = null

    override fun getDisplayName(): String = "Tunnel"

    override fun createComponent(): JComponent {
        val panel = JBPanel<JBPanel<*>>(BorderLayout())
        val content = JBPanel<JBPanel<*>>()
        content.layout = BoxLayout(content, BoxLayout.Y_AXIS)
        content.border = JBUI.Borders.empty(8, 12)

        val checkBox = JBCheckBox("Force classic terminal UI for tunnel sessions")
        val hint = JBLabel("Required to stream output; the new terminal UI has no readable buffer.")
        hint.border = JBUI.Borders.emptyTop(4)

        content.add(checkBox)
        content.add(hint)
        panel.add(content, BorderLayout.NORTH)

        forceClassicCheckBox = checkBox
        reset()
        return panel
    }

    override fun isModified(): Boolean {
        val checkBox = forceClassicCheckBox ?: return false
        return checkBox.isSelected != settingsService.isForceClassicTerminal()
    }

    override fun apply() {
        val checkBox = forceClassicCheckBox ?: return
        settingsService.setForceClassicTerminal(checkBox.isSelected)
    }

    override fun reset() {
        forceClassicCheckBox?.isSelected = settingsService.isForceClassicTerminal()
    }

    override fun disposeUIResources() {
        forceClassicCheckBox = null
    }
}
