// implement ordering hereconsole.log("alltasks: ", allTasks);
//console.log("oldalltasks: ", oldAllTasks);
//    fix the order on the state
//    Find the parent id the new alltasks
// const newTaskIndex = allTasks.findIndex(
//   (task) => newTask.id === task.id
// );
// console.log("new task index: ", newTaskIndex);

// filter
// const siblingsCount = allTasks.filter((task) => {
//   return task.parentId == newTask.parentId;
// }).length;

// if (siblingsCount === 0) {
// } else if (siblingsCount === 1) {
//   allTasks[newTaskIndex].order = 0;
// } else if (siblingsCount === 2) {
//   try {
//     if (
//       allTasks[newTaskIndex - 1].parentId == newTask.parentId
//     ) {
//       // Added below the other sibling
//       allTasks[newTaskIndex].order =
//         allTasks[newTaskIndex - 1].order + 1;
//     } else {
//       // Added above the other sibling
//       allTasks[newTaskIndex].order = 0;
//       allTasks[newTaskIndex + 1].order = 1;
//     }
//   } catch {
//     allTasks[newTaskIndex].order = 0;
//     allTasks[newTaskIndex + 1].order = 1;
//   }
// } else {
//   // more than 2 sibling
//   if (allTasks[newTaskIndex - 1].parentId != newTask.parentId) {
//     // the new task is on the first order
//     allTasks[newTaskIndex].order = 0;
//   } else {
//     allTasks[newTaskIndex].order =
//       allTasks[newTaskIndex - 1].order + 1;
//   }
//   for (
//     let i = newTaskIndex + 1;
//     allTasks[i].parentId == newTask.parentId;
//     i++
//   ) {
//     newTask.order = allTasks[i - 1].order + 1;
//     allTasks[newTaskIndex].order = allTasks[i - 1].order + 1;
//   }
// }
// console.log(allTasks);
//console.log("siblings of new task: ", siblings);

// get the reference task / above or below the newtask

// adjust the order of all tasks with same parent id
