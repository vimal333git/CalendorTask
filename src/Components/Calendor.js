import React, { useState, useEffect, Suspense } from 'react';
import {
    getWeekDetails, getMonthDetails, converDateToHoursTimeStamp, createRowWiseDays, converDateTimeToMinInUnix,
    getYearDetails, createRowWiseYear, getDayDetails, createRowWiseHours
} from './Common';
import moment from 'moment'
import './Common.css';
import EventDetails from './eventDateTimeDetails/calendarfromtoenddate.json';
import Left from './icons/left.png';
import Right from './icons/right.png';
import Close from './icons/close.png';
import EventsDay from './EventsDay';
import EventsWeek from './EventsWeek';
import EventsMonth from './EventsMonth';
import EventsYear from './EventsYear';

const Dialog = React.lazy(() => import('./Dialog/Dialog'));


const App = () => {

    const timeInHour = [
        "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
        "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const series = [
        { frame: 'Day', active: true },
        { frame: 'Week', active: false },
        { frame: 'Month', active: false },
        { frame: 'Year', active: false }
    ]

    const [dateList, setDateList] = useState([]);
    const [activeSeriesTime, setactiveSeriesTime] = useState(0);
    const [events, setEvents] = useState();
    const [mappedData, setMappedData] = useState([]);
    const [fixedMode, setFixedMode] = useState(false);
    const [fixedModeList, setFixedModeList] = useState(EventDetails);
    const [selectedEventDetails, setSelectedEventDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [activerTimeFrame, setactiverTimeFrame] = useState('Day');
    const [timeSeries, setTimeSeries] = useState(series);
    const [dateIndicator, setDateIndicator] = useState('');

    useEffect(() => {
        handleSeriesOfRecord(activeSeriesTime, activerTimeFrame);
        setEvents(EventDetails);

        // console.log(getMonthDetails(-2))

        // setTimeout(() => {
        //     var id = `${moment().format('h')}_${moment().format('A')}`
        //     const targetElement = document.getElementById(id);
        //     targetElement.scrollIntoView({
        //         behavior: "smooth",
        //         block: "center"
        //     });
        // }, 2000);

    }, [])

    const handleSeriesOfRecord = (activeSeriesTime, activerTimeFrame) => {
        if (activerTimeFrame === 'Day') {
            var date = getDayDetails(activeSeriesTime);
            var text = moment(date[0]).format('DD MMMM YYYY');
            setDateIndicator(text)
            var createRowWiseRecord = createRowWiseHours(date);
            handleMappingDay(createRowWiseRecord, EventDetails);
        } else if (activerTimeFrame === 'Week') {
            var date = getWeekDetails(activeSeriesTime);
            var text = moment(date[0]).format('MMMM YYYY');
            setDateIndicator(text)
            var createRowWiseRecord = converDateToHoursTimeStamp(date);
            handleMappingWeek(createRowWiseRecord, EventDetails);
            setDateList(date)
        } else if (activerTimeFrame === 'Month') {
            var date = getMonthDetails(activeSeriesTime);
            var text = moment(date[0]).format('MMMM YYYY');
            setDateIndicator(text)
            var createRowWiseRecord = createRowWiseDays(date);
            handleMappingMonth(createRowWiseRecord, EventDetails);
            setDateList(weekDays)
        } else if (activerTimeFrame === 'Year') {
            var date = getYearDetails(activeSeriesTime);
            var text = moment(date?.[0]?.['start']).format('YYYY')
            setDateIndicator(text)
            var createRowWiseRecord = createRowWiseYear(date);
            handleMappingYear(createRowWiseRecord, EventDetails)
        }
    }

    const timeFrameChange = (item) => {
        setactiverTimeFrame(item.frame)
        setactiveSeriesTime(0);
        handleSeriesOfRecord(0, item.frame)
        setTimeSeries(timeSeries.map((ele) => {
            if (ele['frame'] === item['frame']) {
                ele['active'] = true;
            } else {
                ele['active'] = false;
            }
            return ele;
        }))
    }

    const handleMappingDay = (hourseWiseDetails, EventDetails) => {
        var eachHr = [];
        (hourseWiseDetails).forEach((ele) => {
            var mappedEvent = EventDetails.filter((iValue) => {
                var startTimeStamp = converDateTimeToMinInUnix(iValue['start']);
                return (ele['startTime'] <= startTimeStamp) && (ele['endTime'] > startTimeStamp);
            })
            ele['events'] = mappedEvent;
            eachHr.push(ele);
        })
        setMappedData(eachHr)
    }

    const handleMappingWeek = (hourseWiseDetails, EventDetails) => {
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

    const handleMappingYear = (hourseWiseDetails, EventDetails) => {
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

    const handleMappingMonth = (createRowWiseRecord, EventDetails) => {
        var updatedList = [];
        createRowWiseRecord.forEach((item) => {
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
            if (activerTimeFrame === 'Week') {
                html.push(
                    <span className={`${fixedMode ? 'date_cell_opactiy_mode_fixed' : 'date_cell_opactiy_mode'} `}>
                        <span>{moment(item).format('DD MMM')}</span>
                        <span>{moment(item).format('dddd')}</span>
                    </span>
                )
            } else if (activerTimeFrame === 'Month') {
                html.push(
                    <span className='date_cell_opactiy_mode_fixed'>{item}</span>
                )
            } else {
                return '';
            }

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
                {
                    activerTimeFrame === 'Day' ? <EventsDay item={item} selectCell={selectCell} /> :
                        activerTimeFrame === 'Week' ? <EventsWeek item={item} activerTimeFrame={activerTimeFrame} selectCell={selectCell} /> :
                            activerTimeFrame === 'Month' ? <EventsMonth item={item} activerTimeFrame={activerTimeFrame} selectCell={selectCell} /> :
                                activerTimeFrame === 'Year' ? <EventsYear item={item} activerTimeFrame={activerTimeFrame} selectCell={selectCell} /> : ''

                }
            </Suspense>
            html.push(
                <span className='data_cell_row'>{eachRow}</span>
            )
        })
        return html;
    }

    const nextWeekHandle = () => {
        handleSeriesOfRecord(activeSeriesTime + 1, activerTimeFrame)
        setactiveSeriesTime(activeSeriesTime + 1)
    }

    const beforWeekHandle = () => {
        handleSeriesOfRecord(activeSeriesTime - 1, activerTimeFrame)
        setactiveSeriesTime(activeSeriesTime - 1)
    }

    const renderMultipleEvent = () => {
        var html = [];

        var firstCell = fixedModeList[0];
        var position = firstCell?.['job_id']?.['jobRequest_Title'] || '';
        var eventStartTime = moment(firstCell['start']).format("hh:mm A");
        var eventEndTime = moment(firstCell['end']).format("hh:mm A");
        var Time = `${eventStartTime} to ${eventEndTime}`;

        // html.push(
        //     <div className='fixed-container' >
        //         <div className='subscibed-part2-fixed-first'>
        //             <span>position:{position}</span>
        //             <span>Time: {Time}</span>
        //         </div>
        //     </div>
        // )

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
                        <span>Date: {moment(item.start).format('DD MMM YYYY')}</span>
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
            {/* {dateIndicator} */}
            <div className={`calender_interval_container ${fixedMode && 'cover_background'} `}  >
                <div className='duration' style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                    <div className='arrow_con'>
                        <span className='point_cursor' >
                            <img onClick={beforWeekHandle} src={Left} width={25} height={25} />
                        </span>
                        <span className='point_cursor' >
                            <img onClick={nextWeekHandle} src={Right} width={25} height={25} />
                        </span>
                    </div>
                    <div>
                        {dateIndicator}
                    </div>
                    <div className='duration_con'>
                        <div className='duration_container'>
                            {
                                timeSeries.map((item) => <span onClick={() => timeFrameChange(item)} className={`point_cursor ${item.active ? 'selected_duration' : ''}`} style={{ 'marginLeft': '10px', 'opacity': item.active ? '1' : '0.3' }}>{item.frame}</span>)
                            }
                        </div>
                    </div>
                </div>
                <div className='calender_container'>
                    <div className='divider'>
                        <div className='hour_list' style={{ 'visibility': `${activerTimeFrame === 'Day' || activerTimeFrame === 'Week' ? 'visible' : 'hidden'}`, 'marginTop': `${activerTimeFrame === 'Day' ? '0vh' : '10vh'}` }}>
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