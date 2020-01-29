var autoRefreshCount = 0;
var autoRefreshIntervalId = null;

function refreshTimeTable() {
    $.getJSON("/timeTable", function (timeTable) {
        refreshSolvingButtons(timeTable.solverStatus != null && timeTable.solverStatus !== "NOT_SOLVING");
        $("#score").text("Score: "+ (timeTable.score == null ? "?" : timeTable.score));

        var timeTableByRoom = $("#timeTableByRoom");
        timeTableByRoom.children().remove();
        var timeTableByTeacher = $("#timeTableByTeacher");
        timeTableByTeacher.children().remove();
        var timeTableByStudentGroup = $("#timeTableByStudentGroup");
        timeTableByStudentGroup.children().remove();
        var unassignedLessons = $("#unassignedLessons");
        unassignedLessons.children().remove();

        var theadByRoom = $("<thead>").appendTo(timeTableByRoom);
        var headerRowByRoom = $("<tr>").appendTo(theadByRoom);
        headerRowByRoom.append($("<th>Timeslot</th>"));
        $.each(timeTable.roomList, function (index, room) {
            headerRowByRoom.append($("<th>"
                    + "<span>" + room.name + "</span>"
                    + "<button id=\"deleteRoomButton-" + room.id + "\" type=\"button\" class=\"ml-2 mb-1 btn btn-light btn-sm p-1\">"
                    + "<small class=\"fas fa-trash\"></small>"
                    + "</button>"
                    + "</th>"));
            $("#deleteRoomButton-" + room.id).click(function() {
                deleteRoom(room);
            });
        });
        var theadByTeacher = $("<thead>").appendTo(timeTableByTeacher);
        var headerRowByTeacher = $("<tr>").appendTo(theadByTeacher);
        headerRowByTeacher.append($("<th>Timeslot</th>"));
        const teacherList = [...new Set(timeTable.lessonList.map(lesson => lesson.teacher))];
        $.each(teacherList, function (index, teacher) {
            headerRowByTeacher.append($("<th>"
                    + "<span>" + teacher + "</span>"
                    + "</th>"));
        });
        var theadByStudentGroup = $("<thead>").appendTo(timeTableByStudentGroup);
        var headerRowByStudentGroup = $("<tr>").appendTo(theadByStudentGroup);
        headerRowByStudentGroup.append($("<th>Timeslot</th>"));
        const studentGroupList = [...new Set(timeTable.lessonList.map(lesson => lesson.studentGroup))];
        $.each(studentGroupList, function (index, studentGroup) {
            headerRowByStudentGroup.append($("<th>"
                    + "<span>" + studentGroup + "</span>"
                    + "</th>"));
        });

        var tbodyByRoom = $("<tbody>").appendTo(timeTableByRoom);
        var tbodyByTeacher = $("<tbody>").appendTo(timeTableByTeacher);
        var tbodyByStudentGroup = $("<tbody>").appendTo(timeTableByStudentGroup);
        $.each(timeTable.timeslotList, function (index, timeslot) {
            var rowByRoom = $("<tr>").appendTo(tbodyByRoom);
            rowByRoom.append($("<th class=\"align-middle\">"
                    + "<span>" + timeslot.dayOfWeek.charAt(0) + timeslot.dayOfWeek.slice(1).toLowerCase()
                    + " " + moment(timeslot.startTime, "HH:mm:ss").format("HH:mm")
                    + " - " + moment(timeslot.endTime, "HH:mm:ss").format("HH:mm") + "</span>"
                    + "<button id=\"deleteTimeslotButton-" + timeslot.id + "\" type=\"button\" class=\"ml-2 mb-1 btn btn-light btn-sm p-1\">"
                    + "<small class=\"fas fa-trash\"></small>"
                    + "</button>"
                    + "</th>"));
            $("#deleteTimeslotButton-" + timeslot.id).click(function() {
                deleteTimeslot(timeslot);
            });
            $.each(timeTable.roomList, function (index, room) {
                rowByRoom.append($("<td id=\"timeslot" + timeslot.id + "room" + room.id + "\"></td>"));
            });
            var rowByTeacher = $("<tr>").appendTo(tbodyByTeacher);
            rowByTeacher.append($("<th class=\"align-middle\">"
                    + "<span>" + timeslot.dayOfWeek.charAt(0) + timeslot.dayOfWeek.slice(1).toLowerCase()
                    + " " + moment(timeslot.startTime, "HH:mm:ss").format("HH:mm")
                    + " - " + moment(timeslot.endTime, "HH:mm:ss").format("HH:mm") + "</span>"
                    + "</th>"));
            $.each(teacherList, function (index, teacher) {
                rowByTeacher.append($("<td id=\"timeslot" + timeslot.id + "teacher" + convertToId(teacher) + "\"></td>"));
            });
            var rowByStudentGroup = $("<tr>").appendTo(tbodyByStudentGroup);
            rowByStudentGroup.append($("<th class=\"align-middle\">"
                    + "<span>" + timeslot.dayOfWeek.charAt(0) + timeslot.dayOfWeek.slice(1).toLowerCase()
                    + " " + moment(timeslot.startTime, "HH:mm:ss").format("HH:mm")
                    + " - " + moment(timeslot.endTime, "HH:mm:ss").format("HH:mm") + "</span>"
                    + "</th>"));
            $.each(studentGroupList, function (index, studentGroup) {
                rowByStudentGroup.append($("<td id=\"timeslot" + timeslot.id + "studentGroup" + convertToId(studentGroup) + "\"></td>"));
            });
        });

        $.each(timeTable.lessonList, function (index, lesson) {
            let color = pickColor(lesson.subject);
            var lessonElement = $("<div class=\"card lesson\" style=\"background-color: " + color +"\"><div class=\"card-body p-2\">"
                    + "<button id=\"deleteLessonButton-" + lesson.id + "\" type=\"button\" class=\"ml-2 btn btn-light btn-sm p-1 float-right\">"
                    + "<small class=\"fas fa-trash\"></small>"
                    + "</button>"
                    + "<h5 class=\"card-title mb-1\">" + lesson.subject + "</h5>"
                    + "<p class=\"card-text text-muted ml-2 mb-1\">by " + lesson.teacher + "</p>"
                    + "<small class=\"ml-2 mt-1 card-text text-muted align-bottom float-right\">" + lesson.id + "</small>"
                    + "<p class=\"card-text ml-2\">" + lesson.studentGroup + "</p>"
                    + "</div></div>");
            if (lesson.timeslot == null || lesson.room == null) {
                unassignedLessons.append(lessonElement);
            } else {
                $("#timeslot" + lesson.timeslot.id + "room" + lesson.room.id).append(lessonElement);
                var lessonElementWithoutDelete = $("<div class=\"card lesson\" style=\"background-color: " + color +"\"><div class=\"card-body p-2\">"
                        + "<h5 class=\"card-title mb-1\">" + lesson.subject + "</h5>"
                        + "<p class=\"card-text text-muted ml-2 mb-1\">by " + lesson.teacher + "</p>"
                        + "<small class=\"ml-2 mt-1 card-text text-muted align-bottom float-right\">" + lesson.id + "</small>"
                        + "<p class=\"card-text ml-2\">" + lesson.studentGroup + "</p>"
                        + "</div></div>");
                $("#timeslot" + lesson.timeslot.id + "teacher" + convertToId(lesson.teacher)).append(lessonElementWithoutDelete.clone());
                $("#timeslot" + lesson.timeslot.id + "studentGroup" + convertToId(lesson.studentGroup)).append(lessonElementWithoutDelete.clone());
            }
            $("#deleteLessonButton-" + lesson.id).click(function() {
                deleteLesson(lesson);
            });
        });

    });
}

function convertToId(str) {
    // Base64 encoding without padding to avoid XSS
    return btoa(str).replace(/=/g, "");
}

function solve() {
    $.post("/timeTable/solve", function () {
        refreshSolvingButtons(true);
        autoRefreshCount = 16;
        if (autoRefreshIntervalId == null) {
            autoRefreshIntervalId = setInterval(autoRefresh, 2000);
        }
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Start solving failed.", xhr);
    });
}

function refreshSolvingButtons(solving) {
    if (solving) {
        $("#solveButton").hide();
        $("#stopSolvingButton").show();
    } else {
        $("#solveButton").show();
        $("#stopSolvingButton").hide();
    }
}

function autoRefresh() {
    refreshTimeTable();
    autoRefreshCount--;
    if (autoRefreshCount <= 0) {
        clearInterval(autoRefreshIntervalId);
        autoRefreshIntervalId = null;
    }
}

function stopSolving() {
    $.post("/timeTable/stopSolving", function () {
        refreshSolvingButtons(false);
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Stop solving failed.", xhr);
    });
}

function addLesson() {
    var subject = $("#lesson_subject").val().trim();
    $.post("/lessons", JSON.stringify({
        "subject": subject,
        "teacher": $("#lesson_teacher").val().trim(),
        "studentGroup": $("#lesson_studentGroup").val().trim()
    }), function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Adding lesson (" + subject + ") failed.", xhr);
    });
    $('#lessonDialog').modal('toggle');
}

function deleteLesson(lesson) {
    $.delete("/lessons/" + lesson.id, function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Deleting lesson (" + lesson.name + ") failed.", xhr);
    });
}

function addTimeslot() {
    $.post("/timeslots", JSON.stringify({
        "dayOfWeek": $("#timeslot_dayOfWeek").val().trim().toUpperCase(),
        "startTime": $("#timeslot_startTime").val().trim(),
        "endTime": $("#timeslot_endTime").val().trim()
    }), function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Adding timeslot failed.", xhr);
    });
    $('#timeslotDialog').modal('toggle');
}

function deleteTimeslot(timeslot) {
    $.delete("/timeslots/" + timeslot.id, function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Deleting timeslot (" + timeslot.name + ") failed.", xhr);
    });
}

function addRoom() {
    var name = $("#room_name").val().trim();
    $.post("/rooms", JSON.stringify({
        "name": name
    }), function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Adding room (" + name + ") failed.", xhr);
    });
    $("#roomDialog").modal('toggle');
}

function deleteRoom(room) {
    $.delete("/rooms/" + room.id, function () {
        refreshTimeTable();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        showError("Deleting room (" + room.name + ") failed.", xhr);
    });
}

function showError(title, xhr) {
    var serverErrorMessage = !xhr.responseJSON ? `${xhr.status}: ${xhr.statusText}` : xhr.responseJSON.message;
    console.error(title + "\n" + serverErrorMessage);
    var notification = $("<div class=\"toast\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" style=\"min-width: 30rem\">"
            + "<div class=\"toast-header bg-danger\">"
            + "<strong class=\"mr-auto text-dark\">Error</strong>"
            + "<button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\">"
            + "<span aria-hidden=\"true\">&times;</span>"
            + "</button>"
            + "</div>"
            + "<div class=\"toast-body\"><p>" + title + "</p><pre><code>" + serverErrorMessage + "</code></pre></div>"
            + "</div>");
    $("#notificationPanel").append(notification);
    notification.toast({delay: 30000});
    notification.toast('show');
}

$(document).ready( function() {
    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    // Extend jQuery to support $.put() and $.delete()
    jQuery.each( [ "put", "delete" ], function( i, method ) {
        jQuery[method] = function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });


    $("#refreshButton").click(function() {
        refreshTimeTable();
    });
    $("#solveButton").click(function() {
        solve();
    });
    $("#stopSolvingButton").click(function() {
        stopSolving();
    });
    $("#addLessonSubmitButton").click(function() {
        addLesson();
    });
    $("#addTimeslotSubmitButton").click(function() {
        addTimeslot();
    });
    $("#addRoomSubmitButton").click(function() {
        addRoom();
    });

    refreshTimeTable();
});

// ****************************************************************************
// TangoColorFactory
// ****************************************************************************

const SEQUENCE_1 = [0x8AE234, 0xFCE94F, 0x729FCF, 0xE9B96E, 0xAD7FA8];
const SEQUENCE_2 = [0x73D216, 0xEDD400, 0x3465A4, 0xC17D11, 0x75507B];

var colorMap = new Map;
var nextColorCount = 0;

function pickColor(object) {
    let color = colorMap[object];
    if (color !== undefined) {
        return color;
    }
    color = nextColor();
    colorMap[object] = color;
    return color;
}

function nextColor() {
    let color;
    let colorIndex = nextColorCount % SEQUENCE_1.length;
    let shadeIndex = Math.floor(nextColorCount / SEQUENCE_1.length);
    if (shadeIndex === 0) {
        color = SEQUENCE_1[colorIndex];
    } else if (shadeIndex === 1) {
        color = SEQUENCE_2[colorIndex];
    } else {
        shadeIndex -= 3;
        let floorColor = SEQUENCE_2[colorIndex];
        let ceilColor = SEQUENCE_1[colorIndex];
        let base = Math.floor((shadeIndex / 2) + 1);
        let divisor = 2;
        while (base >= divisor) {
            divisor *= 2;
        }
        base = (base * 2) - divisor + 1;
        let shadePercentage = base / divisor;
        color = buildPercentageColor(floorColor, ceilColor, shadePercentage);
    }
    nextColorCount++;
    return "#" + color.toString(16);
}

function buildPercentageColor(floorColor, ceilColor, shadePercentage) {
    let red = (floorColor & 0xFF0000) + Math.floor(shadePercentage * ((ceilColor & 0xFF0000) - (floorColor & 0xFF0000))) & 0xFF0000;
    let green = (floorColor & 0x00FF00) + Math.floor(shadePercentage * ((ceilColor & 0x00FF00) - (floorColor & 0x00FF00))) & 0x00FF00;
    let blue = (floorColor & 0x0000FF) + Math.floor(shadePercentage * ((ceilColor & 0x0000FF) - (floorColor & 0x0000FF))) & 0x0000FF;
    return red | green | blue;
}
