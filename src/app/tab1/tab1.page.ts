import { OnInit, OnDestroy } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { Component, RendererStyleFlags2 } from '@angular/core';
import { GlobalService } from '../global.service';
import { AlertController } from '@ionic/angular';
import { SharePost } from './tab1.model';
import { tick } from '@angular/core/testing';
import { EmailValidator } from '@angular/forms';
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
  
  ngOnInit () {
    localStorage.family_id = 'xxxxx';
  }



  
  /*コンストラクタ*/
  constructor(
    public gs: GlobalService,
    public gs2: GlobalService,
    public gs3: GlobalService,
    private alertController: AlertController
  ) {}
  
  /*シェアボードに乗せるリスト(テスト用も兼ねてる) */
 
  /*
  SharePost[] = {
    content_id: id(int),
    content: 本文(string),
    is_completed: それは完了したか？(boolean),
  }
  */

  shares: SharePost[] = [
      {
        content_id: 0,
        content: '今月授業参観ですね',
        due: new Date('2021-05-05'),
        is_completed: false 
      },

      {
        content_id: 1,
        content: 'お花見でも行こうか',
        due: new Date('2020-05-05'),
        is_completed: false
      }
  ];

  /*ゲッター */
  get shareList(): SharePost[] {
    return this.shares.filter(share => !share.is_completed);
  }
  /*ゲッター */
  get doneList(): SharePost[] {
    return this.shares.filter(share => share.is_completed);
  }

  /*完了時の操作 */
  onItemClicked(share: SharePost): void {
    share.is_completed = !share.is_completed;
    this.complete(share);
  }

  /*削除時の処理 */
  onDeleteClicked(share: SharePost): void {
    this.shares.splice(this.shares.indexOf(share), 1);
    this.delete(share);
  }

  addSharePost(share: SharePost): void {
    this.shares.push(share);
  }

  /*シェアボードに乗せるリストに追加する処理 */
  async onAddButtonClicked(): Promise<void> {
    const alert = await this.alertController.create({

      //メッセージ
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

          //alertを用いたshare変数への代入
          const share = new SharePost();
          share.content_id = Number((new Date).getTime().toString());
          console.log(share.content_id);
          share.content = data.share;
          console.log(share.content);

          //put通信処理
          this.register(share)           

          //ShareBoardへの追加処理
          this.addSharePost(share);  


        }
      }],

      //入力処理
      inputs: [{
        name: 'share',
        id:'new-share',
        placeholder: '家族に伝えなきゃいけないことは何？'
      }]
    });

    await alert.present();

  }

  /*まだ通信処理と内部処理との連携は完全には取れていません */


  /*Put通信処理 */
  register = (share: SharePost) => {
    this.registerPostObj['family_id'] = localStorage.family_id;
    this.registerPostObj['content'] = share.content;
    const registbody = this.registerPostObj;

    this.gs.http('/shareboard/put.php', registbody).subscribe(
      res => {
        this.registerReturnObj = res;
        this.putResult = this.registerReturnObj['result'];
        if(this.registerReturnObj['result']) {
          console.log('Communication passed!!');
        }else{
          console.log('Communication failed......');
        }
      }
    )
  }


  /*get通信処理 */
  get = () => {
    this.getPostObj['family_id'] = "tylgophxsxpqrmhbbyxe";
    const getbody = this.getPostObj;
    
    this.gs2.http('/shareboard/get.php', getbody).subscribe(
      res => {
        this.getReturnObj = res;
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

        //グローバル変数に代入
        this.deleteResult = this.deleteReturnObj['result'];
        
        //削除の確認
        if(this.deleteReturnObj == true ) {
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
}
