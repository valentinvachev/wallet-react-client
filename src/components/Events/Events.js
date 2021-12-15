import { useContext, useEffect } from 'react';
import Context from '../../context/Context';
import Footer from '../Footer';
import Header from '../Header';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Events.scss';
import Button from '../Button';
import { requester } from '../../utils/requester';
import server from '../../config/server';

const Events = () => {
    const { appState, changeAppState } = useContext(Context);
    const [inputEventName, setInputEventName] = useState('');
    const [inputEventNameError, setInputEventNameError] = useState('');
    const [value, onChange] = useState(new Date());
    const [valueEnd, onChangeEnd] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requester(
                    'GET',
                    `${server}/api/events?active=true`,
                    null
                );

                changeAppState({
                    events: data,
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const handleNewEvents = async () => {
        let eventValid = true;

        const dateStart = value;
        dateStart.setHours( dateStart.getHours() + 2 );

        const dateEnd = valueEnd;
        dateEnd.setHours( dateEnd.getHours() + 2 );

        if (inputEventName.trim().length < 2) {
            setInputEventNameError('Invalid event name. Name should be at least 2 symbols.');
            eventValid = false;
        } else if (value > valueEnd) {
            setInputEventNameError('Start date should not be after end date.');
            eventValid = false;
        } else {
            setInputEventNameError('');
        }

        if (eventValid) {
            let data = null;
            try {
                data = await requester('POST', `${server}/api/events`, {
                    name: inputEventName,
                    startDate: dateStart,
                    endDate: dateEnd,
                });

                if (data && data.created) {
                    changeAppState({
                        events: [
                            ...appState.events,
                            {
                                id: data.created,
                                name: inputEventName,
                                startDate: dateStart.toISOString().split('T')[0],
                                endDate: dateEnd.toISOString().split('T')[0],
                            },
                        ],
                    });

                    onChange(new Date());
                    onChangeEnd(new Date());
                    setInputEventName('');
                }
            } catch (e) {
                setInputEventNameError(e.message);
            }
        }
    };

    return (
        <>
            <Header />
            <div className='events-page'>
                {appState.events.length ? (
                    <div className='events-page-active-events-wrapper'>
                        <h1>Active Events</h1>
                        {appState.events.map((e) => (
                            <div
                                key={e.id}
                                className='events-page-active-event'
                            >
                                <span>{e.startDate}</span>
                                <span> - </span>
                                <span>{e.endDate}</span>
                                <span className='events-page-event-name'>
                                    {e.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : null}
                <div className='events-page-new-event-wrapper'>
                    <h1>Add New Event</h1>
                    <label>Event Name:</label>
                    <input
                        onChange={(e) => setInputEventName(e.target.value)}
                        value={inputEventName}
                        className={`${
                            inputEventNameError ? 'input-error-filled' : ''
                        } input-field`}
                    />
                    <p
                        className={`${
                            inputEventNameError ? 'input-error-text-filled' : ''
                        } input-error-text`}
                    >
                        {inputEventNameError}
                    </p>
                    <label>Event Start Date:</label>
                    <div>
                        <Calendar
                            onChange={onChange}
                            value={value}
                            locale='en'
                            minDate={new Date()}
                        />
                    </div>
                    <label>Event End Date:</label>
                    <div>
                        <Calendar
                            onChange={onChangeEnd}
                            value={valueEnd}
                            locale='en'
                            minDate={new Date()}
                        />
                    </div>
                    <Button textContent='Add' onClick={handleNewEvents} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Events;
