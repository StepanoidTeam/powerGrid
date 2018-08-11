import React from "react";
import jQuery from "jquery";
import app from "./app.js";

const title = "react grid test component";

export default class Grid extends React.Component {
  pageSize = 10;
  pageIndex = 1;
  pageButtonCount = 10;

  render() {
    return <div>{title}</div>;
  }

  loadData(filter) {
    var startIndex = (filter.pageIndex - 1) * filter.pageSize;

    var deferred = $.Deferred();

    var filterByUserId = $("#filterByUserId").val();

    //todo: @vm ESLI error THEN do nothing
    app.ajax(
      "trans/list",
      {
        FilterByUserId: filterByUserId,
        PageIndex: filter.pageIndex - 1,
        PageSize: filter.pageSize
      },
      "POST",
      function(response) {
        var result = response.data.data;
        //data: db.clients.slice(startIndex, startIndex + filter.pageSize),
        //  itemsCount: db.clients.length
        //return{
        //data: result.data,
        //itemsCount: result.totalCount
        //};
        $.map(result.data, function(val, i) {
          var oweText = "";
          for (var userKey in val.owe) {
            var user = val.owe[userKey];
            oweText +=
              "<div class='pd-b-20'>" +
              user.user +
              ": " +
              user.amount +
              "</div>";
          }
          val.oweText = oweText;
        });
        deferred.resolve({
          data: result.data,
          itemsCount: result.totalCount
        });
      }
    );

    return deferred.promise();
  }

  //todo: refac all that shit

  //deleteConfirm: function (item) {
  //return "The item \"" + item.Id + "\" will be removed. Are you sure?";
  //},

  rowClick = function(args) {
    showDetailsDialog("Edit", args.item);
  };

  fields = [
    { name: "id", type: "text", width: 150, visible: false, title: "Id" },
    { name: "payer", type: "text", width: 100, title: "Payer" },
    { name: "fullAmount", type: "number", width: 80, title: "Amount" },
    { name: "time", type: "text", width: 100, title: "Time" },
    { name: "oweText", type: "text", width: 150, title: "Owe" },
    { name: "description", type: "text", width: 100, title: "Description" }
  ];
}
