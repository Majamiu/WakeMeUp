const vueapp = Vue.createApp({
    data() {
        return {
            hour: 0, //Hours of current time
            mins: 0, //Mins of current time
            sec: 0, // Seconds of current time
            PmOrAm: "",
            year: 0,
            month: "",
            day: "",
            monthNames: [
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
            ],
            AlarmIsSet: false,
            Days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            DayInNumer: 0,
            HoursToSet: [
                { Value: "12 AM", time: "00" },
                { Value: "1 AM", time: "01" },
                { Value: "2 AM", time: "02" },
                { Value: "3 AM", time: "03" },
                { Value: "4 AM", time: "04" },
                { Value: "5 AM", time: "05" },
                { Value: "6 AM", time: "06" },
                { Value: "7 AM", time: "07" },
                { Value: "8 AM", time: "08" },
                { Value: "9 AM", time: "09" },
                { Value: "10 AM", time: "10" },
                { Value: "11 AM", time: "11" },
                { Value: "12 PM", time: "12" },
                { Value: "1 PM", time: "13" },
                { Value: "2 PM", time: "14" },
                { Value: "3 PM", time: "15" },
                { Value: "4 PM", time: "16" },
                { Value: "5 PM", time: "17" },
                { Value: "6 PM", time: "18" },
                { Value: "7 PM", time: "19" },
                { Value: "8 PM", time: "20" },
                { Value: "9 PM", time: "21" },
                { Value: "10 PM", time: "22" },
                { Value: "11 PM", time: "23" }
            ],
            MinsToSet: [],
            selectedHour: "08",
            selectedMins: "0",
            Sound: "Classic",
            SongIsPlaying: false,
            exSong: "",
            buttonText: "Set the alarm",
            Buttonicon: "/images/alarm.svg",
            AlarmIsSinging: false,
            background: { backgroundImage: "url(/images/night.jpg)" },
            TimerHour: 0,
            TimerMins: 0,
            TimerSeconds: 0,
            OneDayInFuture: 0,
            MonthInFuture: "",
            YearInTheFuture: "",
            now: null,
            NightMode: false
        };
    },
    methods: {
        GetDate: function () {
            // Getting date of today.
            const CurrentDate = new Date();
            this.year = CurrentDate.getFullYear();
            this.YearInTheFuture = this.year;
            this.month = this.monthNames[CurrentDate.getMonth()];
            this.day = this.Days[CurrentDate.getDay()];
            this.DayInNumer = CurrentDate.getDate();
            this.MonthInFuture = this.month;

            this.OneDayInFuture = this.DayInNumer + 1;

            if (this.OneDayInFuture > 31) {
                // Checking if it is the month's end to get the correct data for the countdown if the user set an alarm for tomorrow.
                this.OneDayInFuture = 1;
                if (this.MonthInFuture + 1 > 12) {
                    // Checking if it is the end of the current year.
                    this.MonthInFuture = this.monthNames[0];
                    this.YearInTheFuture++;
                } else {
                    // If it is not the end of the current year, then just set up next month.
                    this.MonthInFuture = this.monthNames[CurrentDate.getMonth() + 1];
                }
            }
        },
        CheckWhatBackgroundToUse: function () {
            // Check which background to use depending on the hour.
            if (this.hour >= 06 && this.hour <= 12) {
                this.background = { backgroundImage: "url(/images/morning.jpg)" };
            } else if (this.hour > 12 && this.hour <= 18) {
                this.background = { backgroundImage: "url(/images/day.jpg)" };
            } else if (this.hour > 18 && 23 >= this.hour) {
                this.background = { backgroundImage: "url(/images/afternoon.jpg)" };
            } else if (this.hour >= 00 && this.hour < 06) {
                this.background = { backgroundImage: "url(/images/night.jpg)" };
            }
            setTimeout(this.CheckWhatBackgroundToUse, 3600000); //Check in every hour
        },
        StartTimer: function () {
            // Starting the clock
            this.now = new Date().getTime();
            const today = new Date();
            this.hour = today.getHours();
            this.mins = today.getMinutes();
            this.sec = today.getSeconds();
            this.mins = this.checkTime(this.mins);
            this.sec = this.checkTime(this.sec);
            if (this.hour < 12) {
                // Checking if it is morning or not to use the correct ,,Pm'' and ,,Am''.
                this.PmOrAm = "AM";
            } else {
                this.PmOrAm = "PM";
            }
            if (this.hour == 00) {
                // Renew the date if it is a new day.
                this.GetDate();
            }
            if (this.AlarmIsSet) {
                // Distance between now and alarm time
                var countDownDate;
                if (this.selectedHour > this.hour) {
                    // If alarm is setted for today
                    countDownDate = new Date(
                        this.month +
                            this.DayInNumer +
                            " " +
                            this.year +
                            " " +
                            this.selectedHour +
                            ":" +
                            this.selectedMins +
                            ":00"
                    ).getTime();
                } else {
                    // If alarm is setted for tomorrow.
                    countDownDate = new Date(
                        this.MonthInFuture +
                            this.OneDayInFuture +
                            " " +
                            this.YearInTheFuture +
                            " " +
                            this.selectedHour +
                            ":" +
                            this.selectedMins +
                            ":00"
                    ).getTime();
                }

                var distance = countDownDate - this.now;

                this.TimerHour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.TimerMins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.TimerSeconds = Math.floor((distance % (1000 * 60)) / 1000);

                this.TimerSeconds = this.checkTime(this.TimerSeconds);
                this.TimerMins = this.checkTime(this.TimerMins);

                // END

                // Checking the alarm's time with the current time to active the alarm if needed.
                if (this.hour == this.selectedHour) {
                    if (this.mins == this.selectedMins) {
                        this.TimerHour = "00";
                        this.TimerMins = "00";
                        this.TimerSeconds = "00";
                        document.getElementById("" + this.Sound).play();
                        this.buttonText = "Stop alarm";
                        this.Buttonicon = "/images/cancel.svg";
                        this.AlarmIsSinging = true;
                    }
                }
            }
            setTimeout(this.StartTimer, 1000); // Check in every second
        },
        checkTime: function (i) {
            // Add zero in front of numbers when i < 10
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        TrySong: function () {
            if (this.exSong == "") { // Checking if it is the first time when a user is trying the sound of an alarm.
                document.getElementById("" + this.Sound).play();
                this.exSong = this.Sound;
            } else { // If not, then turn off the last sound and start the next sound which the user chose.
                document.getElementById("" + this.exSong).pause();
                document.getElementById("" + this.Sound).play();
                this.exSong = this.Sound;
            }
        },
        StopSong: function () {
            if (this.exSong != "") {
                document.getElementById("" + this.exSong).pause();
            } else {
                document.getElementById("" + this.Sound).pause();
                this.exSong = "";
            }
        },

        SetAlarm: function () {
            if (this.AlarmIsSet == false) {
                this.AlarmIsSet = true;
                this.buttonText = "Cancel alarm";
                this.Buttonicon = "/images/cancel.svg";
            } else {
                if (this.AlarmIsSinging) {
                    document.getElementById("" + this.Sound).pause();
                    this.AlarmIsSet = false;
                    this.AlarmIsSinging = false;
                }
                this.AlarmIsSet = false;
                this.buttonText = "Set the alarm";
                this.Buttonicon = "/images/alarm.svg";
            }
        },
        SetPopularTime: function (t) {
            if (this.AlarmIsSet === false) {
                this.selectedHour = t;
                this.selectedMins = "0";
            }
        },
        TurnOnNightMode: function () {
            this.NightMode = true;
        },
        TurnOffNightMode: function () {
            this.NightMode = false;
        }
    },
    mounted() {
        this.StartTimer();
        this.GetDate();
        this.CheckWhatBackgroundToUse();
        for (var i = 0; i <= 59; i++) { // Setting up an array of mins for users to choose for alarm.
            if (i < 10) {
                this.MinsToSet.push({ Value: "0" + i, mins: i });
            } else {
                this.MinsToSet.push({ Value: i, mins: i });
            }
        }
    }
});
vueapp.mount("#app");
