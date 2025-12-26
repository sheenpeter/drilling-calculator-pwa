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
// TVD input in metres; formulas use ft, so convert m → ft. [file:1]
function calcPressure() {
  const mw = parseFloat(document.getElementById('mw_ppg').value) || 0;
  const tvd_m = parseFloat(document.getElementById('tvd_m').value) || 0;

  const tvd_ft = tvd_m * 3.281;              // metres → feet
  const grad = mw * 0.052;                   // psi/ft [file:1]
  const hp = mw * 0.052 * tvd_ft;            // psi [file:1]
  const sg = mw / 8.33;                      // SG [file:1]

  document.getElementById('grad_out').textContent = grad.toFixed(4);
  document.getElementById('hp_out').textContent = hp.toFixed(1);
  document.getElementById('sg_out').textContent = sg.toFixed(3);
}

// ----- Hydraulics (annular velocity) -----
// AV(ft/min) = 24.5 * Q / (Dh^2 - Dp^2) [file:1]
function calcHydraulics() {
  const q = parseFloat(document.getElementById('q_gpm').value) || 0;
  const dh = parseFloat(document.getElementById('dh_in').value) || 0;
  const dp = parseFloat(document.getElementById('dp_in').value) || 0;

  const denom = dh * dh - dp * dp;
  let avFtMin = 0;
  if (denom > 0) {
    avFtMin = 24.5 * q / denom;
  }

  const avFtSec = avFtMin / 60;

  document.getElementById('av_ftmin_out').textContent = avFtMin.toFixed(1);
  document.getElementById('av_ftsec_out').textContent = avFtSec.toFixed(2);
}

// ----- Slug calculations -----
// Dry pipe input in metres; formulas defined with ft, so convert. [file:1]
function calcSlug() {
  const mud = parseFloat(document.getElementById('slug_mud_ppg').value) || 0;
  const slug = parseFloat(document.getElementById('slug_ppg').value) || 0;
  const dry_m = parseFloat(document.getElementById('dry_pipe_m').value) || 0;
  const cap = parseFloat(document.getElementById('dp_cap_bblft').value) || 0;

  const dry_ft = dry_m * 3.281;              // metres → feet
  const hp = mud * 0.052 * dry_ft;           // psi [file:1]
  const deltaGrad = (slug - mud) * 0.052;    // psi/ft [file:1]

  let slugLen_ft = 0;
  if (deltaGrad > 0) {
    slugLen_ft = hp / deltaGrad;
  }
  const slugVol = slugLen_ft * cap;          // bbl [file:1]

  document.getElementById('slug_hp_out').textContent = hp.toFixed(1);
  document.getElementById('slug_dg_out').textContent = deltaGrad.toFixed(4);
  document.getElementById('slug_len_out').textContent = slugLen_ft.toFixed(0);
  document.getElementById('slug_vol_out').textContent = slugVol.toFixed(2);
}

// ----- Volumes & strokes -----
// Uses original ft-based formulas for DP length. [file:1]
function calcVolumes() {
  const dpId = parseFloat(document.getElementById('dp_id_in').value) || 0;
  const dpLen = parseFloat(document.getElementById('dp_len_ft').value) || 0;
  const po = parseFloat(document.getElementById('po_bbl_stk').value) || 0;

  const dpCap = dpId > 0 ? (dpId * dpId) / 1029.4 : 0;   // bbl/ft [file:1]
  const dpVol = dpCap * dpLen;                           // bbl
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
