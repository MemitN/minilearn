// ============================================
// QUIZ/ASSESSMENT PAGE
// ============================================
// Interactive quiz with multiple question types and real-time feedback

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Mock quiz data
   * In a real app, this would come from the backend
   */
  const quiz = {
    id: params.quizId,
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React basics",
    passingScore: 70,
    questions: [
      {
        id: "1",
        type: "multiple_choice",
        question: "What is React?",
        options: ["A JavaScript library for building UI", "A backend framework", "A CSS preprocessor", "A database"],
        correctAnswer: 0,
        explanation: "React is a JavaScript library developed by Facebook for building user interfaces.",
      },
      {
        id: "2",
        type: "true_false",
        question: "React uses a virtual DOM for performance optimization.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "The virtual DOM is a core React concept that improves performance.",
      },
      {
        id: "3",
        type: "multiple_choice",
        question: "What is JSX?",
        options: [
          "A syntax extension to JavaScript",
          "A new JavaScript version",
          "A styling library",
          "A state management tool",
        ],
        correctAnswer: 0,
        explanation: "JSX allows you to write HTML-like code in JavaScript.",
      },
      {
        id: "4",
        type: "multiple_choice",
        question: "Which hook is used for side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "useEffect is the hook for performing side effects in functional components.",
      },
      {
        id: "5",
        type: "true_false",
        question: "Props in React are mutable and can be changed by the child component.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Props are immutable and cannot be modified by the child component.",
      },
    ],
  }

  const question = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length
  const answeredQuestions = Object.keys(answers).length

  /**
   * Handle answer selection
   */
  const handleAnswer = (answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }))
  }

  /**
   * Move to next question
   */
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  /**
   * Move to previous question
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  /**
   * Submit quiz and calculate score
   */
  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Calculate score
      let correct = 0
      quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          correct++
        }
      })
      const score = Math.round((correct / totalQuestions) * 100)

      // Store result
      localStorage.setItem(
        `quiz_${params.quizId}`,
        JSON.stringify({
          score,
          passed: score >= quiz.passingScore,
          date: new Date().toISOString(),
        }),
      )

      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    // Calculate final score
    const correct = quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length
    const score = Math.round((correct / totalQuestions) * 100)
    const passed = score >= quiz.passingScore

    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Results Card */}
          <Card className="border-border">
            <CardContent className="pt-12 pb-12 text-center space-y-8">
              {/* Score Result */}
              <div>
                {passed ? (
                  <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-24 h-24 text-destructive mx-auto mb-4" />
                )}

                <h1 className="text-4xl font-bold mb-2">{passed ? "Congratulations!" : "Quiz Complete"}</h1>
                <p className="text-6xl font-bold text-primary mb-2">{score}%</p>
                <p className="text-lg text-muted-foreground">
                  You answered {correct} out of {totalQuestions} questions correctly
                </p>
              </div>

              {/* Pass/Fail Message */}
              <div
                className={`p-4 rounded-lg ${
                  passed
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <p className={passed ? "text-green-600" : "text-destructive"}>
                  {passed
                    ? `Great job! You've passed with ${score}%. Your certificate is ready to download.`
                    : `You need ${quiz.passingScore}% to pass. Try again to improve your score.`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {passed && (
                  <Button size="lg" className="gap-2">
                    Download Certificate
                  </Button>
                )}
                <Button
                  size="lg"
                  variant={passed ? "outline" : "default"}
                  onClick={() => {
                    setSubmitted(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                  }}
                >
                  {passed ? "Go to Dashboard" : "Retake Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">{answeredQuestions} answered</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers[currentQuestion] === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {answers[currentQuestion] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation and Submit */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {currentQuestion === totalQuestions - 1 ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={answeredQuestions < totalQuestions || loading}
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-12">
          <p className="text-sm font-medium mb-4">Questions</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg border text-sm font-medium transition-all ${
                  currentQuestion === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : answers[index] !== undefined
                      ? "border-green-500 bg-green-500/10 text-green-600"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
