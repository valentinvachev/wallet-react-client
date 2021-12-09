import { ReactComponent as Remove } from '../assets/remove.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';
import Context from '../../../context/Context';
import { useContext, useState } from 'react';
import Button from '../../Button';
import { requester } from '../../../utils/requester';
import server from '../../../config/server';

const CategoryLine = ({ category }) => {
    const { appState, changeAppState } = useContext(Context);
    const [inputCategoryEditName, setInputCategoryEditName] = useState(
        category.name
    );
    const [inputCategoryEditNameError, setInputCategoryEditNameError] =
        useState('');
    const [isOpenEdit, setOpenEdit] = useState(false);

    const handleOpen = () => {
        setOpenEdit(!isOpenEdit);
    };

    const handleDelete = async (category) => {
        try {
            const data = await requester(
                'DELETE',
                `${server}/api/categories/${category.id}`,
                null
            );

            if (data && data.deleted) {
                changeAppState({
                    categories: {
                        INCOME: appState.categories['INCOME'].filter(
                            (c) => Number(c.id) !== Number(data.deleted)
                        ),
                        EXPENSE: appState.categories['EXPENSE'].filter(
                            (c) => Number(c.id) !== Number(data.deleted)
                        ),
                    },
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleEditWalletName = async () => {
        if (
            inputCategoryEditName.trim() !== '' &&
            inputCategoryEditName.trim().length >= 2
        ) {
            let data = null;
            try {
                data = await requester(
                    'PATCH',
                    `${server}/api/categories/${category.id}`,
                    {
                        name: inputCategoryEditName,
                    }
                );
            } catch (e) {
                console.log(e);
            }

            if (data && data.edited) {
                const categoriesNewIncome = appState.categories.INCOME.map(
                    (c) => {
                        if (c.id === Number(data.edited)) {
                            c.name = inputCategoryEditName;
                        }
                        return c;
                    }
                );

                const categoriesNewExpense = appState.categories.EXPENSE.map(
                    (c) => {
                        if (c.id === Number(data.edited)) {
                            console.log(c);
                            c.name = inputCategoryEditName;
                        }
                        return c;
                    }
                );

                changeAppState({
                    categories: {
                        INCOME: categoriesNewIncome,
                        EXPENSE: categoriesNewExpense,
                    },
                });

                setInputCategoryEditNameError('');
                setOpenEdit(false);
            }
        } else {
            setInputCategoryEditNameError(
                'Invalid category name. Name should be at least 2 symbols.'
            );
        }
    };

    return (
        <>
            <div className='categories-active' key={category.id}>
                <span
                    onClick={handleOpen}
                    className='categories-active-edit-category'
                >
                    <Edit />
                </span>
                <span
                    className='categories-active-remove-category'
                    onClick={() => handleDelete(category)}
                >
                    <Remove />
                </span>
                <span>{category.name}</span>
            </div>
            {isOpenEdit ? (
                <div className='categories-active-edit-category-wrapper'>
                    <label>Name:</label>
                    <input
                        onChange={(e) =>
                            setInputCategoryEditName(e.target.value)
                        }
                        value={inputCategoryEditName}
                        className={`${
                            inputCategoryEditNameError
                                ? 'input-error-filled'
                                : ''
                        } input-field`}
                    />
                    <p
                        className={`${
                            setInputCategoryEditNameError
                                ? 'input-error-text-filled'
                                : ''
                        } input-error-text`}
                    >
                        {inputCategoryEditNameError}
                    </p>
                    <Button
                        textContent='Submit'
                        onClick={handleEditWalletName}
                    />
                </div>
            ) : null}
        </>
    );
};

export default CategoryLine;
