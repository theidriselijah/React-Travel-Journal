import React from "react"
import Question from "./components/Question"
import Answer from "./components/Answer"
import {nanoid} from "nanoid"
import he from "he"

export default function App() {
    
    const [newGame, setNewGame] = React.useState(0)
    const [responses, setResponses] = React.useState([])
    const [correctAnswers, setCorrectAnswer] = React.useState(0)
    const [isChecked, setIsChecked] = React.useState(false)
    
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&category=9")
            .then(res => res.json())
            .then(data => setResponses(data.results.map(question => {
                return ({
                    question: he.decode(question.question),
                    answers: shuffle([{
                        value: he.decode(question.correct_answer),
                        isSelected: false,
                        isCorrect: true,
                        id: nanoid()
                    }, ...question.incorrect_answers.map(answer => {
                        return {
                            value: he.decode(answer),
                            isSelected: false,
                            isCorrect: false,
                            id: nanoid()
                        }
                    })])
                })
            })))
    }, [newGame])
    
    function handleClick(id, question) {
        setResponses(prevResponses => prevResponses.map(elem => {
            return elem.question === question ?
                {    
                ...elem,
                answers: elem.answers.map(answ => {
                    return answ.id === id ? 
                        {...answ, isSelected: !answ.isSelected} :
                        {...answ, isSelected: false}
                })} : 
                elem
            
        }))
    }
    
    function startQuiz() {
        setNewGame(prevGame => prevGame + 1)
        setIsChecked(false)
    }
    
    function checkAnswers() {
        setCorrectAnswer(
            responses.reduce((acc, elem) => acc + elem.answers.reduce((acc,answ) => (answ.isCorrect && answ.isSelected) ? acc + 1 : acc + 0, 0), 0)
        )
        setIsChecked(true)
    }
    
    function shuffle(array) {
        var m = array.length, t, i
        while (m) {
            i = Math.floor(Math.random() * m--)
            t = array[m]
            array[m] = array[i]
            array[i] = t
        }
        return array
    }
    
    const openingScreen = (
        <div className="openingscreen">
            <h1>Quizzical</h1>
            <p>Answer 5 general knowledge questions</p>
            <button onClick={startQuiz}>Start quiz</button>
        </div>
    )
    
    const questionScreen = (
        <div className="questionScreen">
            {
                responses.map(response => (
                    <div key={response.question}>
                        <Question question={response.question}/>
                        <div className="answersContainer">
                            {
                                response.answers.map(answer => (
                                    <Answer 
                                        key={answer.id}
                                        answerValue={answer.value}
                                        isSelected={answer.isSelected}
                                        isCorrect={answer.isCorrect}
                                        isChecked={isChecked}
                                        handleClick={() => handleClick(answer.id, response.question)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ))
            }
            {
                !isChecked ?
                    <div>
                        <button className="checkAnswer--button" onClick={checkAnswers}>Check Answers</button>
                    </div>
                : 
                    <div>
                        <span>You scored {correctAnswers}/{responses.length} correct answers</span>
                        <button className="checkAnswer--button" onClick={startQuiz}>Play Again</button>                 
                    </div>
            }
        </div>
    )
    
    return (
        <main>
            {newGame === 0 ? openingScreen : questionScreen}
        </main>
    )
}