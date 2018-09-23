/* globals window,document,ResizeObserver */

/**
 * This is just a hacky workaround to achieve a fixed table header.
 *
 * The built in <TableHead> can be styled to be fixed, but then the column auto-width
 * feature stops working.
 *
 * The only way I could solve this is to:
 * - Make a separate header div, position over the original header.
 * - Create cell divs in it, by copying attributes from the original header cells.
 * - Put ResizeObservers on the original header cells and when they resize,
 *   update the copied cell widths according the original cell widths.
 */

const fixedHeaderWorkaround = () => {
    if (!window.ResizeObserver) {
        console.log('ResizeObserver is not supported. Fixed header disabled.');
        return;
    }
    const cells = document.querySelectorAll('.ItemTable-head th');
    const fragment = document.createDocumentFragment();
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
    cells.forEach(cell => observer.observe(cell));
};

export default fixedHeaderWorkaround;
