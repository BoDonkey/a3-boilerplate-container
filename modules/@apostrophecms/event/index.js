const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

module.exports = {
  init(self) {
    self.apos.template.addFilter({
      localizeDate: self.localizeDate
    });
  },
  handlers(self) {
    return {
      '@apostrophecms/page:beforeSend': {
        webpack(req) {
          req.data.timezone = process.env.TIMEZONE || 'America/New_York';
        }
      }
    };
  },
  methods(self) {
    return {
      denormalizeDatesAndTimes(piece) {
        console.log('denormalizeDatesAndTimes called!', process.env.TIMEZONE);
        dayjs.extend(utc);
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

        piece.start = new Date(startDate + 'T' + startTime + 'Z');
        piece.end = new Date(endDate + 'T' + endTime + 'Z');
      },
      localizeDate(date, format, allDay = false, zone = 'America/New_York') {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        if (!date) {
          return '';
        }
        const baseDate = dayjs(date);
        const utcDate = baseDate.utc().format(format);
        const localizedDate = baseDate.tz(zone).format(format);
        return allDay ? utcDate : localizedDate;
      }
    };
  }
};
