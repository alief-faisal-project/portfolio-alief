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

const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const [gyroEnabled, setGyroEnabled] = useState(false);

  const chars = text.split("");

  /* ===============================
     INIT + MOUSE FALLBACK
  =============================== */
  useEffect(() => {
    const initCenter = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      cursorRef.current = { ...mouseRef.current };
    };

    initCenter();

    const handleMouseMove = (e: MouseEvent) => {
      if (gyroEnabled) return;
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", initCenter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", initCenter);
    };
  }, [gyroEnabled]);

  /* ===============================
     ENABLE GYRO (IOS SAFE)
  =============================== */
  const enableGyro = async () => {
    // iOS
    // @ts-ignore
    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
      try {
        // @ts-ignore
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") {
          setGyroEnabled(true);
        }
      } catch {
        return;
      }
    } else {
      // Android
      setGyroEnabled(true);
    }
  };

  /* ===============================
     GYRO LISTENER
  =============================== */
  useEffect(() => {
    if (!gyroEnabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const gamma = e.gamma ?? 0; // kiri kanan
      const beta = e.beta ?? 0; // depan belakang

      cursorRef.current.x =
        rect.left + rect.width / 2 + (gamma / 45) * rect.width * 0.5;

      cursorRef.current.y =
        rect.top + rect.height / 2 + (beta / 45) * rect.height * 0.5;
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [gyroEnabled]);

  /* ===============================
        SIZE CALCULATION
  =============================== */
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debounced = debounce(setSize, 100);
    debounced();
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, [setSize]);

  /* ===============================
          ANIMATION LOOP
  =============================== */
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 12;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 12;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : "0";
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          if (alpha) span.style.opacity = alphaVal;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  /* ===============================
              STYLE
  =============================== */
  const styleElement = useMemo(
    () => (
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
        }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          inset: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
        }
      `}</style>
    ),
    [fontFamily, fontUrl, textColor, strokeColor, strokeWidth],
  );

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {styleElement}

      {!gyroEnabled && (
        <button
          onClick={enableGyro}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 999,
            padding: "8px 12px",
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          Aktifkan Motion
        </button>
      )}

      <h1
        ref={titleRef}
        className={`${className} ${flex ? "flex justify-between" : ""} ${
          stroke ? "stroke" : ""
        } uppercase`}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            className="inline-block"
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
