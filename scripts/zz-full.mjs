import { chromium } from "playwright";
const tag = process.argv[2];
const b = await chromium.launch();
for (const [w,h,t] of [[1440,900,"d"],[390,844,"m"]]) {
const p = await b.newPage({ viewport:{width:w,height:h} });
await p.goto("http://127.0.0.1:4400/ahmed.dev/",{waitUntil:"load"}); await p.waitForTimeout(5000);
let H = await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H;y+=400){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(150); H = await p.evaluate(()=>document.body.scrollHeight);}
await p.waitForTimeout(2500);
const secs = await p.evaluate(()=>[...document.querySelectorAll("#main-content section[id]")].map(s=>[s.id, Math.round(s.getBoundingClientRect().height)]));
console.log(t, "H", await p.evaluate(()=>document.body.scrollHeight), JSON.stringify(secs));
for (const id of ["experience","services","faq","contact"]) { await p.evaluate(i=>document.getElementById(i).scrollIntoView(),id); await p.waitForTimeout(2200); await p.screenshot({path:`/tmp/${tag}_${t}_${id}.png`}); }
}
await b.close();
