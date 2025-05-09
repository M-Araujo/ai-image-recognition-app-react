interface ButtonProps{
    text: string,
    btnClasses?: string,
    onClick?: () => void;  
}

export default function Button({ text, btnClasses, onClick }:ButtonProps) {

    return (
        <button onClick={onClick} className={` min-w-[140px] px-4 py-2 text-sm font-semibold rounded-md ${btnClasses}`}>
           {text} 
        </button>
    );
}

