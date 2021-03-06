var SummaryTable = function (config) {

    // Inject CSS
    $("head").append(
        [
            $("<link/>", {
                "rel": "stylesheet",
                "href": "webroot/css/summary.css",
                "type": "text/css"
            }),
            $("<link/>", {
                "rel": "stylesheet",
                "media": "print",
                "href": "webroot/css/summary-print.css",
                "type": "text/css"
            }),
        ]
    );

    var _formatDate = function (date) {
        var y,m,d;
        var retVal = "";

        y = date.getFullYear();
        m = date.getMonth() + 1;
        d = date.getDate();

        retVal += d.length === 1
            ? "0" + d
            : d;
        retVal += "/";
        retVal += m.length === 1
            ? "0" + m
            : m;
        retVal += "/";
        retVal += y

        return retVal;
    };

    /**
     * Gets the day suffix for the given day
     * @param  {[type]} day [description]
     * @return {[type]}     [description]
     */
    var _getDaySuffix = function (day) {
        var nst = /([^1]1|^1)$/;
        var nnd = /([^1]2|^2)$/;
        var nrd = /([^1]3|^3)$/;

        if (nst.test(day)) return "st";
        if (nnd.test(day)) return "nd";
        if (nrd.test(day)) return "rd";
        return "th";
    }

    /**
     * Gets the date as "{DayName} the {d}{suffix} of {monthName}, {y}}"
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    var _dateAsReadable = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();
        var dow = date.getDay();

        var days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]

        var dayName = days[dow];
        var suffix = _getDaySuffix(d);
        var monthName = months[m];

        return dayName + " the " + d + "<sup>" + suffix + "</sup> of " + monthName + ", " + y;
    };

    var getModalMessage = function(booking) {
        return "Are you sure you wish to mark the booking on " + _dateAsReadable(new Date(booking.bookingDate)) +
            " for the session at " + booking.bookingStart + " as " + (booking.paid ? "unpaid" : "paid") + "?";
    }

    var _dateRangeAsReadable = function(startDate, endDate) {
        var y = startDate.getFullYear();
        var m = startDate.getMonth();
        var sD = startDate.getDate();
        var eD = endDate.getDate()
        var sDow = startDate.getDay();
        var eDow = endDate.getDay();

        var days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]

        var startDayName = days[sDow];
        var endDayName = days[eDow];
        var startSuffix = _getDaySuffix(sD);
        var endSuffix = _getDaySuffix(eD);
        var monthName = months[m];

        return startDayName + " the " + sD + "<sup>" + startSuffix + "</sup>" + " to " + endDayName + " the " + eD + "<sup>" + endSuffix + "</sup>" + " of " + monthName + ", " + y;
    }

    var createRow = function (summTable, booking, showPaidCol) {
        var paidCol = $("<td></td>", {
            class: "booking-paid booking-cell",
            html: [
                $("<a></a>", {
                    class: "booking-paid-toggle",
                    text: booking.paid ? "Paid" : "Not Paid",
                    on: {
                        click: function (event) {
                            var modal = new Modal({
                                type: ModalType.YesNo,
                                message: getModalMessage(booking),
                                yes: function (modal) {
                                    modal.close();
                                    var data;

                                    if (booking.isRecurring) {
                                        data = {
                                            bookingId: booking.bookingId,
                                            forDate: booking.bookingDate,
                                        };
                                    } else {
                                        data = {
                                            bookingId: booking.bookingId,
                                        };
                                    }

                                    $.ajax({
                                        data: data,
                                        method: "POST",
                                        url: "/bookings/api/bookings/" + (booking.paid ? "unpaid" : "paid"),
                                        success: function (response) {
                                            booking.paid = !booking.paid;
                                            $("#" + booking.bookingId + " .booking-paid-toggle").text((booking.paid ? "Paid" : "Not Paid"));
                                        },
                                        error: function (response) {
                                            response = JSON.parse(response.responseText);

                                            var modal = new Modal({
                                                title: "Error",
                                                message: response.message,
                                                type: ModalType.Ok
                                            })
                                        }
                                    })
                                },
                                no: function (modal) {
                                    modal.close();
                                }
                            });

                            modal.show();
                        }
                    }
                })
            ]
        });

        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        var fullDate = new Date(booking.bookingDate + ' ' + booking.bookingStart);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Today plus one
        var canCancel = fullDate > tomorrow;

        return $("<tr></tr>", {
            class: "booking-row",
            id: booking.bookingId,
            "data-instance": booking.bookingDate.replace(/\-/g, ""),
            html: [
                $("<td></td>", {
                    class: "booking-date booking-cell",
                    text: _formatDate(new Date(booking.bookingDate))
                }),
                $("<td></td>", {
                    class: "booking-day booking-cell",
                    text: days[(new Date(booking.bookingDate)).getDay()]
                }),
                $("<td></td>", {
                    class: "booking-username booking-cell",
                    text: booking.username
                }),
                $("<td></td>", {
                    class: "booking-displayname booking-cell",
                    text: booking.displayname
                }),
                $("<td></td>", {
                    class: "booking-location booking-cell",
                    text: booking.location
                }),
                $("<td></td>", {
                    class: "booking-room booking-cell",
                    text: booking.roomName
                }),
                $("<td></td>", {
                    class: "booking-start booking-cell",
                    text: booking.bookingStart
                }),
                $("<td></td>", {
                    class: "booking-end booking-cell",
                    text: booking.bookingEnd
                }),
                $("<td></td>", {
                    class: "booking-recurring booking-cell",
                    text: booking.isRecurring ? "Yes" : "No"
                }),
                (showPaidCol ? paidCol : ""),
                $("<td></td>", {
                    class: "booking-cancel booking-cell",
                    html: $("<img/>", {
                        src: "webroot/images/ui/delete.gif",
                        alt: "Delete",
                        class: canCancel ? "active" : "inactive",
                        on: {
                            click: function (event) {
                                if (!canCancel) return false;

                                var modal = new Modal({
                                    type: ModalType.YesNo,
                                    title: "Cancel Booking",
                                    message: "Are you sure that you'd like to cancel this booking?",
                                    yes: function (modal) {
                                        modal.close();
                                        summTable.removeBooking(booking.bookingId, booking.bookingDate);
                                    },
                                    no: function (modal) {
                                        modal.close();
                                    }
                                });

                                modal.show();
                                return true;
                            }
                        }
                    })
                })
            ]
        });
    }

    var sorts = [];

    var props = ["username", "displayname", "bookingStart", "bookingEnd", "bookingDate", "roomName", "location", "paid", "day"];

    for (var i = 0; i < props.length; i++) {
        // Create closure to prevent only the last property working
        (function (prop) {
            sorts[prop] = [];
            sorts[prop]["asc"] = function (a,b) {
                if (a[prop] < b[prop]) return -1;
                if (a[prop] > b[prop]) return 1;
                return 0;
            };
            sorts[prop]["desc"] = function (a,b) {
                if (a[prop] > b[prop]) return -1;
                if (a[prop] < b[prop]) return 1;
                return 0;
            };
        })(props[i]);
    }

    return {
        renderTo: config.renderTo || null,
        bookings: config.bookings || [],
        rendered: false,
        cls: config.cls || "summary-table",
        headerCls: config.headerCls || "summary-header",
        bodyCls: config.bodyCls || "summary-body",
        emptyText: "No bookings for the selected date...",
        startDate: new Date(),
        endDate: new Date(),
        userId: config.userId || null,
        roomId: config.roomId || null,
        showPaidColumn: typeof config.showPaidColumn === "undefined" ? true : config.showPaidColumn,

        init: function () {
            var me = this;

            $(document).on("click", ".header-cell", function (e) {
                me.headerClick(e);
            });
        },

        setBookings: function(bookings) {
            var me = this;

            me.bookings = bookings || [];
            me.update();
        },

        removeBooking: function (bookingId, bookingDate) {
            var me = this;
            var booking = $.grep(me.bookings, function (book) {
                return book.bookingId === bookingId && book.bookingDate === bookingDate;
            })[0];

            var cancelUrl = "/bookings/bookings/cancelXhr/";
            cancelUrl += booking.bookingId;

            if (booking.isRecurring) {
                cancelUrl += "/";
                cancelUrl += booking.bookingDate
            }

            $.ajax({
                method: "POST",
                url: cancelUrl,
                success: function (data) {
                    $.each(me.bookings, function (index) {
                        if (me.bookings[index].bookingId === bookingId) {
                            me.bookings.splice(index, 1);
                            return false;
                        }
                    });

                    $('#' + bookingId)
                        .children('td')
                        .wrapInner('<div class="td-slider" />')
                        .children(".td-slider")
                        .animate({
                            height: "0px",
                            opacity: 0
                        }, {
                            duration: 400,
                            done: function () {
                                me.update()
                            }
                        });
                    },
                    error: function (data) {
                        data = JSON.parse(data.responseText);

                        var modal = new Modal({
                            title: "Error",
                            message: "An error occurred: " + data.message,
                            type: ModalType.Ok
                        });

                        modal.show();
                    }
            })
        },

        getRows: function() {
            var me = this;
            var rows = [];

            for (var i = 0; i < me.bookings.length; i++) {
                rows.push(createRow(me, me.bookings[i], me.showPaidColumn));
            }

            if (rows.length === 0) {
                rows.push($("<tr></tr>", {
                    html: $("<td></td>", {
                        class: "summary-empty",
                        colspan: me.showPaidColumn ? 11 : 10,
                        text: me.emptyText
                    })
                }));
            }

            return rows;
        },

        headerClick: function (e) {
            var me = this;
            var header = e.target;
            var classes = e.target.classList;
            var sortTarget = classes[0].match(/header-(.*)/)[1];
            var asc = true;

            if (classes.contains('header-cancel')) return;

            if (classes.contains("asc")) {
                $(header).removeClass("asc");
                $(header).addClass("desc");

                asc = false;
            } else if (classes.contains("desc")) {
                $(header).removeClass("desc");
                $(header).addClass("asc");
            } else {
                $("." + me.headerCls + " .asc").removeClass("asc");
                $("." + me.headerCls + " .desc").removeClass("desc");

                $(header).addClass("asc");
            }

            switch (sortTarget) {
                case "start":
                    sortTarget = "bookingStart";
                    break;
                case "end":
                    sortTarget = "bookingEnd";
                    break;
                case "date":
                    sortTarget = "bookingDate";
                    break;
                case "room-name":
                    sortTarget = "roomName";
                    break;
                default:
                    break;
            }

            var sort = sorts[sortTarget][asc ? "asc" : "desc"];
            me.bookings.sort(sort);

            me.update();
        },

        setStartDate: function (d) {
            var me = this;

            me.startDate = d;
            me.update();
        },

        setEndDate: function (d) {
            var me = this;

            me.endDate = d;
            me.update();
        },

        getStartDate: function () {
            var me = this;

            return me.startDate;
        },

        getEndDate: function () {
            var me = this;

            return me.endDate;
        },

        getHeaderText: function () {
            var me = this;
            var startDate = me.getStartDate();
            var endDate = me.getEndDate();

            if (startDate > endDate) {
                var temp = endDate;
                endDate = startDate;
                startDate = temp;
            }

            if (startDate.getDate() == endDate.getDate()) {
                return "Bookings for " + _dateAsReadable(startDate);
            }
            return "Bookings for " + _dateRangeAsReadable(startDate, endDate);
        },

        createPdfForm: function () {
            var me = this;

            var startDate = me.startDate, endDate = me.endDate;

            if (startDate > endDate) {
                endDate = me.startDate;
                startDate = me.endDate;
            }

            var form = $("<form></form>", {
                class: "pdf-form",
                method: "post",
                action: "api/pdf",
                target: "_blank",
                html: [
                    $("<input/>", {
                        type: "hidden",
                        name: "startDate",
                        value: startDate
                    }),
                    $("<input/>", {
                        type: "hidden",
                        name: "endDate",
                        value: endDate
                    }),
                    $("<input/>", {
                        type: "hidden",
                        name: "userId",
                        value: me.userId
                    }),
                    $("<input/>", {
                        type: "hidden",
                        name: "roomId",
                        value: me.roomId
                    })
                ]
            });

            $(".content_area").append(form);
            return $(".pdf-form");
        },

        update: function () {
            var me = this;

            if (!me.rendered) return me.render();

            var rows = me.getRows();

            $("." + me.bodyCls).empty();
            $("." + me.bodyCls).append(rows);
            $("." + me.headerCls + "-title").html(me.getHeaderText());
        },

        render: function () {
            var me = this;

            if (me.rendered) {
                me.update();
                return;
            }

            me.init();

            var rows = me.getRows();

            var paidCol = $("<th></th>", {
                class: "header-paid header-cell",
                text: "Paid"
            });

            var paidColCol = $("<col/>", {
                span: "1",
                class: "col-paid"
            });

            var summTable = $("<table></table>", {
                class: me.cls,
                html: [
                    $('<colgroup></colgroup>', {
                        html: [
                            $("<col/>", {
                                span: "1",
                                class: 'col-date'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-day'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-username'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-displayname'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-location'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-room'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-start'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-end'
                            }),
                            $("<col/>", {
                                span: "1",
                                class: 'col-recurring'
                            }),
                            me.showPaidColumn ? paidColCol : "",
                            $("<col/>", {
                                span: "1",
                                class: "col-cancel"
                            })
                        ]
                    }),
                    $("<thead></thead>", {
                        class: me.headerCls,
                        html: [
                            $("<tr></tr>", {
                                html: $("<th></th>", {
                                    colspan: me.showPaidColumn ? 11 : 10,
                                    class: me.headerCls + "-inner",
                                    html: [
                                        $("<span></span>", {
                                            class: me.headerCls + "-title",
                                            html: me.getHeaderText()
                                        }),
                                        $("<div></div>", {
                                            class: "header-button",
                                            html: $("<img/>", {
                                                class: "header-button-icon",
                                                src: "webroot/images/ui/material/print-white-x24.svg"
                                            }),
                                            on: {
                                                click: function () {
                                                    var form = me.createPdfForm();

                                                    form.submit();
                                                }
                                            }
                                        })
                                    ]
                                })
                            }),
                            $("<tr></tr>", {
                                class: "summary-col-headers",
                                html: [
                                    $("<th></th>", {
                                        class: "header-date header-cell",
                                        text: "Date"
                                    }),
                                    $("<th></th>", {
                                        class: "header-day header-cell",
                                        text: "Day"
                                    }),
                                    $("<th></th>", {
                                        class: "header-username header-cell",
                                        text: "Username"
                                    }),
                                    $("<th></th>", {
                                        class: "header-displayname header-cell",
                                        text: "Display Name"
                                    }),
                                    $("<th></th>", {
                                        class: "header-location header-cell",
                                        text: "Location"
                                    }),
                                    $("<th></th>", {
                                        class: "header-room-name header-cell",
                                        text: "Room Name"
                                    }),
                                    $("<th></th>", {
                                        class: "header-start header-cell",
                                        text: "Start Time"
                                    }),
                                    $("<th></th>", {
                                        class: "header-end header-cell",
                                        text: "End Time"
                                    }),
                                    $("<th></th>", {
                                        class: "header-recurring header-cell",
                                        text: "Recurring"
                                    }),
                                    me.showPaidColumn ? paidCol : "",
                                    $("<th></th>", {
                                        class: "header-cancel header-cell",
                                        text: "Cancel"
                                    })
                                ]
                            })
                        ]
                    }),
                    $("<tbody></tbody>", {
                        class: me.bodyCls,
                        html: rows
                    })
                ]
            });

            $(me.renderTo).empty();
            $(me.renderTo).append(summTable);

            me.rendered = true;
        }
    };
}
