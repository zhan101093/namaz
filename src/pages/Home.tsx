import { Link } from 'react-router-dom'

const sections = [
  {
    to: '/why',
    number: '01',
    title: 'Не үшін намаз оқу керек?',
    description: 'Намаздың рухани, дене және психологиялық пайдалары',
    icon: '🌙',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    to: '/movements',
    number: '02',
    title: 'Намаздың қимылдары',
    description: 'Тәкбірден саламға дейін қадам бойынша нұсқаулық',
    icon: '🧍',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    to: '/duas',
    number: '03',
    title: 'Намаздағы дұғалар',
    description: 'Арабша дұғалар, транслитерация және қазақша мағынасы',
    icon: '📖',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    to: '/practice',
    number: '04',
    title: 'Практика',
    description: 'Интерактивті режимде намазды бірге оқып үйрен',
    icon: '✨',
    color: 'from-green-500 to-emerald-600',
  },
  {
    to: '/mistakes',
    number: '05',
    title: 'Жиі жіберілетін қателер',
    description: 'Ең кең тараған қателер мен оларды түзету жолдары',
    icon: '⚠️',
    color: 'from-amber-500 to-orange-600',
  },
  {
    to: '/game',
    number: '06',
    title: 'Ойын — Викторина',
    description: 'Білімді тексер! 10 сұрақ, таймер, ұпай жүйесі',
    icon: '🎮',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    to: '/order-game',
    number: '07',
    title: 'Ойын — Қимылдар реті',
    description: 'Намаздың 8 қимылын дұрыс ретке келтір',
    icon: '🃏',
    color: 'from-rose-500 to-pink-600',
  },
  {
    to: '/match-game',
    number: '08',
    title: 'Ойын — Жұптастыру',
    description: 'Қимылдарды дұғаларымен байланыстыр',
    icon: '🔗',
    color: 'from-violet-500 to-purple-600',
  },
]

export function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-3">
          Намаз үйрену
        </h1>
        <div className="mt-5 max-w-2xl mx-auto bg-white border border-primary-100 rounded-2xl px-6 py-4 text-left shadow-sm">
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Мақсат</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Сіздерге намаздың маңызын түсіндіру, намаз қимылдары мен дұғаларын үйрету,
            практикалық түрде оқып көрсету және намазды күнделікті өмірдің ажырамас бөлігіне
            айналдыруға мотивация беру.
          </p>
        </div>
        <div className="mt-6 inline-block bg-primary-50 border border-primary-200 rounded-2xl px-6 py-3">
          <p className="text-primary-800 font-arabic text-xl">
            وَأَقِيمُوا الصَّلَاةَ
          </p>
          <p className="text-primary-600 text-sm mt-1">«Намазды орындаңдар» — Бақара, 43</p>
        </div>
      </section>

      {/* Sections grid */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Бөлімдер</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <Link
              key={sec.to}
              to={sec.to}
              className="card group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center text-2xl shadow-sm`}>
                {sec.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {sec.number}
                </span>
                <h3 className="font-semibold text-gray-900 text-base mt-0.5 group-hover:text-primary-700 transition-colors">
                  {sec.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{sec.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>Намаз — Ислам дінінің бес парызының бірі</p>
      </footer>
    </main>
  )
}
