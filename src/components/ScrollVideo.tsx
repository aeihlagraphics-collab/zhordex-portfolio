import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

const MAX_FRAMES = 90;
const MIN_FRAMES = 24;
const TARGET_WIDTH = 960;
const LERP_FACTOR = 0.12;
const SEEK_THRESHOLD = 0.04;

export default function ScrollVideo() {
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<ImageBitmap[]>([]);
  const smoothedProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef<number>(0);
  const cacheReady = useRef(false);
  const videoHasFrame = useRef(false);

  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const poster = posterRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2);

    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(smoothedProgress.current);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function coverRect(srcW: number, srcH: number, dstW: number, dstH: number) {
      const scale = Math.max(dstW / srcW, dstH / srcH);
      const w = srcW * scale;
      const h = srcH * scale;
      const x = (dstW - w) / 2;
      const y = (dstH - h) / 2;
      return { x, y, w, h };
    }

    function drawFrame(progress: number) {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      if (cacheReady.current && frameCache.current.length > 0) {
        const frames = frameCache.current;
        const idx = Math.round(progress * (frames.length - 1));
        const bmp = frames[Math.min(idx, frames.length - 1)];
        if (bmp) {
          const { x, y, w, h } = coverRect(bmp.width, bmp.height, cw, ch);
          ctx.drawImage(bmp, x, y, w, h);
        }
      } else if (videoHasFrame.current) {
        const { x, y, w, h } = coverRect(
          video.videoWidth || 1920,
          video.videoHeight || 1080,
          cw,
          ch
        );
        ctx.drawImage(video, x, y, w, h);
      }
    }

    function updateScrollProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current =
        maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    let lastVideoTime = -1;
    function loop() {
      rafId.current = requestAnimationFrame(loop);
      smoothedProgress.current +=
        (targetProgress.current - smoothedProgress.current) * LERP_FACTOR;
      if (!cacheReady.current && videoHasFrame.current) {
        const dur = video.duration;
        if (dur && isFinite(dur)) {
          const targetTime = smoothedProgress.current * (dur - 0.05);
          if (Math.abs(targetTime - lastVideoTime) > SEEK_THRESHOLD) {
            video.currentTime = targetTime;
            lastVideoTime = targetTime;
          }
          drawFrame(smoothedProgress.current);
        }
      } else if (cacheReady.current) {
        drawFrame(smoothedProgress.current);
      }
    }
    rafId.current = requestAnimationFrame(loop);

    async function extractFrames() {
      const offscreen = document.createElement("video");
      offscreen.src = VIDEO_URL;
      offscreen.muted = true;
      offscreen.playsInline = true;
      offscreen.preload = "auto";
      offscreen.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        offscreen.addEventListener("loadedmetadata", () => resolve(), { once: true });
        offscreen.load();
      });
      const dur = offscreen.duration;
      if (!dur || !isFinite(dur)) return;
      const frameCount = Math.max(MIN_FRAMES, Math.min(MAX_FRAMES, Math.floor(dur * 12)));
      const vw = offscreen.videoWidth || 1920;
      const vh = offscreen.videoHeight || 1080;
      const scale = Math.min(1, TARGET_WIDTH / vw);
      const fw = Math.round(vw * scale);
      const fh = Math.round(vh * scale);
      const offCanvas = document.createElement("canvas");
      offCanvas.width = fw;
      offCanvas.height = fh;
      const offCtx = offCanvas.getContext("2d")!;
      const bitmaps: ImageBitmap[] = [];
      for (let i = 0; i < frameCount; i++) {
        const t = (i / (frameCount - 1)) * (dur - 0.05);
        offscreen.currentTime = t;
        await new Promise<void>((resolve) => {
          offscreen.addEventListener("seeked", () => resolve(), { once: true });
        });
        offCtx.drawImage(offscreen, 0, 0, fw, fh);
        const bmp = await createImageBitmap(offCanvas);
        bitmaps.push(bmp);
      }
      frameCache.current = bitmaps;
      cacheReady.current = true;
      canvas.style.opacity = "1";
      video.style.opacity = "0";
    }

    function onVideoLoadedData() {
      videoHasFrame.current = true;
      video.style.opacity = "1";
      poster.style.opacity = "0";
      setTimeout(() => { extractFrames().catch(console.error); }, 300);
    }
    video.addEventListener("loadeddata", onVideoLoadedData, { once: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", resizeCanvas);
      frameCache.current.forEach((bmp) => bmp.close());
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <img
        ref={posterRef}
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transition: "opacity 500ms ease", opacity: 1 }}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0, transition: "opacity 500ms ease" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0, transition: "opacity 500ms ease" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.72) 100%)",
        }}
      />
    </div>
  );
}
