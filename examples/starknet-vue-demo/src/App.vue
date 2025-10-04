<template>
  <main class="app">
    <h1>starknet-vue demo</h1>

    <section class="card">
      <h2>Connection</h2>
      <p>
        <strong>Status:</strong>
        <span v-if="account.isConnected">Connected</span>
        <span v-else>Disconnected</span>
      </p>
      <p><strong>Address:</strong> {{ account.address ?? "—" }}</p>
      <p><strong>Chain:</strong> {{ network.chain.name }}</p>

      <div v-if="availableConnectors.length" class="connectors">
        <button
          v-for="connector in availableConnectors"
          :key="connector.id"
          @click="() => connect(connector)"
          :disabled="account.isConnected && connector.id === account.connector?.id"
        >
          {{ connector.name }}
        </button>
      </div>
      <p v-else class="hint">
        No wallet detected. Install a supported Starknet wallet or enable one in your browser.
      </p>

      <div class="actions">
        <button @click="disconnect" :disabled="account.isDisconnected">
          Disconnect
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  braavos,
  ready,
  useAccount,
  useConnect,
  useDisconnect,
  useInjectedConnectors,
  useNetwork,
} from "starknet-vue";

const account = useAccount();
const network = useNetwork();
const { connectors } = useInjectedConnectors({
    recommended: [ready(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });
const { connectAsync } = useConnect();
const { disconnectAsync } = useDisconnect();

const availableConnectors = computed(() => connectors);

const connect = (connector = availableConnectors.value[0]) => {
  if (!connector) return;
  connectAsync({ connector }).catch((err) => console.error("Connect failed", err));
};

const disconnect = () => {
  disconnectAsync().catch((err) => console.error("Disconnect failed", err));
};
</script>

<style scoped>
.app {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  padding: 2rem;
  background: #0f111a;
  color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  min-width: 320px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

h1 {
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #81e6d9;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

p {
  margin: 0.25rem 0;
}

.connectors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  flex: 1 1 140px;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

.hint {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
