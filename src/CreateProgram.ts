import createShader from './CreateShader';

const createProgram = (gl: WebGLRenderingContext, shaderData: {src: string, type: GLenum}[]) => {
  const program = gl.createProgram()!;

  const shaders = shaderData
    .map(s => createShader(gl, s.src, s.type))
    .forEach(s => gl.attachShader(program, s));

  gl.linkProgram(program);

  return program;
};

export default createProgram;