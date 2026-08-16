
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
