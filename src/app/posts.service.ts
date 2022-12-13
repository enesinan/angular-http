import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService{

    error = new Subject<string>();
    constructor(private http: HttpClient){}

    createAndStorePost(title: string, content: string){
        const postData: Post = {title: title, content: content}
        this.http.post<{name: string}>('/',postData).subscribe(responseData => {
            console.log(responseData)
          }, error => {
            this.error.next(error.message)
          });
    }

    fetchPosts(){
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print','pretty')
        searchParams = searchParams.append('custom','key')
      return  this.http.get('/',{
        headers: new HttpHeaders({ 'Custom-header' : 'Helloo' }),
        params: searchParams ,// new HttpParams().set('print', 'pretty'),
        observe: 'body'
      }).pipe(map((responseData) => {
            const postsArray: Post[] = []
            for (const key in responseData) {
              if(responseData.hasOwnProperty(key)){
                postsArray.push({...responseData[key], id: key})

              }
            }
            return postsArray;
          }), catchError((err) => {
            return throwError(err)
          }))
    }

    deletePosts(){
       return this.http.delete('/', {
        observe: 'events',
        responseType: 'text'
       });
    }
}
