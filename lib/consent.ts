/**
 * Google Tag Manager with Google Consent Mode v2 ("basic" mode):
 * consent defaults to denied, and gtm.js is only loaded after the visitor accepts.
 * Required in the EU (ePrivacy/GDPR) because GTM typically loads tags that set cookies.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-M62NGDQV';
export const CONSENT_KEY = 'ph-consent';
export const CONSENT_OPEN_EVENT = 'ph:open-consent';

/** Inline bootstrap: runs before hydration, restores a stored "granted" choice and loads GTM only then. */
export const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
  wait_for_update: 500
});
window.__phLoadGtm = function () {
  if (window.__phGtmLoaded) return;
  window.__phGtmLoaded = true;
  gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
  gtag('js', new Date());
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';
  document.head.appendChild(s);
};
try { if (localStorage.getItem('${CONSENT_KEY}') === 'granted') window.__phLoadGtm(); } catch (e) {}
`;
