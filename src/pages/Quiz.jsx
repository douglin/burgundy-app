import { useEffect, useState } from 'react'
import questionBank from '../data/quiz.json'

const SESSION_SIZE = 10
const LS_KEY = 'burgundy-quiz-stats'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildSession() {
  return shuffle(questionBank).slice(0, SESSION_SIZE).map((q) => ({
    ...q,
    choices: shuffle([q.answer, ...q.distractors]),
    selected: null,
  }))
}

export default function Quiz() {
  const [questions, setQuestions] = useState(() => buildSession())
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState(() => {
    const s = localStorage.getItem(LS_KEY)
    return s ? JSON.parse(s) : { highScore: 0, streak: 0 }
  })

  const current = questions[index]
  const answered = current.selected !== null
  const score = questions.filter((q) => q.selected === q.answer).length

  function pick(choice) {
    if (answered) return
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, selected: choice } : q)))
  }

  function next() {
    if (index + 1 >= questions.length) setDone(true)
    else setIndex((i) => i + 1)
  }

  useEffect(() => {
    if (!done) return
    const newStats = {
      highScore: Math.max(stats.highScore, score),
      streak: score === SESSION_SIZE ? stats.streak + 1 : 0,
    }
    setStats(newStats)
    localStorage.setItem(LS_KEY, JSON.stringify(newStats))
  }, [done])

  function restart() {
    setQuestions(buildSession())
    setIndex(0)
    setDone(false)
  }

  if (done) {
    const missed = questions.filter((q) => q.selected !== q.answer)
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Results</p>
        <h1
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-3xl font-bold text-[#6B0F1A] mb-1"
        >
          Quiz Complete
        </h1>
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-6xl font-bold text-[#2C1810] mb-1 mt-6"
        >
          {score}<span className="text-2xl text-[#6B5244]">/{SESSION_SIZE}</span>
        </p>
        <p className="text-sm text-[#6B5244] mb-8">
          High score: {stats.highScore} &nbsp;·&nbsp; Streak: {stats.streak}
        </p>

        <div className="h-px bg-[#D4C5A9] mb-8" />

        {missed.length > 0 && (
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-[#6B5244] mb-4">Missed Questions</p>
            <ul className="space-y-4">
              {missed.map((q) => (
                <li key={q.id} className="bg-[#FDFAF5] border border-[#D4C5A9] p-4">
                  <p className="text-[#2C1810] mb-2">{q.question}</p>
                  <p className="text-xs text-green-800">
                    Correct: <strong>{q.answer}</strong>
                  </p>
                  <p className="text-xs text-red-700">Your answer: {q.selected}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={restart}
          className="bg-[#6B0F1A] text-[#F5F0E8] px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#4A0A12] transition-colors"
        >
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">
            {current.category}
          </p>
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl font-bold text-[#6B0F1A]"
          >
            Quiz
          </h1>
        </div>
        <span className="text-sm text-[#6B5244]">
          {index + 1} <span className="text-[#D4C5A9]">/</span> {SESSION_SIZE}
        </span>
      </div>

      <div className="h-0.5 bg-[#EDE6D6] mb-8 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] transition-all"
          style={{ width: `${((index + 1) / SESSION_SIZE) * 100}%` }}
        />
      </div>

      <p className="text-lg text-[#2C1810] mb-8 leading-relaxed">{current.question}</p>

      <ul className="space-y-2 mb-8">
        {current.choices.map((choice) => {
          const isCorrect = choice === current.answer
          const isSelected = choice === current.selected
          let cls = 'w-full text-left px-5 py-3.5 border text-sm transition-colors '
          if (!answered) {
            cls += 'border-[#D4C5A9] text-[#2C1810] hover:border-[#6B0F1A] hover:bg-[#FDFAF5]'
          } else if (isCorrect) {
            cls += 'border-green-400 bg-green-50 text-green-800 font-medium'
          } else if (isSelected) {
            cls += 'border-red-300 bg-red-50 text-red-700'
          } else {
            cls += 'border-[#EDE6D6] text-[#C9A84C]'
          }
          return (
            <li key={choice}>
              <button className={cls} onClick={() => pick(choice)}>{choice}</button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <button
          onClick={next}
          className="bg-[#6B0F1A] text-[#F5F0E8] px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#4A0A12] transition-colors"
        >
          {index + 1 < SESSION_SIZE ? 'Next →' : 'See Results'}
        </button>
      )}
    </div>
  )
}
