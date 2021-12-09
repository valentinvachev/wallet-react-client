import './Button.scss';

const Button = ({ textContent, onClick }) => {
    return (
        <button onClick={onClick} className='button'>
            {textContent}
        </button>
    );
};

export default Button;
