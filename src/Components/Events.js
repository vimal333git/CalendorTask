import moment from "moment";
import { converDateTimeToMinInUnix } from './Common';

const calculateHeight = (min) => {
    var oneMinHeight = 10 / 60;
    var calcMin = oneMinHeight * Number(min);
    return calcMin;
}

const calculatedMarginTop = (min, IntervalFromTop) => {
    min = min + IntervalFromTop * 2
    if (min > 60) {
        var oneMinHeight = 10 / 60;
        var calcMin = oneMinHeight * Number(min - 60);
        return calcMin;
    } else {
        return 0;
    }
}

const calculatedMarginBottom = (min, IntervalFromTop) => {
    min = min + IntervalFromTop * 2
    if (min < 60) {
        var oneMinHeight = 10 / 60;
        var calcMin = oneMinHeight * Number(60 - min);
        return calcMin;
    } else {
        return 0;
    }
}

const RenderEachRow = (props) => {
    var html = [];
    props.item.data.forEach((cell, index) => {
        var active = (cell['events']).length > 0 ? true : false;
        var firstEvent = active ? cell['events']?.[0] || {} : {};
        var noOfInterview = (cell['events']).length > 1 ? true : false;
        var position = firstEvent?.['job_id']?.['jobRequest_Title'] || '';
        var InterviewerName = firstEvent?.['user_det']?.['handled_by']?.['firstName'] || '-';
        var eventStartTime = moment(firstEvent['start']).format("hh:mm A");
        var eventEndTime = moment(firstEvent['end']).format("hh:mm A");
        var Time = `${eventStartTime} to ${eventEndTime}`;
        var totalTimeInMin = eventStartTime && eventEndTime ? Number(converDateTimeToMinInUnix(firstEvent['end'])) - Number(converDateTimeToMinInUnix(firstEvent['start'])) : 60;
        var IntervalFromTop = Number(moment(firstEvent['start']).format('mm'));
        html.push(
            <span className='data_cell' >
                <div className={`${active && 'subscibed'}`}
                    onClick={() => props.selectCell(cell)}
                    style={{
                        height: `${calculateHeight(totalTimeInMin)}vh`,
                        marginTop: `${calculatedMarginTop(totalTimeInMin, IntervalFromTop)}vh`,
                        marginBottom: `${calculatedMarginBottom(totalTimeInMin, IntervalFromTop)}vh`
                    }}
                >
                    <div className={`${(cell['events']).length > 1 ? 'subscibed-part1_muti_event' : 'subscibed-part1'} `}>
                        {
                            noOfInterview ? <span className='count'>{(cell['events']).length}</span> : ''
                        }
                    </div>
                    {
                        active ?
                            <div className='subscibed-part2'>
                                <span>{position}</span>
                                <span>Interviewer: {InterviewerName}</span>
                                <span>Time: {Time}</span>
                            </div> : ''
                    }
                </div>
            </span>
        )
    })
    return html;
}

export default RenderEachRow;