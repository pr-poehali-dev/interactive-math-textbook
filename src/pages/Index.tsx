import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  emoji: string;
}

interface Task {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const topics: Topic[] = [
  { id: 'addition', title: 'Сложение', icon: 'Plus', color: 'from-orange-400 to-orange-600', emoji: '➕' },
  { id: 'subtraction', title: 'Вычитание', icon: 'Minus', color: 'from-purple-400 to-purple-600', emoji: '➖' },
  { id: 'multiplication', title: 'Умножение', icon: 'X', color: 'from-blue-400 to-blue-600', emoji: '✖️' },
  { id: 'geometry', title: 'Геометрия', icon: 'Box', color: 'from-green-400 to-green-600', emoji: '🔷' },
  { id: 'logic', title: 'Логика', icon: 'Brain', color: 'from-pink-400 to-pink-600', emoji: '🧩' },
  { id: 'patterns', title: 'Числовые ряды', icon: 'ArrowRight', color: 'from-yellow-400 to-yellow-600', emoji: '🔢' },
];

const tasks: Record<string, Task[]> = {
  addition: [
    {
      id: 1,
      question: 'Сколько будет 5 + 3?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      explanation: '5 яблок + 3 яблока = 8 яблок! 🍎'
    },
    {
      id: 2,
      question: 'Реши задачу: У Маши было 4 конфеты, мама дала ещё 6. Сколько конфет стало?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 2,
      explanation: '4 + 6 = 10 конфет! 🍬'
    }
  ],
  subtraction: [
    {
      id: 1,
      question: 'Сколько будет 9 - 4?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      explanation: '9 - 4 = 5. Молодец! 🌟'
    },
    {
      id: 2,
      question: 'У Пети было 12 шариков, 5 улетело. Сколько осталось?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 1,
      explanation: '12 - 5 = 7 шариков осталось! 🎈'
    }
  ],
  multiplication: [
    {
      id: 1,
      question: 'Сколько будет 3 × 4?',
      options: ['10', '11', '12', '13'],
      correctAnswer: 2,
      explanation: '3 × 4 = 12. Это как 3 группы по 4! ⭐'
    },
    {
      id: 2,
      question: 'В коробке 5 рядов конфет, в каждом по 2 конфеты. Сколько всего?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 2,
      explanation: '5 × 2 = 10 конфет! 🍭'
    }
  ],
  geometry: [
    {
      id: 1,
      question: 'Сколько углов у треугольника?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
      explanation: 'У треугольника 3 угла! 📐'
    },
    {
      id: 2,
      question: 'Какая фигура имеет 4 равные стороны?',
      options: ['Треугольник', 'Круг', 'Квадрат', 'Прямоугольник'],
      correctAnswer: 2,
      explanation: 'Квадрат имеет 4 равные стороны! 🟦'
    }
  ],
  logic: [
    {
      id: 1,
      question: 'Продолжи закономерность: 🔴 🔵 🔴 🔵 🔴 ?',
      options: ['🔴', '🔵', '🟡', '🟢'],
      correctAnswer: 1,
      explanation: 'Цвета чередуются: красный, синий! 🎨'
    },
    {
      id: 2,
      question: 'Какое число лишнее: 2, 4, 6, 7, 8?',
      options: ['2', '4', '7', '8'],
      correctAnswer: 2,
      explanation: '7 - нечётное число, остальные чётные! 🧮'
    }
  ],
  patterns: [
    {
      id: 1,
      question: 'Какое число продолжит ряд: 2, 4, 6, 8, ?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Добавляем по 2: следующее число 10! 📊'
    },
    {
      id: 2,
      question: 'Найди закономерность: 1, 3, 5, 7, ?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 1,
      explanation: 'Это нечётные числа: следующее 9! 🔢'
    }
  ]
};

export default function Index() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { toast } = useToast();

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentTaskIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const currentTasks = selectedTopic ? tasks[selectedTopic] : [];
    const currentTask = currentTasks[currentTaskIndex];
    
    if (answerIndex === currentTask.correctAnswer) {
      setScore(score + 1);
      toast({
        title: '🎉 Правильно!',
        description: currentTask.explanation,
        className: 'bg-green-100 border-green-400'
      });
    } else {
      toast({
        title: '😊 Попробуй ещё раз!',
        description: currentTask.explanation,
        variant: 'destructive'
      });
    }
    
    setShowExplanation(true);
  };

  const handleNextTask = () => {
    const currentTasks = selectedTopic ? tasks[selectedTopic] : [];
    if (currentTaskIndex < currentTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      toast({
        title: '🏆 Молодец!',
        description: `Ты набрал ${score + (selectedAnswer === currentTasks[currentTaskIndex].correctAnswer ? 1 : 0)} из ${currentTasks.length} звёзд!`,
        className: 'bg-yellow-100 border-yellow-400'
      });
      setSelectedTopic(null);
    }
  };

  const currentTasks = selectedTopic ? tasks[selectedTopic] : [];
  const currentTask = currentTasks[currentTaskIndex];
  const progress = selectedTopic ? ((currentTaskIndex + 1) / currentTasks.length) * 100 : 0;

  if (selectedTopic && currentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedTopic(null)}
              className="mb-4"
            >
              <Icon name="ArrowLeft" className="mr-2" />
              Назад к темам
            </Button>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Вопрос {currentTaskIndex + 1} из {currentTasks.length}
                </span>
                <div className="flex items-center gap-2">
                  <Icon name="Star" className="text-yellow-500" size={20} />
                  <span className="font-bold text-lg">{score}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <Card className="shadow-2xl border-4 border-white animate-scale-in">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {currentTask.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTask.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`h-24 text-xl font-semibold transition-all transform hover:scale-105 ${
                      selectedAnswer === index
                        ? index === currentTask.correctAnswer
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-8 text-center animate-scale-in">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-4">
                    <p className="text-lg font-medium">{currentTask.explanation}</p>
                  </div>
                  <Button
                    onClick={handleNextTask}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg px-8"
                  >
                    {currentTaskIndex < currentTasks.length - 1 ? 'Следующий вопрос' : 'Завершить'} 
                    <Icon name="ArrowRight" className="ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 animate-scale-in">
          <div className="mb-6 flex justify-center gap-4">
            <img 
              src="https://cdn.poehali.dev/projects/1584b6d4-3776-4249-97fc-ef803b57bdd3/files/8d68f3ce-0890-40fe-a912-2c513195372a.jpg" 
              alt="Лисёнок" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain animate-bounce-soft"
            />
            <img 
              src="https://cdn.poehali.dev/projects/1584b6d4-3776-4249-97fc-ef803b57bdd3/files/52ef05a5-028a-4d1f-ac09-fcc23c1696dd.jpg" 
              alt="Сова" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain animate-bounce-soft" 
              style={{ animationDelay: '0.2s' }}
            />
            <img 
              src="https://cdn.poehali.dev/projects/1584b6d4-3776-4249-97fc-ef803b57bdd3/files/ea7689eb-de20-4d27-874d-571892ada841.jpg" 
              alt="Медвежонок" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain animate-bounce-soft" 
              style={{ animationDelay: '0.4s' }}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Математика — это весело! 🎓
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">
            Выбери тему и начни приключение в мире чисел!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-white animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleTopicSelect(topic.id)}
            >
              <CardContent className="p-6">
                <div className={`w-full h-32 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-6xl">{topic.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-center text-foreground mb-2">
                  {topic.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="PlayCircle" size={20} />
                  <span className="text-sm font-medium">2 задания</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <Card className="inline-block bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-foreground/70">
                <Icon name="Sparkles" className="text-yellow-500" size={24} />
                <p className="text-lg font-medium">
                  Решай задачки, зарабатывай звёздочки и становись гением математики! ⭐
                </p>
                <Icon name="Sparkles" className="text-yellow-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </footer>
      </div>
    </div>
  );
}
