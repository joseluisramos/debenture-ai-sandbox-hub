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
    if (normalizedInput.includes("rate") || normalizedInput.includes("interest") || normalizedInput.includes("yield")) {
      return "Economic Development Debentures currently offer a fixed interest rate of 4.0%. This rate is guaranteed throughout the entire 5-year investment period.";
    }
    
    if (normalizedInput.includes("term") || normalizedInput.includes("maturity") || normalizedInput.includes("duration")) {
      return "The term for Economic Development Debentures is 5 years, with a maturity date in June 2028. Early withdrawals are not permitted without penalty.";
    }
    
    if (normalizedInput.includes("risk") || normalizedInput.includes("safe") || normalizedInput.includes("guarantee") || normalizedInput.includes("protection")) {
      return "Economic Development Debentures have a moderate risk profile. They are backed by government infrastructure projects but are not insured by the Financial Services Compensation Scheme like regular deposits.";
    }
    
    if (normalizedInput.includes("tax") || normalizedInput.includes("fiscal")) {
      return "Returns from Debentures are subject to taxation at your personal tax rate. However, they may be eligible for certain tax exemptions if held within specific accounts such as ISAs or SIPPs.";
    }
    
    if (normalizedInput.includes("withdrawal") || normalizedInput.includes("liquidity") || normalizedInput.includes("redemption") || normalizedInput.includes("cancel")) {
      return "Early withdrawals are subject to a 2% penalty on the principal amount. It is recommended to maintain the investment for the entire 5-year period to maximize returns.";
    }
    
    if (normalizedInput.includes("inflation") || normalizedInput.includes("purchasing power")) {
      return "The fixed 4.0% rate is designed to exceed the projected inflation of 2%. However, if inflation increases significantly, the real return could be affected.";
    }
    
    if (normalizedInput.includes("hello") || normalizedInput.includes("hi") || normalizedInput.includes("good morning") || normalizedInput.includes("good afternoon")) {
      return "Hello! I'm your financial assistant from Gibraltar Savings Bank. How can I help you today regarding your Economic Development Debentures?";
    }
    
    if (normalizedInput.includes("thank")) {
      return "You're welcome. I'm here to help with any questions about your investments. Do you have any other questions?";
    }
    
    // Default response for unrecognized queries
    return "As a representative of Gibraltar Savings Bank, I can inform you that the 5-year Economic Development Debentures offer a fixed rate of 4.0% with a nominal value of £50,000. Is there any specific aspect you would like more information about?";
  };

  // Call OpenAI API
  const callOpenAI = async (input: string): Promise<string> => {
    if (!apiKey) {
      setApiKeyError("Please enter a valid OpenAI API key");
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
              content: 'You are a financial assistant from Gibraltar Savings Bank. Your role is to provide information about Economic Development Debentures: fixed rate of 4.0%, 5-year term, value £50,000. Respond professionally, clearly and in English. Do not discuss other products.'
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
        throw new Error(error.error?.message || "Error calling OpenAI API");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast.error("Error connecting to OpenAI. Using local response.");
      // Fallback to local response if API call fails
      return generateLocalResponse(input);
    }
  };

  // Check if this is a conservative question
  const checkConservativeQuestion = (question: string) => {
    const conservativeKeywords = ["risk", "safe", "protect", "guarantee", "guaranteed"];
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
        content: "Sorry, there was a problem processing your request. Please try again." 
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
                OpenAI API Key
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">?</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm">
                    Your API key is temporarily stored in your browser session
                    and is not saved in any database. If you close or reload the page,
                    you'll need to enter it again.
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
              {apiKey ? "API key configured. If you don't have a key, pre-generated responses will be used." : "No API key. Pre-generated responses will be used."}
            </p>
          </div>
        </div>

        <div className="flex flex-col h-[300px]">
          <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-white" ref={scrollAreaRef}>
            {chatHistory.length === 0 ? (
              <div className="text-center text-gsb-muted p-4">
                <p>Start a conversation with the financial assistant.</p>
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
