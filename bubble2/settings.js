const DEFAULTS = {
  renderScale: 0.7,
  maxDpr: 1.25,
  ior: 1.5,
  dispersion: 0.018,
  exposure: 0.85,
  envIntensity: 1.0,
  envRotation: 0.35,
  envMode: 'cubemap',
  useCubemap: 1,
  thinFilm: 1,
  filmStrength: 0.55,
  filmThickness: 480,
  filmIOR: 1.33,
  shellThick: 0.008,
  hollowPower: 3.0,
  wobble: 1,
  wobbleAmp: 0.035,
  wobbleSpeed: 0.85,
  rimStrength: 0.35,
  chromaticRim: 0.14,
  fresnelBoost: 1.0,
  autoRotate: 0,
  autoRotateSpeed: 0.25,
  animateEnv: 1,
  blobCount: 6,
  metaThreshold: 0.92,
  metaBlend: 1.0,
  driftSpeed: 1.0,
  bounds: 2.2,
};

export function createSettingsPanel(onChange) {
  const panel = document.createElement('aside');
  panel.className = 'panel';
  panel.innerHTML = `
    <header class="panel-head">
      <span>Bubble</span>
      <button type="button" class="panel-toggle" aria-label="Collapse panel">−</button>
    </header>
    <div class="panel-body"></div>
  `;

  const body = panel.querySelector('.panel-body');
  const state = { ...DEFAULTS };
  const controls = [];

  function row(label, id, inputHtml) {
    const el = document.createElement('label');
    el.className = 'row';
    el.htmlFor = id;
    el.innerHTML = `<span class="row-label">${label}</span><span class="row-control">${inputHtml}</span>`;
    body.appendChild(el);
    return el;
  }

  function addRange(key, label, min, max, step, fmt = (v) => v.toFixed(2)) {
    const id = `s-${key}`;
    row(
      label,
      id,
      `<input type="range" id="${id}" min="${min}" max="${max}" step="${step}" />
       <output id="${id}-out">${fmt(state[key])}</output>`
    );
    const input = panel.querySelector(`#${id}`);
    const out = panel.querySelector(`#${id}-out`);
    input.value = state[key];
    const update = () => {
      state[key] = parseFloat(input.value);
      out.textContent = fmt(state[key]);
      onChange(state);
    };
    input.addEventListener('input', update);
    controls.push({ key, input, out, fmt });
  }

  function addSelect(key, label, options) {
    const id = `s-${key}`;
    const opts = options
      .map((o) => `<option value="${o.value}">${o.label}</option>`)
      .join('');
    row(label, id, `<select id="${id}">${opts}</select>`);
    const input = panel.querySelector(`#${id}`);
    input.value = state[key];
    input.addEventListener('change', () => {
      state[key] = input.value;
      if (key === 'envMode') {
        state.useCubemap = input.value === 'cubemap' ? 1 : 0;
      }
      onChange(state);
    });
  }

  function addCheck(key, label) {
    const id = `s-${key}`;
    row(
      label,
      id,
      `<input type="checkbox" id="${id}" ${state[key] ? 'checked' : ''} />`
    );
    const input = panel.querySelector(`#${id}`);
    input.addEventListener('change', () => {
      state[key] = input.checked ? 1 : 0;
      onChange(state);
    });
  }

  body.appendChild(sectionTitle('Metaballs'));
  addRange('blobCount', 'Bubble count', 2, 8, 1, (v) => `${Math.round(v)}`);
  addRange('metaThreshold', 'Merge threshold', 0.6, 1.4, 0.02, (v) => v.toFixed(2));
  addRange('metaBlend', 'Blob size', 0.7, 1.4, 0.02);
  addRange('driftSpeed', 'Drift speed', 0.2, 2.5, 0.05);

  body.appendChild(sectionTitle('Performance'));
  addRange('renderScale', 'Resolution', 0.4, 1.0, 0.05, (v) => `${Math.round(v * 100)}%`);
  addRange('maxDpr', 'Max DPR', 1.0, 2.0, 0.25, (v) => v.toFixed(2));

  body.appendChild(sectionTitle('Environment'));
  addSelect('envMode', 'Source', [
    { value: 'cubemap', label: 'Cubemap HDRI' },
    { value: 'procedural', label: 'Live procedural' },
  ]);
  addRange('envIntensity', 'Intensity', 0.4, 3, 0.05);
  addRange('envRotation', 'Rotation', 0, 6.28, 0.01, (v) => `${((v / Math.PI) * 180).toFixed(0)}°`);
  addCheck('animateEnv', 'Spin env (GPU)');

  body.appendChild(sectionTitle('Optics'));
  addRange('ior', 'IOR', 1.2, 1.8, 0.01);
  addRange('dispersion', 'Dispersion', 0, 0.06, 0.001, (v) => v.toFixed(3));
  addRange('fresnelBoost', 'Fresnel', 0.2, 2, 0.05);
  addRange('exposure', 'Exposure', 0.3, 1.5, 0.05);

  body.appendChild(sectionTitle('Thin film'));
  addCheck('thinFilm', 'Enable');
  addRange('filmStrength', 'Strength', 0, 1.2, 0.01);
  addRange('filmThickness', 'Thickness (nm)', 280, 720, 5, (v) => `${Math.round(v)}`);
  addRange('filmIOR', 'Film IOR', 1.2, 1.5, 0.01);
  addRange('shellThick', 'Wall thickness', 0.003, 0.02, 0.001, (v) => v.toFixed(3));
  addRange('hollowPower', 'Center clarity', 0.5, 5.0, 0.1, (v) => v.toFixed(1));

  body.appendChild(sectionTitle('Surface'));
  addCheck('wobble', 'Wobble');
  addRange('wobbleAmp', 'Amplitude', 0, 0.12, 0.001, (v) => v.toFixed(3));
  addRange('wobbleSpeed', 'Speed', 0, 2.5, 0.05);

  body.appendChild(sectionTitle('Rim'));
  addRange('rimStrength', 'Specular rim', 0, 1, 0.01);
  addRange('chromaticRim', 'Chromatic rim', 0, 0.5, 0.01);

  body.appendChild(sectionTitle('Camera'));
  addCheck('autoRotate', 'Auto pan');
  addRange('autoRotateSpeed', 'Pan speed', 0.05, 1.2, 0.05);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'reset-btn';
  resetBtn.textContent = 'Reset defaults';
  resetBtn.addEventListener('click', () => {
    Object.assign(state, DEFAULTS);
    controls.forEach(({ key, input, out, fmt }) => {
      if (input.type === 'range') {
        input.value = state[key];
        if (out) out.textContent = fmt(state[key]);
      }
    });
    panel.querySelector('#s-envMode').value = state.envMode;
    panel.querySelector('#s-thinFilm').checked = !!state.thinFilm;
    panel.querySelector('#s-wobble').checked = !!state.wobble;
    panel.querySelector('#s-animateEnv').checked = !!state.animateEnv;
    panel.querySelector('#s-autoRotate').checked = !!state.autoRotate;
    onChange(state);
  });
  body.appendChild(resetBtn);

  const toggle = panel.querySelector('.panel-toggle');
  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    toggle.textContent = panel.classList.contains('collapsed') ? '+' : '−';
  });

  document.body.appendChild(panel);
  onChange(state);
  return { panel, state };
}

function sectionTitle(text) {
  const h = document.createElement('h3');
  h.className = 'section-title';
  h.textContent = text;
  return h;
}
