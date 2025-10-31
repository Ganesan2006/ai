import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  BookOpen, Video, FileText, Code, Bookmark, 
  ExternalLink, Search, Star, Clock 
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'documentation' | 'book';
  url: string;
  author: string;
  duration?: string;
  rating: number;
  tags: string[];
  difficulty: string;
  bookmarked: boolean;
}

interface ResourceLibraryProps {
  userId: string;
  targetGoal: string;
}

export function ResourceLibrary({ userId, targetGoal }: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'React - The Complete Guide',
      description: 'Learn React from scratch with hooks, context, and advanced patterns',
      type: 'course',
      url: 'https://www.udemy.com/course/react-the-complete-guide',
      author: 'Maximilian Schwarzmüller',
      duration: '48 hours',
      rating: 4.8,
      tags: ['React', 'JavaScript', 'Frontend'],
      difficulty: 'Intermediate',
      bookmarked: false
    },
    {
      id: '2',
      title: 'Python for Data Science Handbook',
      description: 'Essential tools for working with data in Python',
      type: 'book',
      url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
      author: 'Jake VanderPlas',
      rating: 4.9,
      tags: ['Python', 'Data Science', 'NumPy', 'Pandas'],
      difficulty: 'Beginner',
      bookmarked: true
    },
    {
      id: '3',
      title: 'Understanding Async JavaScript',
      description: 'Deep dive into promises, async/await, and event loop',
      type: 'article',
      url: 'https://javascript.info/async',
      author: 'javascript.info',
      duration: '30 min read',
      rating: 4.7,
      tags: ['JavaScript', 'Async', 'Promises'],
      difficulty: 'Intermediate',
      bookmarked: false
    },
    {
      id: '4',
      title: 'Machine Learning Crash Course',
      description: 'Google\'s fast-paced, practical introduction to ML',
      type: 'course',
      url: 'https://developers.google.com/machine-learning/crash-course',
      author: 'Google',
      duration: '15 hours',
      rating: 4.8,
      tags: ['Machine Learning', 'TensorFlow', 'Python'],
      difficulty: 'Beginner',
      bookmarked: true
    },
    {
      id: '5',
      title: 'REST API Design Best Practices',
      description: 'Learn how to design scalable and maintainable REST APIs',
      type: 'article',
      url: 'https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/',
      author: 'Stack Overflow',
      duration: '20 min read',
      rating: 4.6,
      tags: ['API', 'Backend', 'REST'],
      difficulty: 'Intermediate',
      bookmarked: false
    },
    {
      id: '6',
      title: 'Complete SQL Bootcamp',
      description: 'Master SQL for data analysis and database management',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
      author: 'freeCodeCamp',
      duration: '4 hours',
      rating: 4.7,
      tags: ['SQL', 'Database', 'Data Analysis'],
      difficulty: 'Beginner',
      bookmarked: false
    },
    {
      id: '7',
      title: 'TypeScript Documentation',
      description: 'Official TypeScript handbook and reference',
      type: 'documentation',
      url: 'https://www.typescriptlang.org/docs/',
      author: 'Microsoft',
      rating: 4.9,
      tags: ['TypeScript', 'JavaScript', 'Documentation'],
      difficulty: 'All Levels',
      bookmarked: true
    },
    {
      id: '8',
      title: 'Docker Tutorial for Beginners',
      description: 'Learn containerization from basics to deployment',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      author: 'freeCodeCamp',
      duration: '3 hours',
      rating: 4.8,
      tags: ['Docker', 'DevOps', 'Containers'],
      difficulty: 'Beginner',
      bookmarked: false
    }
  ]);

  const toggleBookmark = (resourceId: string) => {
    setResources(resources.map(r =>
      r.id === resourceId ? { ...r, bookmarked: !r.bookmarked } : r
    ));
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-600" />;
      case 'article': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'course': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'documentation': return <Code className="w-5 h-5 text-purple-600" />;
      case 'book': return <BookOpen className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bookmarkedResources = filteredResources.filter(r => r.bookmarked);
  const recommendedResources = filteredResources.filter(r =>
    r.tags.some(tag => targetGoal.toLowerCase().includes(tag.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
        <CardDescription>
          Curated learning materials for your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All Resources ({filteredResources.length})
              </TabsTrigger>
              <TabsTrigger value="bookmarked">
                Bookmarked ({bookmarkedResources.length})
              </TabsTrigger>
              <TabsTrigger value="recommended">
                Recommended ({recommendedResources.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              <ScrollArea className="h-[600px] pr-4">
                {filteredResources.map(resource => (
                  <Card key={resource.id} className="mb-3 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(resource.id)}
                            >
                              <Bookmark
                                className={`w-4 h-4 ${resource.bookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{resource.author}</span>
                            {resource.duration && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {resource.duration}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {resource.type}
                            </Badge>
                            {resource.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Resource
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bookmarked" className="space-y-3 mt-4">
              <ScrollArea className="h-[600px] pr-4">
                {bookmarkedResources.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No bookmarked resources yet</p>
                    <p className="text-sm mt-2">Click the bookmark icon to save resources for later</p>
                  </div>
                ) : (
                  bookmarkedResources.map(resource => (
                    <Card key={resource.id} className="mb-3">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Access Resource
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-3 mt-4">
              <ScrollArea className="h-[600px] pr-4">
                {recommendedResources.map(resource => (
                  <Card key={resource.id} className="mb-3 border-2 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <h4 className="font-medium flex-1">{resource.title}</h4>
                            <Badge className="bg-blue-600">Recommended</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Resource
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
