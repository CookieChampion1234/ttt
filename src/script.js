const config = {
  authDomain: "tictactoe-b39bc.firebaseapp.com",
  databaseURL: "https://tictactoe-b39bc.firebaseio.com",
  projectId: "tictactoe-b39bc"
};

firebase.initializeApp(config);

new Vue({
  el: "#game",
  data() {
    return {
      ref: null,
      started: false,
      roomCode: "",
      current: "circle"
    };
  },
  methods: {
    randCode() {
      this.roomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
    },
    join() {
      this.ref = firebase.database().ref(this.roomCode);
      this.ref.on("child_added", this.received);
      this.ref.on("child_changed", this.received);
      this.ref.on("child_removed", this.clear);
      this.ref.child("next").set(this.current);
      this.started = true;
    },
    received(data) {
      if (data.key === "next") {
        this.current = data.val();
      } else {
        $("#" + data.key)
          .addClass("checked")
          .addClass(data.val());
      }
    },
    clear() {
      this.ref.remove();
      $(".checked")
        .removeClass("circle")
        .removeClass("cross")
        .removeClass("checked");
    },
    check(event) {
      if (!$(event.target).hasClass("checked")) {
        this.ref.child(event.target.id).set(this.current);
        this.nextPlayer();
      }
    },
    nextPlayer() {
      const next = this.current === "circle" ? "cross" : "circle";
      this.ref.child("next").set(next);
    }
  },
  created() {
    this.randCode();
  }
});
