/*
 * 0.00000001 is more precise than 0.0001
 * precision is a mandatory variable
 *
 * highp can cause performance issues, and not work on some devices
 * lowp can create bugs by the lack of precision
 * mediump is the way to go
 *
 * precision is handled automatically when using ShaderMaterial (not raw)
 */
precision mediump float;

/*
 * receive the varying from vertex shader 
 * can be added to r, g, b inside the vec4
 */
// varying float vRandom;

void main() {

  /*
   * if alpha is below 1.0, transparent attribute must be true
   */
  gl_FragColor = vec4(0.5, 0.5, 1.0, 0.5);
}