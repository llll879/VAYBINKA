// VYBINKA fixes v2
window.addEventListener('error',e=>console.error('VYBINKA:',e.error||e.message));
(function(){
 const wait=()=>{ if(!document.body)return;
  // Make hidden media inputs use phone gallery/camera picker
  document.querySelectorAll('input[type=file]').forEach(i=>{
    i.setAttribute('accept','image/*,video/*');
    i.setAttribute('capture','environment');
  });
  // Long press message menu
  document.querySelectorAll('.bubble').forEach(el=>{
    if(el.dataset.vybBound)return; el.dataset.vybBound='1';
    let timer;
    el.addEventListener('pointerdown',()=>{timer=setTimeout(()=>{
      if(typeof openMessageMenu==='function') openMessageMenu(el); else el.click();
    },600)});
    el.addEventListener('pointerup',()=>clearTimeout(timer));
    el.addEventListener('pointerleave',()=>clearTimeout(timer));
  });
 };
 new MutationObserver(wait).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('DOMContentLoaded',wait);
})();

window.openMessageMenu=function(el){
 const id=(el.getAttribute('data-id')||'');
 if(typeof openModal==='function') openModal('<div class="sheet-head"><h2>Сообщение</h2></div><button class="btn wide" onclick="closeModal()">Закрыть</button>');
};
