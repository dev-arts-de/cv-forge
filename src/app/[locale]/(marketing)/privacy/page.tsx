import MarketingNav from '@/components/shared/MarketingNav'
import AppFooter from '@/components/shared/AppFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-syne font-bold text-3xl text-foreground mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-muted mb-10">Stand: März 2026</p>

        <div className="space-y-8 text-sm">

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">1. Verantwortlicher</h2>
            <p className="text-muted leading-relaxed">
              Verantwortlicher im Sinne der DSGVO ist:<br /><br />
              Shopitech, Inhaber Arthur Schimpf<br />
              Hans-Thoma-Str. 4<br />
              76351 Linkenheim-Hochstetten<br />
              Deutschland<br />
              E-Mail:{' '}
              <a href="mailto:Kontakt@Shopitech.de" className="text-foreground hover:underline">
                Kontakt@Shopitech.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">2. Erhobene Daten und Zwecke</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <div>
                <p className="font-medium text-foreground mb-1">Registrierung und Account</p>
                <p>
                  Bei der Registrierung erheben wir deinen Namen und deine E-Mail-Adresse. Diese Daten
                  werden zur Bereitstellung des Nutzerkontos und zur Kommunikation mit dir verwendet.
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Lebenslauf-Analyse (Talentblick)</p>
                <p>
                  Für die KI-gestützte Analyse überträgst du Lebenslauf-Inhalte (PDF oder Text) sowie
                  optional eine Stellenausschreibung. Diese Daten werden zur Verarbeitung an die
                  Anthropic API (Anthropic PBC, USA) weitergeleitet und dort für die Dauer der
                  Anfrage verarbeitet. Wir speichern den Inhalt deines Lebenslaufs nicht dauerhaft auf
                  unseren Servern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Anschreiben-Generierung (Anschreibomat)</p>
                <p>
                  Zur Erstellung eines personalisierten Anschreibens werden Informationen aus deiner
                  Analyse sowie die Stellenausschreibung an die Anthropic API übertragen. Auch hier
                  erfolgt keine dauerhafte Speicherung deiner Bewerbungsunterlagen durch uns.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Zahlungsdaten</p>
                <p>
                  Zahlungsdaten (Kreditkartendaten) werden ausschließlich zur Abwicklung des
                  Credit-Kaufs verarbeitet und nicht dauerhaft gespeichert. Die Transaktion wird
                  serverseitig verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Credit-Guthaben</p>
                <p>
                  Dein aktuelles Credit-Guthaben wird in unserer Datenbank gespeichert und ist für
                  den Betrieb des Dienstes erforderlich.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">3. Cookies und Sessions</h2>
            <p className="text-muted leading-relaxed">
              Wir verwenden ausschließlich technisch notwendige Session-Cookies, die durch NextAuth.js
              gesetzt werden. Diese Cookies dienen der Authentifizierung und sind für die Nutzung des
              eingeloggten Bereichs erforderlich. Eine Einwilligung ist gemäß § 25 Abs. 2 TTDSG nicht
              erforderlich. Wir verwenden keine Tracking- oder Marketing-Cookies.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">4. Drittanbieter</h2>
            <div className="text-muted leading-relaxed space-y-3">
              <div>
                <p className="font-medium text-foreground mb-1">Anthropic PBC (USA)</p>
                <p>
                  Zur Erbringung der KI-Analysen nutzen wir die API von Anthropic PBC. Dabei werden
                  Lebenslauf-Inhalte und Stellenbeschreibungen an Server von Anthropic in den USA
                  übertragen. Die Übertragung erfolgt auf Basis von Standardvertragsklauseln (Art. 46
                  Abs. 2 lit. c DSGVO). Anthropic verarbeitet diese Daten gemäß seiner eigenen
                  Datenschutzrichtlinie ({' '}
                  <a
                    href="https://www.anthropic.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    anthropic.com/privacy
                  </a>
                  ).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">5. Speicherdauer</h2>
            <p className="text-muted leading-relaxed">
              Account-Daten (Name, E-Mail, Credit-Stand) werden für die Dauer der Nutzung gespeichert.
              Nach Löschung deines Accounts werden deine Daten innerhalb von 30 Tagen vollständig
              entfernt. Lebenslauf-Inhalte werden nicht dauerhaft gespeichert und nur für die Dauer
              der jeweiligen API-Anfrage verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">6. Deine Rechte</h2>
            <p className="text-muted leading-relaxed mb-3">
              Du hast nach der DSGVO folgende Rechte gegenüber uns:
            </p>
            <ul className="text-muted space-y-1.5 list-none">
              {[
                'Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)',
                'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
                'Löschung deiner Daten (Art. 17 DSGVO)',
                'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
                'Datenübertragbarkeit (Art. 20 DSGVO)',
                'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
                'Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)',
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 rounded-full bg-muted/50 flex-shrink-0" />
                  {right}
                </li>
              ))}
            </ul>
            <p className="text-muted leading-relaxed mt-3">
              Zur Ausübung deiner Rechte wende dich an:{' '}
              <a href="mailto:Kontakt@Shopitech.de" className="text-foreground hover:underline">
                Kontakt@Shopitech.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">7. Datensicherheit</h2>
            <p className="text-muted leading-relaxed">
              Alle Datenübertragungen erfolgen verschlüsselt via HTTPS/TLS. Wir treffen technische und
              organisatorische Maßnahmen zum Schutz deiner Daten gemäß Art. 32 DSGVO.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">8. Änderungen dieser Erklärung</h2>
            <p className="text-muted leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Die
              jeweils aktuelle Version ist auf dieser Seite abrufbar. Bei wesentlichen Änderungen
              informieren wir registrierte Nutzer per E-Mail.
            </p>
          </section>

        </div>
      </main>
      <AppFooter />
    </div>
  )
}
