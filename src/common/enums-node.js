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
    PROGRESS: 'progress',
    QUIT: 'quit'
});

const FinishedType = Object.freeze({
    YES: 'yes',
    NO: 'no',
    MAYBE: 'maybe',
    PROBABLY: 'probably',
    QUIT: 'quit'
});

const RatingType = Object.freeze({
    EMPTY: '',
    DISLIKE: 'dislike',
    LIKE: 'like',
    FAVORITE: 'favorite'
});

const SearchKeywords = Object.freeze({
    ...ItemType,
    ...StateType,
    FINISHED: 'finished',
    UNFINISHED: 'unfinished',
    VALI: 'vali',
    CSABA: 'csaba',
    NOPOSTER: 'noposter',
    NOIMDB: 'noimdb',
    UNSCRAPED: 'unscraped'
});

const SortComparators = Object.freeze({
    DEFAULT: 'default',
    CREATED: 'created',
    UPDATED: 'updated'
});

const Const = Object.freeze({
    NEW: 'new'
});

exports.ItemType = ItemType;
exports.NextType = NextType;
exports.ValiType = ValiType;
exports.StateType = StateType;
exports.FinishedType = FinishedType;
exports.RatingType = RatingType;
exports.SearchKeywords = SearchKeywords;
exports.SortComparators = SortComparators;
exports.Const = Const;
