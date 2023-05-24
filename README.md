## 概要

誤爆を内緒にできちゃうWebチャットアプリです。

## ローカル実行

### 準備

- Dockerをインストールすること。  
- docker-composeをインストールすること。

### 設定

バックエンド（NestJS）
```bash
$ cd /{任意のディレクトリ}/naisho-chat/naisho-backend
$ cp .env.development.example .env.development
$ npm install
```

フロントエンド（Next.js）
```bash
$ cd /{任意のディレクトリ}/naisho-chat/naisho-frontend
$ cp .env.development.example .env.development
$ npm install
```

### 起動方法

```bash
$ cd /{任意のディレクトリ}/naisho-chat
$ docker-compose -f docker-compose.local.yml build
$ docker-compose -f docker-compose.local.yml up
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
