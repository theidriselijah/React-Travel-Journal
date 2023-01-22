import React from "react"

export default function Answer(props) {
    
    function changeColor() {
        if (!props.isChecked && props.isSelected) {
            return ("selected")
        } else if (props.isChecked && props.isSelected && props.isCorrect) {
            return ("correct")
        } else if (props.isChecked && !props.isSelected && props.isCorrect) {
            return ("notselected-correct")
        } else if (props.isChecked && props.isSelected && !props.isCorrect) {
            return ("incorrect")
        } else if (props.isChecked && !props.isSelected) {
            return ("notselected")
        }
    }
    
    return (
        <div onClick={props.handleClick}>
            <p className={`answer ${changeColor()}`}>{props.answerValue}</p>
        </div>
    )
}