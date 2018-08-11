import React from "react";

import "./grid.less";

export default class Grid extends React.Component {
  // pageSize = 10;
  // pageIndex = 1;
  // pageButtonCount = 10;

  defaultRenderer = (item, fieldName) => item[fieldName];

  oweRenderer = (item, fieldName) => {
    return item[fieldName].map((owe, key) => {
      return (
        <div key={key} className={"pd-b-20"}>
          {owe.user} : {owe.amount}
        </div>
      );
    });
  };

  fields = [
    { name: "id", type: "text", width: 150, visible: false, title: "Id" },
    { name: "payer", type: "text", width: 100, title: "Payer" },
    { name: "fullAmount", type: "number", width: 80, title: "Amount" },
    { name: "time", type: "text", width: 100, title: "Time" },
    {
      name: "owe",
      type: "text",
      width: 150,
      title: "Owe",
      renderer: this.oweRenderer
    },
    { name: "description", type: "text", width: 100, title: "Description" }
  ];

  render() {
    const { data = [], onItemSelected } = this.props;

    return (
      <table className="grid">
        <thead>
          <tr>
            {this.fields.filter(f => f.visible !== false).map((f, key) => (
              <td key={key} style={{ width: `${f.width}px` }}>
                {f.title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, key) => (
            <tr key={key} onClick={() => onItemSelected(item)}>
              {this.fields.filter(f => f.visible !== false).map((f, key2) => (
                <td key={key2}>
                  {(f.renderer || this.defaultRenderer)(item, f.name)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  //todo: refac all that shit

  //deleteConfirm: function (item) {
  //return "The item \"" + item.Id + "\" will be removed. Are you sure?";
  //},

  // jQuery('#pager').on('change', function() {
  //   var page = parseInt($(this).val(), 10);
  //   gridLoadData();

  //   $("#transactionGrid").jsGrid("openPage", page);
  // });
}
