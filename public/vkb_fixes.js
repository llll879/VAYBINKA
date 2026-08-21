// VYBINKA — reliable Android button/touch compatibility layer v4
(function(){
  'use strict';
  const bound=new WeakSet();

  function runInline(code,el,event){
    // Execute the exact handler in the page context. This supports strings,
    // numbers, multiple statements and generated UUID arguments.
    try{
      const fn=new Function('event', code);
      return fn.call(el,event);
    }catch(err){
      console.error('[VYBINKA] button failed:',code,err);
      // Do not swallow the error silently.
      if(typeof window.toast==='function') window.toast('Не удалось выполнить действие');
    }
  }

  function bind(el){
    if(!el || bound.has(el)) return;
    const code=el.getAttribute('onclick');
    if(!code) return;
    bound.add(el);
    el.removeAttribute('onclick');
    el.type=el.type||'button';
    el.style.touchAction='manipulation';
    el.style.webkitTapHighlightColor='transparent';
    el.addEventListener('click',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      runInline(code,el,ev);
    },{passive:false});
  }

  function scan(root=document){
    if(root.nodeType===1 && root.matches?.('[onclick]')) bind(root);
    root.querySelectorAll?.('[onclick]').forEach(bind);
    root.querySelectorAll?.('button').forEach(b=>{
      if(!b.type)b.type='button';
      b.style.touchAction='manipulation';
      b.style.webkitTapHighlightColor='transparent';
    });
  }

  function start(){
    scan(document);
    new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
      if(n.nodeType===1) scan(n);
    }))).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();