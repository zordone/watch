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

exports.ItemType = ItemType;
exports.NextType = NextType;
exports.ValiType = ValiType;
exports.StateType = StateType;
