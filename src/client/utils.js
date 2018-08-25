import moment from 'moment';

export const parseDate = date => {
    const mom = date && (typeof date === 'string'
        ? moment(date, moment.ISO_8601)
        : moment(date)
    );
    return {
        date: mom && mom.toDate(),
        input: mom ? mom.format('YYYY-MM-DD') : '',
        display: mom ? mom.format('YYYY. MM. DD') : ''
    };
};

export const inputDateAddMonth = (dateStr, months) => {
    const mom = dateStr
        ? moment(dateStr, 'YYYY-MM-DD')
        : moment();
    return mom
        .add(months, 'month')
        .format('YYYY-MM-DD');
};

export const season = num => (
    num ? `s${num.toString().padStart(2, '0')}` : ''
);
