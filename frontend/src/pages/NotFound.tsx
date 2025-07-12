import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-sunset rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-primary rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-secondary rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="text-center relative z-10 max-w-lg mx-auto">
        <Card className="shadow-elegant border-primary/20 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* 404 with animated gradient */}
            <div className="mb-6">
              <h1 className="text-8xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent animate-pulse">
                404
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-primary animate-bounce" />
                <p className="text-2xl font-semibold text-foreground">Oops! Page Not Found</p>
                <Zap className="w-6 h-6 text-primary animate-bounce" style={{animationDelay: '0.5s'}} />
              </div>
              <p className="text-muted-foreground mb-8 text-lg">
                The page you're looking for has wandered off into the digital void. 
                Let's get you back on track! 🚀
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <Button asChild variant="sunset" size="lg" className="w-full">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Return to Home
                </Link>
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="warm" className="flex-1">
                  <Link to="/questions">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Questions
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/ask">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ask a Question
                  </Link>
                </Button>
              </div>
            </div>

            {/* Helpful message */}
            <div className="mt-8 p-4 bg-accent/50 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> If you think this is a mistake, please check the URL or contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;