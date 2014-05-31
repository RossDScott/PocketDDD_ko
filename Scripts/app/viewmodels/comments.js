var PocketDDD;
(function (PocketDDD) {
    (function (VM) {
        var Comments = (function () {
            function Comments() {
                var _this = this;
                this.newComment = "";
                this.showAdd = false;
                this.title = "Feedback comments";
                this.defaultAdd = false;
                this.comments = [];
                this.addCommentClick = function () {
                    if (_this.newComment == null || _this.newComment == "")
                        return;

                    var comment = {
                        id: generateUUID(),
                        comment: _this.newComment,
                        date: new Date(),
                        isSynched: false
                    };
                    ko.track(comment);
                    _this.comments.push(comment);
                    _this.newComment = "";
                    _this.showAdd = false;
                };
                this.cancelCommentClick = function () {
                    _this.newComment = "";
                    _this.showAdd = false;
                };
                this.newCommentClick = function () {
                    _this.showAdd = true;
                };
                ko.track(this);

                ko.defineProperty(this, "orderedComments", function () {
                    return _.sortBy(_this.comments, "date").reverse();
                });
            }
            Comments.prototype.setData = function (comments) {
                this.comments = comments;
                if (this.defaultAdd && comments.length === 0)
                    this.showAdd = true;
            };

            Comments.prototype.formatDate = function (date) {
                return moment(date).format("ddd HH:mm");
            };
            return Comments;
        })();
        VM.Comments = Comments;
    })(PocketDDD.VM || (PocketDDD.VM = {}));
    var VM = PocketDDD.VM;
})(PocketDDD || (PocketDDD = {}));
//# sourceMappingURL=comments.js.map
