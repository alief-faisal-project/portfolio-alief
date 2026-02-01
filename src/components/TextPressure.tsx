import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number,
) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func: () => void, delay: number) => {
  let t: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(t);
    t = setTimeout(func, delay);
  };
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = "FAISAL",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#141414",
  strokeColor = "#FF0000",
  strokeWidth = 2,
  className = "",
  minFontSize = 24,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  const chars = text.split("");

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOS =
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isDesktop = !isMobile;

  /* ===============================
        INIT CENTER
  =============================== */
  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
      cursorRef.current = { ...mouseRef.current };
    };
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  /* ===============================
        DESKTOP MOUSE ONLY
  =============================== */
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouse = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isDesktop]);

  /* ===============================
        AUTO ANDROID GYRO
  =============================== */
  useEffect(() => {
    if (isMobile && !isIOS) {
      setGyroEnabled(true);
    }
  }, [isMobile, isIOS]);

  /* ===============================
        IOS PERMISSION
  =============================== */
  const enableGyro = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === "granted") setGyroEnabled(true);
    }
  };

  /* ===============================
        GYRO LISTENER (MOBILE ONLY)
  =============================== */
  useEffect(() => {
    if (!gyroEnabled || isDesktop) return;

    const handle = (e: DeviceOrientationEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      cursorRef.current.x =
        r.left + r.width / 2 + ((e.gamma ?? 0) / 45) * r.width * 0.5;
      cursorRef.current.y =
        r.top + r.height / 2 + ((e.beta ?? 0) / 45) * r.height * 0.5;
    };

    window.addEventListener("deviceorientation", handle);
    return () => window.removeEventListener("deviceorientation", handle);
  }, [gyroEnabled, isDesktop]);

  /* ===============================
        SIZE
  =============================== */
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    let fs = width / (chars.length / 2);
    fs = Math.max(fs, minFontSize);
    setFontSize(fs);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current || !scale) return;
      const tr = titleRef.current.getBoundingClientRect();
      const y = height / tr.height;
      setScaleY(y);
      setLineHeight(y);
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const d = debounce(setSize, 100);
    d();
    window.addEventListener("resize", d);
    return () => window.removeEventListener("resize", d);
  }, [setSize]);

  /* ===============================
        ANIMATION
  =============================== */
  useEffect(() => {
    let raf: number;

    const loop = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 10;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 10;

      if (titleRef.current) {
        const tr = titleRef.current.getBoundingClientRect();
        const max = tr.width / 2;

        spansRef.current.forEach((s) => {
          if (!s) return;
          const r = s.getBoundingClientRect();
          const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          const d = dist(mouseRef.current, c);

          s.style.fontVariationSettings = `
            'wght' ${weight ? getAttr(d, max, 100, 900) : 400},
            'wdth' ${width ? getAttr(d, max, 5, 200) : 100},
            'ital' ${italic ? getAttr(d, max, 0, 1) : 0}
          `;
        });
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [width, weight, italic]);

  const styleElement = useMemo(
    () => (
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
        }
      `}</style>
    ),
    [fontFamily, fontUrl],
  );

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {styleElement}

      {isIOS && !gyroEnabled && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <button
            onClick={enableGyro}
            className="px-8 py-4 text-lg font-semibold bg-white rounded-xl"
          >
            Aktifkan Motion
          </button>
        </div>
      )}

      <h1
        ref={titleRef}
        className={`${className} ${flex ? "flex justify-between" : ""} uppercase`}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          margin: 0,
          fontWeight: 100,
          color: textColor,
        }}
      >
        {chars.map((c, i) => (
          <span key={i} ref={(el) => (spansRef.current[i] = el)}>
            {c}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
