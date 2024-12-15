import moment from "moment";

const RenderEachCellWeek = (props) => {
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
        html.push(
            <span className='data_cell' style={{ height: '14vh', flexDirection: 'column' }} >
                {props.activerTimeFrame === 'Month' && (cell?.date_text || '')}
                <div className={`${active && 'subscibed'}`} onClick={() => props.selectCell(cell)} >
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

export default RenderEachCellWeek;