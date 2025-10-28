import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Grade {
  id: number;
  title: string;
  color: string;
}

interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  emoji: string;
  grades: number[];
}

interface TaskGenerator {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

const grades: Grade[] = [
  { id: 1, title: '1 класс', color: 'from-orange-400 to-orange-600' },
  { id: 2, title: '2 класс', color: 'from-purple-400 to-purple-600' },
  { id: 3, title: '3 класс', color: 'from-blue-400 to-blue-600' },
  { id: 4, title: '4 класс', color: 'from-green-400 to-green-600' },
];

const topics: Topic[] = [
  { id: 'addition', title: 'Сложение', icon: 'Plus', color: 'from-orange-400 to-orange-600', emoji: '➕', grades: [1, 2, 3, 4] },
  { id: 'subtraction', title: 'Вычитание', icon: 'Minus', color: 'from-purple-400 to-purple-600', emoji: '➖', grades: [1, 2, 3, 4] },
  { id: 'multiplication', title: 'Умножение', icon: 'X', color: 'from-blue-400 to-blue-600', emoji: '✖️', grades: [2, 3, 4] },
  { id: 'division', title: 'Деление', icon: 'Divide', color: 'from-pink-400 to-pink-600', emoji: '➗', grades: [2, 3, 4] },
  { id: 'geometry', title: 'Геометрия', icon: 'Box', color: 'from-green-400 to-green-600', emoji: '🔷', grades: [1, 2, 3, 4] },
  { id: 'logic', title: 'Логика', icon: 'Brain', color: 'from-pink-400 to-pink-600', emoji: '🧩', grades: [1, 2, 3, 4] },
  { id: 'patterns', title: 'Числовые ряды', icon: 'ArrowRight', color: 'from-yellow-400 to-yellow-600', emoji: '🔢', grades: [1, 2, 3, 4] },
];

const generateTask = (topicId: string, grade: number): TaskGenerator => {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  switch (topicId) {
    case 'addition': {
      const a = rand(1, grade * 10);
      const b = rand(1, grade * 10);
      const correct = a + b;
      return {
        question: `Сколько будет ${a} + ${b}?`,
        options: [correct - 2, correct - 1, correct, correct + 1].sort(() => Math.random() - 0.5).map(String),
        correctAnswer: [correct - 2, correct - 1, correct, correct + 1].sort(() => Math.random() - 0.5).indexOf(correct),
        explanation: `${a} + ${b} = ${correct}. Молодец! 🎉`,
        hint: `Попробуй посчитать на пальчиках или нарисуй ${a} кружочков и добавь ещё ${b}!`
      };
    }
    
    case 'subtraction': {
      const a = rand(grade * 5, grade * 10);
      const b = rand(1, a);
      const correct = a - b;
      return {
        question: `Сколько будет ${a} - ${b}?`,
        options: [correct - 1, correct, correct + 1, correct + 2].sort(() => Math.random() - 0.5).map(String),
        correctAnswer: [correct - 1, correct, correct + 1, correct + 2].sort(() => Math.random() - 0.5).indexOf(correct),
        explanation: `${a} - ${b} = ${correct}. Правильно! ⭐`,
        hint: `Начни с числа ${a} и отними ${b}. Можешь считать в обратную сторону!`
      };
    }
    
    case 'multiplication': {
      const a = rand(2, grade + 3);
      const b = rand(2, grade + 3);
      const correct = a * b;
      return {
        question: `Сколько будет ${a} × ${b}?`,
        options: [correct - 2, correct, correct + 2, correct + 4].sort(() => Math.random() - 0.5).map(String),
        correctAnswer: [correct - 2, correct, correct + 2, correct + 4].sort(() => Math.random() - 0.5).indexOf(correct),
        explanation: `${a} × ${b} = ${correct}. Отлично! 🌟`,
        hint: `Умножение — это когда мы складываем число ${a} сложить ${b} раз: ${Array(b).fill(a).join(' + ')} = ${correct}`
      };
    }
    
    case 'division': {
      const b = rand(2, grade + 2);
      const correct = rand(2, grade + 3);
      const a = b * correct;
      return {
        question: `Сколько будет ${a} ÷ ${b}?`,
        options: [correct - 1, correct, correct + 1, correct + 2].sort(() => Math.random() - 0.5).map(String),
        correctAnswer: [correct - 1, correct, correct + 1, correct + 2].sort(() => Math.random() - 0.5).indexOf(correct),
        explanation: `${a} ÷ ${b} = ${correct}. Верно! 🎯`,
        hint: `Подумай: сколько раз ${b} помещается в ${a}? Или ${b} × ? = ${a}`
      };
    }
    
    case 'geometry': {
      const shapes = [
        { q: 'Сколько углов у треугольника?', opts: ['2', '3', '4', '5'], correct: 1, exp: 'У треугольника 3 угла! 📐', hint: 'ТРИугольник — в названии есть подсказка!' },
        { q: 'Сколько углов у квадрата?', opts: ['3', '4', '5', '6'], correct: 1, exp: 'У квадрата 4 угла! 🟦', hint: 'Посмотри на окно или дверь — сколько у них углов?' },
        { q: 'Сколько сторон у круга?', opts: ['0', '1', '2', '4'], correct: 0, exp: 'У круга нет сторон, только одна линия! ⭕', hint: 'Круг — это замкнутая линия без углов и сторон!' },
        { q: 'Сколько углов у прямоугольника?', opts: ['2', '3', '4', '5'], correct: 2, exp: 'У прямоугольника 4 угла! 📏', hint: 'Прямоугольник похож на квадрат, только стороны разные!' }
      ];
      const shape = shapes[rand(0, shapes.length - 1)];
      return {
        question: shape.q,
        options: shape.opts,
        correctAnswer: shape.correct,
        explanation: shape.exp,
        hint: shape.hint
      };
    }
    
    case 'logic': {
      const patterns = [
        { q: 'Продолжи: 🔴 🔵 🔴 🔵 🔴 ?', opts: ['🔴', '🔵', '🟡', '🟢'], correct: 1, exp: 'Цвета чередуются: красный, синий! 🎨', hint: 'Смотри на узор: какой цвет идёт после красного?' },
        { q: 'Какое число лишнее: 2, 4, 6, 7, 8?', opts: ['2', '4', '7', '8'], correct: 2, exp: '7 — нечётное, остальные чётные! 🧮', hint: 'Все числа делятся на 2 без остатка, кроме одного!' },
        { q: 'Продолжи: 🟢 🟢 🔵 🟢 🟢 ?', opts: ['🟢', '🔵', '🟡', '🔴'], correct: 1, exp: 'Узор: два зелёных, один синий! 💚', hint: 'Считай: сколько зелёных между синими?' }
      ];
      const pattern = patterns[rand(0, patterns.length - 1)];
      return {
        question: pattern.q,
        options: pattern.opts,
        correctAnswer: pattern.correct,
        explanation: pattern.exp,
        hint: pattern.hint
      };
    }
    
    case 'patterns': {
      const step = rand(1, 3);
      const start = rand(1, 10);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const correct = start + step * 4;
      return {
        question: `Какое число продолжит ряд: ${seq.join(', ')}, ?`,
        options: [correct - 2, correct - 1, correct, correct + 1].sort(() => Math.random() - 0.5).map(String),
        correctAnswer: [correct - 2, correct - 1, correct, correct + 1].sort(() => Math.random() - 0.5).indexOf(correct),
        explanation: `Каждое число на ${step} больше: ${correct}! 📊`,
        hint: `Посмотри, на сколько увеличивается каждое число: ${seq[1]}-${seq[0]}=${step}`
      };
    }
    
    default:
      return generateTask('addition', grade);
  }
};

export default function Index() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskGenerator | null>(null);
  const [score, setScore] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTopic && selectedGrade) {
      setCurrentTask(generateTask(selectedTopic, selectedGrade));
    }
  }, [selectedTopic, selectedGrade]);

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrade(gradeId);
    setSelectedTopic(null);
    setScore(0);
    setTotalTasks(0);
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setScore(0);
    setTotalTasks(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || !currentTask) return;
    
    setSelectedAnswer(answerIndex);
    setTotalTasks(totalTasks + 1);
    
    if (answerIndex === currentTask.correctAnswer) {
      setScore(score + 1);
      toast({
        title: '🎉 Правильно!',
        description: currentTask.explanation,
        className: 'bg-green-100 border-green-400'
      });
    } else {
      toast({
        title: 'Неверно',
        description: 'Посмотри подсказку и попробуй ещё раз!',
        variant: 'destructive'
      });
    }
    
    setShowExplanation(true);
  };

  const handleNextTask = () => {
    if (selectedTopic && selectedGrade) {
      setCurrentTask(generateTask(selectedTopic, selectedGrade));
      setShowExplanation(false);
      setSelectedAnswer(null);
      setShowHint(false);
    }
  };

  if (selectedTopic && currentTask && selectedGrade) {
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
                <Badge variant="outline" className="text-base">
                  {grades.find(g => g.id === selectedGrade)?.title}
                </Badge>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="Target" className="text-blue-500" size={20} />
                    <span className="font-medium">{totalTasks} попыток</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Star" className="text-yellow-500" size={20} />
                    <span className="font-bold text-lg">{score}</span>
                  </div>
                </div>
              </div>
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
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-8 text-center animate-scale-in space-y-4">
                  {selectedAnswer !== currentTask.correctAnswer && !showHint && (
                    <Button
                      onClick={() => setShowHint(true)}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Icon name="Lightbulb" className="mr-2" />
                      Показать подсказку
                    </Button>
                  )}
                  
                  {showHint && selectedAnswer !== currentTask.correctAnswer && (
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Icon name="Lightbulb" className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                        <p className="text-lg font-medium text-left">{currentTask.hint}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6">
                    <p className="text-lg font-medium">{currentTask.explanation}</p>
                  </div>
                  
                  <Button
                    onClick={handleNextTask}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg px-8"
                  >
                    Следующий вопрос
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

  if (selectedGrade) {
    const availableTopics = topics.filter(t => t.grades.includes(selectedGrade));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Button
            variant="ghost"
            onClick={() => setSelectedGrade(null)}
            className="mb-6"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад к выбору класса
          </Button>
          
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
              {grades.find(g => g.id === selectedGrade)?.title}
            </h1>
            <p className="text-xl text-foreground/80 font-medium">
              Выбери тему для тренировки
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {availableTopics.map((topic, index) => (
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
                    <Icon name="Infinity" size={20} />
                    <span className="text-sm font-medium">Бесконечные задания</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Математика — это весело! 🎓
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">
            Выбери свой класс и начни обучение
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {grades.map((grade, index) => (
            <Card
              key={grade.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-white animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleGradeSelect(grade.id)}
            >
              <CardContent className="p-8">
                <div className={`w-full h-32 bg-gradient-to-br ${grade.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-5xl font-bold text-white">{grade.id}</span>
                </div>
                <h3 className="text-2xl font-bold text-center text-foreground">
                  {grade.title}
                </h3>
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
