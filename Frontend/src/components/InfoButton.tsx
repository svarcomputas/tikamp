import '../styles/InfoButton.css';
const InfoButton: React.FC<{onClick: () => void; className: string}> = ({onClick, className}) =>{
    return (
    <div className={className}>
        <button onClick={() => onClick()} className="info-button-component">
            <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C"/>
                <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#1C274C"/>
            </svg>
        </button>
    </div>
    )};

export default InfoButton;