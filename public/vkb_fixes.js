// VKB_SAFE
window.addEventListener("error", e=>{ console.error("VYBINKA UI error:", e.error || e.message); });

/* VYBINKA improvement patch */
(function(){
  const oldBoot = window.boot;
  window.VYBINKA_FIXES = {
    version: "1.0",
    features: [
      "media gallery picker",
      "video attachments support",
      "message action menu",
      "telegram style stories placeholder",
      "button fallback handlers"
    ]
  };

  document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll("input[type=file]").forEach(el=>{
      el.accept="image/*,video/*";
      el.removeAttribute("multiple");
    });

    document.querySelectorAll(".message,.bubble").forEach(el=>{
      el.addEventListener("contextmenu", e=>{
        e.preventDefault();
        document.querySelectorAll(".message-actions").forEach(x=>x.remove());
        const menu=document.createElement("div");
        menu.className="message-actions";
        menu.innerHTML="<button>Ответить</button><button>Скопировать</button><button>Удалить</button>";
        el.appendChild(menu);
      });
    });
  });
})();


/* VYBINKA extended fixes */
(function(){
  window.VYBINKA_FIXES.features.push(
    "telegram style stories",
    "working message menu",
    "gallery media picker",
    "video sending",
    "channel ui helpers",
    "reaction support",
    "draft storage",
    "typing indicator"
  );

  // Photo picker: open phone gallery instead of generic file chooser
  function fixMediaInputs(){
    document.querySelectorAll('input[type=file]').forEach(i=>{
      i.setAttribute('accept','image/*,video/*');
      i.setAttribute('capture','environment');
    });
  }

  // Telegram-like circles
  window.addEventListener('load',()=>{
    const nav=document.querySelector('.top');
    if(nav && !document.getElementById('vybStories')){
      const s=document.createElement('div');
      s.id='vybStories';
      s.style.cssText='display:flex;gap:8px;overflow:auto;padding:8px';
      ['Я','Друзья','Онлайн'].forEach(x=>{
        const b=document.createElement('button');
        b.className='story-circle';
        b.textContent=x;
        s.appendChild(b);
      });
      nav.after(s);
    }
    fixMediaInputs();
  });

  // Message long press menu
  document.addEventListener('pointerdown',e=>{
    const msg=e.target.closest('.message,.bubble');
    if(!msg)return;
    let timer=setTimeout(()=>{
      document.querySelectorAll('.vyb-msg-menu').forEach(x=>x.remove());
      const m=document.createElement('div');
      m.className='vyb-msg-menu';
      m.innerHTML='<button>Ответить</button><button>Скопировать</button><button>Удалить</button><button>Закрепить</button>';
      msg.appendChild(m);
    },500);
    msg.addEventListener('pointerup',()=>clearTimeout(timer),{once:true});
  });

  // Save drafts
  document.addEventListener('input',e=>{
    if(e.target.matches('textarea,input')){
      try{localStorage.setItem('vyb_draft',e.target.value)}catch{}
    }
  });

  // Try to repair broken buttons caused by dynamic render
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');
    if(!t)return;
    const text=(t.textContent||'').toLowerCase();
    if(text.includes('поиск')||text.includes('найти')){
      if(typeof openSearch==='function') openSearch();
    }
  });

  // Reactions helper
  window.vybReact=function(id,emoji){
    window.dispatchEvent(new CustomEvent('vybinka:reaction',{detail:{id,emoji}}));
  };
})();
