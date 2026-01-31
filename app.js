// グローバル変数
let quizData = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

// DOM要素
const startScreen = document.getElementById(‘start-screen’);
const quizScreen = document.getElementById(‘quiz-screen’);
const resultScreen = document.getElementById(‘result-screen’);
const startBtn = document.getElementById(‘start-btn’);
const prevBtn = document.getElementById(‘prev-btn’);
const submitBtn = document.getElementById(‘submit-btn’);
const nextBtn = document.getElementById(‘next-btn’);
const reviewBtn = document.getElementById(‘review-btn’);
const restartBtn = document.getElementById(‘restart-btn’);
const questionListToggle = document.getElementById(‘question-list-toggle’);
const quitBtn = document.getElementById(‘quit-btn’);
const questionGrid = document.getElementById(‘question-grid’);
const questionNumbers = document.getElementById(‘question-numbers’);

// クイズデータの読み込み
async function loadQuizData() {
try {
const response = await fetch(‘quiz-data.json’);
quizData = await response.json();

```
    // 初期化
    document.getElementById('quiz-title').textContent = quizData.quizTitle;
    document.getElementById('total-questions').textContent = quizData.questions.length;
    document.getElementById('total-q').textContent = quizData.questions.length;
    
    // ユーザー回答を初期化
    userAnswers = new Array(quizData.questions.length).fill(null);
    
    console.log('クイズデータ読み込み完了:', quizData);
} catch (error) {
    console.error('クイズデータの読み込みに失敗しました:', error);
    alert('クイズデータの読み込みに失敗しました。quiz-data.jsonファイルを確認してください。');
}
```

}

// 画面切り替え
function showScreen(screen) {
document.querySelectorAll(’.screen’).forEach(s => s.classList.remove(‘active’));
screen.classList.add(‘active’);
}

// クイズ開始
function startQuiz() {
currentQuestionIndex = 0;
userAnswers = new Array(quizData.questions.length).fill(null);
score = 0;
showScreen(quizScreen);
createQuestionNavigation();
displayQuestion();
}

// 問題ナビゲーションを作成
function createQuestionNavigation() {
questionNumbers.innerHTML = ‘’;
quizData.questions.forEach((q, index) => {
const btn = document.createElement(‘button’);
btn.className = ‘question-num-btn’;
btn.textContent = index + 1;
btn.addEventListener(‘click’, () => jumpToQuestion(index));
questionNumbers.appendChild(btn);
});
updateQuestionNavigation();
}

// 問題にジャンプ
function jumpToQuestion(index) {
currentQuestionIndex = index;
displayQuestion();
questionGrid.style.display = ‘none’;
}

// 問題ナビゲーションを更新
function updateQuestionNavigation() {
const buttons = questionNumbers.querySelectorAll(’.question-num-btn’);
buttons.forEach((btn, index) => {
btn.classList.remove(‘current’, ‘answered’, ‘unanswered’);

```
    if (index === currentQuestionIndex) {
        btn.classList.add('current');
    } else if (userAnswers[index] !== null) {
        btn.classList.add('answered');
    } else {
        btn.classList.add('unanswered');
    }
});
```

}

// 問題一覧のトグル
function toggleQuestionList() {
if (questionGrid.style.display === ‘none’) {
questionGrid.style.display = ‘block’;
} else {
questionGrid.style.display = ‘none’;
}
}

// クイズを中断
function quitQuiz() {
const confirmed = confirm(‘クイズを中断しますか？現在の回答状況は保存されません。’);
if (confirmed) {
showResults();
}
}

// 問題を表示
function displayQuestion() {
const question = quizData.questions[currentQuestionIndex];

```
// 問題番号と進捗を更新
document.getElementById('q-number').textContent = currentQuestionIndex + 1;
document.getElementById('current-question').textContent = currentQuestionIndex + 1;
updateProgressBar();
updateQuestionNavigation();

// 問題文を表示
document.getElementById('question-text').textContent = question.question;

// 画像の表示/非表示
const imageContainer = document.getElementById('image-container');
if (question.hasImage) {
    imageContainer.style.display = 'block';
    document.getElementById('question-image').src = `images/${question.imageRef}.jpg`;
    document.getElementById('image-ref-text').textContent = question.imageRef;
} else {
    imageContainer.style.display = 'none';
}

// 選択肢を表示
displayOptions(question);

// ボタンの状態を更新
updateButtons();

// 解説エリアを非表示
document.getElementById('explanation-area').style.display = 'none';
```

}

// 選択肢を表示
function displayOptions(question) {
const optionsContainer = document.getElementById(‘options-container’);
optionsContainer.innerHTML = ‘’;

```
question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.innerHTML = `
        <span class="option-label">${String.fromCharCode(97 + index)}</span>
        <span class="option-text">${option}</span>
    `;
    
    // 既に回答済みの場合は選択状態を復元
    if (userAnswers[currentQuestionIndex] !== null) {
        if (question.multipleChoice) {
            if (userAnswers[currentQuestionIndex].includes(index)) {
                optionElement.classList.add('selected');
            }
        } else {
            if (userAnswers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
        }
    }
    
    optionElement.addEventListener('click', () => selectOption(index, optionElement, question.multipleChoice));
    optionsContainer.appendChild(optionElement);
});
```

}

// 選択肢を選択
function selectOption(index, optionElement, isMultipleChoice) {
// 既に解答を確認している場合は選択不可
if (document.getElementById(‘explanation-area’).style.display === ‘block’) {
return;
}

```
const options = document.querySelectorAll('.option');

if (isMultipleChoice) {
    // 複数選択の場合
    if (userAnswers[currentQuestionIndex] === null) {
        userAnswers[currentQuestionIndex] = [];
    }
    
    const answerIndex = userAnswers[currentQuestionIndex].indexOf(index);
    if (answerIndex > -1) {
        // 既に選択されている場合は解除
        userAnswers[currentQuestionIndex].splice(answerIndex, 1);
        optionElement.classList.remove('selected');
    } else {
        // 新たに選択
        userAnswers[currentQuestionIndex].push(index);
        optionElement.classList.add('selected');
    }
    
    // 配列が空の場合はnullに戻す
    if (userAnswers[currentQuestionIndex].length === 0) {
        userAnswers[currentQuestionIndex] = null;
    }
} else {
    // 単一選択の場合
    options.forEach(opt => opt.classList.remove('selected'));
    optionElement.classList.add('selected');
    userAnswers[currentQuestionIndex] = index;
}

updateButtons();
updateQuestionNavigation();
```

}

// ボタンの状態を更新
function updateButtons() {
const hasAnswer = userAnswers[currentQuestionIndex] !== null;
const isAnswered = document.getElementById(‘explanation-area’).style.display === ‘block’;

```
// 前の問題ボタン
prevBtn.disabled = currentQuestionIndex === 0;

// 解答確認ボタン
submitBtn.disabled = !hasAnswer || isAnswered;
submitBtn.style.display = isAnswered ? 'none' : 'inline-block';

// 次の問題ボタン
nextBtn.style.display = isAnswered ? 'inline-block' : 'none';
if (currentQuestionIndex === quizData.questions.length - 1) {
    nextBtn.textContent = '結果を見る';
} else {
    nextBtn.textContent = '次の問題';
}
```

}

// 進捗バーを更新
function updateProgressBar() {
const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
document.getElementById(‘progress-fill’).style.width = `${progress}%`;
}

// 解答を確認
function submitAnswer() {
const question = quizData.questions[currentQuestionIndex];
const userAnswer = userAnswers[currentQuestionIndex];
const options = document.querySelectorAll(’.option’);

```
let isCorrect = false;

// 正解チェック
if (question.correctAnswer !== null) {
    if (question.multipleChoice) {
        // 複数選択の場合（配列で比較）
        const correctAnswers = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer 
            : [question.correctAnswer];
        const sortedUserAnswer = [...userAnswer].sort();
        const sortedCorrectAnswer = [...correctAnswers].sort();
        isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
        
        // 選択肢に正解/不正解のクラスを追加
        options.forEach((opt, index) => {
            opt.classList.add('disabled');
            if (correctAnswers.includes(index)) {
                opt.classList.add('correct');
            }
            if (userAnswer.includes(index) && !correctAnswers.includes(index)) {
                opt.classList.add('incorrect');
            }
        });
    } else {
        // 単一選択の場合
        isCorrect = userAnswer === question.correctAnswer;
        
        // 選択肢に正解/不正解のクラスを追加
        options.forEach((opt, index) => {
            opt.classList.add('disabled');
            if (index === question.correctAnswer) {
                opt.classList.add('correct');
            }
            if (index === userAnswer && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
    }
} else {
    // 図を見て答える問題など、正解が設定されていない場合
    isCorrect = null; // 採点対象外
    options.forEach(opt => opt.classList.add('disabled'));
}

// スコアを更新
if (isCorrect === true) {
    score++;
}

// 解説を表示
showExplanation(isCorrect, question.explanation);

// ボタンの状態を更新
updateButtons();
```

}

// 解説を表示
function showExplanation(isCorrect, explanation) {
const explanationArea = document.getElementById(‘explanation-area’);
const resultBadge = document.getElementById(‘result-badge’);
const explanationText = document.getElementById(‘explanation-text’);

```
if (isCorrect === null) {
    resultBadge.textContent = '※ この問題は図を参照して解答してください';
    resultBadge.className = 'result-badge';
    resultBadge.style.background = '#64748b';
    resultBadge.style.color = 'white';
} else if (isCorrect) {
    resultBadge.textContent = '✓ 正解！';
    resultBadge.className = 'result-badge correct';
} else {
    resultBadge.textContent = '✗ 不正解';
    resultBadge.className = 'result-badge incorrect';
}

explanationText.textContent = explanation || '解説はありません。';
explanationArea.style.display = 'block';
```

}

// 前の問題へ
function previousQuestion() {
if (currentQuestionIndex > 0) {
currentQuestionIndex–;
displayQuestion();
}
}

// 次の問題へ
function nextQuestion() {
if (currentQuestionIndex < quizData.questions.length - 1) {
currentQuestionIndex++;
displayQuestion();
} else {
showResults();
}
}

// 結果を表示
function showResults() {
// スコアを計算（正解が設定されている問題のみ）
let totalAnswered = 0;
let correctCount = 0;
let incorrectCount = 0;
let unansweredCount = 0;
const results = [];

```
quizData.questions.forEach((question, index) => {
    if (question.correctAnswer !== null) {
        totalAnswered++;
        let isCorrect = false;
        let status = 'unanswered';
        
        if (userAnswers[index] === null) {
            unansweredCount++;
            status = 'unanswered';
        } else {
            if (question.multipleChoice) {
                const correctAnswers = Array.isArray(question.correctAnswer) 
                    ? question.correctAnswer 
                    : [question.correctAnswer];
                const sortedUserAnswer = [...userAnswers[index]].sort();
                const sortedCorrectAnswer = [...correctAnswers].sort();
                isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
            } else {
                isCorrect = userAnswers[index] === question.correctAnswer;
            }
            
            if (isCorrect) {
                correctCount++;
                status = 'correct';
            } else {
                incorrectCount++;
                status = 'incorrect';
            }
        }
        
        results.push({
            questionNumber: index + 1,
            status: status,
            question: question.question.substring(0, 50) + '...'
        });
    }
});

// 結果を表示
document.getElementById('final-score').textContent = correctCount;
document.getElementById('final-total').textContent = totalAnswered;

const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
document.getElementById('score-percentage').textContent = `${percentage}%`;

// スコアメッセージ
let message = '';
if (percentage >= 90) {
    message = '素晴らしい！ 🎉';
} else if (percentage >= 70) {
    message = 'よくできました！ 👍';
} else if (percentage >= 50) {
    message = 'もう少しです！ 💪';
} else {
    message = '復習が必要です 📚';
}
document.getElementById('score-message').textContent = message;

document.getElementById('correct-count').textContent = correctCount;
document.getElementById('incorrect-count').textContent = incorrectCount;
document.getElementById('unanswered-count').textContent = unansweredCount;

// 詳細な結果リストを表示
displayResultList(results);

showScreen(resultScreen);
```

}

// 詳細な結果リストを表示
function displayResultList(results) {
const resultList = document.getElementById(‘result-list’);
resultList.innerHTML = ‘’;

```
results.forEach(result => {
    const item = document.createElement('div');
    item.className = `result-item ${result.status}`;
    
    let statusText = '';
    let statusIcon = '';
    if (result.status === 'correct') {
        statusText = '正解';
        statusIcon = '✓';
    } else if (result.status === 'incorrect') {
        statusText = '不正解';
        statusIcon = '✗';
    } else {
        statusText = '未回答';
        statusIcon = '−';
    }
    
    item.innerHTML = `
        <span class="result-item-number">問題 ${result.questionNumber}</span>
        <span class="result-item-status ${result.status}">${statusIcon} ${statusText}</span>
    `;
    
    item.addEventListener('click', () => {
        currentQuestionIndex = result.questionNumber - 1;
        reviewAnswers();
    });
    
    resultList.appendChild(item);
});
```

}

// 解答を見直す
function reviewAnswers() {
currentQuestionIndex = 0;
showScreen(quizScreen);
displayQuestion();

```
// 既に回答した問題なので解説を表示
const question = quizData.questions[currentQuestionIndex];
if (userAnswers[currentQuestionIndex] !== null && question.correctAnswer !== null) {
    submitAnswer();
}
```

}

// クイズを再開
function restartQuiz() {
currentQuestionIndex = 0;
userAnswers = new Array(quizData.questions.length).fill(null);
score = 0;
showScreen(startScreen);
}

// イベントリスナーの設定
startBtn.addEventListener(‘click’, startQuiz);
prevBtn.addEventListener(‘click’, previousQuestion);
submitBtn.addEventListener(‘click’, submitAnswer);
nextBtn.addEventListener(‘click’, nextQuestion);
reviewBtn.addEventListener(‘click’, reviewAnswers);
restartBtn.addEventListener(‘click’, restartQuiz);
questionListToggle.addEventListener(‘click’, toggleQuestionList);
quitBtn.addEventListener(‘click’, quitQuiz);

// ページ読み込み時にクイズデータを読み込む
window.addEventListener(‘DOMContentLoaded’, loadQuizData);
