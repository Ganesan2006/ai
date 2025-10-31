import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, 
  Target, Video, FileText, Code, Brain, Trophy, PlayCircle,
  ExternalLink, Download, MessageSquare
} from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface CoursePageProps {
  module: any;
  accessToken: string;
  onBack: () => void;
  onComplete: () => void;
  initialProgress?: any;
}

export function CoursePage({ module, accessToken, onBack, onComplete, initialProgress }: CoursePageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [showChatPrompt, setShowChatPrompt] = useState(false);

  useEffect(() => {
    // Load completed topics from progress
    if (initialProgress?.completedTopics) {
      setCompletedTopics(new Set(initialProgress.completedTopics));
    }
  }, [initialProgress]);

  const topics = module.topics || [];
  const totalTopics = topics.length;
  const completedCount = completedTopics.size;
  const progressPercentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  const handleTopicComplete = async (topicIndex: number) => {
    const topicId = `${module.id}-topic-${topicIndex}`;
    const newCompleted = new Set(completedTopics);
    
    if (completedTopics.has(topicId)) {
      newCompleted.delete(topicId);
      toast.info('Topic marked as incomplete');
    } else {
      newCompleted.add(topicId);
      toast.success('Topic completed! 🎉');
    }
    
    setCompletedTopics(newCompleted);

    // Save progress to backend
    try {
      await api.updateProgress({
        moduleId: module.id,
        status: newCompleted.size === totalTopics ? 'completed' : 'in-progress',
        completedTopics: Array.from(newCompleted)
      }, accessToken);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleCompleteModule = async () => {
    if (completedCount < totalTopics) {
      toast.error(`Please complete all ${totalTopics} topics before marking the module as complete`);
      return;
    }

    try {
      await api.updateProgress({
        moduleId: module.id,
        status: 'completed',
        completedTopics: Array.from(completedTopics)
      }, accessToken);
      
      toast.success('Module completed! Great work! 🏆');
      onComplete();
    } catch (error) {
      console.error('Failed to complete module:', error);
      toast.error('Failed to mark module as complete');
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

  const isTopicCompleted = (topicIndex: number) => {
    return completedTopics.has(`${module.id}-topic-${topicIndex}`);
  };

  // Sample learning resources for the module
  const learningResources = [
    {
      type: 'video',
      title: 'Introduction Video',
      description: 'Get started with the fundamentals',
      duration: '15 min',
      url: '#'
    },
    {
      type: 'article',
      title: 'Documentation & Guide',
      description: 'Comprehensive written guide',
      duration: '30 min read',
      url: '#'
    },
    {
      type: 'code',
      title: 'Practice Exercises',
      description: 'Hands-on coding challenges',
      duration: '1 hour',
      url: '#'
    },
    {
      type: 'interactive',
      title: 'Interactive Tutorial',
      description: 'Learn by doing with step-by-step guidance',
      duration: '45 min',
      url: '#'
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      case 'interactive': return <PlayCircle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl">{module.title}</h1>
                <p className="text-sm text-gray-600">
                  {completedCount} of {totalTopics} topics completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(module.difficulty)}>
                {module.difficulty}
              </Badge>
              <Button
                onClick={handleCompleteModule}
                disabled={completedCount < totalTopics}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Complete Module
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Module Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Module</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{module.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{module.estimatedHours}h</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Topics</p>
                          <p className="font-medium">{totalTopics}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Difficulty</p>
                          <p className="font-medium capitalize">{module.difficulty}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Objectives */}
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {topics.map((topic: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                    <CardDescription>
                      Recommended knowledge before starting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Basic understanding of programming concepts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Familiarity with previous modules in this roadmap</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      Track your progress through each topic
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {topics.map((topic: string, idx: number) => {
                        const isCompleted = isTopicCompleted(idx);
                        
                        return (
                          <AccordionItem key={idx} value={`topic-${idx}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3 flex-1 text-left">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{topic}</p>
                                  <p className="text-sm text-gray-500">
                                    Topic {idx + 1} of {totalTopics}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-8 pt-2 space-y-4">
                                <p className="text-sm text-gray-600">
                                  Learn about {topic.toLowerCase()} in detail. This topic covers essential concepts
                                  and practical applications.
                                </p>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setActiveTab('resources')}
                                  >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    View Resources
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setShowChatPrompt(true)}
                                  >
                                    <Brain className="w-4 h-4 mr-2" />
                                    Ask AI
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleTopicComplete(idx)}
                                    variant={isCompleted ? "secondary" : "default"}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {isCompleted ? 'Completed' : 'Mark Complete'}
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Resources</CardTitle>
                    <CardDescription>
                      Curated materials to help you master this module
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {learningResources.map((resource, idx) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="font-medium">{resource.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {resource.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      {resource.duration}
                                    </p>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Need more resources?</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Ask the AI Assistant for personalized recommendations based on your learning style.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowChatPrompt(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Notes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Code className="w-4 h-4 mr-2" />
                  Practice Exercises
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>

                <div className="pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Topics completed</span>
                    <span className="font-medium">{completedCount}/{totalTopics}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated time</span>
                    <span className="font-medium">{module.estimatedHours}h</span>
                  </div>
                </div>

                {completedCount === totalTopics && (
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full"
                      onClick={handleCompleteModule}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Complete Module
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Study Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Take breaks every 25-30 minutes to stay focused</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Practice coding examples as you learn concepts</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Use the AI assistant whenever you're stuck</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Prompt Overlay */}
      {showChatPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                The AI Assistant can help you with this module
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Open the AI Assistant from the dashboard header to ask questions about this module,
                get explanations, or request additional resources.
              </p>
              <Button 
                className="w-full"
                onClick={() => setShowChatPrompt(false)}
              >
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
