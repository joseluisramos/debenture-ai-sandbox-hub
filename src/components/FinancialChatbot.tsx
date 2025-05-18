import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const FinancialChatbot = () => {
  const { chatHistory, addChatMessage, incrementConservativeQuestions } = useFinance();
  const [userInput, setUserInput] = useState("");

  // Preloaded Q&A pairs
  const qaPairs: Record<string, string> = {
    "how will the next rate hike affect the 5-year bond?":
      "A +1% hike lowers its market price by ~5% over 12 months.",
    "should i move my balance into the children's account?":
      "The children's account yields 0.5% less but has no fees—ideal for long-term savings.",
    "what happens if inflation increases?":
      "Higher inflation typically reduces the real return of fixed-rate bonds. Your debenture would maintain its nominal value but lose purchasing power.",
    "is this a good time to invest in debentures?":
      "With current economic indicators, debentures offer stable income but limited growth potential. Consider your risk tolerance and time horizon.",
    "how safe are these investments?":
      "Gibraltar Savings Bank debentures are backed by the government and considered low-risk investments, suitable for conservative portfolios."
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    addChatMessage({ role: "user", content: userInput });

    // Check if this is a conservative question
    const conservativeKeywords = ["risk", "safe", "protect", "secure", "guarantee"];
    if (conservativeKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      incrementConservativeQuestions();
    }

    // Find matching response or use default
    const normalizedInput = userInput.toLowerCase().trim();
    let botResponse = "I don't have specific information on that query. Please contact our financial advisors for detailed guidance.";

    // Check for exact or partial matches in our QA pairs
    for (const [question, answer] of Object.entries(qaPairs)) {
      if (
        normalizedInput === question ||
        normalizedInput.includes(question) ||
        question.includes(normalizedInput)
      ) {
        botResponse = answer;
        break;
      }
    }

    // Add bot response with slight delay for realism
    setTimeout(() => {
      addChatMessage({ role: "assistant", content: botResponse });
    }, 500);

    // Clear input
    setUserInput("");
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-secondary text-white">
        <CardTitle className="text-lg">2. Your AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-[300px]">
          <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-white">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gsb-muted p-4">
                <p>Ask your AI chat about your investment.</p>
                <p className="text-sm mt-2">Try questions like:</p>
                <ul className="text-sm mt-1 text-gsb-primary">
                  <li>"How will the next rate hike affect the 5-year bond?"</li>
                  <li>"Should I move my balance into the children's account?"</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
