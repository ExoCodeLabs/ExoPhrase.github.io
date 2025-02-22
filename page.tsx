"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Loader2, Zap, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CHARACTER_LIMIT = 250

export default function ExonizerApp() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= CHARACTER_LIMIT) {
      setInput(text)
    }
  }

  const remainingChars = CHARACTER_LIMIT - input.length
  const isNearLimit = remainingChars <= 50
  const isAtLimit = remainingChars === 0

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(false)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}humanize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
          },
          body: JSON.stringify({ text: input }),
        }
      )
      if (response.ok) {
        const data = await response.json()
        setOutput(data.humanized_text)
      } else {
        setError(true)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-black to-orange-950">
      {/* Animated background pattern */}
      {/* Futuristic header */}
      <header className="border-b border-orange-500/20 bg-black/30 backdrop-blur-md fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
              Exonizer
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="bg-black/40 border border-orange-500/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10">
          <div className="p-6 grid gap-6">
            {/* Input section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-orange-400">
                  AI Generated Text
                </label>
                <span
                  className={`text-sm ${
                    isNearLimit ? "text-orange-400" : "text-gray-500"
                  }`}
                >
                  {remainingChars} characters remaining
                </span>
              </div>
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Paste your AI-generated text here..."
                  className={`min-h-[200px] bg-black/50 border-orange-500/20 text-white placeholder:text-gray-500
                    ${
                      isAtLimit
                        ? "focus-visible:ring-red-500"
                        : "focus-visible:ring-orange-500"
                    }`}
                />
              </div>
              {isNearLimit && !isAtLimit && (
                <Alert className="mt-2 bg-orange-500/10 border-orange-500/50 text-orange-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Approaching character limit
                  </AlertDescription>
                </Alert>
              )}
              {isAtLimit && (
                <Alert className="mt-2 bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Character limit reached</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert className="mt-2 bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Something went wrong, please try again later.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Transform button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !input}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                  text-black font-bold relative overflow-hidden group px-8 py-6 text-lg shadow-lg shadow-orange-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Humanize Text
                    <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                  </>
                )}
              </Button>
            </div>

            {/* Output section */}
            {output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-orange-400">
                    Humanized Text
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-[200px] bg-black/50 border-orange-500/20 text-white"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {output.length} characters
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
