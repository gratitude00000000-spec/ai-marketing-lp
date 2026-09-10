/* GA4 / GTM 共通イベント送信。タグ未設定でも安全に no-op。 */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type Params = Record<string, unknown>;

export function trackEvent(name: string, params?: Params) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') window.gtag('event', name, params ?? {});
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
}

export const trackLineClick = (location: string) =>
  trackEvent('line_click', { event_category: 'CTA', event_label: `LINE_${location}` });

export const trackPhoneClick = (location: string) =>
  trackEvent('phone_click', { event_category: 'CTA', event_label: `PHONE_${location}` });

export const trackCTAClick = (name: string, location: string) =>
  trackEvent('cta_click', { event_category: 'CTA', event_label: `${name}_${location}` });

export const trackFormSubmit = (formName: string) =>
  trackEvent('form_submit', { event_category: 'Form', event_label: formName });

export {};
