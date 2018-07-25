const todosArray = [
  { name: "todo1" },
  { name: "todo2" },
  { name: "todo3" }
];

export default {
  get: jest.fn(() => Promise.resolve({ data: todosArray })),
  post: jest.fn(() => Promise.resolve())
};

