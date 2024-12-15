import moment from "moment";



const EventsDay = (props) => {
    var cell = props.item;
    var active = (cell['events']).length > 0 ? true : false;
    var firstEvent = active ? cell['events']?.[0] || {} : {};
    var noOfInterview = (cell['events']).length > 1 ? true : false;
    var position = firstEvent?.['job_id']?.['jobRequest_Title'] || '';
    var InterviewerName = firstEvent?.['user_det']?.['handled_by']?.['firstName'] || '-';
    var eventStartTime = moment(firstEvent['start']).format("hh:mm A");
    var eventEndTime = moment(firstEvent['end']).format("hh:mm A");
    var Time = `${eventStartTime} to ${eventEndTime}`;
    return (
        <div style={{ 'width': '91vw', 'height': '10vh', 'box-sizing': 'border-box', 'border': '1px #dfe7e7 solid' }}>
            <div className={`${active && 'subscibed'}`} style={{ 'width': '14vw', 'cursor': 'pointer' }} onClick={() => props.selectCell(cell)} >
                <div style={{ 'width': '2vw' }} className={`${(cell['events']).length > 1 ? 'subscibed-part1_muti_event' : 'subscibed-part1'} `}>
                    {
                        noOfInterview ? <span className='count'>{(cell['events']).length}</span> : ''
                    }
                </div>
                {
                    active ?
                        <div className='subscibed-part2' style={{ 'width': '12vw' }}>
                            <span>{position}</span>
                            <span>Interviewer: {InterviewerName}</span>
                            <span>Time: {Time}</span>
                        </div> : ''
                }
            </div>
        </div>
    )
}

export default EventsDay;