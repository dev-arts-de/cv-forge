import MarketingNav from '@/components/shared/MarketingNav'
import AppFooter from '@/components/shared/AppFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="font-syne font-bold text-3xl text-foreground mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm text-muted mb-10">Stand: März 2026</p>

        <div className="space-y-8 text-sm">

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">1. Geltungsbereich</h2>
            <p className="text-muted leading-relaxed">
              Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Plattform
              Bewerber-Schmiede, betrieben von Shopitech, Inhaber Arthur Schimpf,
              Hans-Thoma-Str. 4, 76351 Linkenheim-Hochstetten (nachfolgend „Anbieter"). Mit der
              Registrierung und Nutzung des Dienstes erklärt sich der Nutzer mit diesen AGB
              einverstanden.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">2. Leistungsbeschreibung</h2>
            <p className="text-muted leading-relaxed">
              Bewerber-Schmiede ist eine KI-gestützte Plattform, die Bewerbern folgende Tools
              bereitstellt:
            </p>
            <ul className="text-muted mt-2 space-y-1.5 list-none">
              {[
                'Talentblick – KI-Analyse von Lebensläufen mit Bewertung, Verbesserungsvorschlägen und Job-Match-Score',
                'Anschreibomat – KI-gestützte Erstellung individueller Anschreiben',
                'Foxfolio – Portfolio-Erstellung (in Entwicklung)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-muted/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-muted leading-relaxed mt-3">
              Die Ergebnisse der KI-Analyse sind Empfehlungen und ersetzen keine professionelle
              Karriereberatung. Der Anbieter übernimmt keine Garantie für den Erfolg von
              Bewerbungen auf Basis der generierten Inhalte.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">3. Registrierung</h2>
            <p className="text-muted leading-relaxed">
              Die Nutzung des eingeloggten Bereichs setzt eine Registrierung voraus. Der Nutzer ist
              verpflichtet, wahrheitsgemäße Angaben zu machen und seine Zugangsdaten vertraulich zu
              behandeln. Der Anbieter behält sich vor, Accounts bei Missbrauch zu sperren oder zu
              löschen. Jeder Nutzer erhält bei der Registrierung ein Startguthaben von 6 Credits.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">4. Credit-System und Zahlung</h2>
            <div className="text-muted leading-relaxed space-y-3">
              <p>
                Die Nutzung kostenpflichtiger Funktionen erfolgt über ein Credit-System. Credits können
                in Paketen erworben werden und verfallen nicht.
              </p>
              <p>
                Aktuelle Credit-Kosten je Aktion:
              </p>
              <ul className="space-y-1.5 list-none">
                {[
                  'Talentblick CV-Analyse: 3 Credits',
                  'Anschreibomat Anschreiben: 2 Credits',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                Credits werden erst verbraucht, wenn eine Aktion erfolgreich abgeschlossen wird.
                Bei technischen Fehlern auf Seiten des Anbieters werden verbrauchte Credits
                automatisch erstattet.
              </p>
              <p>
                Käufe sind endgültig. Eine Erstattung bereits verbrauchter Credits ist
                ausgeschlossen, sofern der Fehler nicht auf Seiten des Anbieters liegt.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">5. Widerrufsrecht</h2>
            <p className="text-muted leading-relaxed">
              Da es sich bei Credits um digitale Inhalte handelt, die sofort nach dem Kauf
              gutgeschrieben werden, erlischt das Widerrufsrecht gemäß § 356 Abs. 5 BGB mit
              Beginn der Vertragserfüllung. Durch die Kaufbestätigung stimmst du ausdrücklich zu,
              dass die Leistung sofort erbracht wird, und nimmst zur Kenntnis, dass du dein
              Widerrufsrecht damit verlierst.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">6. Nutzungspflichten</h2>
            <p className="text-muted leading-relaxed">
              Der Nutzer verpflichtet sich, die Plattform ausschließlich für rechtmäßige Zwecke zu
              nutzen. Insbesondere ist es untersagt, die Plattform für die Erstellung von Inhalten
              zu nutzen, die Dritte täuschen sollen, automatisierte Anfragen (Bots) zu stellen oder
              Maßnahmen zu ergreifen, die die Infrastruktur des Anbieters belasten.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">7. Haftungsbeschränkung</h2>
            <p className="text-muted leading-relaxed">
              Der Anbieter haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem
              Verhalten beruhen. Eine Haftung für die inhaltliche Qualität der KI-generierten
              Ergebnisse ist ausgeschlossen. Der Anbieter übernimmt keine Garantie für die
              ununterbrochene Verfügbarkeit der Plattform.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">8. Kündigung und Accountlöschung</h2>
            <p className="text-muted leading-relaxed">
              Der Nutzer kann seinen Account jederzeit löschen. Verbleibende Credits verfallen dabei
              und werden nicht erstattet. Der Anbieter behält sich das Recht vor, Accounts bei
              Verstößen gegen diese AGB ohne Vorankündigung zu sperren oder zu löschen.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">9. Änderungen der AGB</h2>
            <p className="text-muted leading-relaxed">
              Der Anbieter behält sich vor, diese AGB mit angemessener Frist zu ändern. Registrierte
              Nutzer werden über wesentliche Änderungen per E-Mail informiert. Die weitere Nutzung
              nach Inkrafttreten der Änderungen gilt als Zustimmung.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">10. Anwendbares Recht und Gerichtsstand</h2>
            <p className="text-muted leading-relaxed">
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für Streitigkeiten
              mit Kaufleuten ist Karlsruhe.
            </p>
          </section>

          <section>
            <h2 className="font-syne font-semibold text-foreground mb-2">11. Kontakt</h2>
            <p className="text-muted leading-relaxed">
              Bei Fragen zu diesen AGB wende dich an:{' '}
              <a href="mailto:Kontakt@Shopitech.de" className="text-foreground hover:underline">
                Kontakt@Shopitech.de
              </a>
            </p>
          </section>

        </div>
      </main>
      <AppFooter />
    </div>
  )
}
