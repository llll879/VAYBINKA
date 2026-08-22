(function(){
  'use strict';
  window.addEventListener('error', function(e){ console.error('[VYBINKA runtime]', e.error || e.message); });
  window.addEventListener('unhandledrejection', function(e){ console.error('[VYBINKA promise]', e.reason); });
})();
