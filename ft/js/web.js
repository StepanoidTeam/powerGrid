function moneyRound(value) {
    return Math.round(value * 100) / 100;
};


function logout() {
    if (confirm("You will not be able log in back if you will not have an Internet, are you want to log out anyway?")) {
        app.logout()
        //location.href = config.routes.Login;
    }
    return
    false;
}

function refreshGrid() {
    var online = navigator.onLine;
    if (online)
        $("#transactionGrid").jsGrid("loadData");
}

function addTransaction(item) {
    //todo: @vm do not put item on server directly
    // put it into grid/storage
    // then ELSEWHERE try to sync with server, if online === ok
    app.ajax('trans/addorupdate', item, 'POST', refreshGrid);
    return false;
}

//document.forms.transaction.onsubmit = function () {
//    ajax('transaction/save', { AuthToken: CurrentUser().AuthToken }, 'POST', onSaved, onError);
//    return false;
//};

function getCheckedUsers() {
    var users = [];
    $("#add-transaction-users input[type='checkbox']").filter(":checked").each(function (ind, el) {
        var inp = $(el).closest('div').find('input[type="number"]');
        users.push(inp);
    });
    return users;
}

function onPageLoaded() {
    $("#filterByUserId").val(app.context.Settings.filterByUserId);
    var user = app.context.CurrentUser;
    document.getElementById("username").innerText = user.Name;
    document.getElementById("userid").innerText = user.Id;
    document.getElementById("authToken").value = user.AuthToken;

    app.loadCurrentRoom(function () {
        console.log("load room done");
        $("#roomid").text(app.context.CurrentRoom.Id);
        $("#roomname").text(app.context.CurrentRoom.Name);
        $("#room-users").html("");
        for (var userKey in app.context.CurrentRoom.Users) {
            var user = app.context.CurrentRoom.Users[userKey];
            $("#room-users").append("<li onclick='onUserClick(this)' systemId='" + user.Id + "'>" + user.Name + " (" + user.Id + ")</li>");
        }
    });

    $("#transactionGrid").jsGrid({
        height: "100%",
        width: "100%",
        editing: false,
        autoload: true,
        paging: true,
        pageLoading: true,
        pageSize: 10,
        pageIndex: 1,
        pageButtonCount: 10,

        controller: {
            loadData: function (filter) {
                var startIndex = (filter.pageIndex - 1) * filter.pageSize;

                var deferred = $.Deferred();

                var filterByUserId = $("#filterByUserId").val();


                //todo: @vm ESLI error THEN do nothing
                app.ajax("trans/list", { FilterByUserId: filterByUserId, PageIndex: filter.pageIndex - 1, PageSize: filter.pageSize, }, "POST",
                    function (response) {
                        var result = response.data.data;
                        //data: db.clients.slice(startIndex, startIndex + filter.pageSize),
                        //  itemsCount: db.clients.length
                        //return{
                        //data: result.data,
                        //itemsCount: result.totalCount
                        //};
                        $.map(result.data, function (val, i) {
                            var oweText = "";
                            for (var userKey in val.owe) {
                                var user = val.owe[userKey];
                                oweText += "<div class='pd-b-20'>" + user.user + ": " + user.amount + "</div>";
                            }
                            val.oweText = oweText;
                        });
                        deferred.resolve({
                            data: result.data,
                            itemsCount: result.totalCount
                        });
                    });

                return deferred.promise();
            }
        },

        //deleteConfirm: function (item) {
        //return "The item \"" + item.Id + "\" will be removed. Are you sure?";
        //},

        rowClick: function (args) {
            showDetailsDialog("Edit", args.item);
        },

        fields: [
            { name: "id", type: "text", width: 150, visible: false, title: "Id" },
            { name: "payer", type: "text", width: 100, title: "Payer" },
            { name: "fullAmount", type: "number", width: 80, title: "Amount" },
            { name: "time", type: "text", width: 100, title: "Time" },
            { name: "oweText", type: "text", width: 150, title: "Owe" },
            { name: "description", type: "text", width: 100, title: "Description" },
            {
                type: "control",
                modeSwitchButton: false,
                editButton: false,
                headerTemplate: function () {
                    return $("<button>").attr("type", "button").text("Add")
                        .on("click", function () {
                            showDetailsDialog("Add", {});
                        });
                }
            }
        ]
    });

    $("#pager").on("change", function () {
        var page = parseInt($(this).val(), 10);
        $("#transactionGrid").jsGrid("openPage", page);
    });

    $("#detailsDialog").dialog({
        autoOpen: false,
        width: 700,
        close: function () {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });

    $("#detailsForm").validate({
        rules: {
            //description: "required",
            fullAmount: { required: true },
            //address: { required: true, minlength: 10 },
            //country: "required"
        },
        messages: {
            // name: "Please enter name",
            fullAmount: "Please enter valid amount",
            //address: "Please enter address (more than 10 chars)",
            //country: "Please select country"
        },
        submitHandler: function (event) {
            formSubmitHandler(event);
        }
    });

    var formSubmitHandler = $.noop;

    var showDetailsDialog = function (dialogType, item) {
        $("#transactionId").val(item.id);
        $("#description").val(item.description);
        $("#fullAmount").val(item.fullAmount);
        $("#splitEqually").prop("checked", false);
        $("#splitOnYou").prop("checked", false);
        $("#add-transaction-users").html("");

        for (var userKey in app.context.CurrentRoom.Users) {
            var curUserId = app.context.CurrentUser.Id;
            var user = app.context.CurrentRoom.Users[userKey];

            var checked = (curUserId == user.Id ? '' : "checked='checked'");
            var enabled = (curUserId == user.Id ? "disabled='disabled'" : "");
            var val = 0;
            if (dialogType == 'Edit') {
                var found = jQuery.grep(item.owe, function (n, i) { return (n.user == user.Name); })
                if (found.length == 1)
                    val = found[0].amount;
            }
            $("#add-transaction-users")
                .append("<div><input type='checkbox' " + checked + " onclick='userActiveChanged(this, \"" + user.Id
                    + "\");'>" + user.Name + ": " + "<input type='number' " + enabled + " min='0' id='add-trans-user-" + user.Id +
                    "' systemId='" + user.Id + "' onblur='onUserAmtChanged(this);' value='" + val + "' />" + "</div>");
        }

        formSubmitHandler = function (event) {
            saveClient(client, dialogType === "Add");
            event.preventDefault();
            return false;
        };

        $("#detailsDialog").dialog("option", "title", dialogType + " Transaction")
            .dialog("open");
    };
}
var saveClient = function (item, isNew) {
    if ($("#transactionId").val() != '' && !confirm("It's old trnsaction, are you sure you want to change it?")) {
        return false;
    }

    var usersInfo = [];
    $.each(getCheckedUsers(), function (ind, el) {
        var amt = moneyRound(parseFloat($(el).val()));
        if (isNaN(amt))
            amt = 0;
        usersInfo.push({
            UserId: $(el).attr("systemId"),
            Amount: amt
        });
    });
    //save on server
    var item =
    {
        Id: $("#transactionId").val(),
        Description: $("#description").val(),
        Amount: moneyRound(parseFloat($("#fullAmount").val())),
        IsSplitAmountEqually: $("#splitEqually").is(":checked"),
        IsCurrentUserInSplitListToo: $("#splitOnYou").is(":checked"),
        OweUsers: usersInfo
    };

    //Dt
    //Id

    $("#detailsDialog").dialog("close");
    //todo: @vm make all calculations on CLIENT then send calc data to SERVER
    addTransaction(item);
    return false;
};


function onFilterByUserIdChanged() {
    app.context.Settings.filterByUserId = $("#filterByUserId").val();
    app.saveSettings();
    refreshGrid();
}

function onUserClick(item) {
    $("#filterByUserId").val($(item).attr("systemId")).blur();
}

function onUserAmtChanged(item) {
    if ($("#fullAmount").val() == '') {
        $("#fullAmount").val($(item).val());
    }
}

function userActiveChanged(el, userId) {
    var amtInput = $(el).closest('div').find("input[type='number']");
    if ($(el).is(":checked"))
        amtInput.prop('disabled', false);
    else
        amtInput.prop('disabled', true);
}