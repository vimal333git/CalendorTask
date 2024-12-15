import moment from 'moment';

export const getDayDetails = (offset = 0) => {
    // Get the current date and apply the offset in days
    const startOfDay = moment().startOf('day').add(offset, 'days'); // Shift the entire day, not just the hours
    
    const hoursArray = [];
    
    // Loop through 24 hours (0 to 23) and generate the hourly timestamps
    for (let i = 0; i < 24; i++) {
        // Clone the start of the day (with the offset applied) and add i hours to each
        const hour = startOfDay.clone().add(i, 'hours').format('YYYY-MM-DD HH:00');
        hoursArray.push(hour);
    }
    
    return hoursArray;
};


export const getWeekDetails = (weekOffset = 0) => {
    const startOfWeek = moment().startOf('isoWeek').add(weekOffset, 'weeks');
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    return weekDays;
}

export const getMonthDetails = (offset = 0) => {
    const monthStart = moment().add(offset, 'months').startOf('month');
    const monthEnd = moment().add(offset, 'months').endOf('month');
    const daysInMonth = monthEnd.date();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = monthStart.clone().date(day);
        dates.push(currentDate.format('YYYY-MM-DD'));
    }
    return dates;
}

export const getYearDetails = (offset = 0) => {
    const year = moment().format('YYYY');
    const adjustedYear = moment(`${year}-01-01`).add(offset, 'years');
    const firstDates = [];

    for (let month = 0; month < 12; month++) {
        const firstDayOfMonth = adjustedYear.clone().month(month).startOf('month').format('YYYY-MM-DD');
        const lastDayOfMonth = adjustedYear.clone().month(month).endOf('month').format('YYYY-MM-DD');
        firstDates.push({ 'start': firstDayOfMonth, 'end': lastDayOfMonth });
    }
    return firstDates;
}

export const createRowWiseHours = (dateList) => {
    var result = [];
    dateList.forEach((item) => {
        var obj = {
            startTime: moment(item).startOf('hour').unix() / 60,
            endTime: moment(item).endOf('hour').unix() / 60,
            events: []
        }
        result.push(obj);
    })
    return result;
}

export const createRowWiseDays = (dateList) => {
    var firstDay = moment(dateList[0]).format('dddd');
    var allData = [];
    for (var i = 0; i < 6; i++) {
        for (var j = 7 * i; j < 7 * i + 7; j++) {
            allData.push({ 'cell_id': j + 1 })
        }
    }
    var startI = 0;
    var endI = startI + allData.length;

    if (firstDay === 'Monday') {
        startI = 0;
    } else if (firstDay === 'Tuesday') {
        startI = 1;
    } else if (firstDay === 'Wednesday') {
        startI = 2;
    } else if (firstDay === 'Thursday') {
        startI = 3;
    } else if (firstDay === 'Friday') {
        startI = 4;
    } else if (firstDay === 'Saturday') {
        startI = 5;
    } else {
        startI = 6;
    }
    var newRecord = [];
    allData.slice(startI, endI).forEach((item, i) => {
        if (dateList[i]) {
            item['date'] = dateList[i];
            item['date_text'] = moment(dateList[i]).format('DD');
            item['startTime'] = moment(dateList[i]).startOf('day').unix() / 60;
            item['endTime'] = moment(dateList[i]).endOf('day').unix() / 60;
        }
        newRecord.push(item)
    })

    allData.splice(startI, endI, ...newRecord)
    var result = [];
    for (var i = 0; i < 6; i++) {
        var obj = { row: i + 1, data: allData.slice(7 * i, i * 7 + 7) }
        result.push(obj)
    }
    return result;
}

export const createRowWiseYear = (dateList) => {
    var data1 = [];
    dateList.slice(0, 7).forEach((item) => {
        const startOfDayUnixInMinutes = moment(item.start).startOf('day').unix() / 60;
        const endOfDayUnixInMinutes = moment(item.end).endOf('day').unix() / 60;
        var obj = {
            start_date: item.start,
            startTime: startOfDayUnixInMinutes,
            end_date: item.end,
            endTime: endOfDayUnixInMinutes,
            events: [],
            month_text: moment(item.start).format('MMMM')

        }
        data1.push(obj)
    })
    var data2 = [];
    dateList.slice(7).forEach((item) => {
        const startOfDayUnixInMinutes = moment(item.start).startOf('day').unix() / 60;
        const endOfDayUnixInMinutes = moment(item.end).endOf('day').unix() / 60;
        var obj = {
            start_date: item.start,
            startTime: startOfDayUnixInMinutes,
            end_date: item.end,
            endTime: endOfDayUnixInMinutes,
            events: [],
            month_text: moment(item.start).format('MMMM')

        }
        data2.push(obj)
    })
    data2.push({})
    data2.push({})
    return [{ 'row': 1, data: data1 }, { 'row': 2, data: data2 }]
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
    const dateString = date_time;
    const unixTimestampInMinutes = moment(dateString).unix() / 60;
    return unixTimestampInMinutes;
}