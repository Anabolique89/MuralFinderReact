export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', weekday: 'long', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};


