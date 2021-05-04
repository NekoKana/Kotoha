import { OnInit, OnDestroy } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { Component, RendererStyleFlags2 } from '@angular/core';
import { GlobalService } from '../global.service';
import { AlertController } from '@ionic/angular';
import { SharePost } from './tab1.model';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {


  /*通信テスト用変数*/ 
  family_id: number = 1;
  content_id: number = 1;
  content: string = "こんにちは";
  result: boolean;

 /*送受信用の変数*/ 
  registerPostObj: any = {};
  registerReturnObj: any = {};
  getPostObj: any = {};
  getReturnObj: any = {};

  
  getContent: SharePost[];
  
  ngOnInit () {

  }

  
  /*コンストラクタ*/
  constructor(
    public gs: GlobalService,
    public gs2: GlobalService,
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
        is_completed: false 
      },

      {
        content_id: 1,
        content: 'お花見にでも行こうか',
        is_completed:false
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


  onItemClicked(share: SharePost): void {
    share.is_completed = !share.is_completed;
  }

  onDeleteClicked(share: SharePost): void {
    this.shares.splice(this.shares.indexOf(share), 1);

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

          if(this.result){
          //ShareBoardへの追加処理
          this.addSharePost(share);  
          }

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

  /*まだ通信処理との連携は完全には取れていません */
  /*Put通信処理 */
  register = (share:SharePost) => {
    this.registerPostObj['family_id'] = share.family_id;
    this.registerPostObj['content_id'] = share.content_id;
    this.registerPostObj['content'] = share.content;
    const registbody = this.registerPostObj;

    this.gs.http('/shareboard/put.php', registbody).subscribe(
      res => {
        this.registerReturnObj = res;
        this.result = this.registerReturnObj['result'];
        if(this.registerReturnObj['result'] == true){
          console.log('Communication passed!!');
        }else{
          console.log('Communication failed......');
        }
      }
    )
  }


  /*get通信処理 */
  get = () => {
    this.getPostObj['family_id'] = this.family_id;
    const getbody = this.registerPostObj;
    
    this.gs2.http('/shareboard/get.php', getbody).subscribe(
      res => {
        this.getReturnObj = res;
        this.shares = this.getReturnObj;
      }
    )
  
  }

  delete = () => {

  }
}
