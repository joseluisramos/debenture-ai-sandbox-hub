
import { useState, useRef, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Eye, EyeOff, Key } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FinancialChatbot = () => {
  const { chatHistory, addChatMessage, incrementConservativeQuestions } = useFinance();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    // Try to get the API key from sessionStorage on component mount
    return sessionStorage.getItem("openai_api_key") || "";
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  
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

  // Save API key to sessionStorage when it changes
  useEffect(() => {
    if (apiKey) {
      sessionStorage.setItem("openai_api_key", apiKey);
      setApiKeyError("");
    } else {
      sessionStorage.removeItem("openai_api_key");
    }
  }, [apiKey]);

  // Generate a bot response based on user input
  const generateLocalResponse = (input: string): string => {
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

  // Call OpenAI API
  const callOpenAI = async (input: string): Promise<string> => {
    if (!apiKey) {
      setApiKeyError("Por favor, introduce una clave API de OpenAI válida");
      throw new Error("No API key provided");
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente financiero del Banco de Ahorros de Gibraltar. Tu función es proporcionar información sobre los Debentures de Desarrollo Económico: tasa fija del 4.0%, plazo de 5 años, valor £50,000. Responde de manera profesional, clara y en español. No hables de otros productos.'
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Error en la llamada a la API de OpenAI");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast.error("Error al conectar con OpenAI. Usando respuesta local.");
      // Fallback to local response if API call fails
      return generateLocalResponse(input);
    }
  };

  // Check if this is a conservative question
  const checkConservativeQuestion = (question: string) => {
    const conservativeKeywords = ["riesgo", "seguro", "proteger", "garantía", "garantizado"];
    if (conservativeKeywords.some(keyword => question.toLowerCase().includes(keyword))) {
      incrementConservativeQuestions();
    }
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    addChatMessage({ role: "user", content: userInput });
    checkConservativeQuestion(userInput);
    setIsLoading(true);

    try {
      let botResponse;
      
      // Use OpenAI API if key is provided, otherwise use local response
      if (apiKey) {
        botResponse = await callOpenAI(userInput);
      } else {
        botResponse = generateLocalResponse(userInput);
      }
      
      // Add AI response to chat
      addChatMessage({ role: "assistant", content: botResponse });
    } catch (error) {
      console.error("Error generating response:", error);
      // Add fallback response if something goes wrong
      addChatMessage({ 
        role: "assistant", 
        content: "Lo siento, hubo un problema al procesar tu consulta. Por favor, intenta de nuevo." 
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

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-headerBg text-gsb-primary flex flex-row justify-between items-center">
        <CardTitle>2. Your AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="apiKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key de OpenAI
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">?</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm">
                    Tu clave API se almacena temporalmente en la sesión del navegador
                    y no se guarda en ninguna base de datos. Si cierras o recargas la página,
                    tendrás que introducirla de nuevo.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={toggleApiKeyVisibility} 
                type="button"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {apiKeyError && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{apiKeyError}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-muted-foreground">
              {apiKey ? "API key configurada. Si no tienes una clave, se usarán respuestas pregeneradas." : "Sin API key. Se usarán respuestas pregeneradas."}
            </p>
          </div>
        </div>

        <div className="flex flex-col h-[300px]">
          <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-white" ref={scrollAreaRef}>
            {chatHistory.length === 0 ? (
              <div className="text-center text-gsb-muted p-4">
                <p>Haz preguntas sobre tu inversión al asistente financiero.</p>
                <p className="text-sm mt-2">Prueba con preguntas como:</p>
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
