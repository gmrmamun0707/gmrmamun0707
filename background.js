chrome.webNavigation.onCompleted.addListener((details) => {
    const url = new URL(details.url);

    // Optional: skip homepage if needed
    if (url.pathname !== '/') {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: injectTestSiteKey
        });
    }
});

function injectTestSiteKey() {
    const testSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    const recaptchas = document.querySelectorAll('.g-recaptcha');

    recaptchas.forEach((el, i) => {
        // Check if reCAPTCHA is already rendered
        if (el.getAttribute('data-sitekey') !== testSiteKey) {
            console.log(`[Test] Replacing sitekey on reCAPTCHA element ${i}`);

            // Remove previously rendered element and recreate it
            const newEl = el.cloneNode(false); // shallow clone
            newEl.setAttribute('data-sitekey', testSiteKey);
            el.parentNode.replaceChild(newEl, el);

            // Try to render if API is available
            if (window.grecaptcha && grecaptcha.render) {
                grecaptcha.render(newEl, {
                    sitekey: testSiteKey,
                    callback: () => console.log(`[Test] Captcha ${i + 1} rendered`)
                });
            } else {
                console.warn('grecaptcha not loaded yet');
            }
        } else {
            console.log(`[Info] reCAPTCHA element ${i} already has test sitekey`);
        }
    });
}
