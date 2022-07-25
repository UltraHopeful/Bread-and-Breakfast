import React from 'react';
var createReactClass = require('create-react-class');

let iframe =
  '<iframe width="1200" height="1200" src="https://datastudio.google.com/embed/reporting/9aabdde8-54b5-464a-99a4-ef066babefeb/page/6OXyC" frameborder="0" style="border:0" allowfullscreen ></iframe>';

const Dashboard = createReactClass({
  iframe: function () {
    return {
      __html: iframe,
    };
  },

  render: function () {
    return (
      <div>
        <div dangerouslySetInnerHTML={this.iframe()} />
      </div>
    );
  },
});

export default Dashboard;
