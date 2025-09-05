'use client';

import { useEffect, useRef, useCallback } from 'react';
import './paint-background.css';

interface ElfParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

const PaintBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ElfParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const isVisible = useRef<boolean>(true);

  // Configuración optimizada
  const MAX_PARTICLES = 50; // Límite máximo de partículas
  const TARGET_FPS = 60;
  const FRAME_TIME = 1000 / TARGET_FPS;

  // Función optimizada para crear elfos
  const createElfParticle = useCallback((x: number, y: number): ElfParticle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 6 + 8, // Tamaño pequeño pero visible
      life: 1,
      maxLife: Math.random() * 120 + 60, // Vida más larga
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }, []);

  // Función optimizada para dibujar carita de elfo
  const drawElfFace = useCallback((ctx: CanvasRenderingContext2D, particle: ElfParticle) => {
    const { x, y, size, life, rotation } = particle;
    const alpha = life * 0.8;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    
    // Cara base (roja)
    ctx.fillStyle = `rgba(220, 50, 50, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Orejas puntiagudas
    ctx.fillStyle = `rgba(200, 40, 40, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, -size * 0.2);
    ctx.lineTo(-size * 0.6, -size * 0.5);
    ctx.lineTo(-size * 0.2, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.4, -size * 0.2);
    ctx.lineTo(size * 0.6, -size * 0.5);
    ctx.lineTo(size * 0.2, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Ojos (solo si el tamaño es suficiente)
    if (size > 10) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(-size * 0.15, -size * 0.1, size * 0.08, 0, Math.PI * 2);
      ctx.arc(size * 0.15, -size * 0.1, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupilas
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(-size * 0.15, -size * 0.1, size * 0.04, 0, Math.PI * 2);
      ctx.arc(size * 0.15, -size * 0.1, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Sonrisa
    if (size > 8) {
      ctx.strokeStyle = `rgba(150, 30, 30, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, size * 0.1, size * 0.2, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // Función optimizada de actualización con throttling
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Aplicar fricción suave
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      
      // Actualizar rotación
      particle.rotation += particle.rotationSpeed;
      
      // Reducir vida
      particle.life -= 1 / particle.maxLife;
      
      // Remover partículas muertas
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }, []);

  // Función optimizada de renderizado
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    // Limpiar canvas de forma eficiente
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dibujar solo partículas visibles
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Culling: solo dibujar partículas en pantalla
      if (particle.x < -50 || particle.x > ctx.canvas.width + 50 ||
          particle.y < -50 || particle.y > ctx.canvas.height + 50) {
        continue;
      }
      
      drawElfFace(ctx, particle);
    }
  }, [drawElfFace]);

  // Animación optimizada con control de FPS
  const animate = useCallback((currentTime: number) => {
    if (!isVisible.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Control de FPS
    if (currentTime - lastFrameTime.current < FRAME_TIME) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameTime.current = currentTime;

    updateParticles();
    drawParticles(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || particlesRef.current.length >= MAX_PARTICLES) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calcular velocidad del mouse
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    mouseRef.current = { x, y };

    // Crear elfos solo si hay movimiento significativo
    if (speed > 5 && Math.random() < 0.3) {
      const particle = createElfParticle(x, y);
      
      // Agregar velocidad basada en el movimiento del mouse
      particle.vx += dx * 0.05;
      particle.vy += dy * 0.05;
      
      particlesRef.current.push(particle);
    }
  }, [createElfParticle]);

  const handleMouseEnter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Crear solo algunos elfos al entrar
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(createElfParticle(x, y));
    }
  }, [createElfParticle]);

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || particlesRef.current.length >= MAX_PARTICLES - 5) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Crear pequeña explosión de elfos en el click
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      
      const particle = createElfParticle(particleX, particleY);
      particle.vx = Math.cos(angle) * 2;
      particle.vy = Math.sin(angle) * 2;
      
      particlesRef.current.push(particle);
    }
  }, [createElfParticle]);

  // Detectar visibilidad de la página para pausar animación
  const handleVisibilityChange = useCallback(() => {
    isVisible.current = !document.hidden;
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    
    // Event listeners optimizados
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    canvas.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Crear solo algunos elfos iniciales
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(createElfParticle(x, y));
    }

    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleClick, handleVisibilityChange, createElfParticle, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="paint-canvas"
    />
  );
};

export default PaintBackground;