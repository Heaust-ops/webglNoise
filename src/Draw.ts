async function downloadImage(imageSrc: string, filename: string) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

let download = false;
const draw = (
  gl: WebGLRenderingContext,
  now: number,
  state: {
    geometryBuffer: WebGLBuffer | null;
    attributes: { position: GLint };
    uniforms: {
      resolution: WebGLUniformLocation | null;
      millis: WebGLUniformLocation | null;
    };
  }
) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, state.geometryBuffer);

  gl.enableVertexAttribArray(state.attributes.position);
  gl.vertexAttribPointer(state.attributes.position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(
    state.uniforms.resolution,
    window.innerWidth,
    window.innerHeight
  );
  gl.uniform1f(state.uniforms.millis, now);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  let run_once = false;
  if (!run_once) {
    run_once = true;
    // Download Logic
    (<HTMLButtonElement>document.getElementById("download")!).onclick = (e) => {
      download = true;
    };
  }

  if (download) {
    download = false;
    const d = (<HTMLCanvasElement>gl.canvas).toDataURL("image/jpeg");
    downloadImage(d, "noise.jpg");
  }

  requestAnimationFrame((now) => draw(gl, now, state));
};

export default draw;
