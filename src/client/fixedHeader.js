/* globals document,ResizeObserver */

/**
 * This is just a hacky workaround to achieve a fixed table header.
 *
 * The built in <TableHead> can be styled to be fixed, but then the column auto-width
 * feature stops working.
 *
 * The only way I could solve this is to:
 * - Make a separate header div, position over the original header.
 * - Create cell divs in it, by copying attributes from the original header cells.
 * - Put ResizeObservers on the original header and when it resizes,
 *   update the copied cell widths according the original cell widths.
 */

const fixedHeaderWorkaround = () => {
    const fragment = document.createDocumentFragment();
    const cells = document.querySelectorAll('.ItemTable-head th');
    const copies = [];
    cells.forEach(cell => {
        const copy = document.createElement('div');
        copy.className = 'ItemTable-fixedHeaderCell';
        copy.innerHTML = cell.innerHTML;
        fragment.appendChild(copy);
        copies.push(copy);
    });
    const header = document.querySelector('.ItemTable-fixedHeader');
    header.appendChild(fragment);
    const observer = new ResizeObserver(() => {
        cells.forEach((cell, index) => {
            copies[index].style.width = `${cell.clientWidth}px`;
        });
    });
    observer.observe(header);
};

export default fixedHeaderWorkaround;
