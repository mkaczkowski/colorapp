function radialTimer() {
    var self = this;

    this.seconds = 0;
    this.count = 0;
    this.degrees = 0;
    this.interval = null;
    this.timerHTML = "<div class='n'></div><div class='slice'><div class='q'></div><div class='pie r'></div><div class='pie l'></div></div>";
    this.timerContainer = null;
    this.number = null;
    this.slice = null;
    this.pie = null;
    this.pieRight = null;
    this.pieLeft = null;
    this.quarter = null;

    this.init = function(e, s, callback) {
        self.timerContainer = $("#" + e);
        self.timerContainer.html(self.timerHTML);

        self.number = self.timerContainer.find(".n");
        self.slice = self.timerContainer.find(".slice");
        self.pie = self.timerContainer.find(".pie");
        self.pieRight = self.timerContainer.find(".pie.r");
        self.pieLeft = self.timerContainer.find(".pie.l");
        self.quarter = self.timerContainer.find(".q");

        // start timer
        self.start(s, callback);
    }

    this.start = function(s, callback) {
        self.isActive = true;
        self.seconds = s;
        self.interval = window.setInterval(function () {
            self.number.html(self.seconds - self.count);
            self.count++;

            if (self.count > (self.seconds - 1)) {
                self.isActive = false;
                clearInterval(self.interval);
            }
            self.degrees = self.degrees + (360 / self.seconds);
            if (self.count >= (self.seconds / 2)) {
                self.slice.addClass("nc");
                if (!self.slice.hasClass("mth")) self.pieRight.css({"transform":"rotate(180deg)"});
                self.pieLeft.css({"transform":"rotate(" + self.degrees + "deg)"});
                self.slice.addClass("mth");
                if (self.count >= (self.seconds * 0.75)) self.quarter.remove();
            } else {
                self.pie.css({"transform":"rotate(" + self.degrees + "deg)"});
            }

            var percentage = (self.count / self.seconds) * 100;
            if (percentage < 65) {
                self.pie.addClass("pie-green");
            }else if(percentage < 85){
                self.pie.removeClass("pie-green");
                self.pie.addClass("pie-orange");
            }else{
                self.pie.removeClass("pie-orange");
                self.pie.addClass("pie-red");
            }

            if (self.isActive == false) {
                setTimeout(function() {
                    self.number.html(0);
                    if (callback) {
                        callback()
                    }
                    console.info("stop")
                },1000)
            }

        }, 1000);
    }

    this.stop = function(callback) {
        if(self.interval){
            clearInterval(self.interval);
            if(callback){
                callback( self.seconds - self.count)
            }
        }
    }
}