import { Link } from "react-router-dom";
import { Sparkles, MessageSquareText, Users, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      <div className="relative overflow-hidden">
        {/* Hero Section with Floating Elements */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-warm rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-sunset rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-warm bg-clip-text text-transparent">
                StackIt
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Where curiosity meets expertise. Ask, learn, and grow with the most vibrant developer community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild variant="sunset" size="lg" className="text-lg px-8 py-6">
                  <Link to="/questions">
                    Explore Questions
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="warm" size="lg" className="text-lg px-8 py-6">
                  <Link to="/ask">
                    Ask Your First Question
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-warm hover:scale-105 transition-all duration-300 border-primary/20">
                <CardContent className="p-8 text-center">
                  <MessageSquareText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">50K+</h3>
                  <p className="text-muted-foreground">Questions Answered</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-warm hover:scale-105 transition-all duration-300 border-primary/20">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">25K+</h3>
                  <p className="text-muted-foreground">Active Developers</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-warm hover:scale-105 transition-all duration-300 border-primary/20">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">95%</h3>
                  <p className="text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                Why Choose StackIt?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the most engaging and rewarding Q&A platform designed for modern developers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-elegant hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
                  <p className="text-muted-foreground">Get answers in minutes, not hours. Our AI-powered matching connects you with the right experts instantly.</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-elegant hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-sunset rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Expert Community</h3>
                  <p className="text-muted-foreground">Learn from seasoned professionals and contribute your knowledge to help others grow.</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-elegant hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Gamified Learning</h3>
                  <p className="text-muted-foreground">Earn reputation, unlock achievements, and level up your coding skills through meaningful contributions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-warm relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-sunset rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-primary rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Start your journey today and become part of the most innovative developer community.
            </p>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/signup">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;