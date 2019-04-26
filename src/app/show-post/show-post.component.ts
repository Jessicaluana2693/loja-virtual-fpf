import { Component, OnInit } from '@angular/core';

import { ApiServiceService } from '../api-service.service';

import { Post } from '../post';
import { Comment } from '../comment';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})

export class ShowPostComponent implements OnInit {
  posts: Post[];
  comments: Comment[];

  data = {
    post_id: 0,
    POSTTEXT: '',
    post_index: 0,
    commentid: 0,
    commenttext: '',
    commentindex: 0
  };

  display1 = 'none';
  display2 = 'none';
  constructor(private apiService: ApiServiceService) { }

  ngOnInit() {
    this.apiService.getPost().subscribe(
      posts => this.posts = posts
    );
  }

  openEditPost(postindex: number) {
    this.display1 = 'block';
    this.data.post_id = this.posts[postindex].id;
    this.data.POSTTEXT = this.posts[postindex].POSTTEXT;
    this.data.post_index = postindex;
  }

  openEditComment(postindex: number , commentindex: number) {
    this.display2 = 'block';
    this.data.post_id = this.posts[postindex].id;
    this.data.commentid = this.posts[postindex].comment[commentindex].id;
    this.data.commenttext = this.posts[postindex].comment[commentindex].commenttext;
    this.data.commentindex = commentindex;
    this.data.post_index = postindex;
  }

  onCloseAndSaveEdit() {
    this.display1 = 'none';
    this.editPost( this.data.post_id , this.data.POSTTEXT , this.data.post_index );
  }

  onCloseAndSaveComment() {
    this.display2 = 'none';
    this.editComment( this.data.commentid , this.data.commenttext , this.data.post_id , this.data.commentindex , this.data.post_index); }

  onClose() {
    this.display1 = 'none';
    this.display2 = 'none';
  }

  addPost(POSTTEXT: string): void {
    POSTTEXT = POSTTEXT.trim();
    this.apiService.addPost({ POSTTEXT }as Post)
      .subscribe(post => {
        post.comment = [];
        this.posts.push(post);
    });
  }

  editPost(id: number , POSTTEXT: string , index: number): void {
    POSTTEXT = POSTTEXT.trim();
    this.apiService.editPost(id , { POSTTEXT } as Post)
      .subscribe(isEdit => {
        if (isEdit) { this.posts[index].POSTTEXT = POSTTEXT; }
      });
  }

  deletePost(postindex: number , id: number): void {
    this.apiService.deletePost(id).subscribe(isDelete => {
      if (isDelete) {
        if (this.posts.length === 1) { this.posts = []; }
        // tslint:disable-next-line:one-line
        else { this.posts.splice( postindex, 1 ); }
      }
    });
  }

  addComment(commenttext: string , postid: number , i: number): void {
    commenttext = commenttext.trim();
    this.apiService.addComment({ commenttext , postid } as Comment)
      .subscribe(comment => {
        this.posts[i].comment.push(comment);
      });
  }

  editComment(id: number , commenttext: string , postid: number , commentindex: number , postindex: number): void {
    commenttext = commenttext.trim();
    this.apiService.editComment(id , { commenttext , postid } as Comment)
      .subscribe(isEdit => {
        if (isEdit) { this.posts[postindex].comment[commentindex].commenttext = commenttext; }
      });
  }

  deleteComment(postindex: number , commentindex: number , id: number): void {
    this.apiService.deleteComment(id).subscribe(isDelete => {
      if (isDelete) {
        if (this.posts[postindex].comment.length === 1) { this.posts[postindex].comment = []; }
        // tslint:disable-next-line:one-line
        else { this.posts[postindex].comment.splice(commentindex, 1); }
      }
    });
  }

}
