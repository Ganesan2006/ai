import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  BookOpen, Clock, Target, TrendingUp, Award, 
  CheckCircle2, Circle, PlayCircle, Brain, LogOut, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { ChatAssistant } from './ChatAssistant';

interface DashboardProps {
  profile: any;
  roadmap: any;
  progress: any[];
  onRefresh: () => void;
  onModuleClick?: (module: any) => void;
}

export function Dashboard({ profile, roadmap, progress, onRefresh, onModuleClick }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {
    const getToken = async () => {
      const session = await (await import('../utils/supabase/client')).supabase.auth.getSession();
      setAccessToken(session.data.session?.access_token || '');
    };
    getToken();
  }, []);

  const roadmapContent = roadmap?.content;
  const phases = roadmapContent?.phases || [];

  // Calculate overall progress
  const totalModules = phases.reduce((sum: number, phase: any) => 
    sum + (phase.modules?.length || 0), 0);
  const completedModules = progress.filter(p => p.status === 'completed').length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  // Calculate total time spent
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId);
  };

  const handleStartModule = async (module: any) => {
    // If onModuleClick is provided, use it to navigate to course page
    if (onModuleClick) {
      const moduleProgress = getModuleProgress(module.id);
      if (!moduleProgress || moduleProgress.status === 'not-started') {
        try {
          await api.updateProgress(
            { moduleId: module.id, status: 'in-progress' },
            accessToken
          );
          onRefresh();
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      }
      onModuleClick(module);
    } else {
      // Fallback to old behavior
      setSelectedModule(module);
      const moduleProgress = getModuleProgress(module.id);
      if (!moduleProgress || moduleProgress.status === 'not-started') {
        try {
          await api.updateProgress(
            { moduleId: module.id, status: 'in-progress' },
            accessToken
          );
          onRefresh();
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      }
    }
  };

  const handleCompleteModule = async (moduleId: string) => {
    try {
      await api.updateProgress(
        { moduleId, status: 'completed' },
        accessToken
      );
      setSelectedModule(null);
      onRefresh();
    } catch (error) {
      console.error('Failed to complete module:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (moduleId: string) => {
    const moduleProgress = getModuleProgress(moduleId);
    if (moduleProgress?.status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    } else if (moduleProgress?.status === 'in-progress') {
      return <PlayCircle className="w-5 h-5 text-blue-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Roadmap Found</CardTitle>
            <CardDescription>
              We couldn't find a learning roadmap for your account. This might happen if:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Your profile setup is incomplete</li>
              <li>The roadmap generation is still in progress</li>
              <li>There was an error during generation</li>
            </ul>
            <Button onClick={onRefresh} className="w-full">
              Refresh Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Roadmap */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Roadmap</CardTitle>
                <CardDescription>
                  {roadmapContent.totalEstimatedWeeks} weeks • {totalModules} modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {phases.map((phase: any, idx: number) => (
                      <div key={phase.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg">{phase.title}</h3>
                            <p className="text-sm text-gray-600">{phase.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Estimated: {phase.estimatedWeeks} weeks
                            </p>
                          </div>
                        </div>

                        <div className="ml-5 pl-5 border-l-2 border-gray-200 space-y-3">
                          {phase.modules?.map((module: any) => {
                            const moduleProgress = getModuleProgress(module.id);
                            const isActive = selectedModule?.id === module.id;
                            
                            return (
                              <Card
                                key={module.id}
                                className={`cursor-pointer transition-all ${
                                  isActive ? 'ring-2 ring-blue-600' : 'hover:shadow-md'
                                }`}
                                onClick={() => handleStartModule(module)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    {getStatusIcon(module.id)}
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium">{module.title}</h4>
                                        <Badge className={getDifficultyColor(module.difficulty)}>
                                          {module.difficulty}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {module.description}
                                      </p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {module.estimatedHours}h
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <BookOpen className="w-3 h-3" />
                                          {module.topics?.length || 0} topics
                                        </span>
                                      </div>
                                      {moduleProgress && moduleProgress.status !== 'not-started' && (
                                        <div className="mt-2">
                                          <Badge variant="outline">
                                            {moduleProgress.status === 'completed' ? 'Completed' : 'In Progress'}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Module Details / Skills */}
          <div className="space-y-6">
            {selectedModule ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedModule.title}</CardTitle>
                  <CardDescription>Module Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Topics Covered:</h4>
                    <ul className="space-y-1">
                      {selectedModule.topics?.map((topic: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Learning Resources:</h4>
                    <p className="text-sm text-gray-600">
                      Use the AI Chat Assistant to get personalized resource recommendations
                      and ask questions about this module.
                    </p>
                  </div>

                  <div className="pt-4 space-y-2">
                    {getModuleProgress(selectedModule.id)?.status !== 'completed' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleCompleteModule(selectedModule.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setChatOpen(true)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Ask AI About This Module
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Skills to Master</CardTitle>
                  <CardDescription>Target competencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {roadmapContent.skillsToMaster?.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span>Keep up the great work!</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Learning pace: {profile.learningPace}</p>
                  <p>• Weekly commitment: {profile.hoursPerWeek}h</p>
                  <p>• Preferred style: {profile.learningStyle}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
