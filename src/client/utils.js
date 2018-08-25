import moment from 'moment';

export const parseDate = dateStr => {
    const mom = dateStr && moment(dateStr, moment.ISO_8601);
    return {
        date: mom && mom.toDate(),
        input: mom ? mom.format('YYYY-MM-DD') : '',
        display: mom ? mom.format('YYYY. MM. DD') : ''
    };
};

export const season = num => (
    num ? `s${num.toString().padStart(2, '0')}` : ''
);
