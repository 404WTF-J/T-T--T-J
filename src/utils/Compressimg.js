export function compressImage(
  file,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.7
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;

        // 计算缩放比例，保持宽高比
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = width * scale;
          height = height * scale;
        }

        // 创建 canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // 绘制缩放后的图片
        ctx.drawImage(img, 0, 0, width, height);
        // 【改造-核心修复】
        // 1. 根据原图类型决定输出类型，保持格式一致(不再强制变成png)
        // 2. canvas 原生只支持导出 png/jpeg/webp 这三种，
        //    如果原图是其他格式(比如gif)，兜底转成jpeg
        const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
        const outputType = supportedTypes.includes(file.type)
          ? file.type
          : "image/jpeg";

        // 【改造-核心修复】
        // 3. quality 参数只对 jpeg/webp 有效(有损压缩才谈得上quality)，
        //    png 是无损格式，传quality参数会被浏览器忽略，不影响体积
        //    这里按类型给出更合理的默认质量值
        let finalQuality = quality;
        if (outputType === "image/jpeg") finalQuality = 0.8;
        if (outputType === "image/webp") finalQuality = 0.75;
        // png 不需要设置 quality，无损压缩不吃这个参数
        // 转成压缩后的 base64
        // 【改造-核心修复】canvas.toBlob 只传 3 个参数：callback、type、quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("图片压缩失败"));
              return;
            }
            resolve(blob);
          },
          outputType, // 👈 正确传入 MIME 类型字符串
          finalQuality // 👈 quality 只在 jpeg/webp 时生效
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
