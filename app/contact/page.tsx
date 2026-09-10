import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ContactForm } from '@/components/ContactForm';
import { CONTACT } from '@/lib/site';
import { breadcrumbSchema, organizationSchema, jsonLd } from '@/seo/jsonld';
import { PhoneIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'AI集客・AIO・LLMO・MEO・GBP運用代行についてのお問い合わせ・無料相談はこちら。株式会社Gratitudeが全国対応でサポートします。',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'お問い合わせ | AI集客ドットコム',
    description:
      'AI集客・MEO・GBP運用代行についての無料相談・お問い合わせはこちら。株式会社Gratitudeが全国対応でサポートします。',
    url: '/contact/',
    images: ['/ai-search-google-trend-.jpg'],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        id="ld-contact"
        {...jsonLd([
          organizationSchema(),
          breadcrumbSchema([
            { name: 'トップ', path: '/' },
            { name: 'お問い合わせ', path: '/contact/' },
          ]),
        ])}
      />

      <SiteHeader active="/contact/" />

      <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="ey ey-w">AI集客ドットコム</span>
          <h1>お問い合わせ</h1>
          <p>まずはお気軽にご相談ください。通常2営業日以内にご返信いたします。</p>
        </div>
      </div>

      <section className="sec-72">
        <div className="wrap">
          <div className="contact-grid">
            <div>
              <span className="ey ey-b">Contact</span>
              <h2 className="sec-h2">ご相談・お問い合わせ</h2>

              <div className="info-box">
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    📞
                  </div>
                  <div>
                    <h3>お電話</h3>
                    <a href={CONTACT.telHref} style={{ fontSize: 20, fontWeight: 800 }}>
                      {CONTACT.tel}
                    </a>
                    <p style={{ marginTop: 4, fontSize: 12 }}>{CONTACT.telHours}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    ✉️
                  </div>
                  <div>
                    <h3>メール</h3>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                    <p style={{ marginTop: 4, fontSize: 12 }}>通常2営業日以内にご返信</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    📍
                  </div>
                  <div>
                    <h3>所在地</h3>
                    <p>
                      {CONTACT.address.zip}
                      <br />
                      {CONTACT.address.line}
                    </p>
                  </div>
                </div>
              </div>

              <div className="trust-row">
                <div className="trust-chip">
                  <div className="icon" aria-hidden="true">
                    🌐
                  </div>
                  <p>
                    全国
                    <br />
                    対応
                  </p>
                </div>
                <div className="trust-chip">
                  <div className="icon" aria-hidden="true">
                    🔄
                  </div>
                  <p>
                    継続率
                    <br />
                    90%以上
                  </p>
                </div>
                <div className="trust-chip">
                  <div className="icon" aria-hidden="true">
                    🛡️
                  </div>
                  <p>
                    安心の
                    <br />
                    サポート
                  </p>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
              <div className="f-divider">
                <span>またはお電話でもどうぞ</span>
              </div>
              <a className="f-phone" href={CONTACT.telHref}>
                <PhoneIcon size={22} />
                {CONTACT.tel}
              </a>
            </div>
          </div>
        </div>
      </section>

      </main>

      <SiteFooter />
    </>
  );
}
