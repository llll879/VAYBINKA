// VYBINKA reliable button/touch layer v5
(function(){
  'use strict';
  const bound = new WeakSet();
  function execute(code, el, ev){
    try {
      return Function('event', code).call(el, ev);
    } catch (err) {
      console.error('[VYBINKA] button failed:', code, err);
      if (typeof window.toast === 'function') window.toast('Ошибка действия. Попробуй ещё раз.');
      return false;
    }
  }
  function bind(el){
    if (!el || bound.has(el)) return;
    const code = el.getAttribute('onclick');
    if (!code) return;
    bound.add(el);
    el.removeAttribute('onclick');
    if (el.tagName === 'BUTTON' && !el.getAttribute('type')) el.setAttribute('type','button');
    el.style.touchAction = 'manipulation';
    el.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); execute(code, el, ev); }, {passive:false});
  }
  function scan(root){
    if (!root) return;
    if (root.nodeType === 1) bind(root);
    if (root.querySelectorAll) root.querySelectorAll('[onclick]').forEach(bind);
    if (root.querySelectorAll) root.querySelectorAll('button').forEach(b => {
      if (!b.getAttribute('type')) b.setAttribute('type','button');
      b.style.touchAction = 'manipulation';
    });
  }
  function start(){
    scan(document);
    new MutationObserver(records => records.forEach(r => r.addedNodes.forEach(n => { if(n.nodeType===1) scan(n); }))).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
