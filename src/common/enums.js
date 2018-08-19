const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

const NextType = Object.freeze({
    EMPTY: '',
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

exports.ItemType = ItemType;
exports.NextType = NextType;
exports.ValiType = ValiType;
