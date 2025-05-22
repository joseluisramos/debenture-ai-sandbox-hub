
import { Button } from "@/components/ui/button";

const WelcomeBar = () => {
  return (
    <div className="bg-gsb-accent border-b border-gray-200 w-full">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gsb-primary">Welcome, Joe</h1>
        </div>
        <div>
          <Button 
            variant="outline" 
            className="border-gsb-primary text-gsb-primary opacity-70 cursor-not-allowed" 
            disabled={true}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Customize
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBar;
