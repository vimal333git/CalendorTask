import moment from 'moment';

export const getWeekDetails = (weekOffset = 0) => {
    const startOfWeek = moment().startOf('isoWeek').add(weekOffset, 'weeks'); 
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    return weekDays;
}

export const converDateToHoursTimeStamp = (dateList) => {
    var list = [];
    for (var i = 0; i < 24; i++) {
        var hourData = [];
        dateList.forEach((item) => {
            let startOfDay = moment(item).startOf('day');

            var startTimetamp = startOfDay.clone().add(i, 'hours').unix() / 60;
            var endTimestamp = startOfDay.clone().add(i, 'hours').add(59, 'minutes').add(59, 'seconds').unix() / 60;
        
            var obj = {
                id: `${item}_${startTimetamp}`,
                startTime: startTimetamp,
                endTime: endTimestamp,
                date: item,
                hour: i.toString().padStart(2, '0'),
                active: false,
                events: [],
                multipleEvents: false
            }
            hourData.push(obj);
        })
        var oneRow = {
            'hour': i.toString().padStart(2, '0'),
            'data': hourData
        }
        list.push(oneRow)
    }
    return list;
}

export const converDateTimeToMinInUnix = (date_time) => {
    const dateString =date_time;
    const unixTimestampInMinutes = moment(dateString).unix() / 60;
    return unixTimestampInMinutes;
}