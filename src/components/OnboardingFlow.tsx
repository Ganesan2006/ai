import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

interface OnboardingData {
  background: string;
  currentRole: string;
  yearsOfExperience: string;
  knownSkills: string[];
  targetGoal: string;
  preferredLanguage: string;
  learningPace: string;
  hoursPerWeek: string;
  learningStyle: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  userName: string;
}

const skillOptions = [
  'Python', 'JavaScript', 'Java', 'C++', 'HTML/CSS', 'React', 'Node.js',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Machine Learning', 'Data Analysis',
  'REST APIs', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask'
];

const careerGoals = [
  'Data Scientist',
  'Machine Learning Engineer',
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'AI Engineer',
  'Mobile Developer',
  'Cybersecurity Specialist'
];

export function OnboardingFlow({ onComplete, userName }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    background: '',
    currentRole: '',
    yearsOfExperience: '',
    knownSkills: [],
    targetGoal: '',
    preferredLanguage: '',
    learningPace: '',
    hoursPerWeek: '',
    learningStyle: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      knownSkills: prev.knownSkills.includes(skill)
        ? prev.knownSkills.filter(s => s !== skill)
        : [...prev.knownSkills, skill]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onComplete(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.background && formData.currentRole && formData.yearsOfExperience;
      case 2:
        return formData.targetGoal && formData.preferredLanguage;
      case 3:
        return formData.learningPace && formData.hoursPerWeek;
      case 4:
        return formData.learningStyle;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
          <CardTitle className="text-2xl mt-4">
            {step === 1 && `Welcome, ${userName}! Let's get to know you`}
            {step === 2 && 'Your Learning Goals'}
            {step === 3 && 'Learning Preferences'}
            {step === 4 && 'Final Details'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us about your current background and experience'}
            {step === 2 && 'What do you want to achieve?'}
            {step === 3 && 'How do you prefer to learn?'}
            {step === 4 && 'Just one more thing!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Background */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Educational/Professional Background</Label>
                <Select value={formData.background} onValueChange={(v) => updateField('background', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="ECE">Electronics & Communication</SelectItem>
                    <SelectItem value="EEE">Electrical Engineering</SelectItem>
                    <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                    <SelectItem value="Other Engineering">Other Engineering</SelectItem>
                    <SelectItem value="Non-Engineering">Non-Engineering</SelectItem>
                    <SelectItem value="Self-Taught">Self-Taught</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Current Role/Occupation</Label>
                <Input
                  placeholder="e.g., Student, Software Developer, Career Changer"
                  value={formData.currentRole}
                  onChange={(e) => updateField('currentRole', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Years of Experience in Tech</Label>
                <Select value={formData.yearsOfExperience} onValueChange={(v) => updateField('yearsOfExperience', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Complete Beginner</SelectItem>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Known Technologies/Skills (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg max-h-64 overflow-y-auto">
                  {skillOptions.map(skill => (
                    <Badge
                      key={skill}
                      variant={formData.knownSkills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {formData.knownSkills.length} skill{formData.knownSkills.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Career Goal</Label>
                <Select value={formData.targetGoal} onValueChange={(v) => updateField('targetGoal', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What role are you aiming for?" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerGoals.map(goal => (
                      <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Programming Language</Label>
                <Select value={formData.preferredLanguage} onValueChange={(v) => updateField('preferredLanguage', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your primary language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Learning Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Learning Pace</Label>
                <Select value={formData.learningPace} onValueChange={(v) => updateField('learningPace', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How quickly do you want to learn?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intensive">Intensive (Fast-track, immersive)</SelectItem>
                    <SelectItem value="Moderate">Moderate (Balanced pace)</SelectItem>
                    <SelectItem value="Relaxed">Relaxed (Steady, no rush)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hours Available Per Week</Label>
                <Select value={formData.hoursPerWeek} onValueChange={(v) => updateField('hoursPerWeek', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How much time can you dedicate?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 hours/week</SelectItem>
                    <SelectItem value="10">10 hours/week</SelectItem>
                    <SelectItem value="15">15 hours/week</SelectItem>
                    <SelectItem value="20">20 hours/week</SelectItem>
                    <SelectItem value="30">30+ hours/week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Learning Style */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Learning Style Preference</Label>
                <Select value={formData.learningStyle} onValueChange={(v) => updateField('learningStyle', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How do you learn best?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual (Videos, diagrams, infographics)</SelectItem>
                    <SelectItem value="Hands-on">Hands-on (Coding exercises, projects)</SelectItem>
                    <SelectItem value="Reading">Reading (Articles, documentation, books)</SelectItem>
                    <SelectItem value="Mixed">Mixed (Combination of all styles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Your Profile Summary</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-600">Background:</span> {formData.background}</p>
                  <p><span className="text-gray-600">Target Goal:</span> {formData.targetGoal}</p>
                  <p><span className="text-gray-600">Learning Pace:</span> {formData.learningPace}</p>
                  <p><span className="text-gray-600">Weekly Commitment:</span> {formData.hoursPerWeek} hours</p>
                  <p><span className="text-gray-600">Known Skills:</span> {formData.knownSkills.length} skills</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating your roadmap...
                </>
              ) : step === totalSteps ? (
                'Complete & Generate Roadmap'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
