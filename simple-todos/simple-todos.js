// Server-side = sets up MongoDB collection
// Client-side = creates a cache connected to server collection
Tasks = new Mongo.Collection("tasks");

// This code only runs on the client
if (Meteor.isClient) {

  // Pass data into temapltes from JS by defining helpers
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  // Call function when submit is hit on form
  // key = describe the event to listen for (listening for submit event on any element matching selector .new-task)
  // value = event handlers that are called when event happens
  Template.body.events({
    "submit .new-task": function(event) {
      var text = event.target.text.value;

      Meteor.call("addTask", text);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    // store temp reactive state
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  // Logic for toggling checkbox
  // This refers to individual task object
  Template.task.events({
    "click .toggle-checked": function() {
      // 1st arg, selector that identifies subset of the collection. 2nd arg, update parameters that specifies what should be done to matched objects
      // Tasks.update(this._id, {$set: {checked: ! this.checked}}); <- this is changed once insecure is removed
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function() {
      // Tasks.remove(this._id); <- this is changed once insecure is removed
      Meteor.call("deleteTask", this._id);
    }
  });

  // Configure the accounts UI to use usernames instead of emails
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

// Need to define methods once insecure package is removed 
Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});