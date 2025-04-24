# NotionのタスクをGoogleカレンダーに連携する

目的: NotionカレンダーのタスクをGoogleカレンダーにコピーすることで，ダブルブッキングを防ぎたい

取得する情報: Notionのカレンダーにあるタスクで，プロパティーの「開始」の開始時間と終了時間

連携するGoogleカレンダー: CALENDAR_IDで指定したカレンダー

作成するタスク: 名前が「不在」というタスク

### APIについて
Notionから情報を得るために，NotionAPIが必要なので，下記のURLからインテグレーションを作成し，APIトークンを取得する必要がある．
取得したAPIトークンをコードのNOTION_TOKENに代入する．
https://www.notion.so/my-integrations

### Notionについて
情報を取得したいNotionのページに，作成したインテグレーションを追加する必要がある．
NotonのページのURLで，v=XXXX となっている部分をDATABASE_IDに代入する．

### 送信先について
CALENDAR_IDに連携したいカレンダーのIDを代入する．基本メールアドレス．
このとき，関数を実行したGoogleアカウントのアドレスで連携先のGoogleカレンダーにアクセスできるように権限を与えておく必要がある．
