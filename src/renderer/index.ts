import { GlueCanvas } from 'fxglue';

const fragmentShader = `precision highp float;

uniform float iIterations;
uniform float iScale;
uniform vec2 iOffset;
uniform vec4 iColor1;
uniform vec4 iColor2;

float mandelbrot(in vec2 c) {
  const float maxIter = 2048.0;
  float iter = 0.0;
  vec2 z = vec2(0.0);
  for(float i = 0.0; i < maxIter; i++) {
    if (i > iIterations) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if(dot(z,z) > iIterations) break;
    iter++;
  }

  if(iter > iIterations - 1.0) return 0.0;
  float s = iter - log2(log2(dot(z,z))) + 4.0;
  return mix(iter, s, 1.0);
}

void main() {
  const float supersample = 2.0;
  const float div = 0.5 / pow(supersample, 2.0);
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  for(float sx = 0.0; sx < supersample; sx++) {
    for(float sy = 0.0; sy < supersample; sy++) {
      vec2 sc = gl_FragCoord.xy + vec2(sx, sy) / supersample;
      vec2 p = (-iResolution.xy + 2.0 * sc) / iResolution.x;
      float r = mandelbrot(vec2(-0.75, 0.0) - iOffset + p / iScale);
      color += div * mix(iColor1, iColor2, cos(r * 0.1));
    }
  }
  
  gl_FragColor = color;
  gl_FragColor.a = 1.0;
}`;

export interface Settings {
  iIterations: number;
  iColor1: string;
  iColor2: string;
}

export class Renderer {
  glueCanvas = new GlueCanvas({ antialias: true });

  constructor() {
    const glue = this.glueCanvas.glue;
    glue.registerProgram('fractal', fragmentShader);
  }

  render(offset: number[], scale: number, settings: Settings) {
    this.glueCanvas.setSize(window.innerWidth, window.innerHeight);
    const glue = this.glueCanvas.glue;
    glue.program('fractal')?.apply({
      iScale: scale,
      iOffset: [offset[0] * -1, offset[1]],
      ...settings,
    });
    glue.render();
  }
}
