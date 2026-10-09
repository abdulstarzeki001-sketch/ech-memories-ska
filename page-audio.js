(()=>{
  const BASE='https://ech-nafasm-ska.pages.dev/pub/0524488da2bf9d4cb0d9fc5afa6618ca01574416cd04c3bf/media/';
  const page=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'')||'index';
  const map={
    index:'login_song.mp3',
    home:'home_song.mp3',
    journey:'song1.mp3',
    photos:'song2.mp3',
    writings:'song3.mp3',
    songs:'song4.mp3',
    videos:'song5.mp3'
  };
  const file=map[page];
  if(!file)return;

  const audio=new Audio(BASE+encodeURIComponent(file));
  audio.loop=true;
  audio.preload='auto';
  audio.volume=.16;
  audio.id='nafsam-page-audio';
  window.__nafsamPageAudio=audio;

  let wanted=true;
  const play=()=>{if(!wanted)return;audio.play().catch(()=>{})};
  const pause=()=>audio.pause();

  const tryAutoplay=()=>audio.play().catch(()=>{
    const resume=()=>{play();cleanup()};
    const cleanup=()=>{
      window.removeEventListener('pointerdown',resume,true);
      window.removeEventListener('touchstart',resume,true);
      window.removeEventListener('keydown',resume,true);
    };
    window.addEventListener('pointerdown',resume,{once:true,capture:true});
    window.addEventListener('touchstart',resume,{once:true,capture:true});
    window.addEventListener('keydown',resume,{once:true,capture:true});
  });

  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play()});
  window.addEventListener('nafsam:pause-page-audio',()=>{wanted=false;pause()});
  window.addEventListener('nafsam:resume-page-audio',()=>{wanted=true;play()});
  window.addEventListener('pagehide',pause);
  window.addEventListener('beforeunload',pause);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tryAutoplay,{once:true});
  else tryAutoplay();
})();