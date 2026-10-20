(() => {
function updateLinks(){const chinese=document.documentElement.lang==='zh-CN';document.querySelectorAll('[data-blog-link]').forEach(a=>{a.href=chinese?a.dataset.hrefZh:a.dataset.hrefEn;});const art=document.querySelector('.blog-art');if(art)art.setAttribute('aria-label',chinese?'阅读《生日快乐丨给自己的生日推送》':'Read Happy Birthday: A Birthday Post to Myself');}
document.getElementById('language')?.addEventListener('click',updateLinks);updateLinks();
})();
