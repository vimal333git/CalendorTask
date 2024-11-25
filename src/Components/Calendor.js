import React, { useState, useEffect, Suspense } from 'react';
import { getWeekDetails, converDateToHoursTimeStamp, converDateTimeToMinInUnix } from './Common';
import moment from 'moment'
import './Common.css';
import EventDetails from './eventDateTimeDetails/calendarfromtoenddate.json';
import Left from './icons/left.png';
import Right from './icons/right.png';
import Close from './icons/close.png';
import Events from './Events';

const Dialog = React.lazy(() => import('./Dialog/Dialog'));


const App = () => {

    const timeInHour = [
        "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
        "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
    ];

    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const [dataList, setDataList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [activeWeek, setActiveWeek] = useState(0);
    const [events, setEvents] = useState();
    const [mappedData, setMappedData] = useState([]);
    const [fixedMode, setFixedMode] = useState(false);
    const [fixedModeList, setFixedModeList] = useState(EventDetails);
    const [selectedEventDetails, setSelectedEventDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        handleWeek(activeWeek);
        setEvents(EventDetails);

        setTimeout(() => {
            var id = `${moment().format('h')}_${moment().format('A')}`
            const targetElement = document.getElementById(id);
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 2000);

    }, [])

    const handleWeek = (weekCount) => {
        var date = getWeekDetails(weekCount);
        var hourseWiseDetails = converDateToHoursTimeStamp(date);
        handleMapping(hourseWiseDetails, EventDetails);
        setDataList(hourseWiseDetails)
        setDateList(date)
    }

    const handleMapping = (hourseWiseDetails, EventDetails) => {
        var updatedList = [];
        hourseWiseDetails.forEach((item) => {
            var eachHr = [];
            (item.data).forEach((ele) => {
                var mappedEvent = EventDetails.filter((iValue) => {
                    var startTimeStamp = converDateTimeToMinInUnix(iValue['start']);
                    return (ele['startTime'] <= startTimeStamp) && (ele['endTime'] > startTimeStamp);
                })
                ele['events'] = mappedEvent;
                eachHr.push(ele);
            })
            item['data'] = eachHr;
            updatedList.push(item);
        })
        setMappedData(updatedList)
    }

    const renderHours = () => {
        var html = [];
        timeInHour.forEach((item) => {
            html.push(<span className='hour_cell' tabIndex={'0'} id={`${item.split(' ')?.join('_') || item}`}>{item}</span>)
        })

        return html;
    }

    const renderDateRow = () => {
        var html = [];
        dateList.forEach((item) => {
            html.push(
                <span className={`${fixedMode ? 'date_cell_opactiy_mode_fixed' : 'date_cell_opactiy_mode'} `}>
                    <span>{moment(item).format('DD MMM')}</span>
                    <span>{moment(item).format('dddd')}</span>
                </span>
            )
        })
        return html;
    }

    const selectCell = (cellDetails) => {
        var events = cellDetails['events'];
        if (events.length > 1) {
            setFixedMode(true);
            setFixedModeList(events)
        } else {
            setSelectedEventDetails(events[0])
            setIsOpen(true)
        }
    }

    const clickFixedSelectedEvent = (cellDetails) => {
        setSelectedEventDetails(cellDetails)
        setIsOpen(true)
    }

    const renderDataList = () => {
        var html = [];
        mappedData.forEach((item, i) => {
            var eachRow = <Suspense fallback={<span>Loading...</span>} >
                <Events item={item} selectCell={selectCell} />
            </Suspense>
            html.push(
                <span className='data_cell_row'>{eachRow}</span>
            )
        })
        return html;
    }

    const nextWeekHandle = () => {
        handleWeek(activeWeek + 1)
        setActiveWeek(activeWeek + 1)
    }

    const beforWeekHandle = () => {
        handleWeek(activeWeek - 1)
        setActiveWeek(activeWeek - 1)
    }

    const renderMultipleEvent = () => {
        var html = [];

        var firstCell = fixedModeList[0];
        var position = firstCell?.['job_id']?.['jobRequest_Title'] || '';
        var eventStartTime = moment(firstCell['start']).format("hh:mm A");
        var eventEndTime = moment(firstCell['end']).format("hh:mm A");
        var Time = `${eventStartTime} to ${eventEndTime}`;

        html.push(
            <div className='fixed-container' >
                <div className='subscibed-part2-fixed-first'>
                    <span>position:{position}</span>
                    <span>Time: {Time}</span>
                </div>
            </div>
        )

        fixedModeList.forEach((item) => {
            var firstCell = item;
            var position = firstCell?.['job_id']?.['jobRequest_Title'] || '';
            var eventStartTime = moment(firstCell['start']).format("hh:mm A");
            var eventEndTime = moment(firstCell['end']).format("hh:mm A");
            var Time = `${eventStartTime} to ${eventEndTime}`;
            var InterviewerName = firstCell?.['user_det']?.['handled_by']?.['firstName'] || '-';
            html.push(
                <div className='fixed-container' onClick={() => clickFixedSelectedEvent(item)}>
                    <div className='subscibed-part1-fixed'>
                    </div>
                    <div className='subscibed-part2-fixed'>
                        <span>position:{position}</span>
                        <span>Interviewer: {InterviewerName}</span>
                        <span>Time: {Time}</span>
                    </div>
                </div>
            )
        })
        return html;
    }

    const cleateFixedMode = () => {
        setFixedMode(false)
    }

    const onClose = () => {
        setIsOpen(false)
    }

    const RenderDialog = () => {
        return (
            <Suspense fallback={<span>Loading...</span>} >
                <Dialog onClose={onClose} isOpen={isOpen} eventDetails={selectedEventDetails} />
            </Suspense>
        )
    }

    return (
        <div className='container'>
            {/* <div className='header_container'>
                <div>Todo's</div>
                <div></div>
            </div> */}
            <div className={`calender_interval_container ${fixedMode && 'cover_background'} `}  >
                <div className='duration'>
                    <div className='arrow_con'>
                        <span className='point_cursor' >
                            <img onClick={beforWeekHandle} src={Left} width={25} height={25} />
                        </span>
                        <span className='point_cursor' >
                            <img onClick={nextWeekHandle} src={Right} width={25} height={25} />
                        </span>
                    </div>
                    <div className='duration_con'>
                        <div className='duration_container'>
                            <span className='point_cursor' style={{ 'marginLeft': '10px', 'opacity': '0.3' }}>Today</span>
                            <span className='selected_duration point_cursor' style={{ 'marginLeft': '10px' }}>Week</span>
                            <span className='point_cursor' style={{ 'marginLeft': '10px', 'opacity': '0.3' }}>Month</span>
                            <span className='point_cursor' style={{ 'marginLeft': '10px', 'opacity': '0.3' }}>Year</span>
                        </div>
                    </div>
                </div>
                <div className='calender_container'>
                    <div className='divider'>
                        <div className='hour_list'>
                            {renderHours()}
                        </div>
                        <div className='cell_list'>
                            <div className='date_part'>
                                {renderDateRow()}
                            </div>
                            <div className='cell_part'>
                                {renderDataList()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {RenderDialog()}
            </div>
            <div className='multiple_events_container'>
                {fixedMode && renderMultipleEvent()}
            </div>
            <div className={fixedMode ? 'close_icon_position' : 'hide_close'}>
                <img onClick={cleateFixedMode} src={Close} width={25} height={25} />
            </div>
        </div>
    )
}

export default App;