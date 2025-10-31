import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageSquare, ThumbsUp, User, Search, Plus, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface Post {
  id: string;
  author: string;
  authorInitials: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  timestamp: string;
  tags: string[];
}

interface CommunityForumProps {
  userId: string;
  userName: string;
  accessToken: string;
}

export function CommunityForum({ userId, userName, accessToken }: CommunityForumProps) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      authorInitials: 'SC',
      title: 'Best resources for learning React Hooks?',
      content: 'I\'m transitioning from class components to hooks. Any recommended tutorials or courses?',
      category: 'Frontend Development',
      likes: 12,
      replies: 8,
      timestamp: '2 hours ago',
      tags: ['React', 'JavaScript', 'Hooks']
    },
    {
      id: '2',
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      title: 'How to prepare for Data Science interviews?',
      content: 'I have interviews coming up for DS positions. What topics should I focus on?',
      category: 'Data Science',
      likes: 25,
      replies: 15,
      timestamp: '5 hours ago',
      tags: ['Data Science', 'Interview', 'Career']
    },
    {
      id: '3',
      author: 'Priya Kumar',
      authorInitials: 'PK',
      title: 'Study buddy wanted for ML course',
      content: 'Looking for someone to study Machine Learning fundamentals together. EST timezone preferred.',
      category: 'Study Groups',
      likes: 8,
      replies: 4,
      timestamp: '1 day ago',
      tags: ['Machine Learning', 'Study Group']
    },
    {
      id: '4',
      author: 'Alex Rodriguez',
      authorInitials: 'AR',
      title: 'Confused about async/await in JavaScript',
      content: 'Can someone explain the difference between Promises and async/await? When should I use each?',
      category: 'JavaScript',
      likes: 18,
      replies: 12,
      timestamp: '1 day ago',
      tags: ['JavaScript', 'Async', 'Help']
    }
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = ['All', 'Frontend Development', 'Backend Development', 'Data Science', 'Machine Learning', 'Study Groups', 'Career'];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: userName,
      authorInitials: userName.split(' ').map(n => n[0]).join('').toUpperCase(),
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory || 'General',
      likes: 0,
      replies: 0,
      timestamp: 'Just now',
      tags: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setDialogOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Connect with fellow learners, ask questions, and share knowledge</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Share your question or start a discussion</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="What's your question or topic?"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      placeholder="e.g., Frontend Development"
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      placeholder="Provide more details..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <Button onClick={handleCreatePost} className="w-full">
                    Create Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-3 mt-4">
                <ScrollArea className="h-[600px] pr-4">
                  {filteredPosts.map(post => (
                    <Card key={post.id} className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-medium">{post.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                              </div>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                {post.replies} replies
                              </Button>
                            </div>
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

      {/* Study Buddy Matcher */}
      <Card>
        <CardHeader>
          <CardTitle>Find Study Buddies</CardTitle>
          <CardDescription>Connect with learners on similar paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-gray-600 mt-1">Learning: Full-Stack Development</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">React</Badge>
                      <Badge variant="secondary" className="text-xs">Node.js</Badge>
                    </div>
                    <Button size="sm" className="mt-3 w-full">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-purple-600 text-white">LM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">Lisa Martinez</h4>
                    <p className="text-sm text-gray-600 mt-1">Learning: Data Science</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">Python</Badge>
                      <Badge variant="secondary" className="text-xs">ML</Badge>
                    </div>
                    <Button size="sm" className="mt-3 w-full">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
