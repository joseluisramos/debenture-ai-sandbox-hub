
import { useState, useRef, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

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

  // Generate a bot response based on user input
  const generateBotResponse = (input: string): string => {
    const normalizedInput = input.toLowerCase();
    
    // Check for common questions and provide appropriate responses
    if (normalizedInput.includes("tasa") || normalizedInput.includes("interés") || normalizedInput.includes("rendimiento")) {
      return "Los Debentures de Desarrollo Económico ofrecen actualmente una tasa de interés fija del 4.0%. Esta tasa es garantizada durante todo el período de inversión de 5 años.";
    }
    
    if (normalizedInput.includes("plazo") || normalizedInput.includes("vencimiento") || normalizedInput.includes("duración")) {
      return "El plazo de los Debentures de Desarrollo Económico es de 5 años, con fecha de vencimiento en junio de 2028. No se permiten retiros anticipados sin penalización.";
    }
    
    if (normalizedInput.includes("riesgo") || normalizedInput.includes("seguro") || normalizedInput.includes("garantía") || normalizedInput.includes("protección")) {
      return "Los Debentures de Desarrollo Económico tienen un perfil de riesgo moderado. Están respaldados por proyectos de infraestructura del gobierno, pero no están asegurados por el Esquema de Compensación de Servicios Financieros como los depósitos regulares.";
    }
    
    if (normalizedInput.includes("impuesto") || normalizedInput.includes("fiscal") || normalizedInput.includes("tributo")) {
      return "Los rendimientos de los Debentures están sujetos a impuestos según su tasa impositiva personal. Sin embargo, pueden ser elegibles para ciertas exenciones fiscales si se mantienen en cuentas específicas como ISAs o SIPPs.";
    }
    
    if (normalizedInput.includes("retiro") || normalizedInput.includes("liquidez") || normalizedInput.includes("reembolso") || normalizedInput.includes("cancelar")) {
      return "Los retiros anticipados están sujetos a una penalización del 2% del valor principal. Se recomienda mantener la inversión durante todo el período de 5 años para maximizar los rendimientos.";
    }
    
    if (normalizedInput.includes("inflación") || normalizedInput.includes("poder adquisitivo")) {
      return "La tasa fija del 4.0% está diseñada para superar la inflación proyectada de 2%. Sin embargo, si la inflación aumenta significativamente, el rendimiento real podría verse afectado.";
    }
    
    if (normalizedInput.includes("hola") || normalizedInput.includes("buenos días") || normalizedInput.includes("buenas tardes")) {
      return "¡Hola! Soy su asistente financiero del Banco de Ahorros de Gibraltar. ¿En qué puedo ayudarle hoy con respecto a sus Debentures de Desarrollo Económico?";
    }
    
    if (normalizedInput.includes("gracias") || normalizedInput.includes("agradecido")) {
      return "De nada. Estoy aquí para ayudarle con cualquier consulta sobre sus inversiones. ¿Tiene alguna otra pregunta?";
    }
    
    // Default response for unrecognized queries
    return "Como representante del Banco de Ahorros de Gibraltar, puedo informarle que los Debentures de Desarrollo Económico a 5 años ofrecen una tasa fija del 4.0% con un valor nominal de £50,000. ¿Hay algún aspecto específico sobre el que desea más información?";
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    addChatMessage({ role: "user", content: userInput });

    // Check if this is a conservative question
    const conservativeKeywords = ["riesgo", "seguro", "proteger", "garantía", "garantizado"];
    if (conservativeKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
      incrementConservativeQuestions();
    }

    setIsLoading(true);

    // Simulate a delay for more realistic bot response
    setTimeout(() => {
      // Generate response
      const botResponse = generateBotResponse(userInput);
      
      // Add AI response to chat
      addChatMessage({ role: "assistant", content: botResponse });
      
      setIsLoading(false);
      setUserInput("");
    }, 800);
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
                  <li>"¿Cómo afectará la próxima subida de tasas a mi inversión?"</li>
                  <li>"¿Cuál es el nivel de riesgo de esta inversión?"</li>
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
              placeholder="Haz una pregunta sobre tu inversión..."
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
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChatbot;
