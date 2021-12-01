module.exports.getTotalPriority = (priority) =>
  priority.reduce((acc, inc) => acc + inc.Priority.weight, 0);
