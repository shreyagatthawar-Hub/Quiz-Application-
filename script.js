const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const questionStatus = document.querySelector(".question-status");
const resultContainer = document.querySelector(".result-container");
const timeDisplay = document.querySelector(".time-duration");

let currentQuestion = null;
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;

// display the quiz result and hide the quiz container

const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}<b/> out of <b>${numberOfQuestions}<b/> questions correctly. Great Job!`;
    document.querySelector(".result-message").innerHTML = resultText;
}
//clear and reset the timer
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timeDisplay.textContent = `${currentTime}s`;

    //  Reset timer background color
    quizContainer.querySelector(".quiz-timer").style.background = "";
}

//initialize and start the timerfor the current question
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timeDisplay.textContent = `${currentTime}s`;

        if(currentTime <= 0){
            clearInterval(timer);
            highlightCorrectAnswer();
            document.querySelector(".next-question-btn").style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402"
            //disable all answer options after one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");     
        }  
    },1000);
}

//fetch a random question from based on the selected category

const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || {};
    console.log(categoryQuestions);

    //show the result if all questions have been used
    if(questionIndexHistory.length >= numberOfQuestions){
        return showQuizResult();
    }

    //filter out the already asked questions and choose a random one
    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));//removes index that are in index history and remaining questions are stored in availableQuestions
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    console.log(randomQuestion);
    return randomQuestion;
}

//handle the correct answer option and add icon
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class = "material-symbols-outlined">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);
}

//handle the user answer selection
const handleAnswer = (option, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer == answerIndex;
    option.classList.add(isCorrect? 'correct':'incorrect');

    !isCorrect ? highlightCorrectAnswer():correctAnswerCount++;

    //insert icon based on correctness
    const iconHTML = `<span class = "material-symbols-outlined">${isCorrect? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend",iconHTML);

    //disable all answer options after one option is selectd
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

   document.querySelector(".next-question-btn").style.visibility = "visible";

}

const renderQuestion = () =>{
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;

    resetTimer();
    startTimer();


    //update the ui 
    answerOptions.innerHTML = "";
    document.querySelector(".next-question-btn").style.visibility = "hidden";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    //create option li element and append them and click event listners;
    currentQuestion.options.forEach((option,index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    })

}



//start the quiz and render the question
const startQuiz = () => {
    const selectedCategory = configContainer.querySelector(".category-option.active");
    const selectedQuestions = configContainer.querySelector(".question-option.active");

    //  If nothing selected
    if (!selectedCategory || !selectedQuestions) {
        alert("Please select category and number of questions!");
        return;
    }

    quizCategory = selectedCategory.textContent;
    numberOfQuestions = parseInt(selectedQuestions.textContent);

    configContainer.style.display = "none";
    quizContainer.style.display = "block"; 

    renderQuestion();
};
    

//highlight the selected option on click category or no of questions
document.querySelectorAll(".question-option").forEach(option => {
    option.addEventListener("click", () => {
        const activeBtn = option.parentNode.querySelector(".active");
        if (activeBtn) activeBtn.classList.remove("active"); // safe check
        option.classList.add("active");
    });
});

document.querySelectorAll(".category-option").forEach(option => {
    option.addEventListener("click", () => {
        const activeBtn = option.parentNode.querySelector(".active");
        if (activeBtn) activeBtn.classList.remove("active"); //  safe check
        option.classList.add("active");
    });
}); 
//reset the quiz and return to configuration container

const resetQuiz = () => {
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    resultContainer.style.display = "none";
    configContainer.style.display = "block";
}



document.querySelector(".start-quiz-button").addEventListener("click",startQuiz);
document.querySelector(".next-question-btn").addEventListener("click",renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);