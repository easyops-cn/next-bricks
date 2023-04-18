import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export const createHelper = () => {
  const element = document.createElement('div');
  element.className = 'test';
  const _e = new CSS3DObject(element);
  _e.position.set(0, 0, 0);

  const x = document.createElement('div');
  x.className = 'line';
  x.style.background = "red";
  const _x = new CSS3DObject(x);
  _x.position.set(500, 0, 0);
  _x.rotateZ(Math.PI / 2);

  const xc = document.createElement('div');
  xc.className = 'circle';
  xc.style.background = "red";
  const _xc = new CSS3DObject(xc);
  _xc.position.set(500, 0, 0);

  const y = document.createElement('div');
  y.className = 'line';
  y.style.background = "blue";
  const _y = new CSS3DObject(y);
  _y.position.set(0, 500, 0);

  const yc = document.createElement('div');
  yc.className = 'circle';
  yc.style.background = "blue";
  const _yc = new CSS3DObject(yc);
  _yc.position.set(0, 500, 0);


  const z = document.createElement('div');
  z.className = 'line';
  z.style.background = "green";
  const _z = new CSS3DObject(z);
  _z.position.set(0, 0, 500);
  _z.rotateX(Math.PI / 2);

  const zc = document.createElement('div');
  zc.className = 'circle';
  zc.style.background = "green";
  const _zc = new CSS3DObject(zc);
  _zc.position.set(0, 0, 500);

  return [_e, _x, _xc, _y, _yc, _z, _zc];
};
