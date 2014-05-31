module PocketDDD.VM{
    export class Comments{
        newComment: string = "";
        showAdd = false;
        title: string = "Feedback comments";
        defaultAdd = false;

        comments: UserComment[] = [];

        constructor() {
            ko.track(this);

            ko.defineProperty(this, "orderedComments", () => _.sortBy(this.comments, "date").reverse());
        }

        setData(comments: UserComment[]) {
            this.comments = comments;
            if (this.defaultAdd && comments.length === 0)
                this.showAdd = true;
        }
        addCommentClick = () => {
            if (this.newComment == null || this.newComment == "")
                return;

            var comment: UserComment = {
                id: generateUUID(),
                comment: this.newComment,
                date: new Date(),
                isSynched: false
            }
            ko.track(comment);
            this.comments.push(comment);
            this.newComment = "";
            this.showAdd = false;
        }
        cancelCommentClick = () => {
            this.newComment = "";
            this.showAdd = false;
        }

        newCommentClick = () => {
            this.showAdd = true;
        }
        formatDate(date: Date): string{
            return moment(date).format("ddd HH:mm");
        }
    }
} 