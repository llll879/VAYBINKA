// VYBINKA UI compatibility fixes
(function(){
  const bind=()=>{
    document.querySelectorAll('button').forEach(b=>{b.style.touchAction='manipulation';});
    document.querySelectorAll('input[type=file]').forEach(i=>{
      // Do not overwrite accept/capture: profile music and chat media need different types.
      i.style.pointerEvents='auto';
    });
  };
  new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind); else bind();
})();
window.addEventListener('error',e=>console.error('VYBINKA:',e.error||e.message));
