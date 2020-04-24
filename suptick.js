const puppeteer = require('puppeteer-extra');
const request = require('request-promise');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const devices = require('puppeteer/DeviceDescriptors');
const iPhonexr = devices['iPhone XR'];
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true,
		headless: false,
		devtools: true,		
		userDataDir: 'ticket_profile',
		args: [
				'--disable-features=site-per-process',
				'--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'				
		]
	});
	
	(await browser.pages())[0].close();
	
	const page = await browser.newPage();
	
	await page.emulate(iPhonexr);
	
    await page.setRequestInterception(true);

    page.on('request', async(req) => {
	switch(req.url()) {
			case 'https://d17ol771963kd3.cloudfront.net/assets/f.031a537.js':
				console.log('Load cached ticket');
				req.respond({
					status: 200,
					contentType: 'application/javascript; charset=utf-8',
					body: fs.readFileSync("ticket2.js", "utf8")
				});			
			break;
			default:
				if(req.resourceType() === 'stylesheet' || req.resourceType() === 'image' || req.url().includes('google') || req.url().includes('gstatic') || req.url().includes('mixpanel')){
					console.log(req.url()+" blocked");
					req.abort();
				} else { req.continue();}
			break;
		}
    });
	
 	await page.goto('https://www.supremenewyork.com/mobile/');
	await page.evaluate(() => {
		
		var interceptor = function() {
			CookieInterceptor.init();
			CookieInterceptor.read.use(function (cookie) {
				console.log(cookie);
				return cookie;
			});

			CookieInterceptor.write.use(function (val) {
				console.log(val);
				return val;
			});
		};	
		
		var script = document.createElement("script");
		script.src = "https://unpkg.com/cookie-interceptor@1.0.0/dist/cookie-interceptor.umd.js";
		script.onreadystatechange = interceptor;
		script.onload = interceptor;				
		document.head.appendChild(script);
	});
	//browser.close();
})();