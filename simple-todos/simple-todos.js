if (Meteor.isClient) {
  Template.body.helpers({
    tasks: [
    { text: "Task 1" },
    { text: "Task 2" },
    { text: "Task 3" }
    ]
  });
}