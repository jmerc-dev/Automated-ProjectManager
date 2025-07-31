export const TaskList = () => {
  const tasks = [
    { id: 1, name: "Design", start: 1, duration: 3 },
    { id: 2, name: "Development", start: 4, duration: 5 },
    { id: 3, name: "Testing", start: 9, duration: 2 },
  ];

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="mb-2">
          <span className="font-medium">{task.name}</span>
        </li>
      ))}
    </ul>
  );
};
