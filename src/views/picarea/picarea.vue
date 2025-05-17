<template>
  <div class="pictureArea" id="pictureArea">
    <div class="pichenxin" id="pichenxin" @click="router.push('/mainContent')">
      才不要
    </div>
    <div class="pictitle">
      <h2 id="pictitle">{{ pictitle ? pictitle : "起个标题吧" }}</h2>
    </div>
    <div class="photo-grid" id="photoGrid">
      <!-- 后期数据js动态加载 -->
      <div class="photo-show">
        <span>阿噢 暂无数据勒</span>
      </div>
      <div class="picinputBox">
        <input
          type="text"
          placeholder="请输入..."
          id="picinputText"
          v-model="pictitle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const pictitle = ref("");

onMounted(() => {
  // 生命周期钩子
});
</script>

<style scoped>
/* 图片区 */
.pictureArea {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #84c8f5, #6dd5fa, #dbf9fb);
  position: fixed;
}

.pichenxin {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  opacity: 0.3;
  transition: 0.5s;
}

.pictitle {
  /* width: 200px; */
  height: 40px;
  margin: 20px auto;
  text-align: center;
}
.photo-show {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  margin-top: 100px;
}
.photo-show img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease-in-out;
}
.photo-show img:hover {
  transform: scale(1.1);
}

.picinputBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#picinputText {
  width: 120px;
  border-radius: 15px;
  text-align: center;
}

.picareabtn {
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background-color: #fff;
  color: #bba7b1;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 40px;
  text-align: center;
}

.picareabtn:hover {
  transform: scale(1.1);
}
</style>
