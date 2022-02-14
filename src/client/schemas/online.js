let online = false;

const toggleStatus = () => {
    online = !online;
}

const getStatus = () => online;

exports.getStatus = getStatus;
exports.toggleStatus = toggleStatus;