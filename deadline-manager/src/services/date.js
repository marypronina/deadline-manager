export function formatDate(date) {
    date = new Date(date);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    return formattedDate;
}