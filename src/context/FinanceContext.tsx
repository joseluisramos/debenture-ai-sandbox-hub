
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the client defaults
export const clientDefaults = {
  product: {
    name: "5 Year Economic Development Registered Debentures",
    faceAmount: 50000,
    coupon: 4.0,
    purchaseDate: "June 2023",
    maturityDate: "June 2028",
    currentMarketValue: 51200,
    yieldToMaturity: 3.8
  },
  macroDefaults: {
    interestRateShift: 0,
    inflationRate: 2,
    gdpGrowthProjection: 1.5,
    oilPriceVolatility: 50, // 0-100 scale
  }
};

interface FinanceContextType {
  clientPosition: typeof clientDefaults.product;
  macroSettings: typeof clientDefaults.macroDefaults;
  chatHistory: { role: string; content: string }[];
  alerts: { id: string; message: string; severity: 'info' | 'warning' | 'danger' }[];
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  redeemPercentage: number;
  analysisRecommendation: string | null;
  highVolatilityCount: number;
  conservativeQuestionsCount: number;
  reportVisible: boolean;
  savedAnalysis: any | null;

  // Actions
  updateMacroSettings: (settings: Partial<typeof clientDefaults.macroDefaults>) => void;
  resetToClientDefaults: () => void;
  addChatMessage: (message: { role: string; content: string }) => void;
  clearChatHistory: () => void;
  setRiskProfile: (profile: 'Conservative' | 'Moderate' | 'Aggressive') => void;
  updateRedeemPercentage: (percentage: number) => void;
  setReportVisible: (visible: boolean) => void;
  setAnalysisRecommendation: (recommendation: string | null) => void;
  incrementHighVolatility: () => void;
  incrementConservativeQuestions: () => void;
  saveAnalysis: (data: any) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initialize state with client defaults
  const [clientPosition] = useState(clientDefaults.product);
  const [macroSettings, setMacroSettings] = useState(clientDefaults.macroDefaults);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [alerts, setAlerts] = useState<{ id: string; message: string; severity: 'info' | 'warning' | 'danger' }[]>([]);
  const [riskProfile, setRiskProfile] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [redeemPercentage, setRedeemPercentage] = useState(0);
  const [analysisRecommendation, setAnalysisRecommendation] = useState<string | null>(null);
  const [highVolatilityCount, setHighVolatilityCount] = useState(0);
  const [conservativeQuestionsCount, setConservativeQuestionsCount] = useState(0);
  const [reportVisible, setReportVisible] = useState(false);
  const [savedAnalysis, setSavedAnalysis] = useState<any | null>(null);

  // Update alerts based on slider values
  useEffect(() => {
    const newAlerts = [];

    if (macroSettings.inflationRate > 8) {
      newAlerts.push({
        id: 'inflation-alert',
        message: 'Inflation forecast just jumped above 8%',
        severity: 'danger'
      });
    }

    if (macroSettings.interestRateShift > 1) {
      newAlerts.push({
        id: 'interest-rate-alert',
        message: 'Interest rate shift exceeds +1%',
        severity: 'warning'
      });
    }

    if (clientDefaults.product.coupon < 4.5) {
      newAlerts.push({
        id: 'yield-alert',
        message: `Your 5-year yield (${clientDefaults.product.coupon}%) is 0.5% below market average`,
        severity: 'info'
      });
    }

    setAlerts(newAlerts);
  }, [macroSettings]);

  // Update risk profile based on behavior
  useEffect(() => {
    if (highVolatilityCount >= 3) {
      setRiskProfile('Aggressive');
      setHighVolatilityCount(0);
    } else if (conservativeQuestionsCount >= 3) {
      setRiskProfile('Conservative');
      setConservativeQuestionsCount(0);
    }
  }, [highVolatilityCount, conservativeQuestionsCount]);

  // Load saved analysis from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedAnalysis');
    if (savedData) {
      setSavedAnalysis(JSON.parse(savedData));
    }
  }, []);

  // Functions for updating state
  const updateMacroSettings = (settings: Partial<typeof clientDefaults.macroDefaults>) => {
    setMacroSettings(prev => ({ ...prev, ...settings }));
  };

  const resetToClientDefaults = () => {
    setMacroSettings(clientDefaults.macroDefaults);
    setAnalysisRecommendation(null);
  };

  const addChatMessage = (message: { role: string; content: string }) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const updateRedeemPercentage = (percentage: number) => {
    setRedeemPercentage(percentage);
  };

  const incrementHighVolatility = () => {
    setHighVolatilityCount(prev => prev + 1);
  };

  const incrementConservativeQuestions = () => {
    setConservativeQuestionsCount(prev => prev + 1);
  };

  const saveAnalysis = (data: any) => {
    setSavedAnalysis(data);
    localStorage.setItem('savedAnalysis', JSON.stringify(data));
  };

  return (
    <FinanceContext.Provider
      value={{
        clientPosition,
        macroSettings,
        chatHistory,
        alerts,
        riskProfile,
        redeemPercentage,
        analysisRecommendation,
        highVolatilityCount,
        conservativeQuestionsCount,
        reportVisible,
        savedAnalysis,
        updateMacroSettings,
        resetToClientDefaults,
        addChatMessage,
        clearChatHistory,
        setRiskProfile,
        updateRedeemPercentage,
        setReportVisible,
        setAnalysisRecommendation,
        incrementHighVolatility,
        incrementConservativeQuestions,
        saveAnalysis,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
