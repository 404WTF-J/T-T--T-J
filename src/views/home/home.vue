<template>
  <div class="container" id="welcome">
    <h3>嘿 你来啦 ❤️</h3>
    <button id="enterBtn" @click="startTrip">开启旅程</button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
function startTrip() {
  //缓慢切换路由到maincontent页面
  router.push("/maincontent");
}

onMounted(() => {
  // 生命周期钩子
});
</script>

<style scoped>
.container {
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(to right, #dbe6f6, #c5796d);
}

h3 {
  color: #fff;
  font-size: 2em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 25px;
}

#welcome {
  display: flex;
  animation: fadeIn 1s;
}

#enterBtn {
  margin-top: 30px;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  background: #fff;
  color: #ff69b4;
  font-size: 1.2em;
  cursor: pointer;
  transition: transform 0.3s;
}

#enterBtn:hover {
  transform: scale(1.1);
}

.hearts {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
