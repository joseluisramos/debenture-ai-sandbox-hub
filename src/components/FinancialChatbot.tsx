
import { useState, useRef, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Key, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";

const FinancialChatbot = () => {
  const { chatHistory, addChatMessage, incrementConservativeQuestions } = useFinance();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [storedApiKey, setStoredApiKey] = useState(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    return savedKey || "";
  });
  
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

  // Save API key to localStorage when it changes
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      setStoredApiKey(apiKey);
      setShowApiInput(false);
      toast.success("API key saved successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  // Handle removing API key
  const handleRemoveApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setStoredApiKey("");
    setApiKey("");
    toast.success("API key removed");
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!storedApiKey) {
      toast.error("Please add your OpenAI API key first");
      setShowApiInput(true);
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
          Authorization: `Bearer ${storedApiKey}`,
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
        content: "Lo siento, no pude procesar tu consulta en este momento. Por favor, verifica tu API key o inténtalo de nuevo más tarde." 
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowApiInput(!showApiInput)}
          className="flex items-center gap-1"
        >
          <Key className="h-4 w-4" />
          {storedApiKey ? "Change API Key" : "Add API Key"}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {showApiInput && (
          <div className="mb-4 p-3 border rounded-md bg-gray-50">
            <Label htmlFor="apiKey" className="mb-1 block">OpenAI API Key:</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} size="sm">Save</Button>
              {storedApiKey && (
                <Button 
                  onClick={handleRemoveApiKey} 
                  variant="outline" 
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tu API key se guardará solo en tu navegador y nunca será enviada a nuestros servidores.
            </p>
          </div>
        )}
        
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
              placeholder={storedApiKey ? "Ask a question about your investment..." : "Add your OpenAI API key first"}
              className="flex-1"
              disabled={isLoading || !storedApiKey}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !userInput.trim() || !storedApiKey}
            >
              {isLoading ? (
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
          {!storedApiKey && !showApiInput && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              <Button variant="link" onClick={() => setShowApiInput(true)}>
                Añade tu API key de OpenAI
              </Button> 
              para utilizar el chat
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChatbot;
