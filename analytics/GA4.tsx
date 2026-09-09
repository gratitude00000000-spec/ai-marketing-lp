import Script from 'next/script';

/**
 * GA4。NEXT_PUBLIC_GA4_ID が未設定なら何も出力しない。
 * ID はハードコードせず環境変数から読む（本番で確定後に設定）。
 */
export function GA4() {
  const id = process.env.NEXT_PUBLIC_GA4_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
