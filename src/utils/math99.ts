export interface MathQuestion {
  a: number
  b: number
  answer: number
  choices: number[]
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const makeChoices = (answer: number): number[] => {
  const choices = new Set<number>([answer])
  while (choices.size < 4) {
    const candidate = answer + Math.floor(Math.random() * 10) - 5
    if (candidate > 0 && candidate !== answer) choices.add(candidate)
  }
  return shuffle([...choices])
}

const makeQuestion = (a: number, b: number): MathQuestion => {
  const answer = a * b
  return { a, b, answer, choices: makeChoices(answer) }
}

/** All nine questions (×1 to ×9) for one number's table, in random order. */
export const buildTableQuestions = (n: number): MathQuestion[] =>
  shuffle(Array.from({ length: 9 }, (_, i) => makeQuestion(n, i + 1)))

/** `count` random questions using factors 2-9. */
export const buildRandomQuestions = (count: number): MathQuestion[] =>
  Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * 8) + 2
    const b = Math.floor(Math.random() * 8) + 2
    return makeQuestion(a, b)
  })
