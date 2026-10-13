export const reflectionQuestions = [
  {
    key: "thoughts",
    icon: "💭",
    title: "Thoughts / Beliefs / Perceptions",
    hint: "What’s going through your mind?",
  },
  {
    key: "needs",
    icon: "🩷",
    title: "Wants / Needs / Expectations",
    hint: "What do you want or need in this situation?",
  },
  {
    key: "body",
    icon: "✋🏻",
    title: "Body / Actions / Behaviors",
    hint: "What do you notice in your body?",
  },
];

export const emptyAnswers = () =>
  Object.fromEntries(reflectionQuestions.map((q) => [q.key, ""]));
