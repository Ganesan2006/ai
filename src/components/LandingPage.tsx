import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Brain, Target, TrendingUp, Award, Users, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnMentor AI
            </span>
          </div>
          <Button onClick={onGetStarted} size="lg">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI-Powered Personalized Learning</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Personal AI Mentor for Career Transformation
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a customized learning roadmap powered by AI, designed specifically for your background, 
            goals, and learning pace. Transform your career with intelligent guidance.
          </p>
          
          <div className="flex gap-4 justify-center pt-6">
            <Button onClick={onGetStarted} size="lg" className="text-lg px-8">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl text-center mb-12">
          Why Choose LearnMentor AI?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2">Personalized Roadmaps</h3>
              <p className="text-gray-600">
                AI generates custom learning paths based on your unique background, skills, and career goals
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2">AI Chatbot Mentor</h3>
              <p className="text-gray-600">
                24/7 AI assistant to answer questions, debug code, and provide personalized learning guidance
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Visual analytics and insights to monitor your learning journey and stay motivated
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl mb-2">Adaptive Learning</h3>
              <p className="text-gray-600">
                System adjusts difficulty based on your performance and identifies areas needing review
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl mb-2">Community Support</h3>
              <p className="text-gray-600">
                Connect with peers on similar learning paths and collaborate on projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl mb-2">Career Support</h3>
              <p className="text-gray-600">
                Resume tips, interview prep, and portfolio projects tailored to your target role
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h3 className="text-xl mb-2">Create Profile</h3>
              <p className="text-blue-100">
                Tell us about your background, skills, and career goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h3 className="text-xl mb-2">Get AI Roadmap</h3>
              <p className="text-blue-100">
                Receive a personalized learning path generated by AI
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h3 className="text-xl mb-2">Learn & Practice</h3>
              <p className="text-blue-100">
                Follow your roadmap with interactive content and projects
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                4
              </div>
              <h3 className="text-xl mb-2">Track Progress</h3>
              <p className="text-blue-100">
                Monitor your growth and achieve your career goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl">Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-600">
            Join thousands of learners who are achieving their career goals with AI-powered guidance
          </p>
          <Button onClick={onGetStarted} size="lg" className="text-lg px-12">
            Start Learning Now - It's Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 LearnMentor AI. Powered by AI to democratize personalized learning.</p>
        </div>
      </footer>
    </div>
  );
}
