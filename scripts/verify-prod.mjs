async function run() {
  console.log('=== VERIFYING HOME: https://maternidadconadri.com/ ===');
  const homeRes = await fetch('https://maternidadconadri.com/?cb=' + Date.now());
  console.log('Status:', homeRes.status);
  console.log('CF Cache:', homeRes.headers.get('cf-cache-status'));
  console.log('CSP:', homeRes.headers.get('content-security-policy') ? 'Present' : 'None');
  const homeHtml = await homeRes.text();
  
  const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  let count = 0;
  while ((match = regex.exec(homeHtml)) !== null) {
    if (match[2].includes('Hablemos')) {
      count++;
      console.log(`  Button ${count} href: "${match[1]}" text: "${match[2].replace(/\s+/g, ' ').trim()}"`);
    }
  }

  console.log('\n=== VERIFYING LANDING: https://maternidadconadri.com/hablemos/ ===');
  const leadRes = await fetch('https://maternidadconadri.com/hablemos/');
  console.log('Status:', leadRes.status);
  console.log('CF Cache:', leadRes.headers.get('cf-cache-status'));
  console.log('CSP:', leadRes.headers.get('content-security-policy') ? 'Present' : 'None');
  const leadHtml = await leadRes.text();
  console.log('Title:', leadHtml.match(/<title>(.*?)<\/title>/i)?.[1]);
  console.log('Canonical:', leadHtml.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]);
  console.log('Has GTM script:', leadHtml.includes('GTM-N5RK6MLW'));
  console.log('Has GTM noscript:', leadHtml.includes('ns.html?id=GTM-N5RK6MLW'));
  console.log('Has GA4:', leadHtml.includes('G-0LG1K9B8FP'));
  console.log('Has HubSpot embed:', leadHtml.includes('https://js.hsforms.net/forms/embed/52036222.js'));
  console.log('Has hs-form-frame:', leadHtml.includes('class="hs-form-frame"'));
  console.log('Form ID:', leadHtml.includes('data-form-id="4ce2d475-ba60-4534-bda0-ad4deaaaea41"'));
  console.log('Portal ID:', leadHtml.includes('data-portal-id="52036222"'));
  console.log('Back button link:', leadHtml.match(/<a class="lead-back[^"]*" href="([^"]+)"/i)?.[1]);
}
run();