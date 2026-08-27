import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<ImageBitmap[]>([]);
  const hdCache = useRef<ImageBitmap[]>([]);
  const smoothedProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef<number>(0);
  const cacheReady = useRef(false);
  const hdReady = useRef(false);
  const lastDrawnIdx = useRef(-1);
  const totalFrames = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const isMobile = window.innerWidth < 768;

// ── Phase 1: fast low-res preview ──
const LQ_FRAMES = isMobile ? 10 : 15;
const LQ_WIDTH = isMobile ? 320 : 480;

// ── Phase 2: full HD swap ──
const HQ_FRAMES = isMobile ? 50 : 80;
const HQ_WIDTH = isMobile ? 960 : 1920;

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
      // prefer HD cache once it starts filling in
      const useHD = hdReady.current && hdCache.current.length > 0;
      const frames = useHD ? hdCache.current : frameCache.current;
      const total = useHD ? HQ_FRAMES : totalFrames.current;

      if (frames.length === 0) return;

      const available = frames.length - 1;
      const idx = Math.min(
        Math.round(progress * (total - 1)),
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

    // ── generic frame extractor ──
    async function extractFrames(
      vid: HTMLVideoElement,
      frameCount: number,
      targetWidth: number,
      onFirstFrame?: () => void
    ): Promise<ImageBitmap[]> {
      const dur = vid.duration;
      if (!dur || !isFinite(dur)) return [];

      const vw = vid.videoWidth || 1920;
      const vh = vid.videoHeight || 1080;
      const scale = Math.min(1, targetWidth / vw);
      const fw = Math.round(vw * scale);
      const fh = Math.round(vh * scale);

      const offCanvas = document.createElement("canvas");
      offCanvas.width = fw;
      offCanvas.height = fh;
      const offCtx = offCanvas.getContext("2d")!;

      const cache: ImageBitmap[] = [];

      for (let i = 0; i < frameCount; i++) {
        const t = (i / (frameCount - 1)) * (dur - 0.05);
        vid.currentTime = t;
        await new Promise<void>((res) => { vid.onseeked = () => res(); });
        offCtx.drawImage(vid, 0, 0, fw, fh);
        const bmp = await createImageBitmap(offCanvas);
        cache.push(bmp);

        if (i === 0 && onFirstFrame) onFirstFrame();
      }

      return cache;
    }

    // ── create & load video element ──
    async function createVideo(): Promise<HTMLVideoElement> {
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

      return vid;
    }

    // ── Phase 1: load LQ frames fast ──
async function loadLQ() {
  const vid = await createVideo();
  totalFrames.current = LQ_FRAMES;

  // ── grab frame 0 instantly at tiny resolution ──
  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = 320;
  thumbCanvas.height = 180;
  const thumbCtx = thumbCanvas.getContext("2d")!;
  vid.currentTime = 0;
  await new Promise<void>((res) => { vid.onseeked = () => res(); });
  thumbCtx.drawImage(vid, 0, 0, 320, 180);
  const thumbBmp = await createImageBitmap(thumbCanvas);
  frameCache.current = [thumbBmp];
  totalFrames.current = 1;
  cacheReady.current = true;
  canvas.style.opacity = "1"; // ✅ shows within ~1s

  // ── now load the rest of the LQ frames ──
  const frames = await extractFrames(
    vid,
    LQ_FRAMES,
    LQ_WIDTH
  );

  frameCache.current = frames;
  totalFrames.current = LQ_FRAMES;
  lastDrawnIdx.current = -1;
  return vid;
}

    // ── Phase 2: silently swap in HQ frames ──
    async function loadHQ(vid: HTMLVideoElement) {
      const frames = await extractFrames(
        vid,
        HQ_FRAMES,
        HQ_WIDTH
      );

      // swap in HD frames and free LQ memory
      hdCache.current = frames;
      hdReady.current = true;
      lastDrawnIdx.current = -1; // force redraw at HD

      // free LQ bitmaps
      frameCache.current.forEach((b) => b.close());
      frameCache.current = [];
    }

    // ── run both phases ──
    async function run() {
      try {
        const vid = await loadLQ();
        await loadHQ(vid); // starts immediately after LQ is done
      } catch (e) {
        console.error("ScrollVideo error:", e);
      }
    }

    run();

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resizeCanvas);
      frameCache.current.forEach((b) => b.close());
      hdCache.current.forEach((b) => b.close());
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
