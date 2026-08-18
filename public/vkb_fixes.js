// VYBINKA — reliable button/touch compatibility layer
// The previous build relied heavily on inline onclick handlers. Some Android
// WebViews/hosts block inline handlers, making buttons appear completely dead.
// This layer converts every onclick into a normal addEventListener handler.
// It also keeps touch/click behaviour consistent on mobile.

(function () {
  'use strict';

  const bound = new WeakSet();

  function decodeQuoted(value) {
    return value
      .replace(/\\(['"\\])/g, '$1')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');
  }

  function splitStatements(code) {
    const out = [];
    let start = 0, quote = null, escaped = false, depth = 0;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (quote) {
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === "'" || ch === '"') { quote = ch; continue; }
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ';' && depth === 0) {
        out.push(code.slice(start, i).trim());
        start = i + 1;
      }
    }
    const tail = code.slice(start).trim();
    if (tail) out.push(tail);
    return out;
  }

  function parseArgs(text) {
    const args = [];
    let i = 0;
    while (i < text.length) {
      while (/\s|,/.test(text[i] || '')) i++;
      if (i >= text.length) break;

      const q = text[i];
      if (q !== "'" && q !== '"') return null;

      i++;
      let value = '', escaped = false;
      while (i < text.length) {
        const ch = text[i++];
        if (escaped) {
          value += '\\' + ch;
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === q) {
          break;
        } else {
          value += ch;
        }
      }
      args.push(decodeQuoted(value));
      while (/\s/.test(text[i] || '')) i++;
      if (text[i] === ',') i++;
    }
    return args;
  }

  function callStatement(statement, el, event) {
    statement = statement.trim();
    if (!statement || statement === 'return false') return;

    // Common class-toggle buttons used by registration interests.
    let m = statement.match(/^this\.classList\.toggle\((['"])(.*?)\1\)$/);
    if (m) {
      el.classList.toggle(m[2]);
      return;
    }

    // Common modal backdrop handler.
    if (statement === 'if(event.target===this)closeModal()') {
      if (event.target === el && typeof window.closeModal === 'function') window.closeModal();
      return;
    }

    // Extract a normal global function call: foo('arg','arg')
    m = statement.match(/^([A-Za-z_$][\w$]*)\(([\s\S]*)\)$/);
    if (!m) return;

    const fn = window[m[1]];
    if (typeof fn !== 'function') {
      console.warn('[VYBINKA] Button target is unavailable:', m[1]);
      return;
    }

    const args = parseArgs(m[2]);
    if (args === null) {
      console.warn('[VYBINKA] Could not parse button arguments:', statement);
      return;
    }
    return fn.apply(el, args);
  }

  function bindElement(el) {
    if (bound.has(el)) return;
    const code = el.getAttribute('onclick');
    if (!code) return;

    // Remove inline JavaScript so CSP/Android WebView cannot block the action.
    el.removeAttribute('onclick');
    bound.add(el);

    el.style.touchAction = 'manipulation';
    el.style.webkitTapHighlightColor = 'transparent';

    el.addEventListener('click', function (event) {
      event.preventDefault();
      try {
        for (const statement of splitStatements(code)) {
          callStatement(statement, el, event);
        }
      } catch (err) {
        console.error('[VYBINKA] Button action failed:', code, err);
        if (typeof window.toast === 'function') window.toast('Не удалось выполнить действие');
      }
    }, { passive: false });
  }

  function bindAll(root) {
    const scope = root && root.querySelectorAll ? root : document;
    if (scope.matches && scope.matches('[onclick]')) bindElement(scope);
    scope.querySelectorAll('[onclick]').forEach(bindElement);

    // Native buttons must never accidentally submit a form.
    scope.querySelectorAll('button').forEach(function (b) {
      if (!b.getAttribute('type')) b.setAttribute('type', 'button');
      b.style.touchAction = 'manipulation';
      b.style.webkitTapHighlightColor = 'transparent';
    });

    scope.querySelectorAll('input[type=file]').forEach(function (input) {
      input.style.pointerEvents = 'auto';
      input.style.touchAction = 'manipulation';
    });
  }

  function start() {
    bindAll(document);

    const observer = new MutationObserver(function (records) {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === 1) bindAll(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('error', function (e) {
    try { console.error('VYBINKA:', e.error || e.message); } catch (_) {}
  });
})();
