const features = [
  {
    id: 1,
    title: 'Błyskawiczne zgłoszenia',
    description:
      'Użytkownik zgłasza usterkę w 15 sekund, bez pobierania aplikacji i logowania.',
    icon: 'bolt',
  },
  {
    id: 2,
    title: 'Precyzyjna lokalizacja',
    description:
      'Kod QR od razu mówi Ci, który konkretnie sprzęt wymaga uwagi. Zero pomyłek.',
    icon: 'location',
  },
  {
    id: 3,
    title: 'Pełna historia serwisowa',
    description:
      'Wszystkie naprawy i przeglądy w jednym miejscu. Buduj bazę wiedzy o swoim sprzęcie.',
    icon: 'history',
  },
  {
    id: 4,
    title: 'Lepsza komunikacja',
    description:
      'Automatyczne powiadomienia dla serwisu i informacja zwrotna dla zgłaszającego.',
    icon: 'message',
  },
  {
    id: 5,
    title: 'Szybkie wdrożenie',
    description:
      'Drukujesz kody, naklejasz i gotowe. System działa natychmiast po wyjęciu z pudełka.',
    icon: 'rocket',
  },
]

const Features = () => {
  return (
    <section className="max-w-6xl mx-auto px-5 mt-40">
      <h2 className="font-display font-bold text-4xl text-center mb-10">
        Dlaczego warto wybrać Machino?
      </h2>
      <div>
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col md:items-center gap-12 ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            {/* Obrazek */}
            <div className="w-full md:w-1/2">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                {/* <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                /> */}
                <div className="bg-gray-200"></div>
              </div>
            </div>

            {/* Tekst */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 font-display">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-600 font-display max-w-sm text-balance">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
