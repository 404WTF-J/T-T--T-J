<template>
  <div class="card-container">
    <slot></slot>
  </div>
</template>

<style scoped>
.card-container {
  background-color: rgba(255, 255, 255, 0.973);
  border-radius: 5px;
  overflow: hidden;
  z-index: 99;
  margin: 5px 10px;
}
</style>