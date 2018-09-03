const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

const NextType = Object.freeze({
    EMPTY: '',
    RECHECK: 'recheck',
    START: 'start',
    END: 'end',
    RELEASE: 'release',
    AVAILABLE: 'available'
});

const ValiType = Object.freeze({
    EMPTY: '',
    YES: 'yes',
    NO: 'no',
    MAYBE: 'maybe'
});

const StateType = Object.freeze({
    FINISHED: 'finished',
    RECHECK: 'recheck',
    WAITING: 'waiting',
    READY: 'ready',
    PROGRESS: 'progress'
});

const FinishedType = Object.freeze({
    YES: 'yes',
    NO: 'no',
    MAYBE: 'maybe',
    PROBABLY: 'probably'
});

const SearchKeywords = Object.freeze({
    ...ItemType,
    ...StateType,
    FINISHED: 'finished',
    UNFINISHED: 'unfinished',
    VALI: 'vali',
    CSABA: 'csaba',
    NOPOSTER: 'noposter',
    NOIMDB: 'noimdb'
});

exports.ItemType = ItemType;
exports.NextType = NextType;
exports.ValiType = ValiType;
exports.StateType = StateType;
exports.FinishedType = FinishedType;
exports.SearchKeywords = SearchKeywords;
