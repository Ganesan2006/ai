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
  ExternalLink, Download, MessageSquare, Loader2, Youtube,
  Lightbulb, AlertCircle, CheckSquare
} from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface CoursePageProps {
  module: any;
  accessToken: string;
  onBack: () => void;
  onComplete: () => void;
  initialProgress?: any;
  profile?: any;
}

interface TopicContent {
  explanation: string;
  keyPoints: string[];
  applications: string[];
  pitfalls: string[];
  practiceIdeas: string[];
  youtubeVideos: Array<{
    title: string;
    searchUrl: string;
    embedQuery: string;
  }>;
  generatedAt: string;
}

export function CoursePageEnhanced({ module, accessToken, onBack, onComplete, initialProgress, profile }: CoursePageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showChatPrompt, setShowChatPrompt] = useState(false);

  useEffect(() => {
    console.log('CoursePageEnhanced mounted with:', { 
      moduleId: module.id, 
      moduleTitle: module.title,
      topicsCount: module.topics?.length,
      hasProfile: !!profile,
      targetGoal: profile?.targetGoal 
    });
    
    // Load completed topics from progress
    if (initialProgress?.completedTopics) {
      setCompletedTopics(new Set(initialProgress.completedTopics));
    }
  }, [initialProgress, module, profile]);

  const topics = module.topics || [];
  const totalTopics = topics.length;
  const completedCount = completedTopics.size;
  const progressPercentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  // Debug: Show warning if no topics
  useEffect(() => {
    if (totalTopics === 0) {
      console.warn('Module has no topics:', module);
      toast.error('This module has no topics defined. Please check the roadmap data.');
    }
  }, [totalTopics, module]);

  const handleTopicClick = async (topicIndex: number) => {
    const topic = topics[topicIndex];
    console.log('Topic clicked:', { topicIndex, topic, moduleId: module.id });

    setSelectedTopicIndex(topicIndex);
    setActiveTab('content');
    setLoadingContent(true);
    setTopicContent(null);

    try {
      let hasContent = false;

      // Try to get cached content first
      try {
        console.log('Checking for cached content...');
        const cachedData = await api.getTopicContent(module.id, topic, accessToken);
        console.log('Cached data response:', cachedData);

        if (cachedData.content) {
          console.log('Using cached content');
          setTopicContent(cachedData.content);
          hasContent = true;
        }
      } catch (cacheError) {
        console.log('Cache check failed, will generate new content:', cacheError);
      }

      if (!hasContent) {
        console.log('Generating new content with AI...');
        // Generate new content
        const requestData = {
          moduleId: module.id,
          moduleTitle: module.title,
          topic,
          difficulty: module.difficulty,
          targetGoal: profile?.targetGoal || 'Technology Professional'
        };
        console.log('Request data:', requestData);

        const data = await api.generateTopicContent(requestData, accessToken);
        console.log('Generated content response:', data);

        setTopicContent(data.content);
        toast.success('Content generated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to load topic content:', error);
      toast.error(error.message || 'Failed to load topic content. Check console for details.');
    } finally {
      setLoadingContent(false);
    }
  };

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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Learning Content</TabsTrigger>
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

                {/* Topics List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Topics Covered</CardTitle>
                    <CardDescription>Click on any topic to see detailed AI-generated content and YouTube videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topics.map((topic: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
                          onClick={() => handleTopicClick(idx)}
                        >
                          <div className="flex items-center gap-3">
                            {isTopicCompleted(idx) ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                            <span className="font-medium">{topic}</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            handleTopicClick(idx);
                          }}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Learn
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {loadingContent ? (
                  <Card>
                    <CardContent className="py-12 flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                      <p className="text-gray-600">Generating personalized content with AI...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </CardContent>
                  </Card>
                ) : topicContent && selectedTopicIndex !== null ? (
                  <>
                    {/* Topic Title */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl">{topics[selectedTopicIndex]}</h2>
                      <Button
                        onClick={() => handleTopicComplete(selectedTopicIndex)}
                        variant={isTopicCompleted(selectedTopicIndex) ? "secondary" : "default"}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {isTopicCompleted(selectedTopicIndex) ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>

                    {/* Explanation */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Detailed Explanation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{topicContent.explanation}</p>
                      </CardContent>
                    </Card>

                    {/* Key Points */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckSquare className="w-5 h-5" />
                          Key Learning Points
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {topicContent.keyPoints?.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* YouTube Videos */}
                    {topicContent.youtubeVideos && topicContent.youtubeVideos.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-600" />
                            Recommended YouTube Videos
                          </CardTitle>
                          <CardDescription>
                            AI-selected tutorials to help you learn this topic
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {topicContent.youtubeVideos.map((video, idx) => (
                              <Card key={idx} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="p-2 bg-red-100 rounded-lg">
                                        <Youtube className="w-5 h-5 text-red-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{video.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">Search: {video.embedQuery}</p>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => window.open(video.searchUrl, '_blank')}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Watch
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Applications */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Real-World Applications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {topicContent.applications?.map((app, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Common Pitfalls */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          Common Pitfalls to Avoid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {topicContent.pitfalls?.map((pitfall, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span>{pitfall}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Practice Ideas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600" />
                          Practice Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {topicContent.practiceIdeas?.map((idea, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span>{idea}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a topic from the Overview tab to see AI-generated content</p>
                    </CardContent>
                  </Card>
                )}
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

            {/* Study Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Study Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Click on topics to get AI-generated explanations</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Watch recommended YouTube videos for visual learning</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <p>Practice with the suggested exercises</p>
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
