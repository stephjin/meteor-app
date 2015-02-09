// Server-side = sets up MongoDB collection
// Client-side = creates a cache connected to server collection
Tasks = new Mongo.Collection("tasks");

// This code only runs on the client
if (Meteor.isClient) {

  // Pass data into temapltes from JS by defining helpers
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  // Call function when submit is hit on form
  // key = describe the event to listen for (listening for submit event on any element matching selector .new-task)
  // value = event handlers that are called when event happens
  Template.body.events({
    "submit .new-task": function(event) {
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  // Logic for toggling checkbox
  // This refers to individual task object
  Template.task.events({
    "click .toggle-checked": function() {
      // 1st arg, selector that identifies subset of the collection. 2nd arg, update parameters that specifies what should be done to matched objects
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function() {
      Tasks.remove(this._id);
    }
  });
}