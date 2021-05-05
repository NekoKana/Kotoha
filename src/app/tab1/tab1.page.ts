import { OnInit, OnDestroy } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { Component, RendererStyleFlags2 } from '@angular/core';
import { GlobalService } from '../global.service';
import { AlertController } from '@ionic/angular';
import { SharePost } from './tab1.model';
import { tick } from '@angular/core/testing';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  /*通信テスト用変数*/ 
  content_id: number = 1;
  content: string = "こんにちは";
  private putResult: boolean;
  private deleteResult: boolean;

 /*送受信用の変数*/ 
  registerPostObj: any = {};
  registerReturnObj: any = {};
  getPostObj: any = {};
  getReturnObj: any = {};
  deletePostObj: any = {};
  deleteReturnObj: any = {};
  compPostObj: any = {};
  compReturnObj: any = {};

  
  getContent: SharePost[];
  
  /*コンストラクタ*/
  constructor(
    /*gsたち */
    public gs: GlobalService,
    public gs2: GlobalService,
    public gs3: GlobalService,
    private alertController: AlertController,

    /*emailがnullだった場合、画面遷移させる準備 */
   /* private router: Router*/

  ) {}

    
  ngOnInit () {
    localStorage.family_id = 'mbwgfhwtjrvodiatmnff';
    this.get();

    /*
     email == nullだった場合、画面遷移させる
    if(this.email == null) {
      this.router.navigate(['login']);
    }
    */
  }
  
  /*シェアボードに乗せるリスト(テスト用も兼ねてる) */
 
  /*
  SharePost[] = {
    content_id: id(int),
    content: 本文(string),
    due: new Date,
    is_completed: それは完了したか？(boolean),
  }
  */

  shares: SharePost[] = [];

  /*ゲッター */
  get shareList(): SharePost[] {
    return this.shares.filter(share => !share.is_completed);
  }
  /*ゲッター */
  get doneList(): SharePost[] {
    return this.shares.filter(share => share.is_completed);
  }

  /*完了時の操作 */
  async onItemClicked(share: SharePost): Promise<void> {
    const alert = await this.alertController.create({
      
      header: (share.content),
      subHeader: '',
      message:'完了しますか？削除しますか？',

      buttons:[{
        text: '削除',
        handler: () => {
          this.onDeleteClicked(share);
        }
      },
      {
        text: '完了',
        handler: () => {
          share.is_completed = !share.is_completed;
          this.complete(share);
        }

      }]

    });
    await alert.present();
  }

  /*削除時の処理 */
  onDeleteClicked(share: SharePost): void {
    this.shares.splice(this.shares.indexOf(share), 1);
    this.delete(share);
  }

  /*シェア追加の処理 */
  addSharePost(share: SharePost): void {
    this.shares.push(share);
  }

  /*シェアボードに乗せるリストに追加する処理 */
  async onAddButtonClicked(): Promise<void> {
    const alert = await this.alertController.create({

      //メッセーじ
      header: '追加',
      subHeader: '',
      message: '家族に伝えたいことは何？',
  

      //ボタン　CancelとOKがあり選択によって処理が変わる
      buttons: [{

        //Cancel
        text: 'Cancel',
        role: 'cancel'
      },
      {

        //OK
        text: 'OK',
        handler: (data) => {

          //alertを用いた変数shareへの代入
          const share = new SharePost();

          
          //日付(期日)
          share.due = new Date(data.due);
          console.log(share.due);

          //本文
          share.content = data.share;
          console.log(share.content);

          //未完了のフラグを建てる
          share.is_completed = false;

          //put通信処理
          share.content_id = this.register(share);           

          //ShareBoardへの追加処理
          this.addSharePost(share);  


        }
      }],

      //入力処理
      inputs: [{
        name: 'share',
        id:'new-share',
        placeholder: '本文'
      },
      {
        name: 'due',
        id: 'new-due',
        type: 'date',
      }
    ]
    });

    await alert.present();

  }

  /*まだ通信処理と内部処理との連携は完全には取れていません */


  /*Put通信処理 */
  register(share: SharePost): number {
    
    //shareをサーバに送信
    this.registerPostObj['family_id'] = localStorage.family_id;
    this.registerPostObj['content'] = share.content;
    this.registerPostObj['date'] = this.getDueString(share);

    const registbody = this.registerPostObj;


    this.gs.http('/shareboard/put.php', registbody).subscribe(

      res => {

        this.registerReturnObj = res;

        this.putResult = this.registerReturnObj['result'];
        console.log(this.registerReturnObj['result']);

        if(this.registerReturnObj['result'] == true) {
          console.log('Communication passed!!');
        }else{
          console.log('Communication failed......');
        }

  
      }

    )
    //content_idを返す
    return this.registerReturnObj['content_id'];
    console.log(this.registerReturnObj['content_id']);


  }


  /*get通信処理 */
  get = () => {
    this.getPostObj['family_id'] = localStorage.family_id;

    const getbody = this.getPostObj;
    
    this.gs2.http('/shareboard/get.php', getbody).subscribe(
      res => {
        this.getReturnObj = res;//レスポンスをgetReturnObjに代

        this.getReturnObj['contents'].forEach(element => {
          
          //get：受け取り処理

            const share = new SharePost();

            //content_idの受け取り
            share.content_id = element['content_id'];
            console.log(share.content_id);
          
            //日付情報の取得
            share.due = element['date'];
            console.log(share.due);
            
            //本文の受け取り
            share.content = element['content'];
            console.log(share.content);

            //完了済みかの受け取り
            share.is_completed = element['is_completed'];
            console.log(share.is_completed);
  
            //ShareBoardへの追加処理
            this.addSharePost(share);  
  
  
          
        });
        console.log(this.getReturnObj);
        // this.shares = this.getReturnObj;
      }
    )
  
  }

  /*delete通信処理 */
  delete = (share: SharePost) => {
    this.deletePostObj['family_id'] = localStorage.family_id;
    this.deletePostObj['content_id'] = share.content_id;
    const deletebody = this.deletePostObj;

    this.gs3.http('/shareboard/delete.php', deletebody).subscribe(
      res => {
        this.deleteReturnObj = res;
        //削除の確認
        if(this.deleteReturnObj['result'] == true ) {
          console.log("Delete Successfuly!!");
        } else {
          console.log("Delete Failed......");
        }

      }
    )
    
  }

  /*isCompleted通信処理 */
  complete = (share: SharePost) => {
    this.compPostObj['family_id'] = localStorage.family_id;
    this.compPostObj['content_id'] = share.content_id;
    this.compPostObj['isCompleted'] = share.is_completed;
    const completebody = this.compPostObj;

    this.gs.http('/shareboard/complete.php', completebody).subscribe(
      res => {
        this.compReturnObj = res;

        //確認
        if(this.compReturnObj['result'] == true) {
          console.log("Complete successfuly!!");
        } else {
          console.log("Complete Failed......");
        }
        
      }
    )
  }

  getDueString(share: SharePost): string {
    const year: string = share.due.getFullYear().toString();
    const month: string = (share.due.getMonth() + 1).toString();
    const date: string = share.due.getDate().toString();

    return year + '-' + month + '-' + date;
  }
}
