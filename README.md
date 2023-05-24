## 概要

誤爆を内緒にできちゃうWebチャットアプリです。

## ローカル実行

### 準備

- MySQLをインストールすること。  
- Redisをインストールすること。

### 起動方法

バックエンド（NestJS）
```bash
$ service mysqld start
$ service redis-server start
$ cd /{任意のディレクトリ}/naisho-chat/naisho-backend
$ npm run start
```

フロントエンド（Next.js）
```bash
$ cd /{任意のディレクトリ}/naisho-chat/naisho-frontend
$ npm run dev
```

→　デフォルト環境設定の場合、http://localhost:3000/ でアクセスできます。

## 機能

### TOP画面

アプリのTOP画面を表示します。

### ログイン認証

ユーザー名とパスワードでログイン認証を行います。  
JWT認証を利用しています。

### ホーム画面

自分の入っているチャットが一覧で表示されます。

### チャット画面

自分からチャットを送信したり、同じグループのユーザーのチャットを確認することができます。  
WebSocket通信を利用しています。

## 実装予定の機能

- 誤爆を内緒（非表示）にできる
- 内緒を後からばらすこと（再表示）もできる
