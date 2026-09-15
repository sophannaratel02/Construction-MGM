<template>
  <main class="unauthorized-page">
    <section class="unauthorized-panel">
      <p class="eyebrow">Access control</p>
      <h1>Access denied</h1>
      <p>You do not have permission to view this page.</p>
      <router-link class="btn btn-primary" to="/dashboard">Return to dashboard</router-link>
    </section>
  </main>
</template>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f5f7fb;
}

.unauthorized-panel {
  width: min(100%, 480px);
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 12px;
  color: #0f172a;
}

p:not(.eyebrow) {
  margin-bottom: 24px;
  color: #64748b;
}
</style>
