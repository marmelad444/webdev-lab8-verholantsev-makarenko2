const Input = (props) => {
    return(
        <div className="input-group">
            {props.label && <label htmlFor="" className="input-label">{props.label}</label>}
            <input type="text" className="input-field" {...props} />
        </div>
    )
}
export default Input