import { useEffect, useState } from 'react';
import DropDownItem from '../DropDownItem/DropDownItem';
import './DropDown.scss';

const DropDown = ({ placeholder, data, handleChange, selected }) => {
    const [isOpen, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected || null);

    useEffect(() => {
        setSelectedItem(selected);
    }, [selected]);

    const toggleDropdown = () => {
        setOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        handleChange(item);
    };

    return (
        <div className='dropdown-wrapper'>
            <div
                className={`${isOpen ? 'open' : ''} dropdown`}
                onClick={toggleDropdown}
            >
                <div className='dropdown-header'>
                    <div className='dropdown-header-placeholder'>
                        {selectedItem ? selectedItem : placeholder}
                    </div>
                    <span className='arrow' onClick={toggleDropdown}></span>
                </div>
                <div className={`${isOpen ? 'open' : ''} dropdown-body`}>
                    <div className='dropdown-body-inner'>
                        {data.map((item,i) => (
                            <DropDownItem
                                key={`${item}${i}`}
                                item={item}
                                handleItemClick={handleItemClick}
                                selectedItem={selectedItem}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDown;
