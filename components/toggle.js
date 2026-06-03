/**
 * Creates a toggle switch element.
 * @param {object} opts
 * @param {string} opts.id
 * @param {boolean} opts.checked
 * @param {string} opts.label
 * @param {string} [opts.sublabel]
 * @param {function} opts.onChange
 */
export function createToggle({ id, checked, label, sublabel, onChange }) {
  const wrap = document.createElement('div')
  wrap.className = 'toggle-wrap'
  wrap.innerHTML = `
    <label class="toggle-switch">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
      <span class="toggle-track"></span>
    </label>
    <label for="${id}" class="toggle-label">
      ${label}
      ${sublabel ? `<div class="toggle-sublabel">${sublabel}</div>` : ''}
    </label>
  `
  const input = wrap.querySelector('input')
  input.addEventListener('change', () => onChange(input.checked))
  return wrap
}
