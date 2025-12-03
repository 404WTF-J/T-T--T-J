<template>
  <div class="imgdetail-wrapper">
    <BaseCard>
      <div>
        <img :src="props.imgStr" style="width: 100%; height: 100%" />
        <p style="margin-top: 10px">{{ props.descStr }}</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";
import BaseCard from "@/components/base-card/base-card.vue";

const count = ref(0);
const props = defineProps({
  imgStr: {
    type: String,
  },
  descStr: {
    type: String,
  },
});

function increment() {
  count.value++;
}

onMounted(() => {
  console.log(props.imgStr, props.descStr, "详情来了");
  // 生命周期钩子
});
</script>

<style scoped>
.imgdetail-wrapper {
  width: 95%;
  height: auto;
  /* background-color: aliceblue; */
}
</style>