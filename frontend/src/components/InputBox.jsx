/* eslint-disable react/prop-types */
const InputBox = ({label,placeholder,changeHandle,value})=> {
    return (
        <div className="flex flex-col gap-1"> 
            <label className="text-slate-800 font-bold text-sm">{label}</label>
             <input type="text" value={value} placeholder={placeholder} className="placeholder-slate-400 placeholder:text-xs border border-slate-200 rounded-md outline-none px-2 py-1" onChange={(e)=>changeHandle(e.target.value)}/>
        </div>
    )
}

export default InputBox
