import { Link } from 'react-router-dom'

interface Reason {
  id: number
  icon: string
  title: string
  paragraphs: string[]
  quote?: { text: string; source: string }
  bullets?: string[]
}

const reasons: Reason[] = [
  {
    id: 1,
    icon: '⚖️',
    title: 'Намаз — қияметтегі алғашқы сұрақ',
    paragraphs: [
      'Бір күні бәріміз Аллаhтың алдына барамыз. Сол күні адамды ең бірінші құтқаратын амалдардың бірі — намаз.',
      'Егер намазымыз дұрыс болса — басқа амалдарға да жеңілдік болады.',
    ],
    quote: {
      text: '«Қиямет күні ең бірінші намаз сұралады»',
      source: 'Пайғамбарымыз ﷺ',
    },
  },
  {
    id: 2,
    icon: '🛡️',
    title: 'Намаз адамды күнәдан сақтайды',
    paragraphs: [
      'Адам намаз оқыған сайын: жүрегі жұмсарады, ұяты күшейеді, тәртіпке келеді.',
      'Шынайы намаз адамның мінезін өзгертеді.',
    ],
    quote: {
      text: '«Расында намаз арсыздықтан және жамандықтан тыяды»',
      source: 'Құран, Анкабут: 45',
    },
  },
  {
    id: 3,
    icon: '🕊️',
    title: 'Намаз жүрекке тыныштық береді',
    paragraphs: [
      'Адамдар психолог іздейді, біреуге мұңын айтқысы келеді, ішіндегі ауырлықты шығарғысы келеді.',
    ],
    bullets: [
      'Сен мен Алланың арасына ешкім түспейді',
      'Сенің тіліңді де, жылауыңды да, үнсіздігіңді де Алла түсінеді',
    ],
    quote: {
      text: '«Жүректер Алланы еске алумен тынышталады»',
      source: 'Құран, Раъд: 28',
    },
  },
  {
    id: 4,
    icon: '⏰',
    title: 'Намаз — адамның күнін жүйеге келтіреді',
    paragraphs: ['Намаз оқитын адам:'],
    bullets: [
      'Уақытын бағалайды',
      'Жоспармен жүреді',
      'Жауапкершілігі артады',
    ],
  },
  {
    id: 5,
    icon: '💧',
    title: 'Намаз — рухани тазалық',
    paragraphs: [
      'Бес уақыт намаз адамның жүрегін тазартады.',
      'Пайғамбар ﷺ намазды адамның күніне 5 рет өзенге жуынуымен салыстырған.',
    ],
    bullets: [
      'Күнәлар кешіріледі',
      'Жүрек жұмсарады',
      'Рухани кір азаяды',
    ],
  },
  {
    id: 6,
    icon: '💪',
    title: 'Намаздың денсаулыққа пайдасы',
    paragraphs: ['Намаздың дене денсаулығына тиетін нақты пайдалары:'],
    bullets: [
      'Омыртқааралық дискілерді созып, олардың арасындағы қысымды азайтады',
      'Миға оттегі бар қан ағысының қысымын күшейтеді',
      'Буындар жаттығады',
    ],
  },
]

export function WhyPray() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
          1-бөлім: Не үшін намаз оқу керек?
        </h1>
        <p className="text-gray-500 mt-1">
          Намаздың рухани, психологиялық және дене денсаулығына тигізетін пайдалары
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {reasons.map((reason) => (
          <article key={reason.id} className="card flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">
                {reason.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {reason.id}-себеп
                </span>
                <h2 className="font-bold text-gray-900 text-lg leading-snug mt-0.5">
                  {reason.title}
                </h2>
              </div>
            </div>

            {/* Paragraphs */}
            {reason.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700 text-sm leading-relaxed">
                {p}
              </p>
            ))}

            {/* Bullets */}
            {reason.bullets && (
              <ul className="flex flex-col gap-1.5 pl-1">
                {reason.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary-500 mt-0.5 flex-shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Quote */}
            {reason.quote && (
              <blockquote className="border-l-4 border-primary-400 pl-4 bg-primary-50 rounded-r-xl py-2 pr-3">
                <p className="text-sm text-primary-800 font-medium italic">
                  {reason.quote.text}
                </p>
                <cite className="text-xs text-primary-600 not-italic mt-0.5 block">
                  — {reason.quote.source}
                </cite>
              </blockquote>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Link to="/movements" className="btn-primary">
          Келесі: Намаздың қимылдары →
        </Link>
      </div>
    </main>
  )
}
