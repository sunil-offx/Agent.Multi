import { useCallback, useEffect, useRef, useState } from "react";

function generateCaptchaText(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function drawCaptcha(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 200;
  canvas.height = 60;

  // Background
  ctx.fillStyle = "#E8E8E4";
  ctx.fillRect(0, 0, 200, 60);

  // Noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(28, 28, 28, ${0.15 + Math.random() * 0.15})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 200, Math.random() * 60);
    ctx.lineTo(Math.random() * 200, Math.random() * 60);
    ctx.stroke();
  }

  // Text
  ctx.font = "bold 28px 'Eczar', serif";
  ctx.fillStyle = "#1C1C1C";
  ctx.textBaseline = "middle";

  for (let i = 0; i < text.length; i++) {
    const x = 20 + i * 28;
    const y = 30 + (Math.random() - 0.5) * 10;
    const rotation = (Math.random() - 0.5) * 0.3;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }

  // Noise dots
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(28, 28, 28, ${0.2 + Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 200, Math.random() * 60, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function useCaptcha() {
  const [captchaText, setCaptchaText] = useState(() => generateCaptchaText());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const refresh = useCallback(() => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      drawCaptcha(canvasRef.current, captchaText);
    }
  }, [captchaText]);

  return { captchaText, canvasRef, refresh };
}
