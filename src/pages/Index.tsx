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
  theory: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
}

interface TaskGenerator {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

interface TimerResult {
  correct: number;
  wrong: number;
  total: number;
}

const grades: Grade[] = [
  { id: 1, title: '1 класс', color: 'from-orange-400 to-orange-600' },
  { id: 2, title: '2 класс', color: 'from-purple-400 to-purple-600' },
  { id: 3, title: '3 класс', color: 'from-blue-400 to-blue-600' },
  { id: 4, title: '4 класс', color: 'from-green-400 to-green-600' },
];

const topics: Topic[] = [
  { 
    id: 'addition', 
    title: 'Сложение', 
    icon: 'Plus', 
    color: 'from-orange-400 to-orange-600', 
    emoji: '➕', 
    grades: [1, 2, 3, 4],
    theory: 'Сложение — это объединение чисел в одно целое. Когда мы складываем, мы находим общее количество предметов. Например: 3 яблока + 2 яблока = 5 яблок. Знак "+" означает "плюс" или "добавить". Сложение можно проверить на пальцах или с помощью счётных палочек!'
  },
  { 
    id: 'subtraction', 
    title: 'Вычитание', 
    icon: 'Minus', 
    color: 'from-purple-400 to-purple-600', 
    emoji: '➖', 
    grades: [1, 2, 3, 4],
    theory: 'Вычитание — это когда мы убираем часть от целого. Знак "−" означает "минус" или "отнять". Например: у тебя было 7 конфет, ты съел 3 конфеты, осталось 7 − 3 = 4 конфеты. Вычитание помогает узнать, сколько осталось после того, как что-то убрали.'
  },
  { 
    id: 'multiplication', 
    title: 'Умножение', 
    icon: 'X', 
    color: 'from-blue-400 to-blue-600', 
    emoji: '✖️', 
    grades: [2, 3, 4],
    theory: 'Умножение — это быстрый способ сложения одинаковых чисел. Например: 3 × 4 означает "3 повторить 4 раза": 3 + 3 + 3 + 3 = 12. Знак "×" означает "умножить". Таблица умножения поможет быстро считать большие числа!'
  },
  { 
    id: 'division', 
    title: 'Деление', 
    icon: 'Divide', 
    color: 'from-pink-400 to-pink-600', 
    emoji: '➗', 
    grades: [2, 3, 4],
    theory: 'Деление — это разделение на равные части. Знак "÷" означает "разделить". Например: 12 ÷ 3 означает "разделить 12 на 3 равные части" = 4. Деление помогает справедливо распределить предметы между друзьями!'
  },
  { 
    id: 'geometry', 
    title: 'Геометрия', 
    icon: 'Box', 
    color: 'from-green-400 to-green-600', 
    emoji: '🔷', 
    grades: [1, 2, 3, 4],
    theory: 'Геометрия изучает фигуры и формы. Треугольник имеет 3 угла, квадрат — 4 равные стороны, круг — нет углов. Периметр — это сумма всех сторон фигуры. Площадь — это сколько места занимает фигура (длина × ширина для прямоугольника).'
  },
  { 
    id: 'logic', 
    title: 'Логика', 
    icon: 'Brain', 
    color: 'from-pink-400 to-pink-600', 
    emoji: '🧩', 
    grades: [1, 2, 3, 4],
    theory: 'Логика помогает находить закономерности и решать головоломки. Ищи повторяющиеся узоры, сравнивай числа, находи общее и лишнее. Логическое мышление развивает внимательность и помогает принимать правильные решения!'
  },
  { 
    id: 'patterns', 
    title: 'Числовые ряды', 
    icon: 'ArrowRight', 
    color: 'from-yellow-400 to-yellow-600', 
    emoji: '🔢', 
    grades: [1, 2, 3, 4],
    theory: 'Числовой ряд — это последовательность чисел с определённым правилом. Например: 2, 4, 6, 8 (каждое число больше предыдущего на 2). Найди закономерность: числа могут увеличиваться, уменьшаться или следовать другому правилу!'
  },
];

const achievementsList: Achievement[] = [
  { id: 'first_step', title: 'Первый шаг', description: 'Реши первую задачу', icon: '🎯', requirement: 1, unlocked: false },
  { id: 'beginner', title: 'Новичок', description: 'Реши 5 задач правильно', icon: '⭐', requirement: 5, unlocked: false },
  { id: 'student', title: 'Ученик', description: 'Реши 10 задач правильно', icon: '📚', requirement: 10, unlocked: false },
  { id: 'expert', title: 'Эксперт', description: 'Реши 25 задач правильно', icon: '🏆', requirement: 25, unlocked: false },
  { id: 'master', title: 'Мастер', description: 'Реши 50 задач правильно', icon: '👑', requirement: 50, unlocked: false },
  { id: 'genius', title: 'Гений', description: 'Реши 100 задач правильно', icon: '🧠', requirement: 100, unlocked: false },
  { id: 'speed_demon', title: 'Скоростной демон', description: 'Реши 10+ задач в тренажёре за 2 минуты', icon: '⚡', requirement: 10, unlocked: false },
  { id: 'perfectionist', title: 'Перфекционист', description: 'Реши 10 задач подряд без ошибок', icon: '💎', requirement: 10, unlocked: false },
];

const generateTask = (topicId: string, grade: number): TaskGenerator => {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  switch (topicId) {
    case 'addition': {
      const questionTypes = [
        () => {
          const a = rand(1, grade * 10);
          const b = rand(1, grade * 10);
          const correct = a + b;
          const options = [correct - 2, correct - 1, correct, correct + 1].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Сколько будет ${a} + ${b}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} + ${b} = ${correct}. Молодец! 🎉`,
            hint: `Попробуй посчитать на пальчиках или нарисуй ${a} кружочков и добавь ещё ${b}!`
          };
        },
        () => {
          const a = rand(1, grade * 8);
          const b = rand(1, grade * 8);
          const c = rand(1, grade * 5);
          const correct = a + b + c;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `${a} + ${b} + ${c} = ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} + ${b} + ${c} = ${correct}. Супер! 🌟`,
            hint: `Сначала сложи ${a} + ${b} = ${a+b}, потом добавь ${c}!`
          };
        },
        () => {
          const a = rand(5, grade * 10);
          const result = rand(a + 5, a + grade * 10);
          const correct = result - a;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `${a} + ? = ${result}`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} + ${correct} = ${result}. Правильно! 🎯`,
            hint: `Подумай: что нужно добавить к ${a}, чтобы получить ${result}?`
          };
        }
      ];
      return questionTypes[rand(0, questionTypes.length - 1)]();
    }
    
    case 'subtraction': {
      const questionTypes = [
        () => {
          const a = rand(grade * 5, grade * 10);
          const b = rand(1, a);
          const correct = a - b;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5);
          return {
            question: `Сколько будет ${a} - ${b}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} - ${b} = ${correct}. Правильно! ⭐`,
            hint: `Начни с числа ${a} и отними ${b}. Можешь считать в обратную сторону!`
          };
        },
        () => {
          const a = rand(grade * 5, grade * 12);
          const b = rand(1, a / 2);
          const c = rand(1, (a - b) / 2);
          const correct = a - b - c;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5);
          return {
            question: `${a} - ${b} - ${c} = ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} - ${b} - ${c} = ${correct}. Отлично! 💪`,
            hint: `Сначала ${a} - ${b} = ${a-b}, потом отними ${c}!`
          };
        },
        () => {
          const b = rand(5, grade * 8);
          const correct = rand(b + 5, grade * 12);
          const a = correct + b;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5);
          return {
            question: `${a} - ${b} = ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${a} - ${b} = ${correct}. Умница! 🌈`,
            hint: `От ${a} убери ${b}!`
          };
        }
      ];
      return questionTypes[rand(0, questionTypes.length - 1)]();
    }
    
    case 'multiplication': {
      const a = rand(2, grade + 3);
      const b = rand(2, grade + 3);
      const correct = a * b;
      const options = [correct - 2, correct, correct + 2, correct + 4].filter(n => n > 0).sort(() => Math.random() - 0.5);
      return {
        question: `Сколько будет ${a} × ${b}?`,
        options: options.map(String),
        correctAnswer: options.indexOf(correct),
        explanation: `${a} × ${b} = ${correct}. Отлично! 🌟`,
        hint: `Умножение — это когда мы складываем число ${a} ровно ${b} раз!`
      };
    }
    
    case 'division': {
      const b = rand(2, grade + 2);
      const correct = rand(2, grade + 3);
      const a = b * correct;
      const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
      return {
        question: `Сколько будет ${a} ÷ ${b}?`,
        options: options.map(String),
        correctAnswer: options.indexOf(correct),
        explanation: `${a} ÷ ${b} = ${correct}. Верно! 🎯`,
        hint: `Подумай: сколько раз ${b} помещается в ${a}? Или ${b} × ? = ${a}`
      };
    }
    
    case 'geometry': {
      const questionTypes = [
        () => {
          const shapes = [
            { name: 'треугольника', count: 3, emoji: '📐' },
            { name: 'квадрата', count: 4, emoji: '🟦' },
            { name: 'прямоугольника', count: 4, emoji: '📏' },
            { name: 'пятиугольника', count: 5, emoji: '⬟' },
            { name: 'круга', count: 0, emoji: '⭕' }
          ];
          const shape = shapes[rand(0, shapes.length - 1)];
          const options = [shape.count - 1, shape.count, shape.count + 1, shape.count + 2].filter(n => n >= 0).sort(() => Math.random() - 0.5);
          return {
            question: `Сколько углов у ${shape.name}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(shape.count),
            explanation: `У ${shape.name} ${shape.count} ${shape.count === 1 ? 'угол' : shape.count < 5 ? 'угла' : 'углов'}! ${shape.emoji}`,
            hint: shape.count === 0 ? 'Круг — замкнутая линия без углов!' : `Посчитай углы у фигуры!`
          };
        },
        () => {
          const side = rand(2, 8);
          const count = rand(3, 6);
          const perimeter = side * count;
          const options = [perimeter - 2, perimeter, perimeter + 2, perimeter + 4].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Периметр фигуры с ${count} равными сторонами по ${side} см?`,
            options: options.map(String),
            correctAnswer: options.indexOf(perimeter),
            explanation: `${count} × ${side} = ${perimeter} см. Молодец! 📏`,
            hint: `Сложи все ${count} стороны: ${side} + ${side}...`
          };
        },
        () => {
          const a = rand(3, 10);
          const b = rand(3, 10);
          const area = a * b;
          const options = [area - 2, area, area + 2, area + 4].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Площадь прямоугольника ${a}×${b} см?`,
            options: options.map(String),
            correctAnswer: options.indexOf(area),
            explanation: `${a} × ${b} = ${area} см². Отлично! 🎯`,
            hint: `Умножь длину ${a} на ширину ${b}!`
          };
        }
      ];
      return questionTypes[rand(0, Math.min(questionTypes.length - 1, grade === 1 ? 0 : questionTypes.length - 1))]();
    }
    
    case 'logic': {
      const questionTypes = [
        () => {
          const colors = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
          const patternLength = rand(2, 3);
          const pattern = [];
          for (let i = 0; i < patternLength; i++) {
            pattern.push(colors[rand(0, colors.length - 1)]);
          }
          const sequence = [...pattern, ...pattern];
          const correct = pattern[0];
          const wrongOptions = colors.filter(c => c !== correct);
          const options = [correct, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
          return {
            question: `Продолжи узор: ${sequence.join(' ')} ?`,
            options,
            correctAnswer: options.indexOf(correct),
            explanation: `Узор повторяется: ${pattern.join(' ')}! 🎨`,
            hint: `Посмотри на первые ${patternLength} элемента — они повторяются!`
          };
        },
        () => {
          const isEven = rand(0, 1) === 0;
          const numbers = [];
          const start = rand(2, 10);
          for (let i = 0; i < 4; i++) {
            numbers.push(isEven ? start + i * 2 : start + i * 2 + 1);
          }
          const odd = isEven ? numbers[0] + 1 : numbers[0] - 1;
          numbers.splice(rand(1, 3), 0, odd);
          const options = numbers.sort(() => Math.random() - 0.5).slice(0, 4);
          return {
            question: `Какое число лишнее: ${numbers.join(', ')}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(odd),
            explanation: `${odd} — ${isEven ? 'нечётное' : 'чётное'}, остальные ${isEven ? 'чётные' : 'нечётные'}! 🧮`,
            hint: `Все числа кроме одного делятся на 2 ${isEven ? 'без' : 'с'} остатком!`
          };
        },
        () => {
          const fruits = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓'];
          const correct = fruits[rand(0, fruits.length - 1)];
          const other = fruits.filter(f => f !== correct)[rand(0, fruits.length - 2)];
          const count1 = rand(3, 5);
          const count2 = rand(1, 2);
          const sequence = [...Array(count1).fill(correct), ...Array(count2).fill(other)];
          const shuffled = sequence.sort(() => Math.random() - 0.5);
          const options = [correct, ...fruits.filter(f => f !== correct).slice(0, 3)].sort(() => Math.random() - 0.5);
          return {
            question: `Какой элемент встречается чаще: ${shuffled.join(' ')}?`,
            options,
            correctAnswer: options.indexOf(correct),
            explanation: `${correct} встречается ${count1} раз! 🎯`,
            hint: `Посчитай, сколько раз каждый элемент появляется!`
          };
        },
        () => {
          const num1 = rand(5, 15);
          const num2 = rand(num1 + 5, num1 + 15);
          const num3 = rand(num2 + 5, num2 + 15);
          const options = [num1, num2, num3, rand(1, num1 - 1)].sort((a, b) => a - b);
          const correct = options[options.length - 1];
          return {
            question: `Какое число самое большое: ${options.join(', ')}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${correct} — самое большое число! 🏆`,
            hint: `Сравни все числа и найди максимальное!`
          };
        },
        () => {
          const shapes = ['⭐', '❤️', '🔷', '⬛'];
          const patternTypes = rand(0, 1);
          let sequence, correct;
          if (patternTypes === 0) {
            const shape1 = shapes[rand(0, shapes.length - 1)];
            const shape2 = shapes.filter(s => s !== shape1)[rand(0, shapes.length - 2)];
            sequence = [shape1, shape2, shape1, shape2, shape1];
            correct = shape2;
          } else {
            const shape = shapes[rand(0, shapes.length - 1)];
            sequence = [shape, shape, shape];
            correct = shape;
          }
          const options = [correct, ...shapes.filter(s => s !== correct).slice(0, 3)].sort(() => Math.random() - 0.5);
          return {
            question: `Какая фигура продолжит ряд: ${sequence.join(' ')} ?`,
            options,
            correctAnswer: options.indexOf(correct),
            explanation: `Правильно: ${correct}! Узор повторяется! 🎨`,
            hint: `Посмотри на закономерность в последовательности!`
          };
        },
        () => {
          const a = rand(3, 12);
          const b = rand(2, 8);
          const operations = [
            { q: `${a} больше ${b} на`, ans: a - b, exp: `${a} - ${b} = ${a - b}` },
            { q: `${a} меньше ${a + b} на`, ans: b, exp: `${a + b} - ${a} = ${b}` },
            { q: `Сумма ${a} и ${b} равна`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }
          ];
          const op = operations[rand(0, operations.length - 1)];
          const correct = op.ans;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `${op.q}?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `${op.exp}! Правильно! 🎯`,
            hint: `Подумай над словами задачи!`
          };
        }
      ];
      return questionTypes[rand(0, questionTypes.length - 1)]();
    }
    
    case 'patterns': {
      const questionTypes = [
        () => {
          const step = rand(1, grade === 1 ? 2 : 5);
          const start = rand(1, 10);
          const seq = [start, start + step, start + step * 2, start + step * 3];
          const correct = start + step * 4;
          const options = [correct - 2, correct - 1, correct, correct + 1].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Какое число продолжит ряд: ${seq.join(', ')}, ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `Каждое число на ${step} больше: ${correct}! 📊`,
            hint: `Посмотри, на сколько увеличивается каждое число: ${seq[1]}-${seq[0]}=${step}`
          };
        },
        () => {
          const step = rand(1, grade === 1 ? 2 : 4);
          const start = rand(15, 30);
          const seq = [start, start - step, start - step * 2, start - step * 3];
          const correct = start - step * 4;
          const options = [correct - 1, correct, correct + 1, correct + 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Продолжи ряд: ${seq.join(', ')}, ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `Числа уменьшаются на ${step}: ${correct}! 📉`,
            hint: `Каждое число на ${step} меньше предыдущего!`
          };
        },
        () => {
          const mult = rand(2, grade === 1 ? 2 : 3);
          const seq = [mult, mult * 2, mult * 3, mult * 4];
          const correct = mult * 5;
          const options = [correct - mult, correct, correct + mult, correct + mult * 2].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Найди закономерность: ${seq.join(', ')}, ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `Это таблица умножения на ${mult}: ${correct}! ✖️`,
            hint: `Каждое число — это ${mult} умножить на что-то!`
          };
        },
        () => {
          const start = rand(1, 5);
          const seq = [start, start + 1, start + 3, start + 6];
          const correct = start + 10;
          const options = [correct - 2, correct - 1, correct, correct + 1].filter(n => n > 0).sort(() => Math.random() - 0.5);
          return {
            question: `Какое число следующее: ${seq.join(', ')}, ?`,
            options: options.map(String),
            correctAnswer: options.indexOf(correct),
            explanation: `Разница растёт: +1, +2, +3, +4. Ответ: ${correct}! 🎯`,
            hint: `Посмотри на разницу между числами: она увеличивается!`
          };
        }
      ];
      return questionTypes[rand(0, grade === 1 ? 1 : questionTypes.length - 1)]();
    }
    
    case 'mixed': {
      const mixedTopics = ['addition', 'subtraction', 'multiplication', 'division', 'geometry', 'logic', 'patterns'];
      const randomTopic = mixedTopics[rand(0, mixedTopics.length - 1)];
      return generateTask(randomTopic, grade);
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
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerResult, setTimerResult] = useState<TimerResult | null>(null);
  const [showTheory, setShowTheory] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsList);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTopic && selectedGrade && !timerResult) {
      setCurrentTask(generateTask(selectedTopic, selectedGrade));
    }
  }, [selectedTopic, selectedGrade, timerResult]);

  useEffect(() => {
    if (isTimerMode && timeLeft > 0 && !timerResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isTimerMode && timeLeft === 0 && !timerResult) {
      setTimerResult({
        correct: score,
        wrong: totalTasks - score,
        total: totalTasks
      });
    }
  }, [isTimerMode, timeLeft, timerResult, score, totalTasks]);

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrade(gradeId);
    setSelectedTopic(null);
    setScore(0);
    setTotalTasks(0);
    setIsTimerMode(false);
    setTimeLeft(120);
    setTimerResult(null);
  };

  const handleTopicSelect = (topicId: string, timerMode = false) => {
    setSelectedTopic(topicId);
    setScore(0);
    setTotalTasks(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setIsTimerMode(timerMode);
    setTimeLeft(120);
    setTimerResult(null);
    setShowTheory(false);
  };

  const checkAchievements = (correct: number, consecutive: number, timerTasksCount?: number) => {
    const newAchievements = [...achievements];
    let unlocked = false;

    newAchievements.forEach(achievement => {
      if (!achievement.unlocked) {
        if (achievement.id === 'first_step' && correct >= 1) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'beginner' && correct >= 5) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'student' && correct >= 10) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'expert' && correct >= 25) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'master' && correct >= 50) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'genius' && correct >= 100) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'speed_demon' && timerTasksCount && timerTasksCount >= 10) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        } else if (achievement.id === 'perfectionist' && consecutive >= 10) {
          achievement.unlocked = true;
          unlocked = true;
          toast({
            title: `🎉 Достижение разблокировано!`,
            description: `${achievement.icon} ${achievement.title}`,
            className: 'bg-yellow-100 border-yellow-400'
          });
        }
      }
    });

    if (unlocked) {
      setAchievements(newAchievements);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || !currentTask) return;
    
    setSelectedAnswer(answerIndex);
    setTotalTasks(totalTasks + 1);
    
    if (answerIndex === currentTask.correctAnswer) {
      const newScore = score + 1;
      const newTotal = totalCorrect + 1;
      const newConsecutive = consecutiveCorrect + 1;
      setScore(newScore);
      setTotalCorrect(newTotal);
      setConsecutiveCorrect(newConsecutive);
      
      if (isTimerMode) {
        toast({
          title: '✅ Верно!',
          description: '+1 балл',
          className: 'bg-green-100 border-green-400'
        });
        setTimeout(() => {
          handleNextTask();
        }, 500);
      } else {
        toast({
          title: '🎉 Правильно!',
          description: currentTask.explanation,
          className: 'bg-green-100 border-green-400'
        });
        setShowExplanation(true);
        checkAchievements(newTotal, newConsecutive);
      }
    } else {
      setConsecutiveCorrect(0);
      if (isTimerMode) {
        toast({
          title: '❌ Неверно',
          description: `Правильный ответ: ${currentTask.options[currentTask.correctAnswer]}`,
          variant: 'destructive'
        });
        setTimeout(() => {
          handleNextTask();
        }, 500);
      } else {
        toast({
          title: '❌ Неправильно',
          description: 'Посмотри подсказку и объяснение!',
          variant: 'destructive'
        });
        setShowExplanation(true);
      }
    }
  };

  const handleNextTask = () => {
    if (selectedTopic && selectedGrade) {
      setCurrentTask(generateTask(selectedTopic, selectedGrade));
      setShowExplanation(false);
      setSelectedAnswer(null);
      setShowHint(false);
    }
  };

  useEffect(() => {
    if (timerResult && timerResult.correct >= 10) {
      checkAchievements(totalCorrect, consecutiveCorrect, timerResult.correct);
    }
  }, [timerResult]);

  if (showAchievements) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setShowAchievements(false)}
            className="mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          
          <Card className="shadow-2xl border-4 border-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-foreground mb-2">Достижения 🏆</h2>
                <p className="text-xl text-muted-foreground">Твои успехи и награды</p>
              </div>
              
              <div className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-700">{totalCorrect}</div>
                    <div className="text-sm text-blue-600">Всего верно</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-700">{achievements.filter(a => a.unlocked).length}/{achievements.length}</div>
                    <div className="text-sm text-purple-600">Достижений</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <Card
                    key={achievement.id}
                    className={`transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400'
                        : 'bg-gray-100 opacity-60'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <Badge className="bg-green-500 text-white">
                              <Icon name="CheckCircle" className="mr-1" size={14} />
                              Получено
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Icon name="Lock" className="mr-1" size={14} />
                              Заблокировано
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (timerResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-4 border-white">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-foreground mb-2">Время вышло! ⏱️</h2>
                <p className="text-xl text-muted-foreground">Отличная работа!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6">
                  <Icon name="Target" className="mx-auto mb-2 text-blue-600" size={32} />
                  <div className="text-3xl font-bold text-blue-700">{timerResult.total}</div>
                  <div className="text-sm text-blue-600">Всего</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6">
                  <Icon name="CheckCircle" className="mx-auto mb-2 text-green-600" size={32} />
                  <div className="text-3xl font-bold text-green-700">{timerResult.correct}</div>
                  <div className="text-sm text-green-600">Верно</div>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-6">
                  <Icon name="XCircle" className="mx-auto mb-2 text-red-600" size={32} />
                  <div className="text-3xl font-bold text-red-700">{timerResult.wrong}</div>
                  <div className="text-sm text-red-600">Ошибок</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-lg font-medium mb-2">Точность</div>
                <Progress 
                  value={timerResult.total > 0 ? (timerResult.correct / timerResult.total) * 100 : 0} 
                  className="h-4"
                />
                <div className="text-2xl font-bold text-primary mt-2">
                  {timerResult.total > 0 ? Math.round((timerResult.correct / timerResult.total) * 100) : 0}%
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleTopicSelect('mixed', true)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
                >
                  <Icon name="RotateCcw" className="mr-2" />
                  Попробовать снова
                </Button>
                <Button
                  onClick={() => setSelectedTopic(null)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Вернуться к темам
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showTheory && selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setShowTheory(false);
              setSelectedTopic(null);
            }}
            className="mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад к темам
          </Button>

          <Card className="shadow-2xl border-4 border-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${topic.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-5xl">{topic.emoji}</span>
                </div>
                <h2 className="text-4xl font-bold text-foreground mb-2">{topic.title}</h2>
                <Badge variant="outline" className="text-base">
                  {grades.find(g => g.id === selectedGrade)?.title}
                </Badge>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="BookOpen" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <p className="text-lg leading-relaxed text-foreground">{topic.theory}</p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowTheory(false);
                  handleTopicSelect(topic.id, false);
                }}
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg"
              >
                Начать решать задачи
                <Icon name="ArrowRight" className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedTopic && currentTask && selectedGrade) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
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
                  {isTimerMode && (
                    <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                      <Icon name="Timer" size={20} />
                      <span className="font-bold text-lg">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon name="Target" className="text-blue-500" size={20} />
                    <span className="font-medium">{totalTasks}</span>
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

              {showExplanation && !isTimerMode && (
                <div className="mt-8 text-center animate-scale-in space-y-4">
                  {selectedAnswer !== currentTask.correctAnswer && (
                    <>
                      {!showHint && (
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
                      
                      {showHint && (
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
                          <div className="flex items-start gap-3">
                            <Icon name="Lightbulb" className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                            <p className="text-lg font-medium text-left">{currentTask.hint}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className={`rounded-xl p-6 ${
                    selectedAnswer === currentTask.correctAnswer 
                      ? 'bg-gradient-to-r from-green-100 to-green-200' 
                      : 'bg-gradient-to-r from-yellow-100 to-orange-100'
                  }`}>
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

          <div className="max-w-6xl mx-auto mb-8">
            <Card 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-primary bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500"
              onClick={() => handleTopicSelect('mixed', true)}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-xl p-4">
                      <Icon name="Timer" size={32} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-1">⚡ Тренажёр 2 минуты</h3>
                      <p className="text-white/90">Реши максимум заданий за время!</p>
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={32} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {availableTopics.map((topic, index) => (
              <Card
                key={topic.id}
                className="transition-all duration-300 hover:shadow-2xl border-4 border-white animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div 
                    className={`w-full h-32 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => handleTopicSelect(topic.id, false)}
                  >
                    <span className="text-6xl">{topic.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-foreground mb-2">
                    {topic.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                    <Icon name="Infinity" size={20} />
                    <span className="text-sm font-medium">Бесконечные задания</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setShowTheory(true);
                    }}
                  >
                    <Icon name="BookOpen" className="mr-2" size={16} />
                    Теория
                  </Button>
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

        <footer className="mt-16 text-center space-y-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAchievements(true)}
            className="bg-white/80 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <Icon name="Trophy" className="mr-2" size={24} />
            Мои достижения ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </Button>
          
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