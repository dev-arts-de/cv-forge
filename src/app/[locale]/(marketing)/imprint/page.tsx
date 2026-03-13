import MarketingNav from '@/components/shared/MarketingNav'
import AppFooter from '@/components/shared/AppFooter'

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-syne font-bold text-3xl text-foreground mb-2">Impressum</h1>
        <p className="text-sm text-muted mb-10">Angaben gemäß § 5 TMG</p>

        <div className="space-y-8 text-sm">
          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Anbieter</h2>
            <p className="text-muted leading-relaxed">
              Shopitech<br />
              Inhaber: Arthur Schimpf<br />
              Hans-Thoma-Str. 4<br />
              76351 Linkenheim-Hochstetten<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Kontakt</h2>
            <p className="text-muted">
              E-Mail:{' '}
              <a href="mailto:Kontakt@Shopitech.de" className="text-foreground hover:underline">
                Kontakt@Shopitech.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Steuerliche Angaben</h2>
            <p className="text-muted leading-relaxed">
              Steuernummer: 34310/37667<br />
              Wirtschafts-Identifikationsnummer: 42 679 093 517
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Verantwortlich für den Inhalt</h2>
            <p className="text-muted leading-relaxed">
              Arthur Schimpf<br />
              Hans-Thoma-Str. 4<br />
              76351 Linkenheim-Hochstetten
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Haftungshinweis</h2>
            <p className="text-muted leading-relaxed">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
              externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
              verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">Online-Streitbeilegung</h2>
            <p className="text-muted leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit,
              die du unter{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>{' '}
              findest. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}
