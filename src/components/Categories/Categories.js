import { useContext, useEffect, useState } from 'react';
import Context from '../../context/Context';
import Footer from '../Footer';
import Header from '../Header';
import Button from '../Button';
import DropDown from '../DropDown';
import './Categories.scss';
import { requester } from '../../utils/requester';
import server from '../../config/server';
import CategoryLine from './CategoryLine/CategoryLine';

const Categories = () => {
    const { appState, changeAppState } = useContext(Context);
    const [inputCategoryValue, setInputCategoryValue] = useState('');
    const [inputCategoryValueError, setInputCategoryValueError] = useState('');
    const [transactionCategory, setTransactionCategory] = useState(
        Object.keys(appState.categories)[0]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/categories`,
                    null
                );

                changeAppState({
                    categories: {
                        INCOME: data['INCOME'],
                        EXPENSE: data['EXPENSE'],
                    },
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (
            inputCategoryValue.trim() !== '' &&
            inputCategoryValue.trim().length >= 2
        ) {
            let data = null;
            try {
                data = await requester('POST', `${server}/api/categories`, {
                    name: inputCategoryValue,
                    type: transactionCategory,
                });
            } catch (e) {
                console.log(e);
            }

            if (data && data.created) {
                if (transactionCategory === 'INCOME') {
                    changeAppState({
                        categories: {
                            EXPENSE: appState.categories['EXPENSE'],
                            INCOME: [
                                { id: data.created, name: inputCategoryValue },
                                ...appState.categories['INCOME'],
                            ],
                        },
                    });
                } else {
                    changeAppState({
                        categories: {
                            INCOME: appState.categories['INCOME'],
                            EXPENSE: [
                                { id: data.created, name: inputCategoryValue },
                                ...appState.categories['EXPENSE'],
                            ],
                        },
                    });
                }
            }

            setInputCategoryValueError('');
            setInputCategoryValue('');
        } else {
            setInputCategoryValueError(
                'Invalid category name. Name should be at least 2 symbols.'
            );
        }
    };

    return (
        <>
            <Header />
            <div className='categories-page'>
                {appState.categories['EXPENSE'].length ||
                appState.categories['INCOME'].length ? (
                    <div className='categories-page-active-categories-wrapper'>
                        <h1>Categories</h1>
                        {appState.categories['INCOME'].length ? (
                            <div className='categories-page-active-categories-sub-wrapper'>
                                <h2>INCOME</h2>
                                <div className='categories-page-active-categories-income'>
                                    {appState.categories['INCOME'].map((c) => (
                                        <CategoryLine category={c} key={c.id} />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {appState.categories['EXPENSE'].length ? (
                            <div className='categories-page-active-categories-sub-wrapper'>
                                <h2>EXPENSE</h2>
                                <div className='categories-page-active-categories-expense'>
                                    {appState.categories['EXPENSE'].map((c) => (
                                        <CategoryLine category={c} key={c.id} />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                <div className='categories-page-new-category-wrapper'>
                    <h1>Add New Category</h1>
                    <div className='categories-page-new-category'>
                        <label>Category Name:</label>
                        <input
                            onChange={(e) =>
                                setInputCategoryValue(e.target.value)
                            }
                            value={inputCategoryValue}
                            className={`${
                                inputCategoryValueError
                                    ? 'input-error-filled'
                                    : ''
                            } input-field`}
                        />
                        <p
                            className={`${
                                inputCategoryValueError
                                    ? 'input-error-text-filled'
                                    : ''
                            } input-error-text`}
                        >
                            {inputCategoryValueError}
                        </p>
                        <label>Type:</label>
                        <DropDown
                            data={Object.keys(appState.categories)}
                            selected={transactionCategory}
                            handleChange={setTransactionCategory}
                        />
                    </div>
                    <Button textContent='Add' onClick={handleSubmit} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Categories;
