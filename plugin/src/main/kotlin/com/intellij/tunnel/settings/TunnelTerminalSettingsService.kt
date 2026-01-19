package com.intellij.tunnel.settings

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage
import com.intellij.openapi.util.registry.Registry
import org.jetbrains.plugins.terminal.LocalBlockTerminalRunner

class TunnelTerminalSettingsState {
    var forceClassicTerminal: Boolean = false
    var previousNewUiValue: Boolean? = null
}

@State(
    name = "TunnelTerminalSettings",
    storages = [Storage("tunnel-terminal-settings.xml")]
)
class TunnelTerminalSettingsService : PersistentStateComponent<TunnelTerminalSettingsState> {
    private var settingsState = TunnelTerminalSettingsState()

    companion object {
        fun getInstance(): TunnelTerminalSettingsService {
            return ApplicationManager.getApplication().getService(TunnelTerminalSettingsService::class.java)
        }
    }

    override fun getState(): TunnelTerminalSettingsState = settingsState

    override fun loadState(state: TunnelTerminalSettingsState) {
        settingsState = state
        applySetting()
    }

    fun isForceClassicTerminal(): Boolean = settingsState.forceClassicTerminal

    fun setForceClassicTerminal(enabled: Boolean) {
        if (settingsState.forceClassicTerminal == enabled) return
        settingsState.forceClassicTerminal = enabled
        applySetting()
    }

    private fun applySetting() {
        val registry = Registry.get(LocalBlockTerminalRunner.BLOCK_TERMINAL_REGISTRY)
        val current = registry.asBoolean()
        if (settingsState.forceClassicTerminal) {
            if (settingsState.previousNewUiValue == null) {
                settingsState.previousNewUiValue = current
            }
            if (current) {
                registry.setValue(false)
            }
        } else {
            val previous = settingsState.previousNewUiValue
            if (previous != null && previous != current) {
                registry.setValue(previous)
            }
            settingsState.previousNewUiValue = null
        }
    }
}
