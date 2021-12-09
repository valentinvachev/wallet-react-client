import './DropDownItem.scss';

const DropDownItem = ({ item, handleItemClick, selectedItem }) => {
    return (
        <div
            className={`${
                selectedItem === item ? 'selected' : ''
            } dropdown-item`}
            onClick={() => handleItemClick(item)}
        >
            {item}
        </div>
    );
};

export default DropDownItem;
