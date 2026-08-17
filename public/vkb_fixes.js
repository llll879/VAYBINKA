/* VYBINKA UI fixes — reliable buttons/touch/media */
(function(){
  'use strict';

  function fix(){
    document.querySelectorAll('button').forEach(function(b){
      b.style.pointerEvents='auto';
      b.style.touchAction='manipulation';
      if(getComputedStyle(b).position==='static') b.style.position='relative';
      b.style.zIndex='2';
    });
    document.querySelectorAll('input[type=file]').forEach(function(i){
      i.setAttribute('accept','image/*,video/*');
    });
  }

  function toastError(e){
    console.error('VYBINKA action error:',e);
    try{
      if(typeof toast==='function'){
        const m=e && e.message ? e.message : String(e||'Ошибка');
        toast(m==='network_error'?'Сервер недоступен':'Не удалось выполнить действие');
      }
    }catch(_){}
  }

  window.addEventListener('error',function(e){
    if(e.target && e.target.tagName==='IMG') return;
    console.error('VYBINKA:',e.error||e.message);
  },true);

  window.addEventListener('unhandledrejection',function(e){
    console.error('VYBINKA promise:',e.reason);
    toastError(e.reason);
    e.preventDefault();
  });

  new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix);
  else fix();
})();
