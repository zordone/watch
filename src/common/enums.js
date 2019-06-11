// TODO: find a way so we can use this from both node and browser. (remove enums-node.js)

export const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

export const NextType = Object.freeze({
    EMPTY: '',
    RECHECK: 'recheck',
    START: 'start',
    END: 'end',
    RELEASE: 'release',
    AVAILABLE: 'available'
});

export const ValiType = Object.freeze({
    EMPTY: '',
    YES: 'yes',
    NO: 'no',
    MAYBE: 'maybe'
});

export const StateType = Object.freeze({
    FINISHED: 'finished',
    RECHECK: 'recheck',
    WAITING: 'waiting',
    READY: 'ready',
    PROGRESS: 'progress',
    QUIT: 'quit'
});

export const FinishedType = Object.freeze({
    YES: 'yes',
    NO: 'no',
    MAYBE: 'maybe',
    PROBABLY: 'probably',
    QUIT: 'quit'
});

export const RatingType = Object.freeze({
    EMPTY: '',
    DISLIKE: 'dislike',
    LIKE: 'like',
    FAVORITE: 'favorite'
});

export const SearchKeywords = Object.freeze({
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

export const SortComparators = Object.freeze({
    DEFAULT: 'default',
    CREATED: 'created',
    UPDATED: 'updated'
});

export const Const = Object.freeze({
    NEW: 'new'
});
