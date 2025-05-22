
import { useState, useRef, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const FinancialChatbot = () => {
  // Replace this string with your actual OpenAI API key
  const OPENAI_API_KEY = "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";
  
  const { chatHistory, addChatMessage, incrementConservativeQuestions } = useFinance();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!OPENAI_API_KEY) {
      toast.error("API key not configured. Please update the code with your OpenAI API key.");
      return;
    }

    // Add user message to chat
    addChatMessage({ role: "user", content: userInput });

    // Check if this is a conservative question
    const conservativeKeywords = ["risk", "safe", "protect", "secure", "guarantee"];
    if (conservativeKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      incrementConservativeQuestions();
    }

    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Eres un asistente financiero especializado en productos de inversión del Banco de Ahorros de Gibraltar. Proporciona información precisa y consejos sobre los Debentures de Desarrollo Económico que ofrece el banco, con un enfoque en sus características, riesgos y beneficios. Mantén las respuestas claras, concisas y enfocadas en el ámbito financiero."
            },
            ...chatHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: userInput
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error calling OpenAI API");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Add AI response to chat
      addChatMessage({ role: "assistant", content: aiResponse });
    } catch (error) {
      console.error("Error en el procesamiento del mensaje:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar tu consulta");
      
      // Add error response to chat
      addChatMessage({ 
        role: "assistant", 
        content: "Lo siento, no pude procesar tu consulta en este momento. Por favor, inténtalo de nuevo más tarde." 
      });
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-headerBg text-gsb-primary flex flex-row justify-between items-center">
        <CardTitle>2. Your AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-[300px]">
          <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-white" ref={scrollAreaRef}>
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
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-gsb-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question about your investment..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? (
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChatbot;
