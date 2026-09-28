const C="stihi-v4";
const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(req,r)=>{if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r};
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(r=>put("./",r)).catch(()=>caches.match("./")));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>put(req,r))));
});
