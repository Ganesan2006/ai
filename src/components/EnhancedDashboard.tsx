import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, LogOut, MessageSquare, BookOpen, Users, 
  Trophy, Code, GraduationCap, TrendingUp, CheckCircle2, Clock, Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { ChatAssistant } from './ChatAssistant';
import { CodeEditor } from './CodeEditor';
import { AssessmentQuiz } from './AssessmentQuiz';
import { CommunityForum } from './CommunityForum';
import { ResourceLibrary } from './ResourceLibrary';
import { AchievementSystem } from './AchievementSystem';
import { Dashboard as RoadmapDashboard } from './Dashboard';

interface EnhancedDashboardProps {
  profile: any;
  roadmap: any;
  progress: any[];
  onRefresh: () => void;
  onModuleClick?: (module: any) => void;
}

export function EnhancedDashboard({ profile, roadmap, progress, onRefresh, onModuleClick }: EnhancedDashboardProps) {
  const { user, signOut } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState('roadmap');

  useEffect(() => {
    const getToken = async () => {
      const session = await (await import('../utils/supabase/client')).supabase.auth.getSession();
      setAccessToken(session.data.session?.access_token || '');
    };
    getToken();
  }, []);

  const roadmapContent = roadmap?.content;
  const phases = roadmapContent?.phases || [];

  // Calculate stats
  const totalModules = phases.reduce((sum: number, phase: any) => 
    sum + (phase.modules?.length || 0), 0);
  const completedModules = progress.filter(p => p.status === 'completed').length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const currentStreak = 3; // Mock value - would be calculated from actual activity

  // Sample coding challenge
  const sampleChallenge = {
    id: 'challenge-1',
    title: 'FizzBuzz Challenge',
    description: 'Write a function that prints numbers from 1 to 100. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    difficulty: 'Easy',
    starterCode: `function fizzBuzz() {\n  // Write your code here\n  \n}\n\nfizzBuzz();`,
    solution: `function fizzBuzz() {\n  for (let i = 1; i <= 100; i++) {\n    if (i % 15 === 0) console.log("FizzBuzz");\n    else if (i % 3 === 0) console.log("Fizz");\n    else if (i % 5 === 0) console.log("Buzz");\n    else console.log(i);\n  }\n}`,
    testCases: [
      { input: '1', expectedOutput: '1' },
      { input: '3', expectedOutput: 'Fizz' },
      { input: '5', expectedOutput: 'Buzz' },
      { input: '15', expectedOutput: 'FizzBuzz' }
    ],
    hints: [
      'Use the modulo operator (%) to check if a number is divisible',
      'Check for multiples of 15 first (both 3 and 5)',
      'Use a for loop to iterate from 1 to 100'
    ]
  };

  // Sample quiz questions
  const sampleQuestions = [
    {
      id: 'q1',
      question: 'What is the correct syntax for declaring a variable in JavaScript?',
      options: [
        'variable x = 5;',
        'let x = 5;',
        'var x := 5;',
        'x = 5;'
      ],
      correctAnswer: 1,
      explanation: 'In modern JavaScript, "let" is the preferred way to declare variables. "var" is also valid but less commonly used in modern code.'
    },
    {
      id: 'q2',
      question: 'Which of the following is NOT a JavaScript data type?',
      options: [
        'String',
        'Boolean',
        'Integer',
        'Undefined'
      ],
      correctAnswer: 2,
      explanation: 'JavaScript uses "Number" for all numeric values, not separate Integer and Float types.'
    },
    {
      id: 'q3',
      question: 'What does the "===" operator do in JavaScript?',
      options: [
        'Assigns a value',
        'Compares values only',
        'Compares both value and type',
        'Creates a new variable'
      ],
      correctAnswer: 2,
      explanation: 'The "===" operator performs strict equality comparison, checking both value and type.'
    }
  ];

  const handleAssessmentComplete = async (score: number, results: any) => {
    console.log('Assessment completed with score:', score);
    // In a real app, save to backend
  };

  const handleChallengeComplete = async (challengeId: string) => {
    console.log('Challenge completed:', challengeId);
    // In a real app, save to backend
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Loading your learning journey...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold">LearnMentor AI</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">Welcome back, {profile.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-2xl">{Math.round(overallProgress)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Modules Completed</p>
                  <p className="text-2xl">{completedModules}/{totalModules}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Invested</p>
                  <p className="text-2xl">{Math.round(totalTimeSpent)}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Target Goal</p>
                  <p className="text-lg">{profile.targetGoal}</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap">
            <RoadmapDashboard
              profile={profile}
              roadmap={roadmap}
              progress={progress}
              onRefresh={onRefresh}
              onModuleClick={onModuleClick}
            />
          </TabsContent>

          <TabsContent value="practice">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Coding Challenges</h2>
                <p className="text-gray-600">Practice your skills with hands-on coding exercises</p>
              </div>
              <CodeEditor
                challenge={sampleChallenge}
                onComplete={handleChallengeComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="assessments">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Module Assessment</h2>
                <p className="text-gray-600">Test your knowledge and track your progress</p>
              </div>
              <AssessmentQuiz
                moduleId="module-1"
                moduleName="JavaScript Fundamentals"
                questions={sampleQuestions}
                onComplete={handleAssessmentComplete}
              />
            </div>
          </TabsContent>

          <TabsContent value="community">
            <CommunityForum
              userId={user?.id || ''}
              userName={profile.name}
              accessToken={accessToken}
            />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceLibrary
              userId={user?.id || ''}
              targetGoal={profile.targetGoal}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem
              userId={user?.id || ''}
              completedModules={completedModules}
              totalTimeSpent={totalTimeSpent}
              currentStreak={currentStreak}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Assistant */}
      {chatOpen && (
        <ChatAssistant
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}
