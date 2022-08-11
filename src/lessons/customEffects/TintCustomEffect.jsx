import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = `
  uniform vec3 color;
  uniform float alpha;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(color.rgb, alpha);
  }
`

let _uColor
let _uAlpha

// Effect implementation
class TintCustomEffectImpl extends Effect {
  constructor({ color = [0.1, 0.0, 0.0], alpha = 0.1 } = {}) {
    super('TintCustomEffect', fragmentShader, {
      uniforms: new Map([
        ['color', new Uniform(color)],
        ['alpha', new Uniform(alpha)],
      ]),
    })

    console.log(color, alpha);
    _uColor = color
    _uAlpha = alpha
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('color').value = _uColor
    this.uniforms.get('alpha').value = _uAlpha
  }
}

// Effect component
/**
 * @param color - vec3
 * @param alpha - number - Needs blending 
 */
export const TintCustomEffect = forwardRef(({ color, alpha }, ref) => {
  // adjust color strength
  color = color.map(c => c = c * 0.1)
  console.log(color);
  const effect = useMemo(() => new TintCustomEffectImpl({color, alpha}), [color, alpha])
  return <primitive ref={ref} object={effect} dispose={null} />
})