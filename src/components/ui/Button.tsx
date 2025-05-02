interface ButtonProps{
    text: string,
    btnClasses?: string,
    onClick?: () => void;  
}

export default function Button({ text, btnClasses, onClick }:ButtonProps) {

    return (
        <button onClick={onClick} className={ btnClasses}>
           {text} 
        </button>
    );
}

