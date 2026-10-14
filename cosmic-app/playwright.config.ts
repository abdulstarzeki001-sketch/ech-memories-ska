import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 timeout:30000,
 fullyParallel:true,
 reporter:[['list']],
 use:{baseURL:'http://127.0.0.1:4173',channel:'chrome',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'iphone-se-320',use:{...devices['iPhone SE'],viewport:{width:320,height:690},browserName:'chromium'}},
  {name:'iphone-390',use:{...devices['iPhone 13'],viewport:{width:390,height:844},browserName:'chromium'}},
  {name:'ipad-768',use:{...devices['iPad (gen 7)'],viewport:{width:768,height:1024},browserName:'chromium'}},
  {name:'desktop-1440',use:{viewport:{width:1440,height:900},browserName:'chromium'}}
 ],
 webServer:{command:'npx vite preview --config cosmic-app/vite.config.ts --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:90000}
});
