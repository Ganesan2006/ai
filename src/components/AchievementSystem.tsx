import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { 
  Award, Trophy, Target, Zap, Star, BookOpen, 
  Code, TrendingUp, Users, Clock, Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

interface AchievementSystemProps {
  userId: string;
  completedModules: number;
  totalTimeSpent: number;
  currentStreak: number;
}

export function AchievementSystem({ 
  userId, 
  completedModules, 
  totalTimeSpent,
  currentStreak 
}: AchievementSystemProps) {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first learning module',
      icon: 'star',
      unlocked: completedModules >= 1,
      unlockedDate: completedModules >= 1 ? 'Yesterday' : undefined,
      category: 'Progress',
      rarity: 'common',
      xp: 100
    },
    {
      id: '2',
      title: 'Quick Learner',
      description: 'Complete 5 modules',
      icon: 'zap',
      unlocked: completedModules >= 5,
      unlockedDate: completedModules >= 5 ? '3 days ago' : undefined,
      category: 'Progress',
      rarity: 'common',
      xp: 250
    },
    {
      id: '3',
      title: 'Dedicated Student',
      description: 'Maintain a 7-day learning streak',
      icon: 'flame',
      unlocked: currentStreak >= 7,
      unlockedDate: currentStreak >= 7 ? 'Today' : undefined,
      category: 'Consistency',
      rarity: 'rare',
      xp: 500
    },
    {
      id: '4',
      title: 'Marathon Runner',
      description: 'Spend 50 hours learning',
      icon: 'clock',
      unlocked: totalTimeSpent >= 50,
      category: 'Time',
      rarity: 'rare',
      xp: 500
    },
    {
      id: '5',
      title: 'Code Warrior',
      description: 'Complete 20 coding challenges',
      icon: 'code',
      unlocked: false,
      category: 'Practice',
      rarity: 'epic',
      xp: 750
    },
    {
      id: '6',
      title: 'Quiz Master',
      description: 'Score 100% on 5 assessments',
      icon: 'trophy',
      unlocked: false,
      category: 'Assessment',
      rarity: 'epic',
      xp: 750
    },
    {
      id: '7',
      title: 'Community Helper',
      description: 'Answer 10 forum questions',
      icon: 'users',
      unlocked: false,
      category: 'Community',
      rarity: 'rare',
      xp: 500
    },
    {
      id: '8',
      title: 'Goal Achiever',
      description: 'Complete your entire learning roadmap',
      icon: 'target',
      unlocked: false,
      category: 'Progress',
      rarity: 'legendary',
      xp: 2000
    },
    {
      id: '9',
      title: 'Speedster',
      description: 'Complete a module in under 2 hours',
      icon: 'zap',
      unlocked: false,
      category: 'Speed',
      rarity: 'rare',
      xp: 400
    },
    {
      id: '10',
      title: 'Bookworm',
      description: 'Read 25 articles from the resource library',
      icon: 'book',
      unlocked: false,
      category: 'Learning',
      rarity: 'common',
      xp: 300
    }
  ];

  const totalXP = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);

  const level = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = level * 1000;
  const xpProgress = (totalXP % 1000) / 10;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      star: Star,
      zap: Zap,
      flame: Flame,
      clock: Clock,
      code: Code,
      trophy: Trophy,
      users: Users,
      target: Target,
      book: BookOpen,
      trending: TrendingUp
    };
    const Icon = icons[iconName] || Award;
    return <Icon className="w-6 h-6" />;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Level {level}</CardTitle>
              <CardDescription>{totalXP} Total XP Earned</CardDescription>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{totalXP % 1000} / 1000 XP</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unlockedCount}</div>
              <div className="text-xs text-gray-600">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentStreak}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            {unlockedCount} of {achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <Card
                  key={achievement.id}
                  className={`border-2 transition-all ${
                    achievement.unlocked
                      ? getRarityColor(achievement.rarity)
                      : 'opacity-50 grayscale'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {getIcon(achievement.icon)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.unlocked && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getRarityBadgeColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline">
                            +{achievement.xp} XP
                          </Badge>
                          <Badge variant="secondary">
                            {achievement.category}
                          </Badge>
                        </div>

                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-xs text-gray-500">
                            Unlocked {achievement.unlockedDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Challenges</CardTitle>
          <CardDescription>Complete these to earn bonus XP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-600">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">Study for 30 minutes</h4>
                    <p className="text-sm text-gray-600">0 / 30 minutes</p>
                  </div>
                  <Badge>+50 XP</Badge>
                </div>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">Complete 1 coding challenge</h4>
                    <p className="text-sm text-gray-600">0 / 1 completed</p>
                  </div>
                  <Badge>+100 XP</Badge>
                </div>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">Help 1 community member</h4>
                    <p className="text-sm text-gray-600">0 / 1 helped</p>
                  </div>
                  <Badge>+75 XP</Badge>
                </div>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
