import { ValiType, FinishedType, SearchKeywords } from '../../common/enums';
import { replaceRomanNumbers } from './utils';

const cleanArray = array =>
    array
        .map(item => (item || '').trim().toLowerCase())
        .filter(Boolean);

const itemSearchData = (item, state) => ({
    text: `${replaceRomanNumbers(item.title, true)} ${item.notes} ${item.description}`.toLowerCase(),
    starts: cleanArray(item.genres),
    equals: cleanArray([
        item.type,
        state.type,
        // finished?
        item.finished === FinishedType.YES
            ? SearchKeywords.FINISHED
            : SearchKeywords.UNFINISHED,
        // vali?
        [ValiType.YES, ValiType.MAYBE].includes(item.withVali)
            ? SearchKeywords.VALI
            : '',
        // csaba?
        item.withVali === ValiType.NO
            ? SearchKeywords.CSABA
            : '',
        // no poster?
        !item.posterUrl
            ? SearchKeywords.NOPOSTER
            : '',
        // no imdb?
        !item.imdbId
            ? SearchKeywords.NOIMDB
            : '',
        // unscraped?
        (item.keywords.length || item.description.length)
            ? ''
            : SearchKeywords.UNSCRAPED,
        // + all the keywords from imdb
        ...item.keywords
    ])
});

export default itemSearchData;
