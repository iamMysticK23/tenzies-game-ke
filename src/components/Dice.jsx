/* eslint-disable react/prop-types */


export default function Dice(props) {
    // set style for dice
    const styles = {
        backgroundColor: props.isHeld ? '#59E391' : 'whitesmoke'
    }

    return (
        <div className="dice-face" style={styles} onClick={props.holdDice}>
            <h2 className="dice-num">{props.value}</h2>
        </div>
    )

}