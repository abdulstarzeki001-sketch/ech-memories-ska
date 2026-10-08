(() => {
  const translations = {
    ar:{
      "app.private":"نفسم // نظام الذكريات الخاص",
      "nav.home":"الرئيسية","nav.photos":"الصور","nav.journey":"الرحلة","nav.songs":"الأغاني","nav.videos":"الفيديوهات","nav.writings":"الكتابات","nav.feelings":"المشاعر","nav.chat":"المحادثة",
      "home.dashboard":"لوحة التحكم","home.archive":"الأرشيف","home.nodes":"العُقد",
      "card.photos.sub":"لقطات عالية الدقة","card.journey.sub":"الحكاية التي لا تنتهي","card.songs.sub":"آثار صوتية وصدى","card.videos.sub":"أرشيف الذكريات المتحركة","card.writings.sub":"يوميات وسجلات محفوظة","card.feelings.sub":"بيانات المشاعر المحفوظة",
      "photos.archives":"الأرشيف","photos.gallery":"المعرض","photos.timeline":"الخط الزمني","photos.vault":"الخزنة",
      "journey.archive":"الأرشيف","journey.legacy":"الإرث","journey.sequence":"التسلسل الثالث: مجرى الزمن","journey.immortal":"الرحلة الخالدة","journey.genesis":"ولادة السكون","journey.meta":"عرض التفاصيل","journey.thought":"تشفير الفكرة","journey.access":"دخول الخزنة","journey.convergence":"التقارب الأثيري","journey.wave":"تحليل الموجات",
      "songs.chamber":"غرفة الصدى","songs.desc":"ترددات مؤرشفة. تسجيلات صوتية وشذرات موسيقية محفوظة في الفراغ.","songs.echoes":"أصداء الفراغ","songs.archive":"الأرشيف / الأغاني","songs.loading":"جارِ تحميل الأغاني…","songs.more":"تحميل المزيد من الأغاني","songs.play":"تشغيل داخل الصفحة","songs.youtube":"رابط يوتيوب",
      "videos.cinematic":"أرشيف الفيديوهات","videos.theater":"وضع العرض","videos.echoes":"أصداء البوسفور","videos.vault":"تسلسل الخزنة ألفا","videos.desert":"حكايات الصحراء","videos.archive":"نفسم / أرشيف الفيديو","videos.desc":"لحظات من الضوء والحركة. أرشيف مرئي لذكرياتنا محفوظ على شكل فيديوهات.","videos.present":"الحاضر","videos.loading":"جارِ تحميل الفيديوهات…","videos.more":"تحميل المزيد من الفيديوهات","videos.error":"تعذر تحميل أرشيف الفيديوهات.","videos.open":"فتح الفيديو",
      "writings.thought":"أرشيف الأفكار","writings.new":"إدخال جديد","writings.atrium":"الردهة الرقمية","writings.anomaly":"شذوذات معمارية","writings.protocol":"البروتوكول الأخير",
      "archive.title":"أرشيف نفسم","archive.original":"ذكرياتنا الأصلية","archive.more":"تحميل المزيد من الذكريات","archive.play":"تشغيل","archive.youtube":"فتح على يوتيوب",
      "login.brand":"نفسم",
      "login.lead":"مر زمن منذ أن بدأ حبك ينزف من قلبي، وأنا أتعلم كيف يعيش الإنسان بقلبٍ مكسورٍ لا يتوقف عن الخفقان.",
      "login.since":"مرّ على البداية","login.day":"يوم","login.hour":"ساعة","login.minute":"دقيقة","login.second":"ثانية","login.name":"اختر الاسم","login.open":"افتح ما تبقّى",
      "login.bottom":"أقسى ما في الأمر أن حبك لم يغادرني، بل خرج من قلبي وهو يمزق كل شيءٍ كان جميلًا بداخلي","login.error":"اكتب الاسم أولًا.",
      "lang.label":"اللغة","view.two":"عرض اثنين في الصف"
    },
    fa:{
      "app.private":"نَفَسَم // سامانهٔ خصوصی خاطرات",
      "nav.home":"خانه","nav.photos":"عکس‌ها","nav.journey":"سفر","nav.songs":"آهنگ‌ها","nav.videos":"ویدیوها","nav.writings":"نوشته‌ها","nav.feelings":"احساسات","nav.chat":"گفت‌وگو",
      "home.dashboard":"داشبورد","home.archive":"آرشیو","home.nodes":"گره‌ها",
      "card.photos.sub":"تصاویر با کیفیت بالا","card.journey.sub":"روایت بی‌پایان","card.songs.sub":"ردهای صوتی و پژواک‌ها","card.videos.sub":"آرشیو خاطرات متحرک","card.writings.sub":"دفترها و یادداشت‌های رمزگذاری‌شده","card.feelings.sub":"داده‌های ذخیره‌شدهٔ احساسات",
      "photos.archives":"آرشیوها","photos.gallery":"گالری","photos.timeline":"خط زمانی","photos.vault":"خزانه",
      "journey.archive":"آرشیو","journey.legacy":"میراث","journey.sequence":"توالی سوم: جریان زمان","journey.immortal":"سفر جاودانه","journey.genesis":"زایش سکوت","journey.meta":"نمایش جزئیات","journey.thought":"رمزگذاری اندیشه","journey.access":"ورود به خزانه","journey.convergence":"همگرایی اثیری","journey.wave":"تحلیل موج‌ها",
      "songs.chamber":"تالار طنین","songs.desc":"فرکانس‌های بایگانی‌شده؛ ثبت‌های صوتی و تکه‌های موسیقی که در خلأ حفظ شده‌اند.","songs.echoes":"پژواک‌های خلأ","songs.archive":"آرشیو / آهنگ‌ها","songs.loading":"در حال بارگذاری آهنگ‌ها…","songs.more":"آهنگ‌های بیشتری بارگذاری کن","songs.play":"پخش در همین صفحه","songs.youtube":"لینک یوتیوب",
      "videos.cinematic":"آرشیو ویدیوها","videos.theater":"حالت نمایش","videos.echoes":"پژواک‌های بسفر","videos.vault":"توالی آلفای خزانه","videos.desert":"روایت‌های صحرا","videos.archive":"نَفَسَم / آرشیو ویدیو","videos.desc":"لحظه‌هایی از نور و حرکت؛ آرشیوی تصویری از خاطرات ما که به شکل ویدیو حفظ شده‌اند.","videos.present":"اکنون","videos.loading":"در حال بارگذاری ویدیوها…","videos.more":"ویدیوهای بیشتری بارگذاری کن","videos.error":"بارگذاری آرشیو ویدیوها ممکن نشد.","videos.open":"باز کردن ویدیو",
      "writings.thought":"آرشیو اندیشه","writings.new":"یادداشت تازه","writings.atrium":"آتریوم دیجیتال","writings.anomaly":"ناهنجاری‌های معماری","writings.protocol":"پروتکل نهایی",
      "archive.title":"آرشیو نَفَسَم","archive.original":"خاطرات واقعی ما","archive.more":"خاطرات بیشتری بارگذاری کن","archive.play":"پخش","archive.youtube":"باز کردن در یوتیوب",
      "login.brand":"نفسم","login.lead":"مدتی‌ست که عشق تو از قلبم خون می‌چکاند و من یاد می‌گیرم انسان چگونه با قلبی شکسته که هنوز می‌تپد زندگی می‌کند.","login.since":"از آغاز گذشته","login.day":"روز","login.hour":"ساعت","login.minute":"دقیقه","login.second":"ثانیه","login.name":"نام را انتخاب کن","login.open":"آنچه مانده را باز کن","login.bottom":"سخت‌ترین بخش این است که عشقت مرا ترک نکرد؛ از قلبم بیرون آمد و هر چیز زیبایی را درونم پاره کرد.","login.error":"ابتدا نام را وارد کن.","lang.label":"زبان","view.two":"نمایش دوتایی در هر ردیف"
    },
    tr:{
      "app.private":"NAFSAM // ÖZEL HATIRA SİSTEMİ",
      "nav.home":"Ana Sayfa","nav.photos":"Fotoğraflar","nav.journey":"Yolculuk","nav.songs":"Şarkılar","nav.videos":"Videolar","nav.writings":"Yazılar","nav.feelings":"Hisler","nav.chat":"Sohbet",
      "home.dashboard":"Pano","home.archive":"Arşiv","home.nodes":"Düğümler",
      "card.photos.sub":"Yüksek Çözünürlüklü Kareler","card.journey.sub":"Sonsuz Anlatı","card.songs.sub":"Ses İzleri ve Yankılar","card.videos.sub":"Hareketli Hatıra Arşivi","card.writings.sub":"Kodlanmış Günlükler ve Kayıtlar","card.feelings.sub":"Saklanan Duygu Verileri",
      "photos.archives":"Arşivler","photos.gallery":"Galeri","photos.timeline":"Zaman Çizgisi","photos.vault":"Kasa",
      "journey.archive":"Arşiv","journey.legacy":"Miras","journey.sequence":"Dizi III: Zaman Akışı","journey.immortal":"Ölümsüz Yolculuk","journey.genesis":"Sessizliğin Doğuşu","journey.meta":"Bilgileri Gör","journey.thought":"Düşüncenin Şifrelenmesi","journey.access":"Kasaya Gir","journey.convergence":"Eterik Yakınsama","journey.wave":"Dalgaları Analiz Et",
      "songs.chamber":"Rezonans Odası","songs.desc":"Arşivlenmiş frekanslar. Boşlukta korunan ses kayıtları ve müzik parçaları.","songs.echoes":"Boşluğun Yankıları","songs.archive":"Arşiv / Şarkılar","songs.loading":"Şarkılar yükleniyor…","songs.more":"Daha fazla şarkı yükle","songs.play":"Sayfada oynat","songs.youtube":"YouTube bağlantısı",
      "videos.cinematic":"Video Arşivi","videos.theater":"Gösterim Modu","videos.echoes":"Boğazın Yankıları","videos.vault":"Kasa Dizisi Alfa","videos.desert":"Çöl Günlükleri","videos.archive":"NAFSAM / VİDEO ARŞİVİ","videos.desc":"Işık ve hareketten anlar. Anılarımızın video olarak saklandığı görsel arşiv.","videos.present":"Şimdi","videos.loading":"Videolar yükleniyor…","videos.more":"Daha fazla video yükle","videos.error":"Video arşivi yüklenemedi.","videos.open":"Videoyu aç",
      "writings.thought":"Düşünce Arşivi","writings.new":"Yeni Kayıt","writings.atrium":"Dijital Atrium","writings.anomaly":"Mimari Anomaliler","writings.protocol":"Son Protokol",
      "archive.title":"NAFSAM ARŞİVİ","archive.original":"Gerçek Anılarımız","archive.more":"Daha fazla anı yükle","archive.play":"Oynat","archive.youtube":"YouTube'da Aç",
      "login.brand":"Nafsam","login.lead":"Aşkının kalbimden kanamaya başlamasının üzerinden zaman geçti; ben de insanın atmayı bırakmayan kırık bir kalple nasıl yaşadığını öğreniyorum.","login.since":"Başlangıçtan beri","login.day":"Gün","login.hour":"Saat","login.minute":"Dakika","login.second":"Saniye","login.name":"İsmini seç","login.open":"Geriye kalanı aç","login.bottom":"En acısı, aşkın beni terk etmedi; kalbimden çıkarken içimde güzel olan her şeyi parçaladı.","login.error":"Önce ismini yaz.","lang.label":"Dil","view.two":"Satırda iki tane göster"
    },
    en:{
      "app.private":"NAFSAM // PRIVATE MEMORY SYSTEM",
      "nav.home":"Home","nav.photos":"Photos","nav.journey":"Journey","nav.songs":"Songs","nav.videos":"Videos","nav.writings":"Writings","nav.feelings":"Feelings","nav.chat":"Chat",
      "home.dashboard":"Dashboard","home.archive":"Archive","home.nodes":"Nodes",
      "card.photos.sub":"High-Fidelity Captures","card.journey.sub":"The Eternal Narrative","card.songs.sub":"Sonic Imprints & Echoes","card.videos.sub":"Living Motion Archives","card.writings.sub":"Coded Journals & Logs","card.feelings.sub":"Biometric Sentiment Data",
      "photos.archives":"Archives","photos.gallery":"Gallery","photos.timeline":"Timeline","photos.vault":"Vault",
      "journey.archive":"Archive","journey.legacy":"Legacy","journey.sequence":"Sequence III: Temporal Stream","journey.immortal":"The Immortal Journey","journey.genesis":"The Genesis of Stillness","journey.meta":"View Metadata","journey.thought":"The Encryption of Thought","journey.access":"Access Vault","journey.convergence":"Ethereal Convergence","journey.wave":"Analyze Waveforms",
      "songs.chamber":"Resonance Chamber","songs.desc":"Archived frequencies. Audio logs and musical fragments preserved in the void.","songs.echoes":"Echoes of the Void","songs.archive":"Archive / Songs","songs.loading":"Loading songs…","songs.more":"Load more songs","songs.play":"Play on this page","songs.youtube":"YouTube link",
      "videos.cinematic":"Video Archive","videos.theater":"Theater Mode","videos.echoes":"Echoes of the Bosphorus","videos.vault":"Vault Sequence Alpha","videos.desert":"Desert Chronicles","videos.archive":"NAFSAM / VIDEO ARCHIVE","videos.desc":"Moments of light and motion. A visual archive of our memories preserved as videos.","videos.present":"Present","videos.loading":"Loading videos…","videos.more":"Load more videos","videos.error":"The video archive could not be loaded.","videos.open":"Open video",
      "writings.thought":"Archives of Thought","writings.new":"New Entry","writings.atrium":"The Digital Atrium","writings.anomaly":"Architectural Anomalies","writings.protocol":"The Final Protocol",
      "archive.title":"NAFSAM ARCHIVE","archive.original":"Our Original Memories","archive.more":"Load more memories","archive.play":"Play","archive.youtube":"Open on YouTube",
      "login.brand":"Nafsam","login.lead":"Time has passed since your love began bleeding from my heart, and I am learning how a person lives with a broken heart that never stops beating.","login.since":"Since the beginning","login.day":"Day","login.hour":"Hour","login.minute":"Minute","login.second":"Second","login.name":"Choose your name","login.open":"Open what remains","login.bottom":"The hardest part is that your love never left me; it came out of my heart tearing apart everything beautiful inside me.","login.error":"Enter your name first.","lang.label":"Language","view.two":"Show 2 per row"
    }
  };

  const sourceToKey = new Map([
    ["NAFSAM // PRIVATE MEMORY SYSTEM","app.private"],["2 per row","view.two"],["Show 2 per row","view.two"],["Nafsam","login.brand"],["NAFSAM","login.brand"],
    ["Home","nav.home"],["Photos","nav.photos"],["Journey","nav.journey"],["Songs","nav.songs"],["Videos","nav.videos"],["Writings","nav.writings"],["Feelings","nav.feelings"],["Chat","nav.chat"],
    ["DASHBOARD","home.dashboard"],["ARCHIVE","home.archive"],["NODES","home.nodes"],
    ["4.2k High-Fidelity Captures","card.photos.sub"],["The Eternal Narrative","card.journey.sub"],["Sonic Imprints & Echoes","card.songs.sub"],["Living Motion Archives","card.videos.sub"],["Coded Journals & Logs","card.writings.sub"],["Biometric Sentiment Data","card.feelings.sub"],
    ["Archives","photos.archives"],["Gallery","photos.gallery"],["Timeline","photos.timeline"],["Vault","photos.vault"],
    ["Archive","journey.archive"],["Legacy","journey.legacy"],["Sequence III : Temporal Stream","journey.sequence"],["Sequence III: Temporal Stream","journey.sequence"],["The Immortal Journey","journey.immortal"],["The Genesis of Stillness","journey.genesis"],["View Metadata","journey.meta"],["The Encryption of Thought","journey.thought"],["Access Vault","journey.access"],["Ethereal Convergence","journey.convergence"],["Analyze Waveforms","journey.wave"],
    ["Resonance Chamber","songs.chamber"],["Archived frequencies. Audio logs and musical fragments preserved in the void.","songs.desc"],["Echoes of the Void","songs.echoes"],["/// Archive / Songs","songs.archive"],["Archive / Songs","songs.archive"],["Loading songs…","songs.loading"],["Load more songs","songs.more"],
    ["Cinematic Archives","videos.cinematic"],["Video Archive","videos.cinematic"],["Theater Mode","videos.theater"],["Echoes of the Bosphorus","videos.echoes"],["Vault Sequence Alpha","videos.vault"],["Desert Chronicles","videos.desert"],["NAFSAM / VIDEO ARCHIVE","videos.archive"],["Chronicles of light and motion. A curated temporal gallery of visual memories spanning the archive.","videos.desc"],["Moments of light and motion. A visual archive of our memories preserved as videos.","videos.desc"],["PRESENT","videos.present"],["Loading videos…","videos.loading"],["Load more videos","videos.more"],["The video archive could not be loaded.","videos.error"],
    ["Archives of Thought","writings.thought"],["New Entry","writings.new"],["The Digital Atrium","writings.atrium"],["Architectural Anomalies","writings.anomaly"],["The Final Protocol","writings.protocol"],
    ["NAFSAM ARCHIVE","archive.title"],["Original memories","archive.original"],["Our real memories","archive.original"],["Load more memories","archive.more"],["▶ Play","archive.play"],["▶ Open on YouTube","archive.youtube"],
    ["نفسم","login.brand"],["مرّ على البداية","login.since"],["يوم","login.day"],["ساعة","login.hour"],["دقيقة","login.minute"],["ثانية","login.second"],["افتح ما تبقّى","login.open"],["اكتب الاسم أولًا.","login.error"]
  ]);

  const langs=["ar","fa","tr","en"];
  function getLang(){try{const l=localStorage.getItem("nafsam_language");if(langs.includes(l))return l}catch(e){}return "ar"}
  let current=getLang();
  const t=k=>translations[current]?.[k]??translations.en[k]??k;

  function translateTextNode(node){
    const raw=node.nodeValue,trim=raw.trim(); if(!trim)return;
    const key=sourceToKey.get(trim); if(!key)return;
    const lead=raw.match(/^\s*/)?.[0]||"",tail=raw.match(/\s*$/)?.[0]||"";
    node.nodeValue=lead+t(key)+tail;
  }
  function translateDataAttrs(root=document){
    const scope=root?.querySelectorAll?root:document;
    if(root?.nodeType===1 && root.hasAttribute?.("data-i18n")){
      const k=root.getAttribute("data-i18n"); if(k) root.textContent=t(k);
    }
    scope.querySelectorAll?.("[data-i18n]").forEach(el=>{const k=el.getAttribute("data-i18n");if(k)el.textContent=t(k)});
  }
  function walk(root=document.body){
    if(!root)return;
    translateDataAttrs(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      if(n.parentElement?.closest("script,style,textarea"))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(translateTextNode);
  }
  function special(){
    document.documentElement.lang=current;
    document.documentElement.dir=(current==="ar"||current==="fa")?"rtl":"ltr";
    const brand=document.querySelector(".brand");if(brand)brand.textContent=t("login.brand");
    const lead=document.querySelector(".lead");if(lead)lead.textContent=t("login.lead");
    const ct=document.querySelector(".counter-title");if(ct)ct.textContent=t("login.since");
    const units=document.querySelectorAll(".unit span");if(units.length===4){
      const keys=["login.second","login.minute","login.hour","login.day"];units.forEach((e,i)=>e.textContent=t(keys[i]));
    }
    const name=document.querySelector("#visitorName");if(name)name.placeholder=t("login.name");
    const enter=document.querySelector("#enterBtn");if(enter&&!enter.disabled)enter.textContent=t("login.open");
    const bottom=document.querySelector(".bottom");if(bottom){
      const mark=bottom.querySelector(".bottom-mark");bottom.childNodes.forEach(n=>{if(n.nodeType===3&&n.nodeValue.trim())n.nodeValue=" "+t("login.bottom")+" "}); if(mark&&!bottom.contains(mark))bottom.prepend(mark);
    }
    const err=document.querySelector("#errorBox");if(err)err.textContent=t("login.error");
    document.querySelectorAll(".legacy-loading").forEach(e=>{});
  }
  function switcher(){
    if(document.getElementById("nafsam-lang-menu"))return;

    const menu=document.createElement("div");
    menu.id="nafsam-lang-menu";
    menu.innerHTML=
      '<button data-l="ar"><b>AR</b><span>العربية</span></button>'+
      '<button data-l="fa"><b>FA</b><span>فارسی</span></button>'+
      '<button data-l="tr"><b>TR</b><span>Türkçe</span></button>'+
      '<button data-l="en"><b>EN</b><span>English</span></button>';

    Object.assign(menu.style,{
      position:"fixed",
      zIndex:"10060",
      minWidth:"160px",
      padding:"7px",
      display:"none",
      border:"1px solid rgba(231,187,119,.24)",
      borderRadius:"16px",
      background:"rgba(7,10,16,.97)",
      backdropFilter:"blur(20px)",
      boxShadow:"0 16px 42px rgba(0,0,0,.48)"
    });

    menu.querySelectorAll("button").forEach(b=>{
      Object.assign(b.style,{
        width:"100%",
        border:"0",
        borderRadius:"11px",
        padding:"10px 11px",
        background:"transparent",
        color:"#d7e0e5",
        display:"flex",
        alignItems:"center",
        gap:"10px",
        font:"500 12px Geist,system-ui",
        cursor:"pointer",
        textAlign:"left"
      });
      b.querySelector("b").style.cssText="color:#e7bb77;min-width:25px;font-size:10px";
      b.onclick=(e)=>{e.stopPropagation();setLang(b.dataset.l)};
      b.onmouseenter=()=>b.style.background="rgba(231,187,119,.10)";
      b.onmouseleave=()=>{if(b.dataset.l!==current)b.style.background="transparent"};
    });

    document.body.append(menu);
    highlight();

    const languageIcons=[...document.querySelectorAll(".material-symbols-outlined")]
      .filter(el=>el.textContent.trim()==="language");

    languageIcons.forEach(icon=>{
      icon.style.cursor="pointer";
      icon.setAttribute("role","button");
      icon.setAttribute("tabindex","0");
      icon.setAttribute("aria-label",t("lang.label"));
      icon.addEventListener("click",(e)=>{
        e.preventDefault();e.stopPropagation();
        const rect=icon.getBoundingClientRect();
        const menuW=160;
        let left=rect.left + rect.width/2 - menuW/2;
        left=Math.max(10,Math.min(left,window.innerWidth-menuW-10));
        let top=rect.bottom+10;
        if(top+190>window.innerHeight) top=Math.max(10,rect.top-190);
        menu.style.left=left+"px";
        menu.style.top=top+"px";
        menu.style.display=menu.style.display==="block"?"none":"block";
      });
      icon.addEventListener("keydown",(e)=>{
        if(e.key==="Enter"||e.key===" "){e.preventDefault();icon.click()}
      });
    });

    document.addEventListener("click",()=>{menu.style.display="none"});
    window.addEventListener("resize",()=>{menu.style.display="none"});
    window.addEventListener("scroll",()=>{menu.style.display="none"},{passive:true});
  }

  function highlight(){
    document.querySelectorAll("#nafsam-lang-menu button").forEach(b=>{
      const active=b.dataset.l===current;
      b.style.background=active?"rgba(231,187,119,.14)":"transparent";
      b.style.color=active?"#fff4df":"#d7e0e5";
    });
  }
  function setLang(lang){
    if(!langs.includes(lang))return;current=lang;try{localStorage.setItem("nafsam_language",lang)}catch(e){}
    location.reload();
  }
  function translate(){
    const old=document.getElementById('nafsam-lang');if(old)old.remove();
    special();walk();switcher();
    document.title=document.title.replace(/^Nafsam/i,current==="ar"?"نفسم":current==="fa"?"نفسم":"NAFSAM");
  }
  document.addEventListener("DOMContentLoaded",()=>{
    translate();
    const observer=new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){walk(n);special()}else if(n.nodeType===3)translateTextNode(n);
    });
    observer.observe(document.body,{childList:true,subtree:true});
  });
})();