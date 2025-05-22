
import { useState, useRef, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Respuestas predefinidas para simular la interacción con la API
const predefResponses: Record<string, string> = {
  default: "Como asesor financiero virtual, puedo ofrecerte información sobre diversos productos financieros y estrategias de inversión. ¿En qué puedo ayudarte hoy?",
  bonds: "Los bonos son instrumentos de deuda emitidos por gobiernos o empresas. El Banco de Ahorros de Gibraltar ofrece bonos con rendimientos competitivos y diferentes períodos de vencimiento según tus necesidades de inversión.",
  debenture: "Una obligación o 'debenture' es un instrumento de deuda a largo plazo utilizado por gobiernos y grandes corporaciones. A diferencia de otros bonos, no están garantizados por activos específicos sino por la reputación crediticia general del emisor. El Debenture de 5 años que tienes ofrece un cupón fijo del 4% anual hasta su vencimiento.",
  interest: "Los tipos de interés afectan directamente al valor de los bonos. Cuando los tipos suben, el valor de mercado de los bonos existentes tiende a bajar. Tu Debenture de Desarrollo Económico a 5 años tiene una tasa fija, lo que significa que los pagos de intereses permanecen constantes independientemente de los cambios en el mercado.",
  risk: "Tu perfil parece ser conservador. Los Debentures del Banco de Ahorros de Gibraltar están respaldados por el gobierno y tienen un riesgo relativamente bajo en comparación con otras inversiones. Sin embargo, toda inversión conlleva algún nivel de riesgo, incluyendo la posible pérdida de capital si necesitas vender antes del vencimiento en un entorno de tipos de interés más altos.",
  maturity: "Tu Debenture de 5 años vence en junio de 2028. Al vencimiento, recibirás el valor nominal completo de 50,000. Si vendes antes del vencimiento, el valor estará sujeto a las condiciones del mercado en ese momento.",
  inflation: "La inflación puede erosionar el valor real de los retornos fijos. Con una tasa de cupón del 4% en tu Debenture, estás protegido contra la inflación siempre que ésta se mantenga por debajo de ese nivel. El simulador muestra que con una inflación del 2%, tus ganancias reales siguen siendo positivas.",
};

const FinancialChatbot = () => {
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

    // Add user message to chat
    addChatMessage({ role: "user", content: userInput });

    // Check if this is a conservative question
    const conservativeKeywords = ["risk", "safe", "protect", "secure", "guarantee"];
    if (conservativeKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      incrementConservativeQuestions();
    }

    setIsLoading(true);

    try {
      // Simulate API call with local response matching
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      // Find appropriate response based on keywords in the user question
      let aiResponse = predefResponses.default;
      const input = userInput.toLowerCase();
      
      if (input.includes("bono") || input.includes("bond")) {
        aiResponse = predefResponses.bonds;
      } else if (input.includes("debenture") || input.includes("obligación")) {
        aiResponse = predefResponses.debenture;
      } else if (input.includes("interés") || input.includes("tasa") || input.includes("rate")) {
        aiResponse = predefResponses.interest;
      } else if (input.includes("riesgo") || input.includes("risk")) {
        aiResponse = predefResponses.risk;
      } else if (input.includes("vencimiento") || input.includes("maturity")) {
        aiResponse = predefResponses.maturity;
      } else if (input.includes("inflación") || input.includes("inflation")) {
        aiResponse = predefResponses.inflation;
      }
      
      // Add AI response to chat
      addChatMessage({ role: "assistant", content: aiResponse });
    } catch (error) {
      console.error("Error en el procesamiento del mensaje:", error);
      toast.error("No se pudo procesar tu consulta. Por favor, inténtalo de nuevo.");
      
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
      <CardHeader className="bg-gsb-headerBg text-gsb-primary">
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
            <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
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
