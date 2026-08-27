import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<ImageBitmap[]>([]);
  const smoothedProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef<number>(0);
  const cacheReady = useRef(false);
  const lastDrawnIdx = useRef(-1);
  const totalFrames = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const isMobile = window.innerWidth < 768;

    // ── how many frames & what resolution ──
    const FRAME_COUNT = isMobile ? 40 : 60;
    const TARGET_WIDTH = isMobile ? 640 : 1080;

    // ── resize canvas ──
    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      lastDrawnIdx.current = -1;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ── cover-fit helper ──
    function coverRect(srcW: number, srcH: number, dstW: number, dstH: number) {
      const scale = Math.max(dstW / srcW, dstH / srcH);
      const w = srcW * scale;
      const h = srcH * scale;
      return { x: (dstW - w) / 2, y: (dstH - h) / 2, w, h };
    }

    // ── draw frame ──
    function drawFrame(progress: number) {
      const frames = frameCache.current;
      if (frames.length === 0) return;
      // only draw up to how many frames are ready so far
      const available = frames.length - 1;
      const idx = Math.min(
        Math.round(progress * (totalFrames.current - 1)),
        available
      );
      if (idx === lastDrawnIdx.current) return;
      lastDrawnIdx.current = idx;
      const bmp = frames[idx];
      if (!bmp) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const { x, y, w, h } = coverRect(bmp.width, bmp.height, cw, ch);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(bmp, x, y, w, h);
    }

    // ── scroll tracker ──
    function updateScroll() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current =
        maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
          : 0;
    }
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    // ── animation loop ──
    function loop() {
      rafId.current = requestAnimationFrame(loop);
      smoothedProgress.current +=
        (targetProgress.current - smoothedProgress.current) * 0.08;
      if (cacheReady.current) drawFrame(smoothedProgress.current);
    }
    rafId.current = requestAnimationFrame(loop);

    // ── extract frames ──
    async function extractFrames() {
      const vid = document.createElement("video");
      vid.src = VIDEO_URL;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = "auto";
      vid.crossOrigin = "anonymous";

      await new Promise<void>((res, rej) => {
        vid.onloadedmetadata = () => res();
        vid.onerror = () => rej(new Error("Video load failed"));
        vid.load();
      });

      const dur = vid.duration;
      if (!dur || !isFinite(dur)) return;

      totalFrames.current = FRAME_COUNT;

      const vw = vid.videoWidth || 1920;
      const vh = vid.videoHeight || 1080;
      const scale = Math.min(1, TARGET_WIDTH / vw);
      const fw = Math.round(vw * scale);
      const fh = Math.round(vh * scale);

      const offCanvas = document.createElement("canvas");
      offCanvas.width = fw;
      offCanvas.height = fh;
      const offCtx = offCanvas.getContext("2d")!;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const t = (i / (FRAME_COUNT - 1)) * (dur - 0.05);
        vid.currentTime = t;
        await new Promise<void>((res) => { vid.onseeked = () => res(); });
        offCtx.drawImage(vid, 0, 0, fw, fh);
        const bmp = await createImageBitmap(offCanvas);
        frameCache.current.push(bmp);

        // ── show first frame immediately ──
        if (i === 0) {
          cacheReady.current = true;
          canvas.style.opacity = "1";
        }
      }
    }

    extractFrames().catch(console.error);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resizeCanvas);
      frameCache.current.forEach((b) => b.close());
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "#0a0a0a" }}
    >
      {/* Dark fallback while loading */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0, transition: "opacity 800ms ease" }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.75) 100%)",
        }}
      />
    </div>
  );
}
