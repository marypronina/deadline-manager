export function chooseColor(bgColor) {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    if (brightness > 0.65) {
        return "#232323";
    } else {
        return "#ededed";
    }
}