const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

module.exports = {
  methods(self, options) {
    return {
      denormalizeDatesAndTimes(piece) {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const zone = process.env.TIMEZONE || 'America/New_York';

        // Parse our dates and times
        let startTime = piece.startTime;
        const startDate = piece.startDate;
        let endTime = piece.endTime;
        let endDate;

        if (piece.dateType === 'consecutive') {
          endDate = piece.endDate;
        } else {
          piece.endDate = piece.startDate;
          endDate = piece.startDate;
        }

        if (piece.allDay) {
          startTime = '00:00:00';
          endTime = '23:59:59';
        }

        if (piece.dateType === 'repeat') {
          piece.hasClones = true;
        }

        const start = dayjs.tz(`${startDate} ${startTime}`, zone);
        const end = dayjs.tz(`${endDate} ${endTime}`, zone);
        console.log('tz ', start, end);
        piece.start = new Date(startDate + ' ' + startTime);
        piece.end = new Date(endDate + ' ' + endTime);
        console.log('date ', piece.start, piece.end);
      }
    };
  },
};
