import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Plasma.css";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;
uniform float iTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float wave = sin(vUv.x * 10.0 + iTime) * 0.5 + 0.5;
  gl_FragColor = vec4(uColor * wave, 1.0);
}
`;

export default function Plasma({ color = "#ff6b35" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        uColor: { value: hexToRgb(color) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let animation;
    const animate = (t) => {
      program.uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      animation = requestAnimationFrame(animate);
    };

    animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      containerRef.current.removeChild(canvas);
    };
  }, [color]);

  return <div ref={containerRef} className="plasma-container" />;
}