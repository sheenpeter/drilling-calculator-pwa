// ----- Tabs -----
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tab-button');
  const sections = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const target = document.querySelector(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });
});

// ----- Pressure calculations -----
// grad = MW * 0.052 (psi/ft); HP = MW * 0.052 * TVD; SG = MW / 8.33 [file:1]
function calcPressure() {
  const mw = parseFloat(document.getElementById('mw_ppg').value) || 0;
  const tvd = parseFloat(document.getElementById('tvd_m').value) || 0;

  const grad = mw * 0.052;
  const hp = mw * 0.052 * tvd;
  const sg = mw / 8.33;

  document.getElementById('grad_out').textContent = grad.toFixed(4);
  document.getElementById('hp_out').textContent = hp.toFixed(1);
  document.getElementById('sg_out').textContent = sg.toFixed(3);
}

// ----- Hydraulics (annular velocity) -----
// AV(ft/min) = 24.5 * Q / (Dh^2 - Dp^2) [file:1]
function calcPressure() {
  const mw = parseFloat(document.getElementById('mw_ppg').value) || 0;
  const tvd_m = parseFloat(document.getElementById('tvd_ft').value) || 0; // now metres

  const tvd_ft = tvd_m * 3.281;                 // convert m → ft
  const grad = mw * 0.052;                      // psi/ft [file:1]
  const hp = mw * 0.052 * tvd_ft;               // psi [file:1]
  const sg = mw / 8.33;                         // SG [file:1]

  document.getElementById('grad_out').textContent = grad.toFixed(4);
  document.getElementById('hp_out').textContent = hp.toFixed(1);
  document.getElementById('sg_out').textContent = sg.toFixed(3);
}
// ----- Slug calculations -----
// From Lapeyrouse: HP = MW * 0.052 * ft_dry; Δgrad = (SlugMW - MudMW)*0.052;
// L_slug = HP / Δgrad; Vol_slug = L_slug * DP_cap [file:1]
function calcSlug() {
  const mud = parseFloat(document.getElementById('slug_mud_ppg').value) || 0;
  const slug = parseFloat(document.getElementById('slug_ppg').value) || 0;
  const dry = parseFloat(document.getElementById('dry_pipe_ft').value) || 0;
  const cap = parseFloat(document.getElementById('dp_cap_bblft').value) || 0;

  const hp = mud * 0.052 * dry;
  const deltaGrad = (slug - mud) * 0.052;
  let slugLen = 0;
  if (deltaGrad > 0) {
    slugLen = hp / deltaGrad;
  }
  const slugVol = slugLen * cap;

  document.getElementById('slug_hp_out').textContent = hp.toFixed(1);
  document.getElementById('slug_dg_out').textContent = deltaGrad.toFixed(4);
  document.getElementById('slug_len_out').textContent = slugLen.toFixed(0);
  document.getElementById('slug_vol_out').textContent = slugVol.toFixed(2);
}

// ----- Volumes & strokes -----
// DP capacity(bbl/ft) = ID^2 / 1029.4; Volume = cap * length;
// Strokes = Volume / pump_output [file:1]
function calcVolumes() {
  const dpId = parseFloat(document.getElementById('dp_id_in').value) || 0;
  const dpLen = parseFloat(document.getElementById('dp_len_ft').value) || 0;
  const po = parseFloat(document.getElementById('po_bbl_stk').value) || 0;

  const dpCap = dpId > 0 ? (dpId * dpId) / 1029.4 : 0;
  const dpVol = dpCap * dpLen;
  const strokes = po > 0 ? dpVol / po : 0;

  document.getElementById('dp_cap_out').textContent = dpCap.toFixed(5);
  document.getElementById('dp_vol_out').textContent = dpVol.toFixed(2);
  document.getElementById('surf_bit_stk_out').textContent = strokes.toFixed(0);
}

// ----- PWA service worker registration -----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .catch(err => console.error('SW registration failed', err));
  });
}
