package com.intellij.tunnel.settings

import com.intellij.openapi.options.Configurable
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBPanel
import com.intellij.util.ui.JBUI
import java.awt.BorderLayout
import javax.swing.BoxLayout
import javax.swing.JComponent

class TunnelSettingsConfigurable : Configurable {
    override fun getDisplayName(): String = "Tunnel"

    override fun createComponent(): JComponent {
        val panel = JBPanel<JBPanel<*>>(BorderLayout())
        val content = JBPanel<JBPanel<*>>()
        content.layout = BoxLayout(content, BoxLayout.Y_AXIS)
        content.border = JBUI.Borders.empty(8, 12)

        val title = JBLabel("Terminal output requires the classic UI.")
        val hint = JBLabel("If sessions fail to start, disable 'terminal.new.ui' in the IDE registry.")
        hint.border = JBUI.Borders.emptyTop(6)

        content.add(title)
        content.add(hint)
        panel.add(content, BorderLayout.NORTH)
        return panel
    }

    override fun isModified(): Boolean = false

    override fun apply() {
        // No-op: settings panel is informational only.
    }

    override fun reset() {
        // No-op.
    }
}
