(function() {
  $(function() {
    var $document, death, enterDuelMode, enterOutro, noHonor, reset, resetMessages, restart, showDuelInfo, startButtonOS, win;
    $document = $(document);
    this.$body = $document.find("body");
    
    // opening screen -----------------------------
    this.$openingScreen = $document.find(".js-opening");
    this.$playScreen = $document.find(".js-play");
    this.$startButtonOS = this.$openingScreen.find(".js-start");
    this.$messageOS = this.$openingScreen.find(".js-message");
    startButtonOS = () => {
      this.$startButtonOS.addClass("is-hidden");
      this.$messageOS.removeClass("is-hidden");
      return this.$openingScreen.addClass("has-message");
    };
    this.$startButtonOS.on("click", () => {
      return startButtonOS();
    });
    this.$continueButtonOS = this.$openingScreen.find(".js-continue");
    this.$continueButtonOS.on("click", () => {
      this.$openingScreen.addClass("is-hidden");
      this.$playScreen.removeClass("is-hidden");
      this.$openingScreen.removeClass("has-message");
      return showDuelInfo();
    });
    
    // play screen -----------------------------  
    this.$messagePS = this.$playScreen.find(".js-message");
    this.$duelButton = $document.find(".js-duel");
    this.$drawButton = $document.find(".js-draw");
    this.$sheriff = $document.find(".js-sheriff");
    this.$opponent = $document.find(".js-opponent");
    this.$resultPS = $document.find(".js-result");
    this.result;
    this.$timer;
    this.dueling = false;
    this.level = 1;
    this.gameOver = false;
    this.noHonor = 1;
    this.totalTime = 0;
    restart = () => {
      // completely restarts game
      this.level = 1;
      this.noHonor = 0;
      this.dueling = false;
      this.gameOver = false;
      this.totalTime = 0;
      resetMessages();
      this.$outroScreen.addClass("is-hidden");
      this.$playScreen.addClass("is-hidden");
      this.$openingScreen.removeClass("is-hidden");
      this.$startButtonOS.removeClass("is-hidden");
      this.$messageOS.addClass("is-hidden");
      this.$body.removeClass("game-over");
      this.$body.removeClass("game-end");
      this.$sheriff.removeClass("is-dead");
      return this.$sheriff.removeClass("is-gone");
    };
    death = () => {
      this.totalTime = 0;
      this.$opponent.addClass("is-shooting");
      this.$sheriff.addClass("is-dead");
      return setTimeout((() => {
        this.$sheriff.addClass("is-gone");
        this.$opponent.removeClass("is-shooting");
        this.$resultPS.html("Game Over");
        this.$duelButton.removeClass("is-hidden");
        this.level = 1;
        this.gameOver = true;
        this.$body.addClass("game-over");
      }), 200);
    };
    win = () => {
      this.totalTime = this.totalTime + this.result;
      this.$sheriff.addClass("is-shooting");
      this.$opponent.addClass("is-dead");
      this.$resultPS.html("Justice served in " + this.result.toFixed(3) + " seconds");
      this.level++;
      this.$resultContinue.removeClass("is-hidden");
      setTimeout((() => {
        this.$sheriff.removeClass("is-shooting");
        this.$sheriff.addClass("is-armed");
      }), 200);
      return setTimeout((() => {
        this.$sheriff.removeClass("is-armed");
      }), 1000);
    };
    this.$resultContinue = $document.find(".js-result-continue");
    this.$resultContinue.on("click", () => {
      this.$resultContinue.addClass("is-hidden");
      resetMessages();
      // if won the game
      if (this.level === 4) {
        return enterOutro();
      } else {
        // continue as normal
        return showDuelInfo();
      }
    });
    reset = () => {
      // stops game if no reaction
      death();
      clearInterval(this.$timer);
      this.$duelButton.removeClass("is-hidden");
      return this.$drawButton.addClass("is-hidden");
    };
    showDuelInfo = () => {
      this.$opponent.removeClass("is-armed");
      this.$opponent.removeClass("is-dead");
      this.$opponent.removeClass("opponent--1");
      this.$opponent.removeClass("opponent--2");
      this.$opponent.removeClass("opponent--3");
      this.$opponent.addClass("opponent--" + this.level);
      switch (this.level) {
        case 3:
          this.$messagePS.html("Big Gilly Boulder craves the job of whippin' a squirt like you. He's a slick artist on the draw! Watch out");
          break;
        case 2:
          this.$messagePS.html("Name's Goldie Gaia. She runs the saloon even if she has to send you to the bone yard with your boots on.");
          break;
        default:
          this.$messagePS.html("Pumpgun Ed ain't no man to monkey with. Yuh figure, this big fella lays yuh 'cross the hitch-rack an' fan yuh to a frazzle");
      }
      return this.$duelButton.removeClass("is-hidden");
    };
    resetMessages = () => {
      this.$messagePS.html("");
      return this.$resultPS.html("");
    };
    enterDuelMode = () => {
      this.$duelButton.addClass("is-hidden");
      this.$drawButton.removeClass("is-hidden");
      resetMessages();
      this.delay = (Math.floor(Math.random() * (6 - 1) + 1)) * 1000;
      // start duel
      return this.$duel = setTimeout((() => {
        var startTime;
        this.dueling = true;
        // style start
        this.$opponent.addClass("is-armed");
        // start timer
        startTime = Date.now();
        return this.$timer = setInterval((() => {
          var elapsedTime;
          elapsedTime = Date.now() - startTime;
          // announce result
          this.result = elapsedTime / 1000;
          if (this.result > 2) {
            reset();
          }
        }), 10);
      }), this.delay);
    };
    noHonor = () => {
      var noHonorMessage, random;
      // if clicked to early
      clearInterval(this.$duel);
      this.$duelButton.removeClass("is-hidden");
      this.$drawButton.addClass("is-hidden");
      switch (this.noHonor) {
        case 1:
          noHonorMessage = "You don't want to be too sudden with the trio. They gotta draw first.";
          this.noHonor++;
          break;
        case 2:
          noHonorMessage = "You're sure playin' with luck. Yuh best go an' rustle your blankets.";
          this.noHonor++;
          break;
        default:
          random = Math.floor(Math.random() * (4 - 1)) + 1;
          switch (random) {
            case 1:
              noHonorMessage = "Mixin' it with some chance! An' this time o' day!";
              break;
            case 2:
              noHonorMessage = "Happened kinda sudden, didn't yer?";
              break;
            default:
              noHonorMessage = "What the devil! What fer kind of a thing shows no honour in a fast draw.";
          }
      }
      return this.$resultPS.html(noHonorMessage);
    };
    
    // Duel button
    this.$duelButton.on("click", () => {
      if (this.gameOver) {
        return restart();
      } else {
        return enterDuelMode();
      }
    });
    // Draw button
    this.$drawButton.on("click", () => {
      if (this.dueling) {
        // good draw
        clearInterval(this.$timer);
        this.$opponent.removeClass("is-armed");
        this.$drawButton.addClass("is-hidden");
        switch (this.level) {
          case 3:
            if (this.result < 0.33) {
              win();
            } else {
              death();
            }
            break;
          case 2:
            if (this.result < 0.4) {
              win();
            } else {
              death();
            }
            break;
          default:
            if (this.result < 2) {
              win();
            } else {
              death();
            }
        }
      } else {
        // failed draw
        noHonor();
      }
      return this.dueling = false;
    });
    
    // Outro screen -----------------------------  
    this.$outroScreen = $document.find(".js-outro");
    this.$saveAndQuitButton = this.$outroScreen.find(".js-save-and-quit");
    this.$totalTime = this.$outroScreen.find(".js-total-time");
    enterOutro = () => {
      this.$totalTime.html("Total time: " + this.totalTime.toFixed(3) + "seconds");
      this.$playScreen.addClass("is-hidden");
      this.$outroScreen.removeClass("is-hidden");
      this.$body.addClass("game-end");
      return this.$totalTime = 0;
    };
    return this.$saveAndQuitButton.on("click", () => {
      return restart();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxDQUFBLENBQUUsUUFBQSxDQUFBLENBQUE7QUFDQSxRQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLGFBQUEsRUFBQSxPQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQTtJQUFBLFNBQUEsR0FBWSxDQUFBLENBQUcsUUFBSDtJQUNaLElBQUMsQ0FBQSxLQUFELEdBQVMsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLEVBRFQ7OztJQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLFNBQVMsQ0FBQyxJQUFWLENBQWUsYUFBZjtJQUNsQixJQUFDLENBQUEsV0FBRCxHQUFlLFNBQVMsQ0FBQyxJQUFWLENBQWUsVUFBZjtJQUVmLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsV0FBckI7SUFDbEIsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLGFBQXJCO0lBRWQsYUFBQSxHQUFnQixDQUFBLENBQUEsR0FBQTtNQUNkLElBQUMsQ0FBQSxjQUFjLENBQUMsUUFBaEIsQ0FBeUIsV0FBekI7TUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsV0FBeEI7YUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLFFBQWhCLENBQXlCLGFBQXpCO0lBSGM7SUFJaEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxFQUFoQixDQUFtQixPQUFuQixFQUE0QixDQUFBLENBQUEsR0FBQTthQUFHLGFBQUEsQ0FBQTtJQUFILENBQTVCO0lBRUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsY0FBckI7SUFDckIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEVB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QUFBLE1BQUE7Y0FHRSxLQUFBLENBQUEsRUFIRjs7QUFaSixTQUxGO09BQUEsTUFBQTs7UUF1QkUsT0FBQSxDQUFBLEVBdkJGOzthQXdCQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBekJZLENBQXpCLEVBdkxBOzs7SUFtTkEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmO0lBQ2hCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsbUJBQW5CO0lBQ3RCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLGdCQUFuQjtJQUNkLFVBQUEsR0FBYSxDQUFBLENBQUEsR0FBQTtNQUNYLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixjQUFBLEdBQWlCLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFtQixDQUFuQixDQUFqQixHQUF5QyxTQUExRDtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFzQixXQUF0QjtNQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixXQUExQjtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFnQixVQUFoQjthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFMSDtXQU9iLElBQUMsQ0FBQSxrQkFBbUIsQ0FBQyxFQUFyQixDQUF3QixPQUF4QixFQUFpQyxDQUFBLENBQUEsR0FBQTthQUMvQixPQUFBLENBQUE7SUFEK0IsQ0FBakM7RUE5TkEsQ0FBRjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJCAtPlxuICAkZG9jdW1lbnQgPSAkIChkb2N1bWVudClcbiAgQCRib2R5ID0gJGRvY3VtZW50LmZpbmQgXCJib2R5XCIgIFxuICAgIFxuIyBvcGVuaW5nIHNjcmVlbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBAJG9wZW5pbmdTY3JlZW4gPSAkZG9jdW1lbnQuZmluZCBcIi5qcy1vcGVuaW5nXCJcbiAgQCRwbGF5U2NyZWVuID0gJGRvY3VtZW50LmZpbmQgXCIuanMtcGxheVwiXG4gIFxuICBAJHN0YXJ0QnV0dG9uT1MgPSBAJG9wZW5pbmdTY3JlZW4uZmluZCBcIi5qcy1zdGFydFwiXG4gIEAkbWVzc2FnZU9TID0gQCRvcGVuaW5nU2NyZWVuLmZpbmQgXCIuanMtbWVzc2FnZVwiXG4gIFxuICBzdGFydEJ1dHRvbk9TID0gPT5cbiAgICBAJHN0YXJ0QnV0dG9uT1MuYWRkQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkbWVzc2FnZU9TLnJlbW92ZUNsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJG9wZW5pbmdTY3JlZW4uYWRkQ2xhc3MgXCJoYXMtbWVzc2FnZVwiXG4gIEAkc3RhcnRCdXR0b25PUy5vbiBcImNsaWNrXCIsID0+IHN0YXJ0QnV0dG9uT1MoKVxuICBcbiAgQCRjb250aW51ZUJ1dHRvbk9TID0gQCRvcGVuaW5nU2NyZWVuLmZpbmQgXCIuanMtY29udGludWVcIlxuICBAJGNvbnRpbnVlQnV0dG9uT1Mub24gXCJjbGlja1wiLCA9PlxuICAgIEAkb3BlbmluZ1NjcmVlbi5hZGRDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgQCRwbGF5U2NyZWVuLnJlbW92ZUNsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJG9wZW5pbmdTY3JlZW4ucmVtb3ZlQ2xhc3MgXCJoYXMtbWVzc2FnZVwiXG4gICAgc2hvd0R1ZWxJbmZvKClcbiBcbiMgcGxheSBzY3JlZW4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIFxuICBcbiAgQCRtZXNzYWdlUFMgPSBAJHBsYXlTY3JlZW4uZmluZCBcIi5qcy1tZXNzYWdlXCJcbiAgQCRkdWVsQnV0dG9uID0gJGRvY3VtZW50LmZpbmQgXCIuanMtZHVlbFwiXG4gIEAkZHJhd0J1dHRvbiA9ICRkb2N1bWVudC5maW5kIFwiLmpzLWRyYXdcIlxuICBAJHNoZXJpZmYgPSAkZG9jdW1lbnQuZmluZCBcIi5qcy1zaGVyaWZmXCJcbiAgQCRvcHBvbmVudCA9ICRkb2N1bWVudC5maW5kIFwiLmpzLW9wcG9uZW50XCJcbiAgQCRyZXN1bHRQUyA9ICRkb2N1bWVudC5maW5kIFwiLmpzLXJlc3VsdFwiXG4gIEByZXN1bHRcbiAgQCR0aW1lclxuICBAZHVlbGluZyA9IGZhbHNlXG4gIEBsZXZlbCA9IDFcbiAgQGdhbWVPdmVyID0gZmFsc2VcbiAgQG5vSG9ub3IgPSAxXG4gIEB0b3RhbFRpbWUgPSAwXG4gIFxuICByZXN0YXJ0ID0gPT5cbiAgICAjIGNvbXBsZXRlbHkgcmVzdGFydHMgZ2FtZVxuICAgIEBsZXZlbCA9IDFcbiAgICBAbm9Ib25vciA9IDBcbiAgICBAZHVlbGluZyA9IGZhbHNlXG4gICAgQGdhbWVPdmVyID0gZmFsc2VcbiAgICBAdG90YWxUaW1lID0gMFxuICAgIHJlc2V0TWVzc2FnZXMoKVxuICAgIEAkb3V0cm9TY3JlZW4uYWRkQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkcGxheVNjcmVlbi5hZGRDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgQCRvcGVuaW5nU2NyZWVuLnJlbW92ZUNsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJHN0YXJ0QnV0dG9uT1MucmVtb3ZlQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkbWVzc2FnZU9TLmFkZENsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJGJvZHkucmVtb3ZlQ2xhc3MgXCJnYW1lLW92ZXJcIlxuICAgIEAkYm9keS5yZW1vdmVDbGFzcyBcImdhbWUtZW5kXCJcbiAgICBAJHNoZXJpZmYucmVtb3ZlQ2xhc3MgXCJpcy1kZWFkXCJcbiAgICBAJHNoZXJpZmYucmVtb3ZlQ2xhc3MgXCJpcy1nb25lXCJcbiAgICBcbiAgZGVhdGggPSA9PlxuICAgIEB0b3RhbFRpbWUgPSAwXG4gICAgQCRvcHBvbmVudC5hZGRDbGFzcyBcImlzLXNob290aW5nXCJcbiAgICBAJHNoZXJpZmYuYWRkQ2xhc3MgXCJpcy1kZWFkXCJcbiAgICBzZXRUaW1lb3V0ICg9PlxuICAgICAgQCRzaGVyaWZmLmFkZENsYXNzIFwiaXMtZ29uZVwiXG4gICAgICBAJG9wcG9uZW50LnJlbW92ZUNsYXNzIFwiaXMtc2hvb3RpbmdcIlxuICAgICAgQCRyZXN1bHRQUy5odG1sIFwiR2FtZSBPdmVyXCJcbiAgICAgIEAkZHVlbEJ1dHRvbi5yZW1vdmVDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgICBAbGV2ZWwgPSAxXG4gICAgICBAZ2FtZU92ZXIgPSB0cnVlXG4gICAgICBAJGJvZHkuYWRkQ2xhc3MgXCJnYW1lLW92ZXJcIlxuICAgICAgcmV0dXJuXG4gICAgKSwgMjAwXG4gICBcbiAgd2luID0gPT5cbiAgICBAdG90YWxUaW1lID0gQHRvdGFsVGltZSArIEByZXN1bHRcbiAgICBAJHNoZXJpZmYuYWRkQ2xhc3MgXCJpcy1zaG9vdGluZ1wiXG4gICAgQCRvcHBvbmVudC5hZGRDbGFzcyBcImlzLWRlYWRcIlxuICAgIEAkcmVzdWx0UFMuaHRtbChcIkp1c3RpY2Ugc2VydmVkIGluIFwiICsgQHJlc3VsdC50b0ZpeGVkKDMpICsgXCIgc2Vjb25kc1wiKVxuICAgIEBsZXZlbCsrXG4gICAgQCRyZXN1bHRDb250aW51ZS5yZW1vdmVDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgc2V0VGltZW91dCAoPT5cbiAgICAgIEAkc2hlcmlmZi5yZW1vdmVDbGFzcyBcImlzLXNob290aW5nXCJcbiAgICAgIEAkc2hlcmlmZi5hZGRDbGFzcyBcImlzLWFybWVkXCJcbiAgICAgIHJldHVyblxuICAgICksIDIwMFxuICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICBAJHNoZXJpZmYucmVtb3ZlQ2xhc3MgXCJpcy1hcm1lZFwiXG4gICAgICByZXR1cm5cbiAgICApLCAxMDAwXG4gICAgXG4gIEAkcmVzdWx0Q29udGludWUgPSAkZG9jdW1lbnQuZmluZCBcIi5qcy1yZXN1bHQtY29udGludWVcIlxuICBAJHJlc3VsdENvbnRpbnVlIC5vbiBcImNsaWNrXCIsID0+XG4gICAgQCRyZXN1bHRDb250aW51ZS5hZGRDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgcmVzZXRNZXNzYWdlcygpXG4gICAgIyBpZiB3b24gdGhlIGdhbWVcbiAgICBpZiBAbGV2ZWwgPT0gNFxuICAgICAgZW50ZXJPdXRybygpXG4gICAgIyBjb250aW51ZSBhcyBub3JtYWxcbiAgICBlbHNlXG4gICAgICBzaG93RHVlbEluZm8oKVxuICBcbiAgcmVzZXQgPSA9PlxuICAgICMgc3RvcHMgZ2FtZSBpZiBubyByZWFjdGlvblxuICAgIGRlYXRoKClcbiAgICBjbGVhckludGVydmFsIEAkdGltZXJcbiAgICBAJGR1ZWxCdXR0b24ucmVtb3ZlQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkZHJhd0J1dHRvbi5hZGRDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgXG4gIHNob3dEdWVsSW5mbyA9ID0+XG4gICAgQCRvcHBvbmVudC5yZW1vdmVDbGFzcyBcImlzLWFybWVkXCJcbiAgICBAJG9wcG9uZW50LnJlbW92ZUNsYXNzIFwiaXMtZGVhZFwiXG4gICAgQCRvcHBvbmVudC5yZW1vdmVDbGFzcyBcIm9wcG9uZW50LS0xXCJcbiAgICBAJG9wcG9uZW50LnJlbW92ZUNsYXNzIFwib3Bwb25lbnQtLTJcIlxuICAgIEAkb3Bwb25lbnQucmVtb3ZlQ2xhc3MgXCJvcHBvbmVudC0tM1wiXG4gICAgQCRvcHBvbmVudC5hZGRDbGFzcyBcIm9wcG9uZW50LS1cIiArIEBsZXZlbFxuICAgIHN3aXRjaCBAbGV2ZWxcbiAgICAgIHdoZW4gM1xuICAgICAgICBAJG1lc3NhZ2VQUy5odG1sIFwiQmlnIEdpbGx5IEJvdWxkZXIgY3JhdmVzIHRoZSBqb2Igb2Ygd2hpcHBpbicgYSBzcXVpcnQgbGlrZSB5b3UuIEhlJ3MgYSBzbGljayBhcnRpc3Qgb24gdGhlIGRyYXchIFdhdGNoIG91dFwiXG4gICAgICB3aGVuIDJcbiAgICAgICAgQCRtZXNzYWdlUFMuaHRtbCBcIk5hbWUncyBHb2xkaWUgR2FpYS4gU2hlIHJ1bnMgdGhlIHNhbG9vbiBldmVuIGlmIHNoZSBoYXMgdG8gc2VuZCB5b3UgdG8gdGhlIGJvbmUgeWFyZCB3aXRoIHlvdXIgYm9vdHMgb24uXCJcbiAgICAgIGVsc2VcbiAgICAgICAgQCRtZXNzYWdlUFMuaHRtbCBcIlB1bXBndW4gRWQgYWluJ3Qgbm8gbWFuIHRvIG1vbmtleSB3aXRoLiBZdWggZmlndXJlLCB0aGlzIGJpZyBmZWxsYSBsYXlzIHl1aCAnY3Jvc3MgdGhlIGhpdGNoLXJhY2sgYW4nIGZhbiB5dWggdG8gYSBmcmF6emxlXCJcbiAgICBAJGR1ZWxCdXR0b24ucmVtb3ZlQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIFxuICByZXNldE1lc3NhZ2VzID0gPT5cbiAgICBAJG1lc3NhZ2VQUy5odG1sIFwiXCJcbiAgICBAJHJlc3VsdFBTLmh0bWwgXCJcIiAgIFxuICAgIFxuICBlbnRlckR1ZWxNb2RlID0gPT5cbiAgICBAJGR1ZWxCdXR0b24uYWRkQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkZHJhd0J1dHRvbi5yZW1vdmVDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgcmVzZXRNZXNzYWdlcygpXG4gICAgQGRlbGF5ID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooNiAtMSkrMSkpICogMTAwMFxuXG4gICAgIyBzdGFydCBkdWVsXG4gICAgQCRkdWVsID0gc2V0VGltZW91dCAoID0+XG4gICAgICBAZHVlbGluZyA9IHRydWVcbiAgICAgICMgc3R5bGUgc3RhcnRcbiAgICAgIEAkb3Bwb25lbnQuYWRkQ2xhc3MgXCJpcy1hcm1lZFwiXG5cbiAgICAgICMgc3RhcnQgdGltZXJcbiAgICAgIHN0YXJ0VGltZSA9IERhdGUubm93KClcbiAgICAgIEAkdGltZXIgPSBzZXRJbnRlcnZhbCgoPT5cbiAgICAgICAgZWxhcHNlZFRpbWUgPSBEYXRlLm5vdygpIC0gc3RhcnRUaW1lXG4gICAgICAgICMgYW5ub3VuY2UgcmVzdWx0XG4gICAgICAgIEByZXN1bHQgPSAoZWxhcHNlZFRpbWUgLyAxMDAwKVxuICAgICAgICBpZiBAcmVzdWx0ID4gMlxuICAgICAgICAgIHJlc2V0KClcbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAxMClcbiAgICApLCBAZGVsYXlcbiAgICBcbiAgICBcbiAgbm9Ib25vciA9ID0+XG4gICAgIyBpZiBjbGlja2VkIHRvIGVhcmx5XG4gICAgY2xlYXJJbnRlcnZhbCBAJGR1ZWxcbiAgICBAJGR1ZWxCdXR0b24ucmVtb3ZlQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgIEAkZHJhd0J1dHRvbi5hZGRDbGFzcyBcImlzLWhpZGRlblwiXG4gICAgc3dpdGNoIEBub0hvbm9yXG4gICAgICB3aGVuIDFcbiAgICAgICAgbm9Ib25vck1lc3NhZ2UgPSBcIllvdSBkb24ndCB3YW50IHRvIGJlIHRvbyBzdWRkZW4gd2l0aCB0aGUgdHJpby4gVGhleSBnb3R0YSBkcmF3IGZpcnN0LlwiXG4gICAgICAgIEBub0hvbm9yKytcbiAgICAgIHdoZW4gMlxuICAgICAgICBub0hvbm9yTWVzc2FnZSA9IFwiWW91J3JlIHN1cmUgcGxheWluJyB3aXRoIGx1Y2suIFl1aCBiZXN0IGdvIGFuJyBydXN0bGUgeW91ciBibGFua2V0cy5cIlxuICAgICAgICBAbm9Ib25vcisrXG4gICAgICBlbHNlXG4gICAgICAgIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg0IC0gMSkgKSArIDE7XG4gICAgICAgIHN3aXRjaCByYW5kb21cbiAgICAgICAgICB3aGVuIDFcbiAgICAgICAgICAgIG5vSG9ub3JNZXNzYWdlID0gXCJNaXhpbicgaXQgd2l0aCBzb21lIGNoYW5jZSEgQW4nIHRoaXMgdGltZSBvJyBkYXkhXCJcbiAgICAgICAgICB3aGVuIDJcbiAgICAgICAgICAgIG5vSG9ub3JNZXNzYWdlID0gXCJIYXBwZW5lZCBraW5kYSBzdWRkZW4sIGRpZG4ndCB5ZXI/XCJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBub0hvbm9yTWVzc2FnZSA9IFwiV2hhdCB0aGUgZGV2aWwhIFdoYXQgZmVyIGtpbmQgb2YgYSB0aGluZyBzaG93cyBubyBob25vdXIgaW4gYSBmYXN0IGRyYXcuXCIgICBcbiAgICBAJHJlc3VsdFBTLmh0bWwgbm9Ib25vck1lc3NhZ2UgICAgIFxuICAgXG4gICMgRHVlbCBidXR0b25cbiAgQCRkdWVsQnV0dG9uLm9uIFwiY2xpY2tcIiwgPT5cbiAgICBpZiBAZ2FtZU92ZXJcbiAgICAgIHJlc3RhcnQoKVxuICAgIGVsc2VcbiAgICAgIGVudGVyRHVlbE1vZGUoKVxuXG4jIERyYXcgYnV0dG9uXG4gIEAkZHJhd0J1dHRvbi5vbiBcImNsaWNrXCIsID0+XG4gICAgaWYgQGR1ZWxpbmdcbiAgICAgICMgZ29vZCBkcmF3XG4gICAgICBjbGVhckludGVydmFsIEAkdGltZXJcbiAgICAgIEAkb3Bwb25lbnQucmVtb3ZlQ2xhc3MgXCJpcy1hcm1lZFwiXG4gICAgICBAJGRyYXdCdXR0b24uYWRkQ2xhc3MgXCJpcy1oaWRkZW5cIlxuICAgICAgc3dpdGNoIEBsZXZlbFxuICAgICAgICB3aGVuIDNcbiAgICAgICAgICBpZiBAcmVzdWx0IDwgMC4zM1xuICAgICAgICAgICAgd2luKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWF0aCgpXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIGlmIEByZXN1bHQgPCAwLjRcbiAgICAgICAgICAgIHdpbigpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVhdGgoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgQHJlc3VsdCA8IDJcbiAgICAgICAgICAgIHdpbigpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVhdGgoKVxuICAgIGVsc2VcbiAgICAgICMgZmFpbGVkIGRyYXdcbiAgICAgIG5vSG9ub3IoKVxuICAgIEBkdWVsaW5nID0gZmFsc2VcbiAgICBcbiMgT3V0cm8gc2NyZWVuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICBcbiAgQCRvdXRyb1NjcmVlbiA9ICRkb2N1bWVudC5maW5kIFwiLmpzLW91dHJvXCJcbiAgQCRzYXZlQW5kUXVpdEJ1dHRvbiA9IEAkb3V0cm9TY3JlZW4uZmluZCBcIi5qcy1zYXZlLWFuZC1xdWl0XCJcbiAgQCR0b3RhbFRpbWUgPSBAJG91dHJvU2NyZWVuLmZpbmQgXCIuanMtdG90YWwtdGltZVwiXG4gIGVudGVyT3V0cm8gPSA9PlxuICAgIEAkdG90YWxUaW1lLmh0bWwgXCJUb3RhbCB0aW1lOiBcIiArIEB0b3RhbFRpbWUudG9GaXhlZCgzKSArIFwic2Vjb25kc1wiXG4gICAgQCRwbGF5U2NyZWVuLmFkZENsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJG91dHJvU2NyZWVuLnJlbW92ZUNsYXNzIFwiaXMtaGlkZGVuXCJcbiAgICBAJGJvZHkuYWRkQ2xhc3MgXCJnYW1lLWVuZFwiXG4gICAgQCR0b3RhbFRpbWUgPSAwXG4gICAgXG4gIEAkc2F2ZUFuZFF1aXRCdXR0b24gLm9uIFwiY2xpY2tcIiwgPT5cbiAgICByZXN0YXJ0KCkiXX0=
//# sourceURL=coffeescript